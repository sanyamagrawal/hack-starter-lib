require.config({
    baseUrl: "..",
    paths: {
        jquery: "../../../bower_components/jquery/dist/jquery.min",
        text: "../../../bower_components/requirejs-text/text",
        Handlebar: "../../../bower_components/handlebars/handlebars.min",
        bootstrap: "./src/script/bootstrap",
        underscore: "../../../bower_components/underscore-amd/underscore-min",
        moment: "../../../bower_components/moment/min/moment.min",
        socketio: "../../../bower_components/socket.io-client/socket.io",
        multiselect: "../../../bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect"
    },
    waitSeconds: 0,
    shim: {
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

require(["jquery", "bootstrap"], function() {

    require(["./src/script/beforeAppStart"], function(BeforeAppStart) {

        function initApp() {
            require(["./src/script/app"], function(app) {
                try {
                    app.initialize();
                } catch (ex) {
                    console.log("ERROR:" + ex);
                }
            });
        }

        new BeforeAppStart().render(initApp);
    });

});
