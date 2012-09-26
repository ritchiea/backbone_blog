// load the app once the dom is ready

$(function(){

  // posts model
  // posts should have text, a title, an author, a boolean published status,
  // and 

  window.Post = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function() {
      return {
        author: "Andrew Ritchie",
        published:  false,
        order: Posts.nextOrder()
      };
    },

    // Toggle the 'published' state of this todo item.
    toggle: function() {
      this.set({published: !this.get("published")});
    }


  });

    // blogposts collection

  var PostList = Backbone.Collection.extend({

  model: Post,
  url: 'api/posts',

  // keep unpublished posts in sequential order
  
  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
    }

  });

  var Posts = new PostList;

  // My blog App
  // top level piece of UI

  window.AppView = Backbone.View.extend({

  el: $("#andrew-blog"),

  initialize: function() {
    Posts.on('all',   this.render, this);
    Posts.fetch();
  }

  });


  // create the app

  window.App = new AppView;

}); // app end