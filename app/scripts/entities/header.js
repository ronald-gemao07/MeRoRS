'use strict';

define(['app', 'backbone.picky'], function(MERORS) {
    MERORS.module('Entities', function(Entities, MERORS, Backbone, Marionette, $, _) {
        Entities.Header = Backbone.Model.extend({
            initialize: function() {
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });

        Entities.HeaderCollection = Backbone.Collection.extend({
            model: Entities.Header,

            initialize: function() {
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
            }
        });

        var initializeHeaders = function() {
            Entities.headers = new Entities.HeaderCollection([{
                name: 'My Reservations',
                url: 'reservations',
                navigationTrigger: 'reservations:list'
            }, {
                name: 'Reservation Board',
                url: 'board',
                navigationTrigger: 'board:show'
            }, {
                name: 'About',
                url: 'about',
                navigationTrigger: 'about:show'
            }]);
        };

        var initializeAdminHeaders = function() {
            Entities.headers = new Entities.HeaderCollection([{
                name: 'My Reservations',
                url: 'reservations',
                navigationTrigger: 'reservations:list'
            }, {
                name: 'Reservation Board',
                url: 'board',
                navigationTrigger: 'board:show'
            }, {
                name: 'Manage Rooms',
                url: 'rooms',
                navigationTrigger: 'rooms:list'
            }, {
                name: 'Manage Users',
                url: 'users',
                navigationTrigger: 'users:list'
            }, {
                name: 'About',
                url: 'about',
                navigationTrigger: 'about:show'
            }]);
        };

        var API = {
            getHeaders: function() {
                var profile = MERORS.request('profile:entity:first');
                var group = profile.get('group');

                if (Entities.headers === undefined && group === 'Administrator') {
                  initializeAdminHeaders();
                } else{
                  initializeHeaders();
                }
                return Entities.headers;
            }
        };

        MERORS.reqres.setHandler('header:entities', function() {
            return API.getHeaders();
        });
    });

    return;
});