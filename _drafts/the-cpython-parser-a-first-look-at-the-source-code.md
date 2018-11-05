---
layout: post
title: "The CPython Parser: A First Look at the Source Code"
date: 2018-01-08 11:02:56 -0000
categories:
---

Just cloned the latest build from master (November 3rd, 2018).

The scope of this post will be to take a look at how Cpython handles:

- Development cycle (how does debugging and testing work?)
- Which functions do the heavy work (where to closer inspect)
- Data structures used (Ex. how tokens are represented, how trees are represented)
- Tokenization of the input stream
- How the grammar is represented and how it gets parsed
- What the inputs and outputs of the `Parser/` directory are. (Is it a self contained module that takes in source code and outputs tokens?)
- How the code has changed since initial release (v0.0,1 or whatever)


Makefile.pre.in (301)
    
    PARSER_OBJS=	$(POBJS) Parser/myreadline.o Parser/parsetok.o Parser/tokenizer.o
