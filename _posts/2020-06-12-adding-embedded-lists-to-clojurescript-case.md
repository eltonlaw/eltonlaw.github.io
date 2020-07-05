---
layout: post
title: "Adding Embedded Lists to ClojureScript case"
date: 2020-06-12 00:21:59 AM
categories:
---

A little while ago I contributed my first, very tiny patch to the ClojureScript compiler here are some notes from that process. The patch has not been accepted yet, so take everything with a grain of salt.

This is the ticket: [CLJS-3173](https://clojure.atlassian.net/browse/CLJS-3173)

[![CLJS-3173 Description](/public/images/cljs-3173-description.png){:.ci}](https://clojure.atlassian.net/browse/CLJS-3173)

ClojureScript aims for feature parity with Clojure so checking that the code snippet works on the latest release of Clojure and errors out on the latest release of ClojureScript:

```
$ clj -A:cljr
Clojure 1.10.2-alpha1
user=> (case '(3 4) ((1 2) (3 4)) :matched)
:matched
user=>
$ clj -A:cljsr
ClojureScript 1.10.773
cljs.user=> (case '(3 4) ((1 2) (3 4)) :matched)
Execution error (ClassCastException) at cljs.analyzer/resolve-var (analyzer.cljc:1190).
class java.lang.Long cannot be cast to class clojure.lang.Named (java.lang.Long is in module java.base of loader 'bootstrap'; clojure.lang.Named is in unnamed module of loader 'app')
cljs.user=>
```

These are [deps.edn aliases](https://clojure.org/guides/deps_and_cli) for anyone unfamilliar. Here are the definitions for the aliases run above. They start a REPL for the latest releases of Clojure and ClojureScript:

```clojure
{...
 :aliases
 {...
  :cljr {:override-deps {org.clojure/clojure {:mvn/version "RELEASE"}}}
  :cljsr {:extra-deps {org.clojure/clojurescript {:mvn/version "RELEASE"}}
          :main-opts ["-m" "cljs.main"]}}}
```

And this is an alias for starting a REPL with a local copy:

```clojure :cljs {:extra-deps {org.clojure/clojurescript {:local/root "/path/to/my/clojurescript"}} :main-opts ["-m" "cljs.main"]}
```

`case` is essentially a more restrictive version of [`cond`](https://clojuredocs.org/clojure.core/cond) and could be implemented by just leaning on that...which is basically, exactly how it looked when it was added: [e22f3e9](https://github.com/clojure/clojurescript/commit/e22f3e9577c419d2efa5e56348fca0386595b251)

```clojure
(defmacro case [e & clauses]
  (let [default (if (odd? (count clauses))
                  (last clauses)
                  `(throw (js/Error. (str "No matching clause: " ~e))))
        pairs (partition 2 clauses)]
   `(condp = ~e
      ~@(apply concat pairs)
      ~default)))
```

This is how the `case` statement looks [now](https://github.com/clojure/clojurescript/blob/e9a9e89997c1087857a1eebb3a9514c0890b57fd/src/main/clojure/cljs/core.cljc#L2344-L2413), 8 years later.

Going back to the error:

    class java.lang.Long cannot be cast to class clojure.lang.Named

The implementation assumes that a passed in list looks like

```clojure
(quote some-symbol)
```

So in our case, `const?` sees a list and tries to look up the last element of the list symbol in the passed in environment.

```clojure
...
(ana/resolve-var env (last x))
...
```

...which shouldn't be allowed for `x`s that look like `'(1 2)` so I added an extra condition to only run that logic if the last element of the condition is a symbol.
