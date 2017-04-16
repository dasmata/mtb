"use strict";
/**
 * The class the is inherited by the views
 * @abstract
 * @param {Object} options The view's options
 * @constructor
 */
function AbstractView(options) {
    var viewOptions = options || {};
    this.setActivity(viewOptions.activity || null);
    Backbone.View.prototype.constructor.apply(this, arguments);
}

_.extend(AbstractView.prototype, Backbone.View.prototype, {
    /**
     * Sets the parent activity
     * @param {Activity} act The parent activity
     * @returns {AbstractView} The current object
     */
    setActivity: function (act) {
        this.activity = act;
        return this;
    },
    /**
     * Returns the parent activity
     * @returns {Activity|null} The parent activity
     */
    getActivity: function () {
        return this.activity;
    },

    /**
     * Detaches the root element of the view
     *
     * @returns {AbstractView} The current object
     */
    detach: function(){
        this.$el.detach();
    }
});

AbstractView.extend = Backbone.View.extend;


module.exports = AbstractView;