define(["app", "apps/users/list/list_view"], function(MERORS, View){
	MERORS.module("UsersApp.List", function(List, MERORS, Backbone, Marionette, $, _){
		List.Controller = {
			listUsers: function(criterion){
				var usersListLayout = new View.Layout();
				var contactsListPanel = new View.Panel();
				usersListLayout.panelRegion.show(contactsListPanel);
				MERORS.mainRegion.show(usersListLayout);
			}
		};
	});

	return MERORS.UsersApp.List.Controller;
});