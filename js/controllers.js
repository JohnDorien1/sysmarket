var sysMarketControllers = angular.module('sysMarketControllers', []);

sysMarketControllers.controller('HomeCtrl', ['$scope', '$route',
    function ($scope, $route) {
        /*$http.get('phones/phones.json').success(function(data) {
            $scope.phones = data;
        });*/

        updateNavClasses($route.current.$$route.originalPath);
    }]);

sysMarketControllers.controller('ItemListCtrl', ['$scope', '$route', '$routeParams',
    function($scope, $route, $routeParams) {
        updateNavClasses($route.current.$$route.originalPath);
    }]);

sysMarketControllers.controller('AddItemCtrl', ['$scope', '$route', '$routeParams',
    function($scope, $route, $routeParams) {
        updateNavClasses($route.current.$$route.originalPath);
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