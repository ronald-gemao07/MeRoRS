'use strict';

define(['app',
        'tpl!apps/rooms/show/templates/missing.tpl',
        'tpl!apps/rooms/show/templates/view.tpl'
    ],
    function(MERORS, missingTpl, viewTpl) {
        MERORS.module('RoomsApp.Show.View', function(View, MERORS, Backbone, Marionette, $, _) {
            View.MissingRoom = Marionette.ItemView.extend({
                template: missingTpl
            });

            View.Room = Marionette.ItemView.extend({
                template: viewTpl,

                events: {
                    'click a.js-edit': 'editClicked'
                },

                editClicked: function(e) {
                    e.preventDefault();
                    this.trigger('room:edit', this.model);
                }
            });
        });

        return MERORS.RoomsApp.Show.View;
    });