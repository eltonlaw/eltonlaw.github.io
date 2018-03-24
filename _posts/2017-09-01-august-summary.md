---
layout: post
title: "Monthly Summary"
date: 2017-09-01 6:00:0 -0000
categories:
---

## "Revisiting Unreasonable Effectiveness of Data in Deep Learning Era" <small>[[arXiv](https://arxiv.org/abs/1707.02968)]</small>

#### Description

Trained ResNet-101 on JFT-300M dataset. 

#### Key Points

* A lot more data -> better model
* Models with more capacity capitalize better on the increase in data

#### Commentary

Computationally, a dataset with 300 million images is infeasible for pretty much everybody. Even for Google, it took them 2 months to train 4 epochs using 50 K80 GPU's.

That being said, they did beat SoTa on multiple tasks by around 2-3% despite the model not being fine-tuned so we can likely expect better results (given infinite computation power)... which is comforting in some sense. This at least proves that there is a lot of benefit to doing semi-supervised learning/transfer learning well.

#### Other

[Reddit Discussion](https://www.reddit.com/r/MachineLearning/comments/6o5ume/r_google_trains_network_on_300_million_images/) 

## "Who Said What: Modeling Individual Labelers Improves Classification" <small>[[arXiv](https://arxiv.org/abs/1703.08774)]</small>

#### Description
With medical datasets, the label is noisy so the collectors may solicit opinions from multiple experts. The common approach to use a dataset structured like this is to assume that ground truth is the average of all expert opinions. The authors argue that this throws away alot of data, instead of aiming to model the average of all opinions, it's much better to model each expert individually and average the opinions of that. This makes sense on an intuitive level because now the model can account for experts that only see certain distributions of data, individual biases etc. 

#### Key Points

* Modelling each labeller and then taking some sort of weighted average of all modeled labellers to get the final binary loss is much better than the standard approach of using the average label in a binary loss model.

#### Commentary

This paper reminded me of a point in [one of Andrew Ng's talks](https://youtu.be/F1ka6a13S9I) in which he was talking about how the performance of machine learning models generally tapered off after beating human-level performance. One part of the problem stems from the supervised approach which uses labels (which naturally have some error in them) as the ground truth.

## "Towards a Deeper Understanding of Training Quantized Neural Networks" <small>[[pdf](http://vip.ece.cornell.edu/papers/17ICML_WS_qnets.pdf)]</small>

#### Description
<u>Some background:</u> Quantized neural networks are neural networks with low precision parameters. An example of coarsely quantized weights are weights constrained to binary values. This results in reduced memory usage and the use of bit-wise operations rather than arithmetic operations (making things a heck of a lot faster). The main hope for quantized neural networks is to make everything faster without increasing the loss too much. Intuitively, this should be possible since there are usually multiple parameter configurations that can approximate the distribution of the training data. If we just traverse the manifold, it should be possible to find a nearby set of parameters that are restricted to a more efficient data type right?

This paper explores the difference between quantized neural networks and standard ones, noting that parameters need to be high precision to exploit an annealing property. 

<u>Some problems with low-precision parameters</u>:

* With rounding techniques, if the weight updates are very small, they might get rounded to 0.
* Results in the area are largely experimental, not much theory on whats going on under the hood.

#### Other

Found as one of the submissions to the ICML 2017 workshop [Principled Approaches to Deep Learning](http://padl.ws/#submissions) 

## "Unsupervised Learning in LSTM Recurrent Neural Networks" <small>[[pdf](ftp://ftp.idsia.ch/pub/juergen/icann2001unsup.pdf)]</small>

#### Description

An LSTM network for unsupervised learning. Main difference from the standard LSTM RNN is that they change the objective function. They use two previously introduced information-theoretic objectives: 1) Binary Information Gain Optimization 2) Nonparametric Entropy Optimization. I'm still trying to understand it so check out [Schraudolph's dissertation](https://papers.cnl.salk.edu/PDFs/Optimization%20of%20Entropy%20with%20Neural%20Networks%201995-3847.pdf) which introduced the ideas (I think).

#### Commentary

Pretty neat that they didn't have to introduce any new architectural elements to adjust for the lack of labels.
