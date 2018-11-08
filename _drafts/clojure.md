---
layout: post
title: "Clojure and Lisp"
date: 2018-08-01 0:00:00 -0000
categories:
---

- Dynamicly typed 
- Trying to be as accessible as Python/Ruby and as fast as Java 
- Useful in any context in which you would use Java (not just for scripting or lightweight problems)
- Most data structures are immutable (useful particularly in concurrency)
- Data structures are persistent
- No mutable local variables (don't need to iterate a counter when looping)
- In Lisp (core philosophy):
    * Code is data
    * Reader that the language has defined in terms of the interpretation of a data structure and not in terms of a stream of characters and a grammar. 
- Also in Lisp
    * Parenthesis
    * S-expressions
- Everything in Clojure is compiled on the fly into JVM bytecode
- Extensible data types, represented by abstractions with interfaces on the java side. Meaning they aren't hard wired.
- Direct metadata support for all data structures
- Typical Lisp Things:
    * Functions are first class data types
    * Closures
    * Functional looping construct
- Doesn't have proper tail call optimization (you can't get it on the JVM). Can't do recursive calls as a method of doing loops. However, it does have first class looping construct (less general than full tail call optimization)
- Destructuring/binding system (argument unpacking in Python). Can pick out and name variables from a data structure you're getting passed. Built into `let`, `fn` and `loop`. Can destructure very interesting things like sequences and maps.
- List comprehensions in a construct called `for`
- Common lisp style macros (procedural macros) 
- Clojure is a lisp 1
    * Typically it can't have hygenic macros without being a disaster, this is solved through two things: 1. Namespaces and 2. Distinguish between symbols and variables
    * Common Lisp is a Lisp two, so it has a seperate name space for functions. When the reader reads, it creates data cells because symbols are places. In Clojure the reader reads symbols and symbols are just symbols, there's no storage associated with them.
    * There's something called vars in Clojure which compilation will find, given a symbol, the var to which it corresponds.
- Multi methods: Polymorphism without inheritance. Completely general, so you have a function and it takes elements and you can say I'd like to dispatch this differently depending on what the arguments are, and it doesn't have to depend on the types it can depend on the values of the arguments. Arbitrary way of doing dispatch. Dispatching is a function of the arguments
- Concurrency support
- STATE, YOU'RE DOING IT WRONG
- Mutable objects are the wrong way to do most things. It creates an intractable mess.
- Encapsulation does not help, all it does is help you go like "well I'm in charge of this mess". But the mess is still there!
- The mess with mutable objects comes from this network you've created of objects that can change and your inability to look at the state of a system and see how it got there, how to get it there to test it next time. So it's hard to understand a program when things can change out from underneath you.
    * That's why there's so much emphasis on test-driven design.
    * We should ask ourselves, should there really be so much testing?

### What makes Lisp Macros so special

A macro is a compiler hook, when the Clojure compiler is going through it's normal process, when it sees a reference to a macro, it'll call out and let you do arbitrary code. But the code you do there returns more code. So a macro is a compiler.

https://stackoverflow.com/questions/267862/what-makes-lisp-macros-so-special

>the key difference between a macro and a normal function is that LISP evaluates all the parameters first before calling the function.

>A Lisp programmer who notices a common pattern in their code can write a macro to give themselves a source-level abstraction of that pattern. A Java programmer who notices the same pattern has to convince Sun that this particular abstraction is worth adding to the language. Then Sun has to publish a JSR and convene an industry-wide "expert group" to hash everything out. That process--according to Sun--takes an average of 18 months. After that, the compiler writers all have to go upgrade their compilers to support the new feature. And even once the Java programmer's favorite compiler supports the new version of Java, they probably ''still'' can't use the new feature until they're allowed to break source compatibility with older versions of Java. So an annoyance that Common Lisp programmers can resolve for themselves within five minutes plagues Java programmers for years.

>In most programming languages, syntax is complex. Macros have to take apart program syntax, analyze it, and reassemble it. They do not have access to the program's parser, so they have to depend on heuristics and best-guesses. Sometimes their cut-rate analysis is wrong, and then they break. But Lisp is different. Lisp macros do have access to the parser, and it is a really simple parser. A Lisp macro is not handed a string, but a preparsed piece of source code in the form of a list, because the source of a Lisp program is not a string; it is a list. And Lisp programs are really good at taking apart lists and putting them back together. They do this reliably, every day.

