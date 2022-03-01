#!/usr/bin/env bb
;;;; yay -S babashka-bin
;;;; To be run inside the _posts/ dir
;;;; Note: clojure.string is already aliased to `str`

;; very old script: should really use clj-yaml
(require '[clojure.string :as string])
(import java.time.format.DateTimeFormatter
        (java.time LocalDateTime Instant ZoneOffset)
        (java.io BufferedReader FileReader))

(def file-date-format "yyyy-MM-dd")
(def last-modified-date-format "yyyy-MM-dd HH:mm:ss a")

(defn- prepend-file-date [string local-date-time]
  (str (.format local-date-time (DateTimeFormatter/ofPattern file-date-format)) "-" string))

(defn new-post [title]
  (if title
    (let [now (LocalDateTime/now)
          filename (-> title
                       (string/replace #" " "-")
                       (string/replace #"\"" "-")
                       string/lower-case
                       (prepend-file-date now)
                       (str ".md"))
          yaml-frontmatter (string/join "\n"
                                        ["---"
                                         "layout: post"
                                         "title: \"%s\""
                                         "date: %s"
                                         "categories:"
                                         "---"])
          body (format yaml-frontmatter
                       title
                       (.format now (DateTimeFormatter/ofPattern last-modified-date-format)))]
      (spit filename body))
    (throw (Exception. "New post requires 'title'"))))

(defn parse-date [date]
  (LocalDateTime/parse date
                       (DateTimeFormatter/ofPattern last-modified-date-format)))

(defn read-frontmatter* [file]
  (with-open [reader (-> file (FileReader.) (BufferedReader.))]
    (loop [line (.readLine reader)
           ;; can be :start, :frontmatter or :post
           reader-location :start
           out {}]
      (cond
        (and (= :start reader-location) (re-find #"---" line))
        (recur (.readLine reader) :frontmatter out)

        (= :start reader-location)
        (throw (Exception. "Expected a `---` at beginning of file"))

        (= :frontmatter reader-location)
        (if-not (re-find #"---" line)
          ;; parse individual line - ex. `layout: post`
          (let [[x k v] (re-find #"(\w+):\s?(.*)" line)]
            (recur (.readLine reader) :frontmatter (assoc out (keyword k) (str v))))
          (recur (.readLine reader) :post out))
        ;; don't parse rest of post, only need front matter
        ;; can impl if needed later
        (= :post reader-location)
        out))))

(defn read-frontmatter [file]
  (let [fm (read-frontmatter* file)]
    (cond-> fm
      (:date fm) (update :date parse-date)
      (:categories fm) (update :categories #(set (string/split % #","))))))

;; Milliseconds to seconds
(defn- ms->s [ms] (/ ms 1000))

(defn md-file? [file]
  (some? (re-find #".md$" (.getName file))))

(defn- update-filename-date [file local-date-time]
  (let [filename-without-date (subs (.getName file)
                                    (count file-date-format))
        new-date-str (.format local-date-time
                              (DateTimeFormatter/ofPattern file-date-format))
        new-filename (str new-date-str filename-without-date)]
    (.renameTo file (io/file new-filename))))

(defn- update-yaml-date [file local-date-time]
  (let [tmp-file (io/file (str "tmp-" (.getName file)))]
    (with-open [writer (io/writer tmp-file)]
      (with-open [reader (io/reader file)]
        (doseq [line (line-seq reader)]
          (if (re-find #"date: (\S+ \S+ \S+)" line)
            (.write writer (format "date: %s\n"
                                   (.format local-date-time (DateTimeFormatter/ofPattern last-modified-date-format))))
            (.write writer (str line "\n"))))))
    (.renameTo tmp-file file)))

(defn update-post
  "If file has been written to more recently than saved date, update it"
  [file]
  (let [frontmatter (read-frontmatter file)
        ;; Last modified value of the file on the file system
        file-last-modified (LocalDateTime/ofEpochSecond (ms->s (.lastModified file)) 0 (ZoneOffset/ofHours -4))
        ;; Last modified value stored in the markdown
        yaml-last-modified (:date frontmatter)]
    ;; Compare file modified last written to date with saved data inside file
    ;; add 5 seconds to account for slight lag in auto-updates
    (if (and (.isBefore (.plusSeconds yaml-last-modified 5)
                        file-last-modified)
             (not (contains? (:categories frontmatter) "finalized"))) 
      (do
        (update-yaml-date file file-last-modified)
        ;; Changing the name should happen last
        (update-filename-date file file-last-modified)
        (println (format "[UPDATED] `%s`" (.getName file))))
      (println (format "[-] `%s`" (.getName file))))))

(defn update-all-posts [dir]
  (let [files (->> (file-seq (io/file dir))
                   (filter md-file?))]
    (doall (map update-post files)))
  (println "Update complete. -------------"))

(defn print-help []
  (println "Available commands: new, update")
  (println "```")
  (println "$ posts.clj new \"A Generated Post Title Writing\"")
  (println "$ posts.clj update-all")
  (println "$ posts.clj update 2020-07-05-adding-unsafe_block_in_unsafe_fn-checks-to-libstd-fs.md")
  (println "```")
  (println "The `update` commands help auto update the yaml date and file name to match the")
  (println "last written timestamp.")
  (println "Note: Posts that have a 'finalized' value in categories don't get updated"))

(defn -main []
  (let [[cmd & args] *command-line-args*]
    (case (keyword cmd)
      :new        (new-post (first args))
      :update     (update-post (io/file (first args)))
      :update-all (update-all-posts ".")
      :frontmatter (println (read-frontmatter (io/file (first args))))
      (print-help))))

(-main)
