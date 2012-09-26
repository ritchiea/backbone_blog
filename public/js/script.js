// load the app once the dom is ready

$(function(){

  // backbone router

  var BlogRouter = Backbone.Router.extend({
  routes: { "posts/:id": "route" },

  route: function(id) {
    var item = PostArchive.get(id);
    var view = new AdminView({ model: item });

    something.html( view.render().el );
  }
  });

  // posts model
  // posts should have text, a title, an author & a boolean published status

  window.Post = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function() {
      return {
        author: "Andrew Ritchie",
        title: "New Post",
        text: "Hello world",
        published:  false,
        order: Posts.nextOrder()
      };
    },

    initialize: function(){
        console.log("this model has been instantiated");
        this.on("change:text", function(){
            var text = this.get("text");
            console.log('Text source updated');
        });
    },

    changeText: function( posttext ){
        this.set({ text: posttext });
    },

    // Toggle the 'published' state of this todo item.
    toggle: function() {
      this.set({published: !this.get("published")});
    }


  });

  // blogposts collection

  var PostArchive = Backbone.Collection.extend({

  model: Post,
  url: 'admin/api/posts',

  // keep unpublished posts in sequential order
  
  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
    }

  });

  var Posts = new PostArchive;

  // views

  var PostView = Backbone.View.extend({

    // templating function
    template: _.template($('#post-template').html()),

    // The DOM events specific to an item.
    events: {
      "click publish" : "togglePublished"
    },

    // listen for changes to posts model

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.on('change', this.render);
      this.model.on('destroy', this.remove);
    },

    // Re-render the post
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    // Toggle the "published" state of the model.
    togglePublished: function() {
      this.model.toggle();
    }

  });

  // My blog App
  // top level piece of UI

  window.AdminView = Backbone.View.extend({

  el: $("#admin"),

  initialize: function() {
    Posts.on('all',   this.render, this);
    Posts.fetch();
  }

  });


  // create the app

  window.App = new BlogView;

}); // app end