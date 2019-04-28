(ns web.core
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [frontmatter.core :as fm]
            [garden.core :refer [css]]
            [hiccup.core :as hc]
            [hiccup.page :refer [html5]]
            [mount.core :as mount]
            [mount.core :refer [defstate]]
            [markdown-to-hiccup.core :as m]
            [org.httpkit.server :refer [run-server]])
  (:gen-class))

(defn style []
  (css [:body {:background "#f2f2f2" :color "#444444"
               :font-family "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
               :max-width "80%"}]
       [:code {:background "white"}]
       [:a {:border-bottom "1px solid #444444" :color "#444444" :text-decoration "none"}]))

(defn load-md [filename]
  (-> filename
      io/resource
      slurp
      fm/parse
      (update :body m/md->hiccup)))

(defn post-header [{:keys [layout title date]}]
  [:div
   [:h1 title]
   [:h4 date]])

(defn posts [& filenames]
  (for [{:keys [frontmatter body]} (map load-md filenames)]
    [:div
     (post-header frontmatter)
     [:div body]]))

(defn home-page []
  (html5
    [:head
     [:meta {:charset "utf-8"}]
     [:meta {:name "viewport"
             :content "width=device-width, height=device-height, user-scalable=no, initial-scale=1.0"}]
     [:meta {:name "description"
             :content ""}]
     [:style (style)]]
    [:body
     [:title "Loads of Crap"]
     (posts "2018-03-07-docker-for-python-testing.md"
            "2018-11-08-building-aws-lambda-functions-with-clojure.md")]))

(defn handler [request]
  {:status 200
   :headers {"Content-Type" "text/html"}
   ; :body "asdasdasd"
   :body (hc/html (home-page))})

(defn start-server []
  (run-server handler {:port 3000 :join? false}))

(defstate server ; ^{:on-reload :noop} 
  :start (start-server)
  :stop (server))

(defn -main [& args]
  (mount/start server))
