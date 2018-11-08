---
layout: post
title: "Building AWS Lambda Functions with Clojure"
date: 2018-11-08 1:44:0 -0000
categories:
---


So this is a quick tutorial on getting up and running on AWS Lambda in Clojure. It took me a while to get things running correctly so I'm just going to document what I did here. 

Let's say we want to set up a RESTful service called `adder`. Setup a new [Leiningen](https://leiningen.org/) project using the template [lein-clojure-lambda-template](https://github.com/bansd/lein-clojure-lambda-template). It's deployed to Clojars so you can just run the command as is:

    $ lein new aws-lambda-serverless adder
    $ cd adder && tree
    .
    ├── project.clj
    ├── README.md
    ├── src
    │   └── adder
    │       └── core.clj
    └── test
        └── adder
            └── core_test.clj

    4 directories, 4 files

Change directory into it and you'll see a directory structure like the above, pretty standard stuff.

    $ cat src/adder/core.clj
    (ns adder.core
      (:gen-class
       :methods [^:static [handler [java.util.Map] String]]))


    (defprotocol ConvertibleToClojure
      (->cljmap [o]))

    (extend-protocol ConvertibleToClojure
      java.util.Map
      (->cljmap [o] (let [entries (.entrySet o)]
                    (reduce (fn [m [^String k v]]
                              (assoc m (keyword k) (->cljmap v)))
                            {} entries)))

      java.util.List
      (->cljmap [o] (vec (map ->cljmap o)))

      java.lang.Object
      (->cljmap [o] o)

      nil
      (->cljmap [_] nil))

    (defn -handler [s]
      (println (->cljmap s))
      (println "Hello World!"))

Inside `src/adder/core.clj` is the main stuff you want to focus on.

* In setting the namespace a `:gen-class` directive is supplied to generate a bunch of class files `adder/core*.class` so that we can generate named classes that can be called in Java. I won't go into it here but checkout the docs [Ahead-of-time Compilation and Class Generation](https://clojure.org/reference/compilation).
* The `:methods [^:static [handler [java.util.Map] String]]))` line defines a static method `handler` which takes in a parameter of type `java.util.Map` and returns a value of type `String`. The `^` inside `^:static` is called a metadata marker and in this instance sets `:static` to `true`.
* A protocol, `->cljmap`, has been defined which takes in one parameter `o`. All it does is this, if `o` is a Java object, it'll be converted to the corresponding Clojure object.
* The function definition for `-handler`. Everything above is boilerplate, this is the only thing you need to modify. `(->cljmap s)` is the payload.

To implemenet the handler we would just write something like this. Inputs generally come in json format,


    ;; Ex. {"input": [1, 2, 3, 4]}
    (defn adder [nums]
      (reduce + nums))
    (defn -handler [s]
      (adder (:input (->cljmap s) #",")))

Say you want to be able to handle multiple inputs. You would need to modify the method definition too.

    ;; Ex. {"input": [[1, 2, 3, 4],[5, 6, 7, 8]]}
    ...
    :methods [^:static [handler [java.util.Map] clojure.lang.LazySeq]]))
    ...
    (defn adder [nums]
      (reduce + nums))
    (defn -handler [s]
      (map (adder (:input (->cljmap s) #","))))

And that should be enough to get you anywhere you want to go. Now to deploy it. Make sure you've already installed and setup the AWS CLI.

    pip3 install awscli
    aws configure

Create your uploadable binary

    lein uberjar

Create the Lambda function. You'll need to create a role that your Lambda can assume to have the proper permissions.

    #/bin/bash
    AWS_ACCOUNT_ID=XXXXXXXXXX # Should be some number
    ROLENAME=XXXXXX # A string name
    FUNCTION_NAME=adder
    HANDLER=adder.core::handler
    MEMORY=512
    TIMEOUT=5
    VERSION=0.1.0

    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --handler $HANDLER \
        --runtime java8 \
        --memory $MEMORY \
        --timeout $TIMEOUT \
        --role arn:aws:iam::$AWS_ACCOUNT_ID:role/$ROLE \
        --zip-file fileb://target/adder-$VERSION-SNAPSHOT-standalone.jar

Now your Clojure code is on Lambda. To test whether it's working

    aws lambda invoke --function-name adder --payload "{\"input\": [[1, 2, 3, 4]]}" outfile.txt

You should now have the output saved in `outfile.txt`. But invoking the Lambda directly isn't ideal. AWS has something called API Gateway which can be connected to, creating a REST endpoint.

    #/bin/bash

    # Create REST API: Regional endpoint with API key enabled
    aws apigateway create-rest-api \
        --name adder-api \
        --endpoint-configuration types=REGIONAL \
        --api-key-source HEADER
    # Get the ID of the created API (assumes you don't have any other API gateways)
    REST_API_ID=$(aws apigateway get-rest-apis | jq ".items[0].id" | tr -d '"')
    # Get the default resource ID of the created API
    RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $REST_API_ID | jq ".items[0].id" | tr -d '"')
    
    # To get URI: https://docs.aws.amazon.com/cli/latest/reference/apigateway/put-integration.html
    URI=XXXX 
    # Attach our Lambda to the above method
    aws apigateway put-integration \
        --rest-api-id $REST_API_ID \
        --resource-id $RESOURCE_ID \
        --type AWS
        --http-method POST \
        --integration-http-method POST \
        --authorization-type NONE \
        --uri $URI
        --api-key-required

    # Deploy to a `dev` stage
    aws apigateway create-deployment \
        --rest-api-id $REST_API_ID \
        --stage-name dev

Above we create a REST API that's open to the world. To add an `X-API-KEY` header for authentication:

    #/bin/bash

    # Create an API key
    aws apigateway create-api-key --name adder-api-key
    KEY_ID=$(aws apigateway get-key-ids | jq ".items[0].id" | tr -d '"')

    # Create a usage plan and connect it to the deployed API above
    aws apigateway create-usage-plan \
        --name basic-usage-plan \
        --api-stages apiId="$REST_API_ID",stage="dev"
    USAGE_PLAN_ID=$(aws apigateway get-usage-plans | jq ".items[0].id" | tr -d '"')

    # Connect the created API key to the usage plan
    aws apigateway create-usage-plan-key \
        --key-id $KEY_ID \
        --key-type "API_KEY" \
        --usage-plan-id $USAGE_PLAN_ID \
     # Get the API key value to put in your request header
     API_KEY=$(aws apigateway get-api-key --api-key $KEY_ID --include-value | jq ".value" | tr -d '"')

     echo "Your API Key: $API_KEY"

Honestly, setting up the API Gateway via command line is messy, doing it from the console is much nicer in my opinion. But anyways. To test that everythings working send a post request to `https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/` with the API key as a header. In Python this would be:

    #!/usr/bin/python
    import requests

    rest_api_id = ...
    region = ...
    stage_name = "dev"

    url = f"https://{rest_api_id}.execute-api.{region}.amazonaws.com/{stage_name}/"
    payload = {"input": [[1, 2, 3, 4]]}
    headers = {
        "content-type": "application/json",
        "x-api-key": XXXXXXXXXXXXXXX
    }

    response =requests.post(url, data=json.dumps(payload), headers=headers)

That's it, you're done. By the way if you want to update your function, you would just run something like:

    #/bin/bash
    FUNCTION_NAME=adder
    VERSION=0.1.0

    lein uberjar
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://target/adder-$VERSION-SNAPSHOT-standalone.jar

Just to close off, this was what worked well for me, it was simple to setup and is relatively easy to maintain. You may find better mileage elsewhere. A nice option to consider if you're willing to put a bit of time into learning it is the [Serverless framework](https://serverless.com/) which provides a lot more in terms of automation, features and has a ton of open source support (26,000+ GitHub stars!). 
