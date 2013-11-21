define(["app", "marionette"], function(MERORS, Marionette) {
	MERORS.module("UsersApp", function(UsersApp, MERORS, Backbone, Marionette, $, _){
		UsersApp.startWithParent = false;

		UsersApp.onStart = function() {
			console.log("Starting UsersApp...");
		}

		UsersApp.onStop = function() {
			console.log("Stopping UsersApp...");
		}
	});

	MERORS.module("Routers.UsersApp", function(UsersAppRouter, MERORS, Backbone, Marionette, $, _) {
		UsersAppRouter.Router = Marionette.AppRouter.extend({
			appRoutes: {
				"users" : "listUsers"
			}
		});

		var executeAction = function(action, arg){
			MERORS.startSubApp("UsersApp");
			action(arg);
			MERORS.execute("set:active:header", "users");
		};


		var API = {
			listUsers: function(criterion) {
				require(["apps/users/list/list_controller"], function(ListController){
					executeAction(ListController.listUsers, criterion);
				});
			}
		}

		MERORS.on("users:list", function(){
			MERORS.navigate("users");
			API.listUsers();
		});

		MERORS.addInitializer(function(){
			new UsersAppRouter.Router({
				controller: API
			});
		});
	});

});