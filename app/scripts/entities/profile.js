'use strict';
define(['app', 'apps/config/storage/localstorage'], function(MERORS){
  MERORS.module('Entities', function(Entities, MERORS, Backbone, Marionette, $, _){
    Entities.Profile = Backbone.Model.extend({

      idAttribute: '_id',
      //urlRoot: 'profiles',
      urlRoot: 'http://localhost:9000/api/v1/Users/Profile',

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

    Entities.ProfileCollection = Backbone.Collection.extend({
      url: 'http://localhost:9000/api/v1/Users/Profile',
      model: Entities.Profile,
      comparator: 'email'
    });

    var Profiles;

    var API = {
      getProfileEntities: function(){
        Profiles = new Entities.ProfileCollection();
        var defer = $.Deferred();
        Profiles.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        $.when(promise).done(function(profiles){
          if(profiles.length === 0){
            // if we don't have any profiles yet, create some for convenience
            var models = initializeProfiles();
            profiles.reset(models);
          }
        });
        return promise;
      },

      getProfileEntity: function(profileId){
        var profile = new Entities.Profile({id: profileId});
        var defer = $.Deferred();
        setTimeout(function(){
          profile.fetch({
            success: function(data){
              defer.resolve(data);
            },
            error: function(data){
              defer.resolve(undefined);
            }
          });
        }, 2000);
        return defer.promise();
      },

      getProfileEntityFirst: function () {
        return Profiles.first();
      }

    };

    MERORS.reqres.setHandler('profile:entities', function(){
      return API.getProfileEntities();
    });

    MERORS.reqres.setHandler('profile:entity', function(id){
      return API.getProfileEntity(id);
    });

    MERORS.reqres.setHandler('profile:entity:first', function(){
      return API.getProfileEntityFirst();
    });

    MERORS.reqres.setHandler('profile:entity:new', function(id){
      return new Entities.Profile();
    });
  });

  return ;
});