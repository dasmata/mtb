"use strict";
var FormComponent = require("backbone-forms");
var formTemplate = require("../templates/grid-form.jade");

module.exports = Backbone.View.extend({
    events: {
        "click .btn-primary": "submit",
        "click .btn-default": "dismiss"
    },

    /**
     * Class constructor
     *
     * @param {Activity} [activity] The current activity
     * @param {string} [entity] The name of the entity
     *
     * @constructor
     */
    initialize(activity, entity) {
        this.setActivity(activity);
        this.setElement($(formTemplate({
            entity: entity
        })));
    },

    /**
     * Sets the current activity
     *
     * @param {Activity} activity The current activity
     * @returns {GridFormV} The current object
     */
    setActivity(activity) {
        this.activity = activity;
        return this;
    },

    /**
     * Renders the form
     *
     * @returns {GridFormView} The current object
     */
    render() {
        this.success = false;
        this.form = this.form || new FormComponent({
            model: this.model
        }).render();
        this.form.activity = this.activity;
        this.form.trigger("activity:set");
        this.$(".entity-form-body").append(this.form.el);
        this.$el.filter(".modal").modal({keyboard: false, backdrop: "static"});
        $("body").append(this.$el);
        this.$el.show();
        return this;
    },
    /**
     * Submits the form
     *
     * @returns {undefined}
     */
    submit() {
        this.success = false;
        if (this.form.validate() === null) {
            this.form.commit();
            this.activity.saveEntity(this.model, this.form.getValue())
                .then(_.bind(function (errors) {
                    if (typeof errors === "object" && errors instanceof Array && errors.length > 0) {
                        errors.forEach((err)=> {
                            this.form.fields[err.element].setError(err.message);
                        });
                        return;
                    }
                    this.success = true;
                    this.dismiss();
                }, this));
        }
    },

    /**
     * Hides the form
     *
     * @returns {undefined}
     */
    dismiss() {
        if (this.form) {
            this.form.remove();
            this.stopListening(this.form);
            this.form = null;
            this.trigger('hidden.form', this.success);
            this.$el.modal("hide");
            this.detach();
        }
    },

    /**
     * Detaches the view from the DOM
     *
     * @returns {undefined}
     */
    detach() {
        this.$el.modal("hide");
        this.$el.detach();
    },

    /**
     * Sets the work model
     *
     * @param {Backbone.Model} model The new work model
     * @returns {undefined}
     */
    setModel(model) {
        this.model = model;
    }

});
