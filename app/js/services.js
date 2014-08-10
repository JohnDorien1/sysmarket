'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('sysMarket.services', [])
    .factory('syscoinService', ['$http', '$q', function($http, $q) {
        // add an item with the given params to the blockchain
        var addItem = function( category, title, quantity, price, description ) {
            console.log("addItem(" + category + ", " + title + ", " + quantity + ", " + price + ", " + description + ")");
            var request = $http({
                method: "get",
                url: "http://localhost:8080/api/additem",
                params: {
                    category: category,
                    title: title,
                    quantity: quantity,
                    price: price,
                    description: description
                }
            });

            return( request.then( handleSuccess, handleError ) );
        }

        var getPendingItems = function() {
            console.log("getPendingItems()");
            var request = $http({
                method: "get",
                url: "http://localhost:8080/api/getpendingitems",
                params: {
                }
            });

            return( request );
        }


        // ---
        // PRIVATE METHODS.
        // ---


        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError( response ) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                    ! response.data.message
                ) {

                return( $q.reject( "An unknown error occurred." ) );

            }

            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );

        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            console.log("res:", response);
            return( response.data );

        }

        // Return public API.
        return {
            addItem: function(category, title, quantity, price, description) { return addItem(category, title, quantity, price, description); },
            getPendingItems: function() { return getPendingItems(); }
        };
    }]);
