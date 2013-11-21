define(["app",
		"tpl!apps/users/list/templates/layout.tpl",
		"tpl!apps/users/list/templates/panel.tpl",
		"tpl!apps/users/list/templates/none.tpl",
		"tpl!apps/users/list/templates/list.tpl",
		"tpl!apps/users/list/templates/list_item.tpl"], function(MERORS, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl) {

	MERORS.module("UsersApp.List.View", function(View, MERORS, Backbone, Marionette, $, _){
		View.Layout = Marionette.Layout.extend({
			template: layoutTpl,
			regions: {
				panelRegion: '#panel-region',
				contactsRegion: "users-region"
			}
		});

		View.Panel = Marionette.ItemView.extend({
			template: panelTpl,
		});

		View.User = Marionette.ItemView.extend({
			tagName: "tr",
			template: listItemTpl
		});

		var NoUsersView = Marionette.ItemView.extend({
			template: noneTpl,
			tagName: "tr",
			className: "alert"
		});

		View.Users = Marionette.CompositeView.extend({
			tagName: "table",
			className: "table table-hover",
			template: listTpl,
			emptyView: NoUsersView,
			ItemView: View.User,
			itemViewContainer: "tbody",
			initialize: function(){
				//this.listenTo(this.collection, "reset", function(){
					this.appendHtml = function(collectionView, itemView, index){
						collectionView.$el.append(itemView.el);
					}
				//});
			},
			onCompositeCollectionRendered: function(){
				this.appendHtml = function(collectionView, itemView, index){
					collectionView.$el.prepend(itemView.el);
				}
			}
		});
	});	

	return MERORS.UsersApp.List.View;		
});