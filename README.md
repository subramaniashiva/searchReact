#Implementing Search using ReactJS#

Implementing a RESTful search functionality using ReactJS. Constructing a [similar page like this](http://www.buyingiq.com/s/q:mot/) using ReactJS
Since the API has not supported JSONP, I have directly taken the JSON results from the buyingiq server and saved it in my local.
Whenever the page is loaded, an AJAX request is sent to fetch this local JSON  file, parse it and then display the results accordingly.
Once JSONP is supported, this function can be easily used to fetch JSON through API call

##Future Improvements##

 - Creating a left nav filter
 - Sorting the products in page
 - Pagination of results
