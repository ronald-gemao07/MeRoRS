'use strict';

define(['app',
        'tpl!apps/rooms/list/templates/layout.tpl',
        'tpl!apps/rooms/list/templates/panel.tpl',
        'tpl!apps/rooms/list/templates/none.tpl',
        'tpl!apps/rooms/list/templates/list.tpl',
        'tpl!apps/rooms/list/templates/list_item.tpl'
    ],
    function(MERORS, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl) {
        MERORS.module('RoomsApp.List.View', function(View, MERORS, Backbone, Marionette, $, _) {
            View.Layout = Marionette.Layout.extend({
                template: layoutTpl,

                regions: {
                    panelRegion: '#panel-region',
                    roomsRegion: '#rooms-region'
                }
            });

            View.Panel = Marionette.ItemView.extend({
                template: panelTpl,

                triggers: {
                    'click button.js-new': 'room:new'
                },

                events: {
                    'submit #filter-form': 'filterRooms'
                },

                ui: {
                    criterion: 'input.js-filter-criterion'
                },

                filterRooms: function(e) {
                    e.preventDefault();
                    var criterion = this.$('.js-filter-criterion').val();
                    this.trigger('rooms:filter', criterion);
                },

                onSetFilterCriterion: function(criterion) {
                    this.ui.criterion.val(criterion);
                }
            });

            View.Room = Marionette.ItemView.extend({
                tagName: 'tr',
                template: listItemTpl,

                events: {
                    'click': 'highlightName',
                    'click td a.js-show': 'showClicked',
                    'click td a.js-edit': 'editClicked',
                    'click button.js-delete': 'deleteClicked'
                },

                flash: function(cssClass) {
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(800, function() {
                        setTimeout(function() {
                            $view.toggleClass(cssClass)
                        }, 500);
                    });
                },

                highlightName: function(e) {
                    this.$el.toggleClass('warning');
                },

                showClicked: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger('room:show', this.model);
                },

                editClicked: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger('room:edit', this.model);
                },

                deleteClicked: function(e) {
                    e.stopPropagation();
                    this.trigger('room:delete', this.model);
                },

                remove: function() {
                    var self = this;
                    this.$el.fadeOut(function() {
                        Marionette.ItemView.prototype.remove.call(self);
                    });
                }
            });

            var NoRoomsView = Marionette.ItemView.extend({
                template: noneTpl,
                tagName: 'tr',
                className: 'alert'
            });

            View.Rooms = Marionette.CompositeView.extend({
                tagName: 'table',
                className: 'table table-hover',
                template: listTpl,
                emptyView: NoRoomsView,
                itemView: View.Room,
                itemViewContainer: 'tbody',

                initialize: function() {
                    this.listenTo(this.collection, 'reset', function() {
                        this.appendHtml = function(collectionView, itemView, index) {
                            collectionView.$el.append(itemView.el);
                        };
                    });
                },

                onCompositeCollectionRendered: function() {
                    this.appendHtml = function(collectionView, itemView, index) {
                        collectionView.$el.prepend(itemView.el);
                    };
                }
            });
        });

        return MERORS.RoomsApp.List.View;
    });