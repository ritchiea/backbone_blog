// load the app once the dom is ready

$(function(){

  // backbone router

  var AdminRouter = Backbone.Router.extend({
  routes: { "admin/posts/:id": "route" },

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

    // TODO: add validations

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
        console.log("Post model has been instantiated");
        this.on("change:text", function(){
            var text = this.get("text");
            console.log('Post text updated');
        });
    },

    changeText: function( post_text ){
        this.set({ text: post_text });
    },

    // Toggle the 'published' state of this todo item.
    toggle: function() {
      this.set({published: !this.get("published")});
    }


  });

  // blogposts collection

  var PostLibrary = Backbone.Collection.extend({

  model: Post,
  url: 'admin/api/posts',

  // keep unpublished posts in sequential order
  
  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
    },

  comparator: function(post) {
      return post.get('order');
    }


  });

  var Posts = new PostLibrary;

  // views

  var PostView = Backbone.View.extend({
    el: $('#post'),

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function( event ){
        var compiled_template = _.template( $("#post-template").html() );
        this.$el.html( compiled_template(this.model.toJSON()) );
        return this; //recommended as this enables calls to be chained.
    },

    // The DOM events specific to an item.
    events: {
      "click #publish" : "togglePublished"
    },

    // Toggle the "published" state of the model.
    togglePublished: function() {
      this.model.toggle();
    }

  });

  // My Backbone CMS App
  // top level piece of UI

  window.AdminView = Backbone.View.extend({

  el: $("#admin"),

  initialize: function() {
    console.log("Admin view instantiated");
    Posts.on('all',   this.render, this);
    Posts.fetch();
  }

  });


  // create the app

  window.App = new AdminView;

}); // app end