//import MbModule from './module.js';

/***************************************************************************
 * Name: collection-builder
 * Version: 0.1.0
 * Author: 
 * 	- Mohammad Hadi Mansouri (mohammad.hadi.mansouri@gmail.com)
 * 
 * 
 * Adds a list of items base on a template to a widget. 
 * 
 **************************************************************************/
/*
 * Creates and load modules
 * @ngInject
 */
function loadModule($window, $q) {

	/**
	 * Collection builder service
	 * 
	 * @name $collectionBuilder
	 */
	class CollectionBuilder {

		/**
		 * Creates new instance of the object
		 */
		constructor() {
			this.template = '';
			this.items = [];
			this.widget = null;
		}

		/**
		 * Sets items to be added to the widget
		 */
		setItems(items) {
			this.items = items;
			return this;
		}
		
		/**
		 * Sets the parent widget which items will be added to it as its children.
		 */
		setWidget(parent) {
		    this.widget = parent;
		    return this;
		}
		
		/**
		 * Sets template of items
		 */
		setTemplate(template) {
		    this.template = template;
		    return this;
		}

		/**
		 * Adds an new item to the widget. It will use previousely determined template to add new item. 
		 * @param {Object} item to add into the basket
		 */
		addItem(item) {
			// add an item
		    var el = angular.copy(this.template);
		    el['id'] = item.id;
            el = JSON.stringify(el);
            el = Mustache.render(el, item);
            el = JSON.parse(el);
            var promis = this.widget.addChild(0, el);
            return promis;
		}

		/**
		 * Builds elements by using given item data and template and 
		 * adds them to the given widget.
		 * 
		 * It returns a promise which is success if all items are added successfuly.
		 * 
		 * @memberof $collectionBuilder
		 */
		build() {
		    var promises = [];
		    this.items.forEach((item) => {
		        var promis = this.addItem(item);
		        promises.push(promis);
		    });
		    return $q.all(promises);
		}
		
	}

	$window.CollectionBuilder = CollectionBuilder;
}

/***************************************************************************
 * Integeration code
 * 
 * To get access to the injector of a currently running
 * AngularJS app from outside AngularJS, You can
 * using the extra injector() added to JQuery/jqLite elements.
 **************************************************************************/
angular
	.element(document)
	.injector()
	.invoke(loadModule);
