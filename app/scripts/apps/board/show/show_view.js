define(["marionette", "tpl!apps/board/show/templates/message.tpl"], function(Marionette, messageTpl){
  return {
    Message: Marionette.ItemView.extend({
      template: messageTpl
    })
  };
});
