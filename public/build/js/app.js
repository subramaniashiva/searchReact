var ProductList = React.createClass({displayName: "ProductList",
    render: function() {
        var productNodes = this.props.data.products.map(function (product) {
            return (
            React.createElement(Product, {name: product.name, img: product.images_o.l, url: product.url, 
              price: product.min_price_str, rating: product.avg_rating, 
              deals: product.deal_count, ratingCount: product.rating_count, 
              keyFeatures: product.key_features.splice(0,6)}, 
                product.brand
            )
            );
        });
        return (
            React.createElement("div", {className: "productList"}, 
                productNodes
            )
        );
    }
});

var CommentForm = React.createClass({displayName: "CommentForm",
    handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
        React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

var PageBar = React.createClass({displayName: "PageBar",
  render: function() {
    return (
      React.createElement("div", {className: "page-bar"}, 
        "Showing ", this.props.data.products.length, " of ", this.props.data.total, " Results"
      )
      );
    }
});

var Product = React.createClass({displayName: "Product",
  render: function() {
    return (
      React.createElement("div", {className: "product col-md-3"}, 
        React.createElement("a", {href: this.props.url}, React.createElement("img", {className: "thumb-img", src: this.props.img})), 
        React.createElement("h5", {className: "product-name"}, 
          React.createElement("a", {href: this.props.url}, this.props.name)
        ), 
        React.createElement("div", {className: "price-block pull-left"}, 
          React.createElement("div", {className: "price"}, 
            "BEST PRICE ", React.createElement("span", {className: "value"}, "Rs. ", this.props.price)
          ), 
          React.createElement("div", {className: "deals"}, 
            this.props.deals, " deals"
          )
        ), 
        React.createElement("div", {className: "pull-right"}, 
          React.createElement("div", {className: "rating"}, 
            this.props.rating
          ), 
          React.createElement("div", {className: "total-rating"}, 
              this.props.ratingCount, " votes"
          )
        ), 
        React.createElement("div", {className: "clearfix"}), 
        React.createElement(ProductFeatures, {keyFeatures: this.props.keyFeatures}
        )
      )
    );
  }
});

var ProductFeatures = React.createClass({displayName: "ProductFeatures",
  render: function() {
    var featureNodes = this.props.keyFeatures.map(function (features) {
      return (
      React.createElement("li", null, 
          (features[1].split(','))[0]
      )
      );
    });
    return (
      React.createElement("div", {className: "features-list"}, 
        featureNodes
      )

      );
  }
});
var ProductContainer = React.createClass({displayName: "ProductContainer",
    loadProductsFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        /*$.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: comment,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });*/
    },
    getInitialState: function() {
        return {data: {products: []}};
    },
    componentDidMount: function() {
        this.loadProductsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return ( React.createElement("div", {className: "product-container"}, 
            React.createElement(PageBar, {data: this.state.data}), 
            React.createElement(ProductList, {data: this.state.data}), 
            React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
            )
        );
    }
});

var SearchContainer = React.createClass({displayName: "SearchContainer",
    loadProductsFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data.products});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },
    getInitialState: function(){
        return { searchString: '',
                  data: []};
    },
    handleChange: function(e){

        // If you comment out this line, the text box will not change its value.
        // This is because in React, an input cannot change independently of the value
        // that was assigned to it. In our case this is this.state.searchString.
        this.loadProductsFromServer();
        this.setState({searchString:e.target.value});
    },
    render: function() {
        var searchResult = this.state.data,
            searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            // We are searching. Filter the results.
            searchResult = searchResult.filter(function(l){
                return l.name.toLowerCase().match( searchString );
            });

        }
        return (React.createElement("div", null, 
                  React.createElement("input", {id: "search-box", type: "text", value: this.state.searchString, onChange: this.handleChange, className: "form-control search-input ui-autocomplete-input", placeholder: "Find the best mobile at today's best price.", autocomplete: "off"}), 
                  React.createElement("span", {className: "glyphicon glyphicon-search form-control-feedback"}), 
                  React.createElement("ul", {id: "search-list", className: "search-list"}, 
                       searchResult.map(function(l){
                          return React.createElement("li", null, 
                            React.createElement("a", {href: l.url}, 
                              React.createElement("div", {className: "pull-left search-list-img"}, React.createElement("img", {src: l.images_o.s})), 
                              React.createElement("div", {className: "pull-left"}, React.createElement("span", {className: "search-list-name"}, l.name), " ", React.createElement("br", null), "from ", React.createElement("span", {className: "search-list-desc"}, l.min_price_str), " in ", React.createElement("span", {className: "search-list-desc"}, l.store_count), " stores")
                            ))
                      }) 
                  )
                ));

    }
});
React.render(React.createElement(ProductContainer, {url: "products.json"}), document.getElementById('content'));
React.render(React.createElement(SearchContainer, {url: "products.json"}), document.getElementById('search-bar'))

// Listening to search box press event and toggle the search result accordingly
$("#search-box").on("keyup", function(event) {
  console.log(this.value);
  if(this.value === "") {
    $("#search-list").hide();
  } else {
    $("#search-list").show();
  }
});
