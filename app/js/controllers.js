'use strict';

/* Controllers */

angular.module('sysMarket.controllers', ['sysMarket.services'])
    .controller('HomeCtrl', ['$scope', '$route', function ($scope, $route) {
        /*$http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });*/

        updateNavClasses($route.current.$$route.originalPath);
    }])

    .controller('ItemListCtrl', ['$scope', '$route', '$routeParams', function($scope, $route, $routeParams) {
        updateNavClasses($route.current.$$route.originalPath);
    }])

    .controller('AddItemCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        //see if there are any pending items to list
        var request  = syscoinService.getPendingItems();
        request.then(function(response) {
            $scope.pendingItems = response.data.pendingItems;
            console.log("PENDING: " + $scope.pendingItems);
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

function updateNavClasses(currentRoute) {
    $('#home-nav').removeClass("active");
    $('#items-nav').removeClass("active");
    $('#additem-nav').removeClass("active");

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
    }
}
