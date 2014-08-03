var sysMarketApp = angular.module('sysMarket', ['ngRoute', 'sysMarketControllers']);

sysMarketApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'HomeCtrl',
                templateUrl:'partials/home.html'
            })
            .when('/items', {
                controller:'ItemListCtrl',
                templateUrl:'partials/item_list.html'
            })
            .when('/additem', {
                controller:'AddItemCtrl',
                templateUrl:'partials/add_item.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    });