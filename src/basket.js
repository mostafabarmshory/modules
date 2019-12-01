/***************************************************************************
 * Name: basket
 * Version: 0.1.0
 * Author: 
 * 	- Mostafa Barmshory (mostafa.barmshory@gmail.com)
 * 
 * 
 * Load and create basic modules in our system 
 * 
 * @ngInject
 **************************************************************************/

const DISPATCHER_BASKET_PATH = '/app/modules/basket';
const DISPATCHER_BASKET_ITEMS_PATH = '/app/modules/basket/items';

const STATE_DIRTY = 'dirty';
const STATE_LOADING = 'loading';
const STATE_READY = 'ready';

const STORAGE_KEY = '/app/modules/basket';


function loadModule($window, $dispatcher, $storage, $app, $http, $q) {

	/**
	 * Basket service
	 * 
	 * @name $basket
	 */
	class Bascket {
		
		constructor(){
			this.autoSave = true;
			this.load();
		}

		setProperty (key, value){
			this.data[key] = value;
			this.setState(STATE_DIRTY);
		}

		setTitle (title){
			this.setProperty('title', title);
		}

		setPhone (phone){
			this.setProperty('phone', phone);
		}

		setFullName (fullName){
			this.setProperty('full_name', fullName);
		}

		setEmail (email){
			this.setProperty('email', email);
		}

		setAddress (address){
			this.setProperty('address', address);
		}

		/**
		 * Adds and item into the basket
		 * 
		 * Following attribute is required for items
		 * 
		 * - id
		 * - type
		 * - count
		 * 
		 * @memberof $basket
		 * @param {Object} newItem to add into the basket
		 */
		addItem (newItem) {
			var basketItem = this.getItem(newItem.item_type, newItem.item_id);
			if(basketItem){
				basketItem.count += newItem.count || 1;
				$dispatcher.dispatch(DISPATCHER_BASKET_ITEMS_PATH, {
					type: 'update',
					values: [basketItem]
				});
			} else {
				basketItem = newItem;
				this.data.items.push(newItem);
				$dispatcher.dispatch(DISPATCHER_BASKET_ITEMS_PATH, {
					type: 'create',
					values: [basketItem]
				});
			}
			this.setState(STATE_DIRTY);
		}

		/**
		 * Removes specified item from the basket
		 * 
		 * @memberof $basket
		 * @param {string} itemType of the item
		 * @param {int} itemId of the item
		 */
		removeItem (itemType, itemId) {
			var basketItem = this.getItem(itemType, itemId);
			if(!basketItem){
				return;
			}
			var index = this.data.items.indexOf(basketItem);
			this.items.splice(index, 1);
			$dispatcher.dispatch(DISPATCHER_BASKET_ITEMS_PATH, {
				type: 'delete',
				values: [basketItem]
			});
			this.setState(STATE_DIRTY);
		}

		/**
		 * Gets item from the basket
		 * 
		 * @memberof $basket
		 * @param {string} itemType of an item
		 * @param {int} itemId of an item
		 * @return the related item or undefined
		 */
		getItem (itemType, itemId) {
			return _.find(this.data.items, function(item){
				return item.item_id == itemId && item.item_type == itemType;
			});
		};

		/**
		 * Gets items from the basket
		 * 
		 * @memberof $basket
		 * @return all items of the basket
		 */
		getItems () {
			return _.clone(this.data.items);
		};

		/**
		 * Sets a meta value
		 * 
		 * @memberof $basket
		 * @params {string} key of the meta
		 * @params {string} value of the meta
		 */
		setMeta (key, value) {
			this.data.metas[key] = value;
			// TODO: maos, 2019: fire meta are changed
			this.setState(STATE_DIRTY);
		}

		/**
		 * Gets meta value fro the key
		 * 
		 * @memberof $basket
		 * @params {string} key of the meta
		 * @return value of the meta
		 */
		getMeta (key) {
			return this.data.metas[key];
		}


		/**
		 * Gets count of items in the basket
		 * 
		 * Items count is the total count of items (item count is not considerd)
		 * 
		 * NOTE: count is and virtual value and will be calculated runtime.
		 * 
		 * @memberof $basket
		 * @return the number of items from the basket
		 */
		getCount () {
			var count = 0;
			_.forEach(this.data.items, function(item){
				count += item.count;
			});
			return count;
		}

		/**
		 * Removes all items from the basket
		 * 
		 * @memberof $basket
		 */
		clear () {
			var oldValue = this.data;
			this.data = {
					metas: {},
					items: []
			};
			$dispatcher.dispatch(DISPATCHER_BASKET_ITEMS_PATH, {
				type: 'delete',
				values: oldValue.items
			});
			this.setState(STATE_DIRTY);
		}

		/**
		 * Saves the basket into the local storage
		 * 
		 * @memberof $basket
		 */
		save () {
			this.setState(STATE_LOADING);
			$storage.put(STORAGE_KEY, this.data);
			this.setState(STATE_READY);
		};

		/**
		 * Loads the basket data from local storage
		 * 
		 * @memberof $basket
		 */
		load () {
			this.setState(STATE_LOADING);
			var data = $storage.get(STORAGE_KEY) ||  {
				title: '',
				full_name: '',
				phone: '',
				address: '',
				email: '',
				description: '',
				customer_id:  0,
				meta:{},
				items: []
			};
			this.data = data;

			// Load user info
			var account = $app.getProperty('account');
			if(!account.anonymous){
				data.full_name = account.profile.first_name + account.profile.lastName;
				data.email = account.profile.email;
				// TODO: maso, 2019: load other information from current account
			}

			this.setState(STATE_READY);
		};

		/**
		 * Gets current state of the service
		 * 
		 * @see $basket#setState(state)
		 * @memberof $basket
		 * @return state of the service
		 */
		getState () {
			return this.state;
		};

		/**
		 * Sets the state of the service
		 * 
		 * NOTE: this is an internal method and should not be invoked from outside of the service.
		 * 
		 * @memberof $basket
		 * @param {string} state of the service
		 */
		setState (state) {
			this.state = state;
			$dispatcher.dispatch(DISPATCHER_BASKET_PATH,{
				type: 'update',
				keys: ['state'],
				values: [state]
			});
			// save if the state is derty
			if(this.isAutoSave() && state == STATE_DIRTY) {
				this.save();
			}
		}

		/**
		 * Sets auto save 
		 * 
		 * If the service is in auto save mode, then all changes will be saved
		 * in the local storage automatically.
		 * 
		 * @memberof $basket
		 * @param {boolean} autoSave to enable the auto save
		 */
		setAutoSave (autoSave) {
			this.autoSave = autoSave;
		};

		/**
		 * Checks if the service is in autosave mode 
		 * 
		 * @memberof $basket
		 * @return true if the module is in autosave mode
		 */
		isAutoSave() {
			return this.autoSave;
		};

		/**
		 * Creates and return the order
		 * 
		 * @memberof $basket
		 */
		createOrder() {
			var order;
			var ctrl = this;
			function putItems(){
				var jobs = [];
				_.forEach(ctrl.data.items, function(item){
					var job = $http({
						method : 'POST',
						url: '/api/v2/shop/orders/' + order.secureId + '/items',
						params: item,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});
					jobs.push(job);
				})
				return $q.all(jobs);
			}
			function putMetas(){
				var jobs = [];
				_.forEach(ctrl.data.metas, function(value, key){
					var job = $http({
						method : 'POST',
						url: '/api/v2/shop/orders/' + order.secureId + '/metas',
						params: {
							key: key,
							value: value
						},
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});
					jobs.push(job);
				})
				return $q.all(jobs);
			}

			if(!this.data.description){
				this.data.description = 'برند: ' + this.getMeta('brand') + '-' + 
				'مدل: ' + this.getMeta('model');
			}
			return $http({
				method : 'POST',
				url: '/api/v2/shop/orders',
				params: this.data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(function (response) {
				order = response.data;
				return $q.all([putItems(), putMetas()]);
			}, function(error){
				// TODO: maso, 2019: handle the error
				error = {
						message: 'fail to add order items/meta',
						error: error
				};
				log.error(error);
				throw error;
			})
			.then(function(){
				return order;
			}, function(error){
				throw error;
			});
		}
	}

	// Load global service
	$window.$basket = new Bascket();
	$dispatcher.dispatch('/app/modules', {
		type:'create',
		values: ['$basket'],
	});
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









