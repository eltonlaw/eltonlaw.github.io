---
layout: post
title: "A Visual Intuition for Factoring"
date: 2017-05-02 6:00:0 -0000
categories: math
---

I'm a big fan of the [3Blue1Brown YouTube channel] which provides pretty, visual intuitions of some pretty gnarly math so check it out if you haven't already. 

Well this math isn't gnarly but I think it's pretty neat so let's talk about factoring. Say we have a square:

![x^2](https://github.com/eltonlaw/devbum.github.io/blob/master/public/images/a-visual-intuition-for-factoring/factoring_2.png?raw=true){:.ci}

Remembering that the area of a square is just length times width, the area of this square would just be x*x or  x<sup>2</sup> Now take this same square and imagine we added y to both sides.

![(x+y)^2](https://github.com/eltonlaw/devbum.github.io/blob/master/public/images/a-visual-intuition-for-factoring/factoring_2.png?raw=true){:.ci}

The new total area would now consist of: 
* The original squares area, x*x
* The area of the rectangle on the bottom, y * x
* The area of the rectangle on the side, x * y
* The area of the square in the bottom right y * y. 

Adding all of these together you get:

x<sup>2</sup> + 2xy + y<sup>2</sup>

Actually, there's a shortcut you can see that adding y to both sides changes the width and length to x+y, already signifying (x+y)<sup>2</sup>. But I think the earlier method is more generalizable. Think about how this would look adding another dimension (x+y)<sup>3</sup>. There would be much more little extra squares. That's why it evaluates into:

x<sup>3</sup> + 3x<sup>2</sup>y + 3xy<sup>2</sup> + y<sup>3</sup>

Doesn't it now make a lot more sense that Pascal's Triangle increases in complexity as the number of dimensions increases?

At the heart of this technique is this little trick to split everything into chunks which you can individually calculate the area of, summed together they would create the area of the original. I think it's an interesting little mathematical sleight of hand to pop into the toolbox.

[3Blue1Brown YouTube channel]:https://www.youtube.com/channel/UCYO_jab_esuFRV4b17AJtAw
