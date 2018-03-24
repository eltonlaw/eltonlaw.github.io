---
layout: post
title: "Optical Character Recognition using Expert Systems"
date: 2017-05-19 9:10:00 -0000
categories: computer-vision
---

Optical character recognition is solved and expert systems have fallen out of favour, however, I do believe that there is at least some merit to understanding some of this stuff. For one, despite the incredible accuracy percentages that deep learning is achieving, I get the feeling that the current state-of-the-art is missing something fundamental. It's just a feeling, maybe I'm wrong, but I don't think it hurts to explore new ideas, or in this case, rehash old ones.

### Methods Used

#### Convolution

Image convolution is the idea of applying aggregating the values of neighbouring pixels. If you want to apply convolution to an image, you take one pixel, look at the pixels around it; above, below, to the right, to the left, in the four corners and take some combination of these 9 values (9 including the pixel we're focusing on) as the new value of our pixel. The combination is called a kernel or mask. Apply the kernel to every pixel in an image at the same time and that's image convolution in a nutshell. I specifically mention at the same time because if you were to apply the kernel one by one, it would mess up the output. If you think about it, after a while you would be mixing mutated values with non-mutated values. Anyways, check out this [wikipedia article](https://en.wikipedia.org/wiki/Kernel_(image_processing)) for common kernels/masks and their effects on an image. 

#### Zhang-Suen Thinning

The Zhang-Suen Thinning algorithm thins an image by looping through every pixel in an image and identifying pixels that are redundant to the structure of an image. There are some specific conditions it uses, but the main idea is that if a pixel is black and there are   of black pixels around it, you can change this pixel to white without erasing any structure. To see how it works check the rosetta code implementation [here](https://rosettacode.org/wiki/Zhang-Suen_thinning_algorithm).

#### Canny Edge Detection

The Canny Edge Detector has multiple stages:

1. Noise reduction using Gaussian Kernel
2. Calculate gradient using Sobel Kernel
3. We know that the gradient direction is normal to edges so armed with the gradient magnitude and direction from part 2, we suppress all pixels that aren't local maximums
4. Hysteresis Thresholding. We define threshold values `maxVal` and `minVal`. Anything above `maxVal` is definitely an edge, anything below is definitely not an edge, anything in between is iffy, could be an edge or a non-edge.  [See More](http://docs.opencv.org/trunk/da/d22/tutorial_py_canny.html)

#### Otsu Thresholding

Image thresholding algorithm to reduce a grayscale image into a binary image. Otsu's algorithms looks for the threshold value (0-255) that minimizes the weighted within-class variance. [See More](http://docs.opencv.org/trunk/d7/d4d/tutorial_py_thresholding.html)

### Model

The breakdown: I had some images of handwritten digits which I fed through some mutation functions (thinning, scaling, convolution). Then the image was divided into 9 equal blocks which we use as our features. These features are stored along with their label. Come prediction time, calculate how different each stored feature is with a new image. The label of the feature that is least different is used as the prediction.

To get a better sense of how things work, here are the first 10 symbols as they go through the system:

**1)** Load image

**2)** Symbols separated into individual images (Optional - I was using sprites)
symbol

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/0.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/1.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/2.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/3.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/4.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/5.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/6.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/7.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/8.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/0_symbols/9.jpg?raw=true){:.inline-blk}

**3-1)** Horizontal Convolution using a (5, 1) vector filled with 0.2 as the mask

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/0.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/1.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/2.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/3.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/4.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/5.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/6.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/7.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/8.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/1_convolution1/9.jpg?raw=true){:.inline-blk}

**3-2)** Vertical Convolution using (1, 5) column vector filled with 0.2 as the mask

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/0.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/1.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/2.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/3.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/4.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/5.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/6.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/7.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/8.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/2_convolution2/9.jpg?raw=true){:.inline-blk}

**3-3)** Binarize image using Otsu Thresholding and Scale to 32x32

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/0.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/1.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/2.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/3.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/4.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/5.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/6.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/7.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/8.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/3_scaled/9.jpg?raw=true){:.inline-blk}

**3-4)** Zhang-Suen Thinning 

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/0.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/1.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/2.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/3.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/4.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/5.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/6.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/7.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/8.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/4_thinned/9.jpg?raw=true){:.inline-blk}

**3-5)** Canny Edge Detection

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/0.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/1.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/2.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/3.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/4.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/5.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/6.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/7.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/8.jpg?raw=true){:.inline-blk}
![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/5_edges/9.jpg?raw=true){:.inline-blk}

**3-6)** 3 x 3 Feature Vector

_Only displaying the first one (cause the image is pretty big), check [here](https://github.com/eltonlaw/ml_algorithms/tree/master/ocr/outputs/6_feature_vectors) to see the rest_

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/6_feature_vectors/0.jpg?raw=true)

### Training

At this point it might be good to check out the actual [source code](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/ocr.py) because I've kept this explanation high-level.

Training is really simple. I start off by creating a class `FeatureDescriptions` which will have methods to 1) train by adding features, `add` and 2) use these stored features to predict new images, `predict`.

	fd = FeatureDescriptions()

Our feature descriptions are a placed into a python dictionary, one key for each label. Each key is initialized with an empty list.

	self.features = {'0':[], '1':[], '2':[], '3':[] ... '9':[]}

Each 3x3 feature vector in our training set is added to it's corresponding label in the `self.features` dictionary. 
	
	for feature, label in feature_label_pairs[:split]:
        fd.add(label,feature)   

Note: The `split` variable is the index that we split the train images from the test images.

### Prediction

To classify new images, the system feeds a list of test images into our trained `FeatureDescriptions` object and calculates the Euclidean distance to every stored feature vector.  

    for feature, label in feature_label_pairs[split:]:
        distances = fd.predict(feature)
        prediction = np.argmin(distances)

The label with the feature vector closest to the new image is selected as the prediction. With 35 training images and 15 test images, this system achieves a 37.5% accuracy rate.

![](https://github.com/eltonlaw/machine_learning/blob/master/models/ocr/outputs/7_predictions.png?raw=true)

### Closing Remarks

Experts systems are an old technique and we can see that they perform poorly on handwritten digits. From a computational perspective, calculating pairwise euclidean distances is a nightmare. Additionally, this system does not account for translational invariance. As an example, if you look at (3-6), the 2 was not centered which could cause problems, say if we had another 2 but it was right justified. However, I would like to mention that this system managed to squeeze out 37.5% accuracy despite only 35 training images, which is less feasible with a statistical system. (By the way, if you want the definition of something going wrong, look at that second image. It's supposed to be 1 but by the end of the transforms it looks like a binary search tree)

---

### References 

Ahmed, M., & Ward, R. K. (2000). An expert system for general symbol recognition. Pattern Recognition, 33(12), 1975-1988. doi:10.1016/s0031-3203(99)00191-0
