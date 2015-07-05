define([
    "src/base/declare"

], function(declare) {

    return declare(null, {

        create: function() {
            this.templateRendering();
        },

        enterWaitState: function() {
            $.event.trigger("page-enter-wait");
        },

        exitWaitState: function() {
            $.event.trigger("page-exit-wait");
        },

        emit: function(type, details) {
            $.event.trigger({
                type: type,
                details: details
            });
        },

        emitStatusMessage: function(message, alert) {
            this.emit("page-message", {
                message: message,
                alert: alert
            });
        }

    });

});
