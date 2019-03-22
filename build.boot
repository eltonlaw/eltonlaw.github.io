(set-env!
  :resource-paths #{"src/clj"}
  :dependencies '[[org.clojure/clojure "1.10.0"] [ring "1.7.1"]
                  [adzerk/boot-reload "0.6.0"]
                  [markdown-clj "1.0.7"]
                  [mount "0.1.16"]
                  [hiccup "1.0.5"]
                  [bidi "2.1.5"]
                  [org.danielsz/system "0.4.2"]])

(task-options!
  pom {:project 'web
       :version "0.0.1"}
  jar {:manifest {"Foo" "bar"}})

(require
  '[web.core :as web]
  '[adzerk.boot-reload :refer [reload]]
  '[mount.core :as mount])

(deftask dev
  []
  (comp
    (reload)
    (watch :verbose true)
    (repl :server true)
    (web/start)))

(deftask build []
  (comp (pom) (uber) (jar) (sift) (target)))
