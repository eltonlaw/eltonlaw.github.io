---
layout: post
title: "A High Level Explanation of TensorFlow"
date: 2017-05-25 1:00:00 -0000
categories: deep-learning
---

__At the time of writing the current version of TensorFlow is 1.1.0__

## Why TensorFlow?

The first thought that comes to mind is that it's backed by Google, meaning there's probably a lot of smart people leading the project who are a kind of filthy rich. TensorFlow was built to support very flexible ideas that could be quickly put into product, so code used for research and prototyping can quickly be made production ready. Just the fact that this is used for Google's machine learning is a good sign, they handle huge amounts of traffic so it's definitely battle tested. TensorFlow supports many platforms (CPU, TPU, GPU, Android, iOS, Raspberry Pi), which can lead to some very [interesting use cases][Mobile TF]. TensorFlow's open source community is thriving and adoption/support is very high, at the time I'm writing this, the [TensorFlow GitHub Repo][TF github] has roughly 60,000 stars! Lastly, some of the tools that TensorFlow has available are amazing such as the beautiful TensorBoard - oh boy, I love, love, love it.

## Great Ideas

TensorFlow is built on a foundation of really great ideas, for the full schtick I highly recommend the [TensorFlow White Papers]. For the distilled (and possibly wrongly interpreted) version, read on.

### Dataflow Graph

![directed_graph](https://upload.wikimedia.org/wikipedia/commons/4/4b/Directed_acyclic_graph.svg){:.ci}

A TensorFlow program can be described as a data-flow graph. All our nodes are linked together through their inputs/dependencies. Take a look at the image above, another way to think about this is that you have this A node at the beginning and that could be your data, which is in the form of an n-dimensional array, or what they call a tensor. These tensors(or data) flow along the graph edges, where the nodes are some sort of operation on the input. Hence, the name TensorFlow. As an example, the image above might've been the result of a TensorFlow program such as the following:

	A = <INPUT DATA>
	B = tf.nn.tanh(A)
	C = tf.random_normal(tf.shape(tf.transpose(A))
	G = 0.2
	D = tf.ones_like(B) * G
	E = tf.matmul(B, C) + D
	F = tf.nn.softmax_cross_entropy_with_logits(E) 

### Symbolic Computation

So the picture in your head right now is a graph right? Keep that in mind, now as you add operations and variables and stuff, this graph doesn't get computed right away. Rather, you have to create a `Session` object which is a sort of environment that TensorFlow provides to evaluate nodes in a graph. TensorFlow programs are split into a construction phase that assembles a graph and an execution phase that runs the graph. 

	# Step 1 - Construction Phase
	a = tf.constant([[1., 2.], [3., 4.])
	b = tf.constant([[1., 2.], [3., 4.])
	c = tf.add(a, b)
	# Step 2 - Execution Phase
    with tf.Session() as sess:
    	### THE WRONG WAY
        print(c) # <tf.Tensor 'Add:0' shape=(2, 2) dtype=float32>
        ### THE RIGHT WAY
        print(sess.run(c)) # [[ 2.,  4.],[ 6.,  8.]]
        print(c.eval() # [[ 2.,  4.],[ 6.,  8.]]

Everything in TensorFlow is a [`Tensor`][tf.Tensor]. By printing without first evaluating we can see that, `c` is a symbolic representation of the output of an `Operation`, it doesn't mean anything until we actually evaluate it in an environment(`Session`) and get whatever it's supposed to return. Rather than holding a value, `c`, it holds the steps required to compute what we've defined as `c`, which is why when we print it, an `Add:0` operation is displayed. TensorFlow is stating that it's going to add it's inputs together later. (Note: the `0` after `Add:` represents the device on which this tensor will be computed, more on this later).

If you've played around with bot TensorFlow and NumPy you'll notice that TensorFlow mirrors a lot of NumPy's functionality; they share methods such as creating ndarrays of zeros and ones, reshaping, matrix multiplication etc. It's because of this symbolic computation idea that everything has been reimplemented. To reiterate, NumPy operations/matrixes are instantiated instantly when created. In TensorFlow, when these operations/matrixes are created they add a new node to the current graph, connected to other nodes by dependencies. 

### Partial Execution

Having a symbolic programming model has the added benefit of partial execution, you can run any arbitrary subgraph. When you do a sess.run, it only computes the required nodes, everything else is left alone.

    A = tf.constant([[1., 2.], [3., 4.])
    B = tf.constant([[5., 6.], [7., 8.])
    C = tf.constant([[9., 0.], [1., 2.])
    D = A + B # '+' operator is equivalent to tf.add(x, y)
    E = C + D
    with tf.Session() as sess:
        sess.run(D) # Only computes A, B and D

`sess.run()` can actually take a parameter, `feed_dict`, where you can substitute the inputs of the node you're computing with some custom input. 

    A = tf.constant([1, 2, 3, 4])
    B = tf.constant([4, 5, 6, 7])
    C = tf.constant([0, 1, 2, 3])
    D = tf.add(A, B)
    E = tf.add(C, D)
    with tf.Session() as sess:
        print(sess.run(E, feed_dict={C: [100, 100, 100, 100]}))
        # Prints [105, 107, 109, 111]

### Checkpoints

TensorFlow makes it very easy to bundle up a trained model so that you can use it elsewhere. Since it supports many platforms, you do something like train on some GPU's then export it to a  Raspberry Pi or Mobile device to perform inferences. Another reason that checkpoints are cool is that you can use them to save the progress of your model, say if you wanted to stop training halfway through and continue tomorrow.

### Gradient Computation

TensorFlow can automatically calculate gradients, a much welcome relief, I've tried it once for a project and honestly it was brutal. Hand calculating gradients gets messy super fast, and this only gets more complicated as you add more layers and use different activation functions. TensorFlow currently has implementations of many popular optimization algorithms: Gradient Descent, AdaGrad, RMSProp, etc. For the full list checkout [tf.train].

	cost = tf.nn.log_poisson_loss(y, y_pred)
	learning_rate = 0.01
	train = tf.train.RMSPropOptimizer(learning_rate).minimize(cost)
	

## Behind the scenes

### Single-Device Implementation

In the simplest scenario (single device, single process) the operations are executed sequentially. 

![single_machine](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/single_machine.png?raw=true){:.ci}
<center><em>
	Image licensed under Creative Commons by TensorFlow. <a href="https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45166.pdf">Link</a>
</em></center><br>

TensorFlow calculates the number of dependencies for every operation, the number of operations that need to be done before this operation can be performed. Nodes that have no dependencies are note being blocked and thus can be run immediately, so they are added to the queue. Imagine the following calculation: 
	
	((3 * 2)+ 6)/4
	
At the very beginning, the number of dependencies assigned to calculating that first multiplication step is 0, because we're already given both arguments, 3 and 2. Now let's look at the addition part of it: (3*2+6). If we wanted to do the addition, we already have 6 but we don't have the result of the multiplication, so the number of dependencies for this addition operation is 1. Going further, if we wanted to do the division operation, we would be missing both results from the addition and multiplication processes so it's number of dependencies is 2. 

To make this more concrete, here's a visualization of the calculation:
	
![tf_single_exec_1](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/single_device_execution_1.png?raw=true){:.ci}
![tf_single_exec_2](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/single_device_execution_2.png?raw=true){:.ci}
![tf_single_exec_3](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/single_device_execution_3.png?raw=true){:.ci}
![tf_single_exec_4](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/single_device_execution_4.png?raw=true){:.ci}

### Multi-Device Implementation

![distributed_system](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/distributed_system.png?raw=true){:.ci}
<center><em>
	Image licensed under Creative Commons by TensorFlow. <a href="https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45166.pdf">Link</a>
</em></center>

Things get a bit more complicated as you move from single-device to multi-device since two new problems emerge (design decisions might be a better word for it). I'll highlight the problem first before explaining the TensorFlow implementation. The first problem is how the framework will handle node placement. In the single-device implementation the graph just runs on the same device from start to finish so there's nothing to optimize. However, as soon as you have more than one device, consideration needs to be put on how to split up the nodes. Imagine you have three devices (A, B & C), which nodes on your computational graph should be put on device A, which on device B and which on device C? In a perfect world, the optimal solution is to calculate the total amount of work of the graph and each of it's nodes and split it right down the middle, allocating a third of the work to each device. While logical, this thought process is naive and breaks down quickly since we haven't yet considered blocking and non-blocking operations. As seen in the previous section, many parts of a graph may require as input, output from previous operations. These sequential operations can't be parallelized. Another assumption held for the previous statements was the idea that our three devices A, B and C are equal power, that's usually not true in the real world. For example, a computer can have a CPU and a GPU, how should TensorFlow optimize for an imbalanced situation like this? 

That leads us directly into the second major issue/design decision, which is very much tied to the previous problem/design decision. How should the framework handle cross-device communication? After all, the whole point of using multiple devices is to speed up computation time. If the cost of cross-device communication was too high, it would be pointless to use multiple devices.

Here's how TensorFlow tackles these problems:

1. TensorFlow's node placement algorithm contains a cost function which contains the input and output of each operation, and an estimate of the computation time for each node in a graph. Using these two metrics: estimated computation time and the estimated cost of device-to-device communication, TensorFlow searches for the optimal device allocation configuration. 
2. Cross device communication is done through `send` and `recv`(receive) nodes. Notice in the below image that any edges (lines) crossing across devices gets substituted with a `send` and `recv` node. From the [2015 white paper][whitepaper2015]: 

>"By handling communication in this manner, we also allow the scheduling of individual nodes of the graph on different devices to be decentralized into the workers: the Send and Receive nodes impart the necessary synchronization between different workers and devices, and the master only needs to issue a single Run request per graph execution to each worker that has any nodes for the graph, rather than being involved in the scheduling of every node or every cross-device communication. This makes the system much more scalable and allows much finer-granularity node executions than if the scheduling were forced to be done by the master." [^1]

![cross_device_communication](https://github.com/eltonlaw/eltonlaw.github.io/blob/master/public/images/tensorflow-guide/cross_device_communication.png?raw=true){:.ci}
<center><em>
	Image licensed under Creative Commons by TensorFlow. <a href="https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45166.pdf">Link</a>
</em></center> 


## Miscellaneous

`global_step` refers to the number of batches trained by the graph. The reason why this is explicitly defined is that [if you stop training for the day and continue the next day, the local iteration number will start from 1 again, but the global step keeps a record of the total number of iterations.][global_step]

[^1]: Abadi et. al. (2015). TensorFlow: Large-Scale Machine Learning on Heterogeneous Distributed Systems. Retrieved May 23, 2017, from http://tensorflow.org/: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45166.pdf

----------------------------------------------

[tf.Tensor]:https://www.tensorflow.org/api_docs/python/tf/Tensor
[CS224D Lecture 7]:https://www.youtube.com/watch?v=l6K-MFgIEjc
[global_step]:http://stackoverflow.com/questions/41166681/what-does-tensorflow-global-step-mean
[whitepaper2015]: https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45166.pdf
[tf.train]: https://www.tensorflow.org/api_guides/python/train
[Mobile TF]: https://www.youtube.com/watch?v=0r9w3V923rk&index=10&list=PLOU2XLYxmsIKGc_NBoIhTn2Qhraji53cv
[TF github]: https://github.com/tensorflow/tensorflow
[Hands-on TensorBoard]: https://www.youtube.com/watch?v=eBbEDRsCmv4
[TensorBoard: Visualizing Learning]: https://www.tensorflow.org/get_started/summaries_and_tensorboard 
[TensorBoard: Embedding Visualization]: https://www.tensorflow.org/get_started/embedding_viz
[TensorBoard: Graph Visualization]: https://www.tensorflow.org/get_started/graph_viz
[TensorFlow White Papers]:https://www.tensorflow.org/about/bib
