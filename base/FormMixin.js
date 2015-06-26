define([
    "src/base/declare"
], function(declare) {
    return declare(null, {

        SELECTABLE_FIELDS: ["input", "textarea", "select"],

        ERROR_CLASS: "inErrorState",

        PIN_CODE_REG: /^\d{6}$/,

        EMAIL_ADDRESS_REG: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,

        PHONE_NO_10_REG: /^\d{10}$/,

        PHONE_NO_11_REG: /^\d{11}$/,

        INPUT_TYPE_MAP: {
            "email": "emailAddressValidator",
            "phoneno": "phoneNoValidation",
            "pincode": "pinCodeValidation",
            "select": "selectValidation"
        },

        _getAllSelectableField: function(formNode) {
            var selectableFields = this.SELECTABLE_FIELDS.join(",");
            return $(formNode).find(selectableFields);
        },

        reset: function(formSelector) {
            var inputFieldsNode = this._getAllSelectableField(formSelector);
            $(inputFieldsNode).each(function(index, input) {
                /*jshint unused:true*/
                $(input).val("");
                $(input).removeClass(this.ERROR_CLASS);

            }.bind(this));
        },

        validate: function(formSelector, validateAllFields) {
            var inputFieldsNode = this._getAllSelectableField(formSelector),
                isValid = true;

            $(inputFieldsNode).each(function(index, input) {
                /*jshint unused:true*/
                var requiredValue,
                    inputValue,
                    validator,
                    type,
                    isPatternValid,
                    isRequiredValid,
                    isTypeValid,
                    isAdditionalValidation,
                    isCurrentValid;

                requiredValue = $(input).attr("required");
                validator = $(input).data("validator");
                type = $(input).data("type") || $(input).attr("type");
                inputValue = $(input).val();

                //Required Validator
                isRequiredValid = this._requireValidation(inputValue, requiredValue);

                //Pattern Validator
                isPatternValid = this._patternValidation(inputValue, validator);

                //Type Validator
                isTypeValid = this._typeValidation(inputValue, type, input);

                //This has to be implemeneted by The Validation Service
                isAdditionalValidation = this._additionalValidation(input);

                isCurrentValid = isRequiredValid && isPatternValid && isTypeValid && isAdditionalValidation;
                this._changeState(input, isCurrentValid);
                isValid = isValid && isCurrentValid;

                if (!validateAllFields) {
                    return isValid;
                }

            }.bind(this));

            return isValid;
        },

        _requireValidation: function(inputValue, required) {
            var isRequiredValid = true;
            if (required === "required") {
                if (!inputValue) {
                    isRequiredValid = false;
                }
            }
            return isRequiredValid;
        },

        _patternValidation: function(inputValue, pattern) {
            var isPatternValid = true;
            if (pattern) {
                isPatternValid = new RegExp(pattern).test(inputValue);
            }
            return isPatternValid;
        },

        _typeValidation: function(inputValue, type, input) {
            var isTypeValid = true,
                typeCallback;

            if (type) {
                typeCallback = this.INPUT_TYPE_MAP[type];

                if (typeCallback) {
                    isTypeValid = this[typeCallback].call(this, inputValue, input);
                }
            }

            return isTypeValid;
        },

        _additionalValidation: function(inputNode) {
            var isValid = this.additionalValidator ? this.additionalValidator(inputNode) : true;
            return isValid;
        },

        _changeState: function(node, state) {
            var inState = state ? $(node).removeClass(this.ERROR_CLASS) : $(node).addClass(this.ERROR_CLASS);
            return inState;
        },

        pinCodeValidation: function(pinCode) {
            return this._regexValidator(pinCode, this.PIN_CODE_REG);
        },

        emailAddressValidator: function(emailId) {
            return this._regexValidator(emailId, this.EMAIL_ADDRESS_REG);
        },

        phoneNoValidation: function(phoneNo) {
            var regex = (phoneNo.trim() !== "" && phoneNo.charAt(0) === "0" && phoneNo.length === 11) ? this.PHONE_NO_11_REG : this.PHONE_NO_10_REG;
            return this._regexValidator(phoneNo, regex);

        },

        selectValidation: function() {
            /*jshint unused:true*/
            return true;
        },

        _regexValidator: function(input, regex) {
            var isValid = true;
            if (regex.test(input) === false || input.trim() === "") {
                isValid = isValid && false;
            }
            return isValid;
        }

    });
});
