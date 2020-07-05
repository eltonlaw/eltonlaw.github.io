---
layout: post
title: "Analog-to-Digital Conversion with the Atmega328P"
date: 2020-06-08 21:48:43 PM
categories:
---

Certain materials will generate electric current when squeezed, these are called piezoelectric materials and they are more generally defined as materials that can convert a "mechanical stress" into an electric current. A piezo sensor.

There are many more types of sensors: thermoelectric (two differing temperatures into electricity), pyroelectric (changes in temperature into electricity)

piezo sensor. All you need to know is that it generates a voltage 

The ADC (Analog-to-Digital Converter) is used to 

The ADC architecture used by the m328p is successive approximation with 10 bits of precision. 

DDRC register controls analog pins  

By default the factory condition sets a fuse (special register) CKDIV8 flag telling it to divide the clock speed by 8. So the internal crystal is 8MHz giving us a default of 1MHz.

    CFLAGS += -DF_CPU=1000000ul // ... setting in Makefile
    #define F_CPU 1000000ul     // In c code
    // If you decide to turn it off 
    CLKPR = 0; 
    CFLAGS += -DF_CPU=8000000ul // ... setting in Makefile
    #define F_CPU 8000000ul     // In c code

DDRx (Data Direction Register), whether a pin is input or output
DDRx pin set for input, set PORTx bit to 1 to use an internal pull up resistor or 0 not to use the internal pull up resistor
DDRx pin set for output, set PORTx bit to 1 to set output high or 0 to set output low
PINx is read only, checks the state of the corresponding pin

Bit banging a

https://www.explainthatstuff.com/piezoelectricity.html
