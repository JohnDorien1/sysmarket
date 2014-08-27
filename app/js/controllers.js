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
        //get certissuers from rpc
        var request  = syscoinService.getcertissuers($routeParams.guid);
        request.then(function(response) {
            $scope.items = response.data;
            console.log("Got Cert info: ", response.data);
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
    }])

    .controller('DividendCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        $('#dividendBtn').click(function() {
            console.log("controller click");
            
            //collect input offerGUID and retrieve info from daemon
            var title = $('#inputTitle').val();
            var data = syscoinService.getItem(title);
            var items = new Array();
            var shares = new Array();
            //create a loop to get 1) the buyers address and 2) the amount bought
                  for(var i = 0; i < data.length; i++){
                       items.push(data[i].accepts.txid);
                       shares.push(data[i].accepts.quantity);
                       }
            
            //Do the final calculation (Divindend / Shares * AmountSharesOwned)
            var total_dividend = $('#inputCategory').val();  // Crash happens in this line!!!
            var total_shares=0;
              for(var i = 0; i < shares.length; i++){
                total_shares += shares[i];
              }
            
            var div_per_share = total_dividend / total_shares;
            var payperbuyer = new Array();
            
              for (var i = 0; i < items.length; i++){
                payperbuyer.push(shares[i] * div_per_share);                
                }
                
            // What do we have now:
            // items[i] -- contains TXID
            // shares[i] -- number of shares per buyer
            // payperbuyer[i] -- Total amount of dividend per stakeholder
            
            // Here we need to find out the sender's SYS address
            
            // Create and return sendmany string the user can copy&paste to conduct his dividends
          
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
            
        //case "/dividend":
        //    $('#dividend-nav').addClass("active");
        //    break;
    }
}
