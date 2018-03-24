---
layout: post
title: "The Cost of Driving Additional Weight"
date: 2017-04-11 18:00:0 -0000
categories: physics
---

DISCLAIMER: I'm pretty sure my calculations & logic are correct but I'm not confident so take everything with a pinch of salt.

With that out of the way, here's some quick context. Two week ago, I ran out of water so I've just been drinking fucking tea and coffee for hydration. Anyways, on a recent Costco run, I finally picked up a pack of water bottles, which I didn't immediately bring up to my room. That was a couple of days ago so I've just been trucking this pack of water bottles around town with me. So just earlier, my friend was ribbing me about it, saying I was wasting money not bringing the water up. Instead of bringing it up, I wrote this post. 

A quick [google search] shows that every additional 100 lbs should roughly reduces gas mileage by 1-2%. That's pretty low but the author doesn't explain the number and I'm thinking "how hard could this be" so I attempted to calculate it myself. 

From this [wiki on energy density], Gasoline is 34.2 MJ per litre. [Engine efficiency] is roughly 20%, so we have 6.84 MJ of usable energy per litre. I can't find information on the weight of my 2015 Hyundai Elantra so I'll use 4,009 pounds which this [article] cited as the average weight of American cars in 2010. I couldn't find the [0-60 time] of my car, so I used the time for the 2016 Hyundai Elantra Value Edition and calculated acceleration from that.

Using the above, we can calculate a rough estimate of what we want, here are the calculations:

![calculations](https://github.com/eltonlaw/devbum.github.io/blob/master/public/images/the-cost-of-driving-additional-weight/car_additional_work.png?raw=true){:.ci}

I figured that if I just compared the difference in work for two different weights, I wouldn't have to calculate all this stuff like air drag and friction. I know hardly any physics so my process to find the cost per km is pretty trivial. Essentially I found the difference in work attributable to the change in weight which was then translated into cost. The result was a cost per km coming out to 1.27 cents which is 1.2% of gas price. That's a bit above the value of 1-2% per 100 lbs that was mentioned earlier, but it's still pretty close (considering my calculations oversimplified the situation)

[google search]: http://www.autoblog.com/2009/10/29/greenlings-how-does-weight-affect-a-vehicles-efficiency/
[Engine efficiency]: http://www.greencarreports.com/news/1091436_toyota-gasoline-engine-achieves-thermal-efficiency-of-38-percent
[0-60 time]:http://www.zeroto60times.com/vehicle-make/hyundai-0-60-mph-times/  
[wiki on energy density]:https://en.wikipedia.org/wiki/Energy_density
[article]:http://www.slate.com/articles/business/moneybox/2011/06/your_big_car_is_killing_me.html
