---
layout: post
title: "A Gentle Introduction to DNA Computing"
date: 2017-03-22 0:00:00 -0000
categories: bioinformatics
---

Before we begin, this post is for the complete amateur, no understanding of chemistry or biology required.

### Introduction

In his talk _[Plenty of Room at the Bottom]_, Richard Feynman reasoned that there was a lot of potential in going smaller. Using some basic arithmetic he calculated that:

>"...all of the information that mankind had carefully accumulated in all the books in the world can be written in this form, in a cube of material one two-hundredth of an inch wide – which is the barest piece of dust that can be made out by the human eye. So there is plenty of room at the bottom!" [^1] 

He goes on to explain that there's nothing new about this idea:

>"This fact – that enormous amounts of information can be carried in an exceedingly small space – is, of course, well known to the biologists, and resolves the mystery which existed before we understood all this clearly, of how it could be that, in the tiniest cell, all of the information for the organization of a complex creature such as ourselves can be stored. All this information – whether we have brown eyes, or whether we think at all, or that in the embryo the jawbone should first develop with a little hole in the side so that later a nerve can grow through it – all this information is contained in a very tiny fraction of the cell in the form of long-chain DNA molecules in which approximately 50 atoms are used for one bit of information about the cell.” [^1]

However, what this idea leads us to is interesting:

>"The biological example of writing information on a small scale has inspired me to think of something that should be possible. Biology is not simply writing information; it is doing something about it. A biological system can be exceedingly small. Many of the cells are very tiny, but they are very active; they manufacture various substances; they walk around; they wiggle; and they do all kinds of marvellous things—all on a very small scale. Also, they store information. Consider the possibility that we too can make a thing very small which does what we want—that we can manufacture an object that maneuvers at that level!" [^1]

A biological system doesn't hold information just for the sake of holding it, it acts upon and uses it. A biological system is just like a computer, an incredibly fast computer! There are two lines of thought that spring from this concept, 1) Our current processing power is far from the theoretical limit 2) Can we harness the computational power of biological systems?

The answer to the latter was given by Leonard Adleman in his paper [Molecular Computation of Solutions to Combinatorial Problems]. Adleman figured out a way to use DNA to compute the optimum solution to a Hamiltonian path problem. 

------------------------------------------------------------------------

_**NOTE**: The travelling salesman problem, how can we optimize for the shortest distance crossed. In the example below, the question is about the shortest distance to travel through 15 of the most popular cities in Germany._

![Travelling Salesman Problem](https://upload.wikimedia.org/wikipedia/commons/c/c4/TSP_Deutschland_3.png){:.ci}

_The Hamiltonian path problem is a cousin of the travelling salesman problem, it asks for the shortest path that visits each vertex in a graph only once. This problem has been proven to be NP-complete (Nondeterministic Polynomial Time Complete), a term computer scientists use to say that computation time grows exponentially as the size of the problem(number of cities in this case) increases._

------------------------------------------------------------------------

So earlier, I stated that our biological system is basically a super fast computer. That's not entirely true, it does compute incredibly fast, BUT, only on a specific subset of problems. Biological systems are strong at parallel processing (running multiple computations at the same time). In contrast, current silicon chip-based computers are probably better suited for sequential processing (doing computations one after another). 

-------------------------------------------------------------------------

_**NOTE**: I say relatively better suited (and not just better) because there's no inherent disadvantage to using a silicon chip to do parallel computations. There is, however, a limit to the amount of transistors on a chip so the more branches you have, the less you have all around._

-------------------------------------------------------------------------

### Primer on DNA

To understand why biological systems are strong at parallel processing, we first need to understand a bit about DNA. 

![DNA-RNA](https://upload.wikimedia.org/wikipedia/commons/3/37/Difference_DNA_RNA-EN.svg)

Adenine (A), thymine (T), cytosine (C), and guanine (G) are the four chemical bases in DNA. Combinations of these four bases create strands or RNA. Adenine bonds to thymine and cytosine bonds to guanine, these are called Watson-Crick complements. Watson-Crick complements don't have to be singular bases, they can also be strings. So the string AGTCATAAG would have a complement TCAGTATTC. Stick these two strands/RNA together and you have DNA! So trying to steer clear of being too technical, all the stuff we talked about just now has some pretty neat chemical properties. Here are some operations you can perform DNA/RNA [^3]: 

1. Restriction Enzymes: These enzymes contain something called a restriction site which parses double-stranded DNA for specific sequences. When these specific sequences are found, the DNA is split at that point
2. Polymerase Chain Reaction: Creates/replicates DNA strands
3. Annealing & Melting: Strands of DNA will bond or split depending on whether the temperature is decreasing or increasing. 
4. Gel Electrophoresis: Separates DNA according to molecule size.

There's a lot more operations you can perform on DNA, but here's the main point: **through manipulating inputs and causing certain chemical reactions, one can create, edit, piece together, clone and move around DNA.**

### The Birth of DNA Computing

Now we have what we need to understand Adleman's 1994 paper. The algorithm proposed to solve the Hamiltonian path problem looks like this [^2]:

1. Generate random paths through the graph
2. A beginning point and ending point are defined as v<sub>in</sub> and v<sub>out</sub>. Keep only those paths that begin with "v<sub>in</sub> and end with v<sub>out</sub>
3. If the graph has n vertices then keep only those paths that enter exactly n vertices
4. Keep only those paths that enter all of the vertices of the graph at least once
5. If any paths remain, say "Yes"; otherwise, say "No".

Implementing each step using DNA [^2]:

1. Each vertex of the graph is encoded as a random 20-mer strand of DNA. Each edge x-y is encoded as the last 10 nucleotides of x and first 10 nucleotides of y, in that order. Node and edge complements are mixed in to create ligation reactions
2. Product of step 1 amplified by polymerase chain reaction using "v<sub>in</sub> and v<sub>out</sub>. Node complements are mixed in to create ligation reactions
3. Product of step 2 is run on an agarose gel to separate all 140-mer DNA strands. Product is PCR amplified and gel-purified to enhance its purity
4. Product is affinity-purified with a biotin-avidin magnetic beads system. Generating single-stranded DNA from step 3's double stranded products. Incubate single stranded DNA with the complement of each nucleotide that is not "v<sub>in</sub> or v<sub>out</sub>.
5. Product of step 4 is amplified by PCR. Product is run on a get

I'm overgeneralizing here but the gist of it is; Adleman has a problem he wants to solve. The Hamiltonian path problem. He creates a couple million DNA strands, labels each one as a possible solution and throws them all in a vial. He proceeds through a series of actions such as changing the environment (increasing/decreasing the temperature of the vial) or introducing enzymes in the vial (to cause chemical reactions) which causes changes to the original DNA strands. Some enzymes cut double-stranded DNA into single stranded DNA, others can replicate DNA strands, there's a lot you can do. So Adleman goes through his algorithm, "okay we need paths that begin at "v<sub>in</sub> and end with v<sub>out</sub>, let's add some molecules of this and that to cause a polymerase chain reaction in the vial and then cause some ligation reactions." Like magic, each DNA strand would be acted upon by the molecules introduced and you would get a neat little group of DNA strands that satisfied your conditions. Except it's chemistry, not magic. Each time Adleman introduces a new variable, some DNA strands get trashed. By repeating this over and over again, Adleman will repeatedly pare down the number of DNA strands in his vial. When he's done going through his algorithm, whatever's left in his vial is an optimum solution.

### External Sources

Bai Li. (2016, August 02). A Brief Introduction to DNA Computing. Retrieved March 21, 2017, from https://luckytoilet.wordpress.com/2016/07/28/a-brief-introduction-to-dna-computing/

#### Citations

[^1]: Richard P. Feynman, “There’s plenty of room at the bottom,” California Institute of Technology Journal of Engineering and Science 4(2), 23–36 (1960). [Link][Plenty of Room at the Bottom] 

[^2]: Leonard M. Adleman. 1994. Molecular computation of solutions to combinatorial problems. Science 266, 11 (November 1994), 1021-1024. [Link][Molecular Computation of Solutions to Combinatorial Problems]

[^3]: School of Information Technology Indian Institute of Technology Kharagpur , 1-18. (2005). Retrieved March 21, 2017, from http://sit.iitkgp.ernet.in/research/aut05seminar2/#topic6





[Plenty of Room at the Bottom]:https://www.pa.msu.edu/~yang/RFeynman_plentySpace.pdf
{:target="_blank"}

[Molecular Computation of Solutions to Combinatorial Problems]: https://www.usc.edu/dept/molecular-science/papers/adleman-science.pdf
{:target="_blank"}

[A Brief Introduction to DNA Computing]: https://luckytoilet.wordpress.com/2016/07/28/a-brief-introduction-to-dna-computing/
{:target="_blank"}




