define(["app",
        "tpl!apps/reservations/show/templates/missing.tpl",
        "tpl!apps/reservations/show/templates/view.tpl"],
       function(MERORS, missingTpl, viewTpl){
  MERORS.module("ReservationsApp.Show.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.MissingReservation = Marionette.ItemView.extend({
      template: missingTpl
    });

    View.Reservation = Marionette.ItemView.extend({
      template: viewTpl,

      events: {
        "click a.js-edit": "editClicked"
      },

      editClicked: function(e){
        e.preventDefault();
        this.trigger("reservation:edit", this.model);
      }
    });
  });

  return MERORS.ReservationsApp.Show.View;
});
