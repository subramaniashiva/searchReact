var ProductList = React.createClass({
    render: function() {
        var productNodes = this.props.data.products.map(function (product) {
            return (
            <Product name={product.name} img={product.images_o.l} url={product.url} 
              price={product.min_price_str} rating={product.avg_rating} 
              deals={product.deal_count} ratingCount={product.rating_count}
              keyFeatures={product.key_features.splice(0,6)}>
                {product.brand}
            </Product>
            );
        });
        return (
            <div className="productList">
                {productNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
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
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var PageBar = React.createClass({
  render: function() {
    return (
      <div className="page-bar">
        Showing {this.props.data.products.length} of {this.props.data.total} Results
      </div>
      );
    }
});

var Product = React.createClass({
  render: function() {
    return (
      <div className="product col-md-3">
        <a href={this.props.url}><img className="thumb-img" src={this.props.img} /></a>
        <h5 className="product-name">
          <a href={this.props.url}>{this.props.name}</a>
        </h5>
        <div className="price-block pull-left">
          <div className="price">
            BEST PRICE <span className="value">Rs. {this.props.price}</span>
          </div>
          <div className="deals">
            {this.props.deals} deals
          </div>
        </div>
        <div className="pull-right">
          <div className="rating">
            {this.props.rating}
          </div>
          <div className="total-rating">
              {this.props.ratingCount} votes
          </div>
        </div>
        <div className="clearfix"></div>
        <ProductFeatures keyFeatures={this.props.keyFeatures}>
        </ProductFeatures>
      </div>
    );
  }
});

var ProductFeatures = React.createClass({
  render: function() {
    var featureNodes = this.props.keyFeatures.map(function (features) {
      return (
      <li>
          {(features[1].split(','))[0]}
      </li>
      );
    });
    return (
      <div className="features-list">
        {featureNodes}
      </div>

      );
  }
});
var ProductContainer = React.createClass({
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
        return ( <div className = "productContainer">
            <PageBar data={this.state.data} />
            <ProductList data={this.state.data}/>
            <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});
React.render(<ProductContainer url="products.json" />, document.getElementById('content'));