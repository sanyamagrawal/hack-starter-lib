define([
    "src/base/declare",
    "src/base/util/xhr",
    "src/base/BaseURLMap"

], function(declare, xhr, config) {

    return declare(null, {

        getUIServiceUrl: function(baseUrl, uiserviceURL, port) {

            var ENV = window.app.ENV,
                urlConfig,
                portNumber,
                url;

            //Getting The correct Config based on the Environment
            urlConfig = config.BASE_URL_MAP[ENV][baseUrl];

            //Set The port Number
            portNumber = port ? port : urlConfig.port;

            url = [urlConfig.url, portNumber].join(":") + "/";
            url = [url, uiserviceURL].join("");
            return url;
        },

        getOptions: function() {
            return {};
        },

        doXHRGet: function(url, options) {
            var args = $.extend({
                url: url,
                type: "GET"
            }, options || {});
            return xhr.get(args);
        },

        doXHRPost: function(url, content, options) {
            var args = $.extend({
                url: url
            }, options || {});

            if (content) {
                args.data = content;
            }

            return xhr.post(args);
        },

        doXHRPut: function(url, content, options) {
            var args = $.extend({
                url: url
            }, options || {});

            if (content) {
                args.data = content;
            }

            return xhr.put(args);
        }

    });
});
