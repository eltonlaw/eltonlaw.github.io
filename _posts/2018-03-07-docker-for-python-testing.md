---
layout: post
title: "Unit testing in Python with Docker Containers"
date: 2018-03-07 3:56:00 -0000
categories: docker
---

I'm working on a new Python package called [`diehard`](https://eltonlaw.github.io/) and was looking for a way to run unit tests across multiple Python environments. The standard approach seems to be to use [`tox`](https://tox.readthedocs.io/en/latest/). My main issue with it is that you need the Python versions being tested already installed to run tests and that's a hassle if you're working on multiple machines. As a result any sort of testing uses a local build, which to me, can lead to possible, annoying issues with dependencies and versioning. I think it's much simpler and cleaner to just throw everything into a Dockerfile so the environment gets built to specification for everyone. This way you at least get hard guarantees that things actually work in the environment you're testing with.

```
FROM ubuntu:16.04

RUN apt-get update && \
    apt-get -y install software-properties-common \
                       python-software-properties && \
    add-apt-repository -y ppa:deadsnakes/ppa && apt-get update && \
    apt-get autoclean

RUN apt-get -y install \
    python2.7 python2.7-dev \
    python3.4 python3.4-dev \
    python3.5 python3.5-dev \
    python3.6 python3.6-dev && \
    apt-get autoclean

RUN apt-get install wget && \
    wget https://bootstrap.pypa.io/get-pip.py && \
    python2.7 get-pip.py && \
    python3.4 get-pip.py && \
    python3.5 get-pip.py && \
    python3.6 get-pip.py && \
    rm get-pip.py && \
    apt-get autoclean

```

The test environment was split into two Dockerfiles, this is the first layer. Basically, the OS gets loaded and because Ubuntu 16.04 doesn't support Python natively, you gotta get it from a PPA. 

Note: As you can see, Ubuntu 16.04 was used, but there was no design decision around that. I just happened to have used it in the past and was comfortable with it ... I guess it's also a rather popular Ubuntu version. 

Next we have the Dockerfile for my package.

```
FROM eltonlaw/pybase

COPY ./requirements /diehard/requirements
RUN pip2.7 install -r /diehard/requirements/dev.txt && \
    pip3.4 install -r /diehard/requirements/dev.txt && \
    pip3.5 install -r /diehard/requirements/dev.txt && \
    pip3.6 install -r /diehard/requirements/dev.txt

COPY ./setup.py ./setup.cfg ./pytest.ini ./README.rst /diehard/
COPY ./docs /diehard/docs
COPY ./tests/ /diehard/tests
COPY ./diehard /diehard/diehard
WORKDIR /diehard
RUN pip2.7 install -e . && \
    pip3.4 install -e . && \
    pip3.5 install -e . && \
    pip3.6 install -e .

CMD ["python3.6", "-m", "pytest"]
```
The `FROM eltonlaw/pybase` means that this stacks on top of the `eltonlaw/pybase` image (I named the image built from the Dockerfile before `pybase` and uploaded it to Docker Hub under my account). Now we can go about the regular setup for each version being used. Install the core stuff: `cpython` interpreter, `pip`, `setuptools`. Then `pip install` dependencies. The next few lines are just copying over files. It might seem weird to copy over so many files manually and it is but it's partially because I didn't want to copy everything over and partially because every time something changes in a file, the Dockerfile reruns from that line onward. So if we've already built the image once and cached everything, if we say changed a file in `./docs`, the `COPY ./setup.py ... ` line would use cache but everything from `COPY ./docs /diehard/docs` and onwards would rerun from scratch. Splitting things up into multiple `COPY`'s makes it very slightly more efficient (assuming you're not changing your `setup.py` and etc. often), and it's just my subjective, preferred way of doing things. `WORKDIR`, unsurprisingly, changes the working directory to `/diehard`. Next the `RUN pip2.7 install ...` lines installs the package in each python environment. Lastly, the `CMD ...` line just specifies the default command passed when you run the image. I've set it to run pytest with the python3.6 environment.

Okay the environments setup, this is how to run tests. I made a tiny `Makefile` like this:

```
init:
	pip install -r requirements.txt

test:
	docker pull eltonlaw/pybase
	docker build -t diehard .
	docker run diehard python2.7 -m pytest
	docker run diehard python3.4 -m pytest
	docker run diehard python3.5 -m pytest
	docker run diehard python3.6 -m pytest

```
So all you have to do is run `make test` and your tests run on all environments.

By the way, the reason that the test environment is split like this is because originally, with everything in one Dockerfile, the Travis build took 4 minutes. The installation of Python versions is pretty much constant so pulling a built image speeds things up a lot.
Great, things work locally now. But I wanted to integrate this with TravisCI so I did some Googling and modified the `.travis.yml` into this.

```
sudo: required

language: python

services:
    - docker

before_install:
    - docker pull eltonlaw/pybase

script:
    make test
```
