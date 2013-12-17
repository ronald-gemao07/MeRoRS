'use strict';
require.config({

    baseUrl: '/scripts',

    shim: {
        backbone: {
            deps: [
                'underscore',
                'jquery',
            ],
            exports: 'Backbone'
        },
        marionette: {
          deps: ['backbone'],
          exports: 'Marionette'
        },
        'jquery-ui': ['jquery'],
        'backbone.picky': ['backbone'],
        'backbone.syphon': ['backbone'],
        'spin.jquery': ['spin', 'jquery'],
        'jquery-timepicker' : ['jquery'],
        'fullcalendar' : ['jquery-ui','jquery'],
        localstorage: ['backbone']
    },

    paths: {
        jquery: '../bower_components/jquery/jquery',
        'jquery-ui': '../bower_components/jquery-ui/ui/jquery-ui',
        'jquery-timepicker' : 'jquery.timepicker',
        'fullcalendar' : 'fullcalendar',
        backbone: '../bower_components/backbone-amd/backbone',
        'backbone.picky': 'vendor/backbone.picky',
        'backbone.syphon': 'vendor/backbone.syphon',
 
        spin: 'vendor/spin',
        'spin.jquery': 'vendor/spin.jquery',

        marionette: '../bower_components/backbone.marionette/lib/backbone.marionette',
        underscore: '../bower_components/underscore-amd/underscore',

        /* alias all marionette libs */
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/amd/backbone.babysitter',

        

        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: '../bower_components/requirejs-text/text',
        tpl: 'vendor/tpl',

        json2: 'vendor/json2',
        localstorage: 'vendor/backbone.localstorage'
    }
});

require(['app', 'apps/header/header_app'], function(MERORS){
  MERORS.start();
});