'use strict';
define(['app',
        'tpl!apps/users/list/templates/layout.tpl',
        'tpl!apps/users/list/templates/panel.tpl',
        'tpl!apps/users/list/templates/none.tpl',
        'tpl!apps/users/list/templates/list.tpl',
        'tpl!apps/users/list/templates/list_item.tpl'],
       function(MERORS, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  MERORS.module('UsersApp.List.View', function(View, MERORS, Backbone, Marionette, $, _){
    View.Layout = Marionette.Layout.extend({
      template: layoutTpl,

      regions: {
        panelRegion: '#panel-region',
        usersRegion: '#users-region'
      }
    });

    View.Panel = Marionette.ItemView.extend({
      template: panelTpl,

      triggers: {
        'click button.js-new': 'user:new'
      },

      events: {
        'submit #filter-form': 'filterUsers'
      },

      ui: {
        criterion: 'input.js-filter-criterion'
      },

      filterUsers: function(e){
        e.preventDefault();
        var criterion = this.$('.js-filter-criterion').val();
        this.trigger('users:filter', criterion);
      },

      onSetFilterCriterion: function(criterion){
        this.ui.criterion.val(criterion);
      }
    });

    View.User = Marionette.ItemView.extend({
      tagName: 'tr',
      template: listItemTpl,

      events: {
        'click': 'highlightName',
        'click td a.js-show': 'showClicked',
        'click td a.js-edit': 'editClicked',
        'click button.js-delete': 'deleteClicked'
      },

      flash: function(cssClass){
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function(){
          setTimeout(function(){
            $view.toggleClass(cssClass);
          }, 500);
        });
      },

      highlightName: function(e){
        this.$el.toggleClass('warning');
      },

      showClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger('user:show', this.model);
      },

      editClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger('user:edit', this.model);
      },

      deleteClicked: function(e){
        e.stopPropagation();
        this.trigger('user:delete', this.model);
      },

      remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
          Marionette.ItemView.prototype.remove.call(self);
        });
      }
    });

    var NoUsersView = Marionette.ItemView.extend({
      template: noneTpl,
      tagName: 'tr',
      className: 'alert'
    });

    View.Users = Marionette.CompositeView.extend({
      tagName: 'table',
      className: 'table table-hover',
      template: listTpl,
      emptyView: NoUsersView,
      itemView: View.User,
      itemViewContainer: 'tbody',

      initialize: function(){
        this.listenTo(this.collection, 'reset', function(){
          this.appendHtml = function(collectionView, itemView, index){
            collectionView.$el.append(itemView.el);
          };
        });
      },

      onCompositeCollectionRendered: function(){
        this.appendHtml = function(collectionView, itemView, index){
          collectionView.$el.prepend(itemView.el);
        };
      }
    });
  });

  return MERORS.UsersApp.List.View;
});