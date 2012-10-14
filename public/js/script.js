// load the app once the dom is ready

$(function(){

  // backbone router

  window.AdminRouter = Backbone.Router.extend({
    routes: {
      '' : 'home'
    },

    initialize: function(){
      adminView = new AdminView();
      libraryView = new LibraryView({collection: library});
    },

    home: function(){
      var $postLibrary = $('#post-library');
      $postLibrary.empty();
      $postLibrary.append(libraryView.render().el);
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
        order: library.nextOrder()
      };
    },

    initialize: function(){
        // this.on("change:published", function(){
        // });
    },

    changeText: function( post_text ){
        this.set({ text: post_text });
    },

    isPublished: function(){
      return this.get("published") == true;
    },

    // Toggle the 'published' state of this post.
    toggle: function() {
      this.set({published: !this.get("published")});
      this.save();
      return this;
    }


  });

  // blogposts collection

  window.Posts = Backbone.Collection.extend({

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

  window.library = new Posts();

  // views

  window.PostView = Backbone.View.extend({

    tagName: 'li',
    className: 'post',

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
      this.template = _.template($('#post-template').html());
    },

    render: function( event ){
        var renderedContent = this.template( this.model.toJSON() );
        $(this.el).html(renderedContent);

        return this; //recommended as this enables calls to be chained.
    },

    // The DOM events specific to an item.
    events: {
      "click .publish" : "togglePublished",
      "click .unpublish" : "togglePublished",
      "click .delete"    : "deletePost",
      "click .edit" : "editPost"
    },

    // Toggle the "published" state of the model.
    togglePublished: function() {
      this.model.toggle();
      return this;
    },

    deletePost: function() {
      this.model.destroy();
    },

    editPost: function() {
      var title = this.model.get('title'),
        text = this.model.get('text');
      // console.dir(post);
      window.post_for_editing = this.model;
      window.$('#title').val(title);
      window.$('#text').val(text);
    }

  });


  // old posts that appear as titles on the top level ui
  // LibraryPostView extends PostView because it will hold all posts

  window.LibraryPostView = PostView.extend({


  });

  // the view below handles collections of posts

  window.LibraryView = Backbone.View.extend({
    tag: 'section',
    className: 'library',

    initialize: function() {
                _.bindAll(this, 'render');
                this.template = _.template($('#library-template').html());
                this.collection.bind('reset', this.render);
            },

    render: function() {
      var $posts,
          collection = this.collection;
      $(this.el).html(this.template({}));
      $posts = this.$('.posts');
      collection.each(function(post) {
        var view = new LibraryPostView({
          model: post,
          collection: collection
        });
        $posts.append(view.render().el);
      });
      return this;
      }

  });

  // *********************
  //     Backbone CMS
  // top level piece of UI
  // *********************

  window.AdminView = Backbone.View.extend({

  el: $("#admin"),

  events: {
      "click #save-post":  "setOrCreateOnSubmit"
    },

  initialize: function() {
    // stuff to come here
  },
 
  setOrCreateOnSubmit: function (){

    var $title = this.$('#title'),
      $text = this.$('#text'),
      $post_id = this.$('#post-id'),
      title = $title.val(),
      text = $text.val();

    if (window.post_for_editing != undefined)  {   // needs logic for if post exists
      window.post_for_editing.save({title: title, text: text});
      window.post_for_editing = undefined;
    }

    else {
      library.create({title: title, text: text});
    }

    $title.val('');
    $text.val('');
    $post_id.val('');

    library.fetch(); // I think this should be event triggered...
  }

  });

  // create the app
  window.App = new AdminRouter();
  Backbone.history.start({pushState: true, root: '/admin'});

}); // app end
