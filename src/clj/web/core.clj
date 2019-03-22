(ns web.core
  (:require [mount.core :as mount]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [ring.middleware.resource :refer [wrap-resource]]
            [clojure.java.io :as io]))

(defn handler [request]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body "blahasdsadas "})

(defn start-server []
  (run-jetty handler {:http-port 3000 :async true}))

(defn stop-server [s]
  (.stop s))

(mount/defstate ^{:on-reload :noop} repl-server
  :start (start-server)
  :stop (stop-server repl-server))
