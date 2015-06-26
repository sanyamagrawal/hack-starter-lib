define([
    "Handlebar",
    "underscore",
    "moment"
], function(Handlebar, _, moment) {
    var localeInfo = {
            "IN": {
                "MONEY": "Rs.",
                "DatePattern": "ddd, Do MMM'YY" ////Tue, 3rd Sep'13
            }
        },

        util = {

            renderTemplate: function(template, data) {
                var callback = Handlebar.compile(template);

                Handlebar.registerHelper("l10nMoney", function(value) {
                    if (value) {
                        return [localeInfo.IN.MONEY, value].join(" ");
                    }
                });

                Handlebar.registerHelper("l10nDate", function(value) {
                    if (value) {
                        return this.getLocalizedStringFromDate(value, localeInfo.IN.DatePattern);
                    }
                }.bind(this));

                Handlebar.registerHelper("deliveryDate", function(value, pattern) {
                    var usePattern = typeof(pattern) === "string" ? pattern : "ddd, Do MMM";
                    if (value) {
                        return this.getLocalizedStringFromDate(value, usePattern);
                    }
                    return value;
                }.bind(this));

                Handlebar.registerHelper("l10nShipping", function(value) {
                    if (value) {
                        return [localeInfo.IN.MONEY, value].join("");
                    } else {
                        return "FREE";
                    }
                });

                Handlebar.registerHelper("booleanToValueMapping", function(value) {
                    if (value) {
                        return "YES";
                    } else {
                        return "NO";
                    }
                });

                Handlebar.registerHelper("JSON2String", function(object) {
                    return JSON.stringify(object);
                });

                Handlebar.registerHelper("boolenToRequiredMapping", function(value) {
                    if (value) {
                        return "required";
                    } else {
                        return "false";
                    }
                });

                Handlebar.registerHelper("chainedField", function(value) {
                    return value ? value : "undefined";
                });

                return callback(data);
            },

            find: function(iterator, value, callback) {
                return _.find(iterator, callback.bind(this, value));
            },

            getLocalizedStringFromDate: function(date, pattern) {
                if (!pattern) {
                    pattern = localeInfo.IN.DatePattern;
                }
                var localizedDate = moment(date).format(pattern);
                localizedDate = localizedDate !== "Invalid date" ? localizedDate : date;
                return localizedDate;
            },

            findParent: function(klass, node, count) {
                var parent;
                if (node && count > 0) {
                    parent = $(node).parent();
                    if ($(parent).hasClass(klass)) {
                        return parent;
                    } else {
                        parent = this.findParent(klass, parent, --count);
                    }
                }
                return parent;
            },

            reject: function(array, fn) {
                return _.reject(array, fn);
            },

            timeRange: function(value) {
                var timeArray;
                if (!value) {
                    return "";
                }
                timeArray = value.split("-");
                $.each(timeArray, function(index, time) {
                    timeArray[index] = moment(time, "hh a").format("hh a");
                });
                return timeArray.join(" - ");
            }

        };

    return util;
});
