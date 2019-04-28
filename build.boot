(set-env!
  :resource-paths #{"src" "markdown" "public"}
  :dependencies '[[adzerk/boot-reload "0.6.0" :scope "test"]
                  [bidi "2.1.5"]
                  [gbuisson/frontmatter "0.0.3"]
                  [garden "1.3.9"]
                  [hiccup "1.0.5"]
                  [http-kit "2.3.0"]  
                  [markdown-to-hiccup "0.6.2"]
                  [mount "0.1.16"]
                  [org.clojure/clojure "1.10.0"]
                  [org.danielsz/system "0.4.2"]])

(task-options!
  pom {:project 'web
       :version "0.1.0-SNAPSHOT"
       :description ""}
  jar {:main 'web.core})

(require '[web.core :as web]
         '[adzerk.boot-reload :refer [reload]]
         '[mount.core :as mount])

; (deftask dev
;   []
;   (comp
;     (reload)
;     (watch :verbose true)
;     (repl :no-color true :init-ns 'boot.user)))
;     ; (web/start-server!)))

(deftask dev []
  (comp
    (repl :no-color true :init-ns 'web.core)))

(deftask build []
  (comp (aot) (pom) (uber) (jar) (sift) (target)))
