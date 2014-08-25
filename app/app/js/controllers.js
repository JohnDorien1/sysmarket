'use strict';

/* Controllers */

angular.module('sysMarket.controllers', ['sysMarket.services'])
    .controller('HomeCtrl', ['$scope', '$route', function ($scope, $route) {
        /*$http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });*/

        updateNavClasses($route.current.$$route.originalPath);
    }])

    .controller('ItemListCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        //see if there are any pending items to list
        var request  = syscoinService.getPendingItems();
        request.then(function(response) {
            $scope.pendingItems = response.data.pendingItems;
        });

        //get active item list
        var request  = syscoinService.getItems();
        request.then(function(response) {
            $scope.items = response.data.items;
            console.log("got items:", $scope.items);
        });
    }])

    .controller('ItemCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        //get item detail
        var request  = syscoinService.getItem($routeParams.guid);
        request.then(function(response) {
            $scope.item = response.data;
            console.log("Got item info: ", response.data);
        });
    }])
    
     .controller('CertCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        //get item detail
        var request  = syscoinService.getcertissuers($routeParams.guid);
        request.then(function(response) {
            $scope.items = response.data;
            console.log("Got Cert info: ", $scope.items);
        });
    }])

    .controller('AddItemCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        //see if there are any pending items to list
        var request  = syscoinService.getPendingItems();
        request.then(function(response) {
            $scope.pendingItems = response.data.pendingItems;
        });

        $('#addItemBtn').click(function() {
            console.log("controller click");

            //collect the offer info
            var category = $('#inputCategory').val();
            var title = $('#inputTitle').val();
            var quantity = $('#inputQuantity').val();
            var price = $('#inputPrice').val();
            var description = $('#inputDescription').val();

            //call Syscoin
            syscoinService.addItem(category, title, quantity, price, description);
        });
    }]);

    .controller('DividendCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        $('#dividendBtn').click(function() {
            console.log("controller click");
            
            //collect input offerGUID and retrieve info from daemon
            var title = $('#inputTitle').val();
            var data = syscoinService.getItem(title);
            
            //create a loop to get 1) the buyers address and 2) the amount bought
                       
            
            //Do the final calculation (Divindend / Shares * AmountSharesOwned)
            var total_dividend = $('#inputCategory').val();
            
            //return sendmany string

        });
    }]);
    
function updateNavClasses(currentRoute) {
    $('#home-nav').removeClass("active");
    $('#items-nav').removeClass("active");
    $('#certs-nav').removeClass("active");
    $('#additem-nav').removeClass("active");
    $('#dividend-nav').removeClass("active");

    switch(currentRoute) {
        case "/":
            $('#home-nav').addClass("active");
            break;

        case "/items":
            $('#items-nav').addClass("active");
            break;

        case "/additem":
            $('#additem-nav').addClass("active");
            break;
            
        case "/getcertissuer":
            $('#certs-nav').addClass("active");
            break;
            
        case "/dividend":
            $('#dividend-nav').addClass("active");
            break;
    }
}
