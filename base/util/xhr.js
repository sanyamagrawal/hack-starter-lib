define(function() {

    /**
     * Takes a name/value mapping object and returns a string representing a URL-encoded version of that object.
     *  Example:
     *		 var object = {
     *			blah: "blah",
     *			multi: [
     *				"thud",
     *				"thonk"
     *			]
     *		};
     *
     *		Yields the following query string:
     *
     *		"blah=blah&multi=thud&multi=thonk"
     *
     * @param  {object} map An object which needs to be converted to string to be attached to the URL
     * @return {string}     A String containing all the key value pairs as required by the URL . Query Param
     */
    var objectToQuery = function(map) {

            var enc = encodeURIComponent,
                pairs = [],
                assign;

            $.each(map, function(name, value) {

                assign = enc(name) + "=";
                if ($.isArray(value)) {
                    $.each(value, function(index, data) {
                        /*jshint unused:false*/
                        pairs.push(assign + enc(data));
                    });
                } else {
                    pairs.push(assign + enc(value));
                }

            });

            return pairs.join("&"); // String
        },

        addQueryToURL = function(args) {
            var query = objectToQuery(args.query || {});
            if (args.url && query) {
                args.url += (~args.url.indexOf("?") ? "&" : "?") + query;
            }
            return args;
        },

        /**
         *
         * @param {Object} args Should contain the values required by jquery.ajax
         *  url     : the url
         *  data    : the POST data either as an object or json string
         *  query   : the GET query params
         *  headers : can have headers
         *
         * The caller of the function must use the Jquery deferred API as follows
         *
         *   get(args).then(function(response){
         *       // Do something with the response
         *   }, function(error){
         *       // Handle the error condition
         *   });
         *
         * @return {jquery.Deferred}
         */
        doRequest = function(method, args) {
            if (!method || !args.url) {
                return;
            }

            var defaultContentType = "application/json; charset=utf-8",
                defaultCharset = "; charset=utf-8",
                data, query, contentTypeKey, contentType, options;

            // process Content Type
            contentTypeKey = Object.keys(args.headers || {}).filter(function(key) {
                return key.toLowerCase() === "content-type";
            })[0];

            contentType = contentTypeKey ? args.headers[contentTypeKey] : defaultContentType;

            // Add UTF-8 charset as dojo's xhr doesn't add one
            if (contentType !== false && contentType.indexOf("charset") < 0) {
                contentType += defaultCharset;
            }

            //async = (args.sync !== undefined || args.sync !== null) ? args.sync : true;
            options = {
                // mix Content-Type and CSRF Token to our headers
                headers: $.extend(args.headers, {
                    "Content-Type": contentType
                }),
                method: method,
                handleAs: args.handleAs || "json",
                async: args.sync ? args.sync : true
            };

            // If the service sends a timeout arg, send it along with the options.
            if (args && args.timeout) {
                options.timeout = args.timeout;
            }

            if (args && args.withCredentials) {
                options.withCredentials = true;
            }

            // process data
            if (method === "GET") {
                query = objectToQuery(args.query || args.data || args.content || {});
                if (args.preventCache) {
                    query += (query ? "&" : "") + "request.preventCache=" + (+new Date());
                }

                if (args.url && query) {
                    args.url += (~args.url.indexOf("?") ? "&" : "?") + query;
                }

            } else if (method === "POST" || method === "PUT") {
                if (args.query) {
                    args = addQueryToURL(args);
                }

                data = args.data || args.postData || args.content;
                // if data is still an object and contentType is JSON, process further
                if (typeof data === "object" && contentType !== false && ~contentType.indexOf("json")) {
                    // remove undefined
                    Object.keys(data).forEach(function(key) {
                        if (typeof data[key] === "undefined") {
                            delete data[key];
                        }
                    });

                    /*
                     * Stringify and remove control characters
                     *
                     * Remove control characters 0-7, 11, 14-31 to prevent errors
                     * when server is deserializing the string
                     */
                    data = JSON.stringify($.extend({}, data));
                    data = data ? data.replace(/[\x00-\x07\t\x0E-\x1F]/g, "") : "";
                }
                options.data = data;
            }
            return $.ajax(args.url, options);
        };

    return {

        /**
         * Calls doRequest internally to do an XHR GET
         *
         * @param {Object} args See doRequest for args information
         * @return {jquery.Deferred}
         */
        get: function(args) {
            return doRequest("GET", args).then(this.handleResolved, this.handleRejected);
        },

        /**
         * Calls doRequest internally to do an XHR POST
         *
         * @param {Object} args See doRequest for args information
         * @return {jQuery.Deferred}
         */
        post: function(args) {
            return doRequest("POST", args).then(this.handleResolved, this.handleRejected);
        },

        /**
         * Calls doRequest internally to do an XHR PUT
         *
         * @param {Object} args See doRequest for args information
         * @return {jQuery.Deferred}
         */
        put: function(args) {
            return doRequest("PUT", args).then(this.handleResolved, this.handleRejected);
        },
        /**
         * Method called after an xhr success. This can be used as a hook for further processing.
         * @param {Object} response Response from xhr
         * @return {Object} response Response from xhr
         */
        handleResolved: function(response) {
            return response;
        },

        /**
         * Method called after an xhr failure. This can be used as a hook for further processing.
         * @param {Error} error JavaScript Error object
         * @param {Object} args Args passed from doRequest
         */

        handleRejected: function(response) {
            return response;
        },

        doRequest: doRequest
    };

});
