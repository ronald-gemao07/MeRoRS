define(["app"/*, "apps/config/storage/localstorage"*/], function(MERORS){
  MERORS.module("Entities", function(Entities, MERORS, Backbone, Marionette, $, _){
    Entities.User = Backbone.Model.extend({
      idAttribute: "_id",
      urlRoot: "http://localhost:9000/api/v1/Users",
      /*urlRoot: "users",*/

      defaults: {
        _id: null,
        email: "", 
        firstName: "",
        lastName: "",
        position: "",
        group: "",
        status: ""
      },

      validate: function(attrs, options) {
        var errors = {}
        if (! attrs.email) {
          errors.email = "can't be blank";
        }
      }
    });

    /*Entities.configureStorage(Entities.User);*/

    Entities.UserCollection = Backbone.Collection.extend({
      url: "http://localhost:9000/api/v1/Users",
      model: Entities.User,
      comparator: "email"
    });

    /*Entities.configureStorage(Entities.UserCollection);*/

    var initializeUsers = function(){
      var users = new Entities.UserCollection(/*[
        { 
          id: 1, 
          email: "elluis.invento@globalzeal.net", 
          firstName: "Elluis", 
          lastName: "Invento", 
          position: "Software Engineer", 
          group: "Administrator",
          status: "Active"
        }
      ]*/);
      users.forEach(function(user){
        user.save();
      });
      return users.models;
    };

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

    MERORS.reqres.setHandler("user:entities", function(){
      return API.getUserEntities();
    });

    MERORS.reqres.setHandler("user:entity", function(id){
      return API.getUserEntity(id);
    });

    MERORS.reqres.setHandler("user:entity:new", function(id){
      return new Entities.User();
    });
  });

  return ;
});
