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
var ProductContainer = React.createClass({displayName: "ProductContainer",
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
        return ( React.createElement("div", {className: "product-container"}, 
            React.createElement(PageBar, {data: this.state.data}), 
            React.createElement(ProductList, {data: this.state.data})
            )
        );
    }
});
/*
  Pagination component. Part of Product container component
  Contains details about total products and current page
  This logic is not complete
*/
var PageBar = React.createClass({displayName: "PageBar",
  render: function() {
    return (
      React.createElement("div", {className: "page-bar"}, 
        "Showing ", this.props.data.products.length, " of ", this.props.data.total, 
        "Results"
      )
      );
    }
});
/*
  List of products as a component
  Contains individual product components
*/
var ProductList = React.createClass({displayName: "ProductList",
    render: function() {
        var productNodes = this.props.data.products.map(function (product) {
            return (
            React.createElement(Product, {name: product.name, img: product.images_o.l, 
              url: product.url, price: product.min_price_str, 
              rating: product.avg_rating, deals: product.deal_count, 
              ratingCount: product.rating_count, 
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
/*
  Individual product as a component
  Contains product details such as price, rating..etc
*/
var Product = React.createClass({displayName: "Product",
  render: function() {
    return (
      React.createElement("div", {className: "product col-md-3"}, 
        React.createElement("a", {href: this.props.url}, React.createElement("img", {className: "thumb-img", 
          src: this.props.img})), 
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
/*
  Product features as component
  This will be a part of product component
*/
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
/*
  Search component.
  Continas the search box and filters out the results as user types
*/
var SearchContainer = React.createClass({displayName: "SearchContainer",
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
        return (React.createElement("div", null, 
                  React.createElement("input", {id: "search-box", type: "text", 
                    value: this.state.searchString, 
                    onChange: this.handleChange, 
                    className: "form-control search-input ui-autocomplete-input", 
                    placeholder: "Find the best mobile at today's best price.", 
                    autocomplete: "off"}), 
                  React.createElement("span", {
                    className: "glyphicon glyphicon-search form-control-feedback"
                    }), 
                  React.createElement("ul", {id: "search-list", className: "search-list"}, 
                       searchResult.map(function(l){
                          return React.createElement("li", null, 
                              React.createElement("a", {href: l.url}, 
                                React.createElement("div", {className: "pull-left search-list-img"}, 
                                  React.createElement("img", {src: l.images_o.s})
                                ), 
                                React.createElement("div", {className: "pull-left"}, 
                                  React.createElement("span", {className: "search-list-name"}, 
                                    l.name
                                  ), React.createElement("br", null), "from",  
                                  React.createElement("span", {className: "search-list-desc"}, 
                                    l.min_price_str
                                  ), " in",  
                                  React.createElement("span", {className: "search-list-desc"}, 
                                    l.store_count
                                  ), " stores")
                              )
                            )
                      }) 
                  )
                ));

    }
});
// Render the Product container
React.render(React.createElement(ProductContainer, {url: "products.json"}), 
  document.getElementById('content'));
// Render the Search container
React.render(React.createElement(SearchContainer, {url: "products.json"}), 
  document.getElementById('search-bar'))
