/***************************************************************************
 * Module loader
 * 
 * @ngInject
 **************************************************************************/
function loadModule($window, $app) {
	// $mb.import('$user', new UserManager());

	/**
	 * User mangement system
	 */
	class UserManager{

		constructor(){
			this.state = 'ready';
		}

		login(credential){
			return $app.login(credential);
		}

		logout(){
			return $app.logout();
		}

		submit(){
			// TODO: 
		}
	};

	/*
	 * Contribute the service
	 */
	$window.$wbUser = new UserManager();
	// $mb.exportAs('$user', new UserManager());
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









