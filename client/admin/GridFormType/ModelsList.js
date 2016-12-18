"use strict";

import Promise from "bluebird";

(function(Form) {

  /**
   * ModelsList editor
   *
   * An array editor. Creates a list of models to add to the form.
   *
   * Special options:
   * @param {Backbone.Collection} [options.schema.collection] The collection that will be used to search for the items
   * @param {String} [options.schema.confirmDelete]     Text to display in a delete confirmation dialog. If falsey, will not ask for confirmation.
   */
  Form.editors.ModelsList = Form.editors.Base.extend({

    events: {
      'click [data-action="add"]': function(event) {
        event.preventDefault();
        this.addItem(null, true);
      }
    },

    initialize: function(options) {
      options = options || {};

      var editors = Form.editors;

      editors.Base.prototype.initialize.call(this, options);

      var schema = this.schema;
      if (!schema) throw new Error("Missing required option 'schema'");
      if (!schema.collection) throw new Error("Missing required option 'collection'");

      this.template = options.template || this.constructor.template;

      //Determine the editor to use
      this.Editor = editors.Text;

      this.items = [];
      this.options = options;
    },

    render: function() {
      var self = this,
        value = this.value || (this.value = new this.model.relations[this.schema.title.trim()]()),
        $ = Backbone.$;

      //Create main element
      var $el = $($.trim(this.template()));

      //Store a reference to the list (item container)
      this.$list = $el.is('[data-items]') ? $el : $el.find('[data-items]');

      //Add existing items
      if (value.length) {
        value.forEach(function(itemValue) {
          self.addItem(itemValue);
        });
      }

      this.setElement($el);
      this.$el.attr('id', this.id);
      this.$el.attr('name', this.key);

      if (this.hasFocus) this.trigger('blur', this);

      return this;
    },

    /**
     * Add a new item to the list
     * @param {Mixed} [value]           Value for the new item editor
     * @param {Boolean} [userInitiated] If the item was added by the user clicking 'add'
     */
    addItem: function(value, userInitiated) {
      var self = this,
        editors = Form.editors;
      //Create the item
      var item = new editors.ModelsList.Item({
        list: this,
        form: this.form,
        schema: this.schema,
        value: value,
        Editor: this.Editor,
        key: this.key,
        collection: new this.schema.collection(),
        delay: 500,
        template: this.options.editorTemplate,
        optionTemplate: this.options.optionTemplate
      }).render();

      var _addItem = function() {
        self.items.push(item);
        self.$list.append(item.el);

        item.editor.on('all', function(event) {
          if (event === 'change') return;

          // args = ["key:change", itemEditor, fieldEditor]
          var args = _.toArray(arguments);
          args[0] = 'item:' + event;
          args.splice(1, 0, self);
          // args = ["item:key:change", this=listEditor, itemEditor, fieldEditor]

          editors.ModelsList.prototype.trigger.apply(this, args);
        }, self);

        item.editor.on('change', function() {
          if (!item.addEventTriggered) {
            item.addEventTriggered = true;
            this.trigger('add', this, item.editor);
          }
          this.trigger('item:change', this, item.editor);
          this.trigger('change', this);
        }, self);

        item.editor.on('focus', function() {
          if (this.hasFocus) return;
          this.trigger('focus', this);
        }, self);
        item.editor.on('blur', function() {
          if (!this.hasFocus) return;
          var self = this;
          setTimeout(function() {
            if (_.find(self.items, function(item) { return item.editor.hasFocus; })) return;
            self.trigger('blur', self);
          }, 0);
        }, self);

        if (userInitiated || value) {
          item.addEventTriggered = true;
        }

        if (userInitiated) {
          self.trigger('add', self, item.editor);
          self.trigger('change', self);
        }
      };

      //Check if we need to wait for the item to complete before adding to the list
      if (this.Editor.isAsync) {
        item.editor.on('readyToAdd', _addItem, this);
      }

      //Most editors can be added automatically
      else {
        _addItem();
        item.editor.focus();
      }

      return item;
    },

    /**
     * Remove an item from the list
     * @param {List.Item} item
     */
    removeItem: function(item) {
      //Confirm delete
      var confirmMsg = this.schema.confirmDelete;
      if (confirmMsg && !confirm(confirmMsg)) return;

      var index = _.indexOf(this.items, item);

      this.items[index].remove();
      this.items.splice(index, 1);

      if (item.addEventTriggered) {
        this.trigger('remove', this, item.editor);
        this.trigger('change', this);
      }

      if (!this.items.length && !this.Editor.isAsync) this.addItem();
    },

    getValue: function() {
      this.value.reset([]);
      this.items.forEach((item)=>{
        this.value.add(new this.value.model({
          id : item.getValue(),
          name: item.getLabel()
        }));
      });

      //Filter empty items
      return this.value;
    },

    setValue: function(value) {
      this.value = value;
      this.render();
    },

    focus: function() {
      if (this.hasFocus) return;

      if (this.items[0]) this.items[0].editor.focus();
    },

    blur: function() {
      if (!this.hasFocus) return;

      var focusedItem = _.find(this.items, function(item) { return item.editor.hasFocus; });

      if (focusedItem) focusedItem.editor.blur();
    },

    /**
     * Override default remove function in order to remove item views
     */
    remove: function() {
      _.invoke(this.items, 'remove');

      Form.editors.Base.prototype.remove.call(this);
    },

    /**
     * Run validation
     *
     * @return {Object|Null}
     */
    validate: function() {
      if (!this.validators) return null;

      //Collect errors
      var errors = _.map(this.items, function(item) {
        return item.validate();
      });

      //Check if any item has errors
      var hasErrors = _.compact(errors).length ? true : false;
      if (!hasErrors) return null;

      //If so create a shared error
      var fieldError = {
        type: 'list',
        message: 'Some of the items in the list failed validation',
        errors: errors
      };

      return fieldError;
    }
  }, {

    //STATICS
    template: _.template('\
      <div>\
        <div data-items></div>\
        <button type="button" data-action="add">Add</button>\
      </div>\
    ', null, Form.templateSettings)

  });


  /**
   * A single item in the list
   *
   * @param {editors.List} options.list The List editor instance this item belongs to
   * @param {Function} options.Editor   Editor constructor function
   * @param {String} options.key        Model key
   * @param {Mixed} options.value       Value
   * @param {Object} options.schema     Field schema
   */
  Form.editors.ModelsList.Item = Form.editors.Base.extend({

    events: {
      'click [data-action="remove"]': function(event) {
        event.preventDefault();
        this.list.removeItem(this);
      },
      'keyup input[type=text]': 'searchItem',
      'keydown input[type=text]': 'handleUserKeys'
    },

    initialize: function(options) {
      this.list = options.list;
      this.schema = options.schema || this.list.schema;
      this.value = options.value;
      this.Editor = options.Editor || Form.editors.Text;
      this.key = options.key;
      this.template = options.template || this.schema.itemTemplate || this.constructor.template;
      this.errorClassName = options.errorClassName || this.constructor.errorClassName;
      this.form = options.form;
      this.collection = options.collection;
      this.delay = options.delay;
      this.optionTemplate = options.optionTemplate || null;
      this.optionViews = [];
      this.selectedIndex = null;

      this.searchPromise = this.searchPromise || new Promise((done, fail)=>{
          done();
        });
    },

    render: function() {
      var $ = Backbone.$;

      //Create editor
      this.editor = new this.Editor({
        key: this.key,
        schema: this.schema,
        value: null,
        list: this.list,
        item: this,
        form: this.form,
      }).render();

      //Create main element
      var $el = $($.trim(this.template()));
      this.editor.el.autocomplete = "off";
      $el.find('[data-editor]').append(this.editor.el);

      //Replace the entire element so there isn't a wrapper tag
      this.setElement($el);
      this.resultsList = this.$("ul");

      if(this.value instanceof Backbone.Model){
        this.setValue(this.value.get("id"), this.value.get("name"));
      }

      return this;
    },

    searchItem: function(e){
      var el = $(e.currentTarget),
        value = el.val();
      if(value.length < 3) return;
      if(value === this.lastSearched) return;
      if(e.keyCode === 40 || e.keyCode === 28 || e.keyCode === 13) return;

      this.searchPromise.then(()=>{
        return new Promise((done, fail)=>{
          this.collection.queryParams.q = value;
          setTimeout(()=>{
            if(this.lastSearched !== this.lastFinished && this.collection.queryParams.q !== ""){
              var syncCallback = ()=>{
                this.lastFinished = this.collection.queryParams.q;
                this.displaySearchResults();
                done();
                this.collection.off("error", errorCallback);
              };
              var errorCallback = ()=>{
                fail();
                this.collection.off("sync", syncCallback);
              };
              this.collection.once("sync", syncCallback);
              this.collection.once("error", errorCallback);
              this.collection.fetch({reset: true});
            }
          }, this.delay);
        });
      });
      this.lastSearched = value;
    },

    removeOptions: function(){
      this.optionViews.forEach(function(view){
        view.remove();
      });
    },

    displaySearchResults: function(){
      this.removeOptions();
      this.collection.each((model)=>{
        this.createOption(model);
      });
    },

    createOption(model){
      if(typeof model.toString !== "function"){
        throw new Error("the model should have a toString method.");
        return;
      }
      var optionView = new Form.editors.ModelsList.Option({
        label: model.toString(),
        value: model.get(model.idAttribute),
        template: null || this.optionTemplate,
        context : this
      });
      this.resultsList.append(optionView.render().$el);
      this.optionViews.push(optionView);
    },

    getValue: function() {
      return this.value;
    },

    getLabel: function(){
      return this.label;
    },

    setValue: function(value, label) {
      this.value = value;
      this.label = label;
      this.editor.setValue(label);
      this.removeOptions();
    },

    focus: function() {
      this.editor.focus();
    },

    blur: function() {
      this.editor.blur();
    },

    remove: function() {
      this.editor.remove();

      Backbone.View.prototype.remove.call(this);
    },

    validate: function() {
      var value = this.getValue(),
        formValues = this.list.form ? this.list.form.getValue() : {},
        validators = this.schema.validators,
        getValidator = this.getValidator;

      if (!validators) return null;

      //Run through validators until an error is found
      var error = null;
      _.every(validators, function(validator) {
        error = getValidator(validator)(value, formValues);

        return error ? false : true;
      });

      //Show/hide error
      if (error){
        this.setError(error);
      } else {
        this.clearError();
      }

      //Return error to be aggregated by list
      return error ? error : null;
    },

    /**
     * Show a validation error
     */
    setError: function(err) {
      this.$el.addClass(this.errorClassName);
      this.$el.attr('title', err.message);
    },

    /**
     * Hide validation errors
     */
    clearError: function() {
      this.$el.removeClass(this.errorClassName);
      this.$el.attr('title', null);
    },

    activateDown: function(){
      if(this.optionViews.length < 1) return;
      if(typeof this.selectedIndex !== "undefined" && this.selectedIndex !== null) {
        this.optionViews[this.selectedIndex].deactivate();
        if(this.selectedIndex >= (this.optionViews.length-1)) {
          this.selectedIndex = -1;
        }
      } else {
        this.selectedIndex = -1;
      }
      this.optionViews[++this.selectedIndex].activate();
    },

    activateUp: function(){
      if(this.optionViews.length < 1) return;
      if(typeof this.selectedIndex !== "undefined" && this.selectedIndex !== null){
        this.optionViews[this.selectedIndex].deactivate();
        if(this.selectedIndex <= 0) {
          this.selectedIndex = this.optionViews.length;
        }
      } else {
        this.selectedIndex = this.optionViews.length;
      }
      this.optionViews[--this.selectedIndex].activate();
    },

    selectCurrent: function(){
      this.optionViews[this.selectedIndex].registerAsSelected();
    },

    handleUserKeys: function(e){
      switch(e.keyCode){
        case 40:
          this.activateDown();
          break;
        case 38: // up
          this.activateUp();
          break;
        case 13:
          this.selectCurrent();
          break;
        default:
          return;
      }
    }
  }, {

    //STATICS
    template: _.template('\
      <div class="autocomplete-element">\
        <span data-editor></span>\
        <button type="button" data-action="remove">&times;</button>\
        <ul class="autocomplete-list"></ul>\
      </div>\
    ', null, Form.templateSettings),

    errorClassName: 'error'

  });


  /**
   * Option view for the autocomplete
   */
  Form.editors.ModelsList.Option = Backbone.View.extend({
    events: {
      'click a': 'registerAsSelected',
      "mouseover a": function(e){$(e.target).addClass("selected")},
      "mouseout a": function(e){$(e.target).removeClass("selected")}
    },
    initialize: function(options) {
      options = options || {};

      if(!options.context) throw new Error("No context provided.");

      this.context = options.context;
      this.label = options.label;
      this.value = options.value;
      //Template
      this.template = options.optionTemplate || this.constructor.template;
    },

    /**
     * Render the list item representation
     */
    render: function() {
      this.setElement(this.template({
        "label" : this.label,
        "value" : this.value
      }));

      return this;
    },

    registerAsSelected: function(){
      this.context.setValue(this.value, this.label);
    },

    activate: function(){
      this.$("a").addClass("selected");
    },

    deactivate: function(){
      this.$("a").removeClass("selected");
    }

  }, {
    template: _.template('\
      <li><a href="javascript://" data-value="<%=value%>"><%=label%></a></li>\
    ', null, Form.templateSettings)
  });
})(Backbone.Form);