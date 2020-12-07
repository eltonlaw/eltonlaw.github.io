---
layout: post
title: "Adding unsafe_block_in_unsafe_fn linting to libstd/fs.rs"
date: 2020-07-05 22:26:12 PM
categories:
---

I recently had the pleasure of [adding a `deny` lint to `libstd/fs.rs` in `rustc`](https://github.com/rust-lang/rust/pull/73909), this is documentation of that process.

### Context

A new feature `unsafe_block_in_unsafe_fn` was proposed in [RFC #2585] and implemented [here][RFC #2585 implementation]. The basic idea is that the semantics of `unsafe fn` have changed from meaning "this entire function is `unsafe`" to "this function contains `unsafe` block(s)". Changes will need to be done to all instances of `unsafe fn`, wrapping `unsafe` blocks where needed. This has been implemented as an opt-in lint and to prevent breaking changes it only emits warnings for now.

A [proposal was made to enable these lints for `liballoc`][Enable lint in `liballoc` proposal] and [another for `libcore` and `libstd`][Enable lint in `libcore` and `libstd` proposal]. A quick PR followed up for [enabling the lint for `liballoc`][Enable lint in `liballoc` implementation] as an example implementation and that has since been merged. So the remaining work was to replicate what was done in that PR for the other namespaces. `libstd`, being pretty large, was split into its component files with a [tracking issue][Enable lint in `libstd` tracking issue]. I asked to take `stdlib/fs.rs`.

### The PR ([#73909])

Getting started is simple as instructions are laid out in the community-maintained ["Guide to Rustc Development"](https://rustc-dev-guide.rust-lang.org/about-this-guide.html).

I enabled the lint in `lib.rs` and set the lint level to `deny` in `fs.rs` ([b438811]). The `deny` is needed to override the [lint declaration] which sets it to `Allow` by default. Running `./x.py check` (as instructed in the tracking issue) gave the following errors:

    ...
    error: call to unsafe function is unsafe and requires unsafe block (error E0133)
       --> src/libstd/fs.rs:670:9
        |
    670 |         Initializer::nop()
        |         ^^^^^^^^^^^^^^^^^^ call to unsafe function
        |
    note: the lint level is defined here
       --> src/libstd/fs.rs:2:9
        |
    2   | #![deny(unsafe_op_in_unsafe_fn)]
        |         ^^^^^^^^^^^^^^^^^^^^^^
        = note: consult the function's documentation for information on how to avoid undefined behavior

    error: call to unsafe function is unsafe and requires unsafe block (error E0133)
       --> src/libstd/fs.rs:715:9
        |
    715 |         Initializer::nop()
        |         ^^^^^^^^^^^^^^^^^^ call to unsafe function
        |
        = note: consult the function's documentation for information on how to avoid undefined behavior

    error: aborting due to 2 previous errors

    error: could not compile `std`.
    ...

So the lint seems to be working properly, and found two problems areas, occurring on the same function call. The fix requires two things, surrounding the unsafe code with an `unsafe` block and a comment explaining why the code is safe. The following will address the latter.

`Initializer::nop` is being called in the `initializer` method for the standard library implementations of `Read` for `File` and `&File`

```rust
impl Read for File {
    ...
    unsafe fn initializer(&self) -> Initializer {
        Initializer::nop()
    }
}
...
impl Read for &File {
    ...
    unsafe fn initializer(&self) -> Initializer {
        Initializer::nop()
    }
}
```

The `initializer` determines whether any prep work operates on the buffer before the read occurs, the other `Initializer::zeroing()` gets passed in if the specific implementation of the `Read` requires the buffer to be zeroed out first. This does not seem to be required which is why it's fine to use `Initializer::nop`. So I just added those comments and surrounded it with `unsafe` ([7616cd9]). Rerunning `./x.py check`

    ...
    Build completed successfully in 0:00:00

and bada boom bada bing, Bob's your uncle.

### Reference Links

- [RFC #2585] Long form motivation of RFC
- [RFC #2585 implementation]
- [RFC #2585 tracking issue]
- [Enable lint in `liballoc` proposal]
- [Enable lint in `liballoc` implementation]
- [Enable lint in `libcore` and `libstd` proposal]
- [Enable lint in `libstd` tracking issue]


[RFC #2585]: https://github.com/rust-lang/rfcs/blob/master/text/2585-unsafe-block-in-unsafe-fn.md
[RFC #2585 implementation]: https://github.com/rust-lang/rust/pull/71862
[RFC #2585 tracking issue]: https://github.com/rust-lang/rust/issues/71668
[Enable lint in `liballoc` proposal]: https://github.com/rust-lang/compiler-team/issues/306
[Enable lint in `liballoc` implementation]: https://github.com/rust-lang/rust/pull/72709
[Enable lint in `libcore` and `libstd` proposal]: https://github.com/rust-lang/compiler-team/issues/317
[Enable lint in `libstd` tracking issue]: https://github.com/rust-lang/rust/issues/73904
[#73909]: https://github.com/rust-lang/rust/pull/73909
[b438811]:https://github.com/rust-lang/rust/pull/73909/commits/b438811029edfb3f39451c91d7e107e0338cf043
[7616cd9]: https://github.com/rust-lang/rust/pull/73909/commits/7616cd9ee9c2eb0cec7b76d608af7c8fad7704d4
[lint declaration]: https://github.com/eltonlaw/rust/blob/b438811029edfb3f39451c91d7e107e0338cf043/src/librustc_session/lint/builtin.rs#L535-L540

