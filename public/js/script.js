// load the app once the dom is ready

$(function(){


  // My blog App
  // top level piece of UI

  window.AppView = Backbone.View.extend({

  el: $("#andrew-blog"),

  initialize: function() {
    Posts.on('all',   this.render, this);
    Posts.fetch();
  }

  });

  // blogposts collection

  var BlogPosts = Backbone.Collection.extend({

  model: Post,
  url: 'api/posts'

  });

  // create the app

  window.App = new AppView;

}); // app end