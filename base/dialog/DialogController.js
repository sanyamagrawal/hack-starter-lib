define([
    "src/base/declare",
    "src/base/util/common",
    "src/base/BaseController",
    "src/base/FormMixin",
    "text!./templates/DialogView.html"
], function(declare, common, BaseController, FormMixin, template) {

    return declare([BaseController, FormMixin], {
        dialogtemplateString: template,

        baseClass: "",

        title: "",

        bodyNodeContent: "",

        footerNodeContent: "",

        constructor: function(args) {
            $.extend(this, args);
        },

        createTemplate: function() {
            var dialogDomNode = $.parseHTML(common.renderTemplate(this.dialogtemplateString, {
                baseClass: this.baseClass,
                title: this.title
            }));

            $(dialogDomNode).find(".body-container").append(this.bodyNodeContent);
            $(dialogDomNode).find(".footer-container").append(this.footerNodeContent);
            this.dialogDomNode = $(dialogDomNode).html();
        },

        show: function(args) {
            $.extend(this, args);
            this.createDialog();
        },

        createDialog: function(args) {

            this.createTemplate(args);

            this.dialog = $(this.dialogDomNode).modal({
                "backdrop": "static",
                "keyboard": false,
                "show": true
            });

            this.showDialog();
            this.prepareDialog();
        },

        showDialog: function() {
            if (this.dialog) {
                $(this.dialog).modal("show");
            }
        },

        hideDialog: function() {
            if (this.dialog) {
                $(this.dialog).modal("hide");
            }
        },

        prepareDialog: function() {},

        showDialogError: function(message) {
            var alertContainer = $(this.dialog).find("#error-container"),
                alertMessageContainer = alertContainer.find("#error-message-box");

            if (message) {
                $(alertMessageContainer).html(message.toLowerCase());
                $(alertContainer).removeClass("hide").addClass("show");
            }

        },

        hideDialogError: function() {
            var alertContainer = $(this.dialog).find("#error-container");
            $(alertContainer).removeClass("show").addClass("hide");
        }
    });
});
