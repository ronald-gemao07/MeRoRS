define(["app",
        "tpl!apps/reservations/list/templates/layout.tpl",
        "tpl!apps/reservations/list/templates/panel.tpl",
        "tpl!apps/reservations/list/templates/none.tpl",
        "tpl!apps/reservations/list/templates/list.tpl",
        "tpl!apps/reservations/list/templates/list_item.tpl"],
       function(MERORS, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  MERORS.module("ReservationsApp.List.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Layout = Marionette.Layout.extend({
      template: layoutTpl,

      regions: {
        panelRegion: "#panel-region",
        reservationsRegion: "#reservations-region"
      }
    });

    View.Panel = Marionette.ItemView.extend({
      template: panelTpl,

      triggers: {
        "click button.js-new": "reservation:new"
      },

      events: {
        "submit #filter-form": "filterReservations"
      },

      ui: {
        criterion: "input.js-filter-criterion"
      },

      filterReservations: function(e){
        e.preventDefault();
        var criterion = this.$(".js-filter-criterion").val();
        this.trigger("reservations:filter", criterion);
      },

      onSetFilterCriterion: function(criterion){
        this.ui.criterion.val(criterion);
      }
    });

    View.Reservation = Marionette.ItemView.extend({
      tagName: "tr",
      template: listItemTpl,

      events: {
        "click": "highlightName",
        "click td a.js-show": "showClicked",
        "click td a.js-edit": "editClicked",
        "click button.js-delete": "deleteClicked"
      },

      flash: function(cssClass){
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function(){
          setTimeout(function(){
            $view.toggleClass(cssClass)
          }, 500);
        });
      },

      highlightName: function(e){
        this.$el.toggleClass("warning");
      },

      showClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger("reservation:show", this.model);
      },

      editClicked: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.trigger("reservation:edit", this.model);
      },

      deleteClicked: function(e){
        e.stopPropagation();
        this.trigger("reservation:delete", this.model);
      },

      remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
          Marionette.ItemView.prototype.remove.call(self);
        });
      }
    });

    var NoReservationsView = Marionette.ItemView.extend({
      template: noneTpl,
      tagName: "tr",
      className: "alert"
    });

    View.Reservations = Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      emptyView: NoReservationsView,
      itemView: View.Reservation,
      itemViewContainer: "tbody",

      initialize: function(){
        this.listenTo(this.collection, "reset", function(){
          this.appendHtml = function(collectionView, itemView, index){
            collectionView.$el.append(itemView.el);
          }
        });
      },

      onCompositeCollectionRendered: function(){
        this.appendHtml = function(collectionView, itemView, index){
          collectionView.$el.prepend(itemView.el);
        }
      }
    });
  });

  return MERORS.ReservationsApp.List.View;
});
