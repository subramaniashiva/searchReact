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
        return ( React.createElement("div", {className: "productContainer"}, 
            React.createElement(PageBar, {data: this.state.data}), 
            React.createElement(ProductList, {data: this.state.data}), 
            React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
            )
        );
    }
});
React.render(React.createElement(ProductContainer, {url: "products.json"}), document.getElementById('content'));