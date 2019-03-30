(ns web.core
  (:require [mount.core :refer [defstate start]]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [ring.middleware.resource :refer [wrap-resource]]
            ; [hiccup.core :refer hc]
            [clojure.java.io :as io]))

(defn handler [request]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body "reloaded"})

(defn start-server []
  (run-jetty handler {:port 3000 :join? false}))

(defn stop-server [server]
  (.stop server)(mount/start #'web.core/server))

(defstate server ; ^{:on-reload :noop} 
  :start (start-server)
  :stop (stop-server server))
