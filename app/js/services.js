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
                url: "http://188.226.131.93:81/api/additem",
                params: {
                    category: category,
                    title: title,
                    quantity: quantity,
                    price: price,
                    description: description
                }
            });

            return( request );
        }

        var getPendingItems = function() {
            console.log("getPendingItems()");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/getpendingitems",
                params: {
                }
            });

            return( request );
        }

        var getItems = function() {
            console.log("getItems()");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/getitems",
                params: {
                }
            });

            return( request );
        }

        var getcertissuers = function() {
            console.log("getcertissuers()");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/getcertissuers",
                params: {
                }
            });

            return( request );
        }
        
        var getaliases = function() {
            console.log("getaliases()");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/getaliases",
                params: {
                }
            });

            return( request );
        }
        
        var getItem = function(guid) {
            console.log("getItem( " + guid + ")");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/getitem",
                params: {
                    guid: guid
                }
            });

            return( request );
        }

        var getrawtransaction = function(guid) {
            console.log("getrawtransaction( " + guid + ")");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/getrawtransaction",
                params: {
                    guid: guid
                }
            });

            return( request );
        }
        
        var decoderawtransaction = function(guid) {
            console.log("decoderawtransaction( " + guid + ")");
            var request = $http({
                method: "get",
                url: "http://188.226.131.93:81/api/decoderawtransaction",
                params: {
                    guid: txid
                }
            });

            return( request );
        }
       
        
        // Return public API.
        return {
            addItem: function(category, title, quantity, price, description) { return addItem(category, title, quantity, price, description); },
            getPendingItems: function() { return getPendingItems(); },
            getItems: function() { return getItems(); },
            getItem: function(guid) { return getItem(guid); },
            getcertissuers: function() { return getcertissuers(); },
            getaliases: function() {return getaliases(); },
            getrawtransaction: function(guid) { return getrawtransaction(guid); },
            decoderawtransaction: function(guid) { return decoderawtransaction(guid); }
        };
    }]);
