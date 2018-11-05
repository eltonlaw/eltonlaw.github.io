---
layout: post
title: "CPython Internals"
date: 2018-08-01 0:00:00 -0000
categories:
---

This is the document structure

    aclocal.m4
    CODE_OF_CONDUCT.md
    config.guess
    config.sub
    configure
    configure.ac
    Doc
    doc.text
    Grammar
    Include
        opcode.h: Different kind of operations you can do in python
        ceval.c: Main interpeter loop, basically a giant while loop that runs instructions
    install-sh
    Lib
    LICENSE
    m4
    Mac
    Makefile.pre.in
    Misc
    Modules
    Objects
        object.c: Generic object type in python and how things are implemented
    Parser
    PC
    PCbuild
    Programs
    pyconfig.h.in
    Python
    README.rst
    setup.py
    Tools

`Lib/` contains the python standard library implemented in Python. Some of the standard library is also in `Modules/` as C code. Data structures are in `Objects`.

What happens when you run `python3 test.py`

    >>> c = compile("test.py", "test.py", "exec")
    >>> c 
    <code object <module> at 0x7f873658b5d0, file "test.py", line 1>
    >>> [byte for byte in c.co_code]
    [101, 0, 106, 1, 1, 0, 100, 0, 83, 0]

So Python has a disassembler, it takes the source file, compiles it and prints it out in a pretty way.
    
    $ python3 -m dis test.py 
      1           0 LOAD_CONST               0 (1)
                  2 STORE_NAME               0 (x)

      2           4 LOAD_CONST               1 (2)
                  6 STORE_NAME               1 (y)

      3           8 LOAD_NAME                0 (x)
                 10 LOAD_NAME                1 (y)
                 12 BINARY_ADD
                 14 STORE_NAME               2 (z)

      4          16 LOAD_NAME                3 (print)
                 18 LOAD_NAME                2 (z)
                 20 CALL_FUNCTION            1
                 22 POP_TOP
                 24 LOAD_CONST               2 (None)
                 26 RETURN_VALUE


