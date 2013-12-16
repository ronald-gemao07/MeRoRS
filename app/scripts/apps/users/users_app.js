'use strict';
define(['app', 'marionette'], function(MERORS, Marionette) {
    MERORS.module('UsersApp', function(UsersApp, MERORS, Backbone, Marionette, $, _) {
        UsersApp.startWithParent = false;

        UsersApp.onStart = function() {
            console.log('Starting UsersApp...');
        };

        UsersApp.onStop = function() {
            console.log('Stopping UsersApp...');
        };
    });

    MERORS.module('Routers.UsersApp', function(UsersAppRouter, MERORS, Backbone, Marionette, $, _) {
        UsersAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                'users': 'listUsers',
                'users(/filter/criterion::criterion)': 'listUsers',
                'users/:id': 'showUser',
                'users/:id/edit': 'editUser'
            }
        });

        var executeAction = function(action, arg) {
            $(document).attr('title', 'Manage Users - Global Zeal Meeting Room Reservation System');
            MERORS.startSubApp('UsersApp');
            action(arg);
            MERORS.execute('set:active:header', 'users');
        };


        var API = {
            listUsers: function(criterion) {
                require(['apps/users/list/list_controller'], function(ListController) {
                    executeAction(ListController.listUsers, criterion);
                });
            },

            showUser: function(id) {
                require(['apps/users/show/show_controller'], function(ShowController) {
                    executeAction(ShowController.showUser, id);
                });
            },

            editUser: function(id) {
                require(['apps/users/edit/edit_controller'], function(EditController) {
                    executeAction(EditController.editUser, id);
                });
            }
        };

        MERORS.on('users:list', function() {
            MERORS.navigate('users');
            API.listUsers();
        });

        MERORS.on('users:filter', function(criterion) {
            if (criterion) {
                MERORS.navigate('users/filter/criterion:' + criterion);
            } else {
                MERORS.navigate('users');
            }
        });

        MERORS.on('user:show', function(id) {
            MERORS.navigate('users/' + id);
            API.showUser(id);
        });

        MERORS.on('user:edit', function(id) {
            MERORS.navigate('users/' + id + '/edit');
            API.editUser(id);
        });

        MERORS.addInitializer(function() {
            new UsersAppRouter.Router({
                controller: API
            });
        });
    });

    return MERORS.UsersAppRouter;
});