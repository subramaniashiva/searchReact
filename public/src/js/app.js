/*
  Helper function to load data from server
*/
function loadProductsFromServer(url, dataType, reference, params) {
  $.ajax({
    url: url,
    dataType: dataType,
    cache: false,
    success: function(data) {
      this.setState({data: data});
    }.bind(reference),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(reference)
  });
}
/*
  Product container
  Contains product list and pagination components
*/
var ProductContainer = React.createClass({
    getInitialState: function() {
        return {
          data: {
            products: [],
            total: 0
          }};
    },
    componentDidMount: function() {
        loadProductsFromServer(this.props.url, "json", this);
    },
    render: function() {
        return ( <div className = "product-container">
            <PageBar data={this.state.data} />
            <ProductList data={this.state.data}/>
            </div>
        );
    }
});
/*
  Pagination component. Part of Product container component
  Contains details about total products and current page
  This logic is not complete
*/
var PageBar = React.createClass({
  render: function() {
    return (
      <div className="page-bar">
        Showing {this.props.data.products.length} of {this.props.data.total} 
        Results
      </div>
      );
    }
});
/*
  List of products as a component
  Contains individual product components
*/
var ProductList = React.createClass({
    render: function() {
        var productNodes = this.props.data.products.map(function (product) {
            return (
            <Product name={product.name} img={product.images_o.l} 
              url={product.url} price={product.min_price_str} 
              rating={product.avg_rating} deals={product.deal_count}
              ratingCount={product.rating_count} 
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
/*
  Individual product as a component
  Contains product details such as price, rating..etc
*/
var Product = React.createClass({
  render: function() {
    return (
      <div className="product col-md-3">
        <a href={this.props.url}><img className="thumb-img" 
          src={this.props.img} /></a>
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
/*
  Product features as component
  This will be a part of product component
*/
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
/*
  Search component.
  Continas the search box and filters out the results as user types
*/
var SearchContainer = React.createClass({
    getInitialState: function(){
        return { searchString: '',
                  data: {products: []}};
    },
    handleChange: function(e){
        loadProductsFromServer(this.props.url, "json", this);
        this.setState({searchString:e.target.value});
    },
    render: function() {
        var searchResult = this.state.data.products,
            searchString = this.state.searchString.trim().toLowerCase();

        if(searchString.length > 0){
            // We are searching. Filter the results.
            searchResult = searchResult.filter(function(l){
                return l.name.toLowerCase().match( searchString );
            });

        }
        return (<div>
                  <input id="search-box" type="text" 
                    value={this.state.searchString} 
                    onChange={this.handleChange} 
                    className="form-control search-input ui-autocomplete-input" 
                    placeholder="Find the best mobile at today's best price." 
                    autocomplete="off" />
                  <span 
                    className="glyphicon glyphicon-search form-control-feedback"
                    ></span>
                  <ul id="search-list" className="search-list"> 
                      { searchResult.map(function(l){
                          return <li>
                              <a href={l.url}>
                                <div className="pull-left search-list-img">
                                  <img src={l.images_o.s} />
                                </div>
                                <div className="pull-left">
                                  <span className="search-list-name">
                                    {l.name}
                                  </span><br/>from 
                                  <span className="search-list-desc">
                                    {l.min_price_str}
                                  </span> in 
                                  <span className="search-list-desc">
                                    {l.store_count}
                                  </span> stores</div>
                              </a>
                            </li>
                      }) }
                  </ul>
                </div>);

    }
});
// Render the Product container
React.render(<ProductContainer url="products.json" />, 
  document.getElementById('content'));
// Render the Search container
React.render(<SearchContainer url="products.json" />, 
  document.getElementById('search-bar'))
