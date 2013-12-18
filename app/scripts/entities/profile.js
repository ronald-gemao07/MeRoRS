'use strict';
define(['app', 'apps/config/storage/localstorage'], function(MERORS){
  MERORS.module('Entities', function(Entities, MERORS, Backbone, Marionette, $, _){
    Entities.User = Backbone.Model.extend({

      idAttribute: '_id',
      //urlRoot: 'users',
      urlRoot: 'http://localhost:9000/api/v1/Users/profile',

      defaults: {
        _id: null,
        email: '',
        firstName: '',
        lastName: '',
        position: '',
        group: '',
        status: ''
      }
    });

    Entities.UserCollection = Backbone.Collection.extend({
      url: 'http://localhost:9000/api/v1/Users/profile',
      model: Entities.User,
      comparator: 'email'
    });

    var API = {
      getUserEntities: function(){
        var users = new Entities.UserCollection();
        var defer = $.Deferred();
        users.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        $.when(promise).done(function(users){
          if(users.length === 0){
            // if we don't have any users yet, create some for convenience
            var models = initializeUsers();
            users.reset(models);
          }
        });
        return promise;
      },

      getUserEntity: function(userId){
        var user = new Entities.User({id: userId});
        var defer = $.Deferred();
        setTimeout(function(){
          user.fetch({
            success: function(data){
              defer.resolve(data);
            },
            error: function(data){
              defer.resolve(undefined);
            }
          });
        }, 2000);
        return defer.promise();
      }
    };

    MERORS.reqres.setHandler('user:entities', function(){
      return API.getUserEntities();
    });

    MERORS.reqres.setHandler('user:entity', function(id){
      return API.getUserEntity(id);
    });

    MERORS.reqres.setHandler('user:entity:new', function(id){
      return new Entities.User();
    });
  });

  return ;
});