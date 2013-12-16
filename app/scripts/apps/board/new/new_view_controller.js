'use strict';

define(['app', 'apps/board/new/new_view', 'fullcalendar'], function(MERORS, View) {
    MERORS.module('BoardApp.NewView', function(NewView, MERORS) {
        NewView.Controller = {
            showAddView: function(calObj) {
                var view = new View.AddView(calObj);
                MERORS.dialogRegion.show(view);
                require(['entities/reservation'], function(){
                    var newReservation = MERORS.request('reservation:entity:new');
                    view.on('form:submit', function(data){
                        if(newReservation.save(data)){
                            view.trigger('dialog:close');
                        }
                    });
                });
            }
        };
    });

    return MERORS.BoardApp.NewView.Controller;
});