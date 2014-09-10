'use strict';


// Declare app level module which depends on filters, and services
angular.module('sysMarket', [
  'ngRoute',
  //'sysMarket.filters',
  'sysMarket.services',
  //'sysMarket.directives',
  'sysMarket.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', { controller:'HomeCtrl', templateUrl:'partials/home.html'});
    $routeProvider.when('/items', { controller:'ItemListCtrl', templateUrl:'partials/item_list.html'});
    $routeProvider.when('/item/:guid', { controller:'ItemCtrl', templateUrl:'partials/item_detail.html'});
    $routeProvider.when('/additem', { controller:'AddItemCtrl', templateUrl:'partials/add_item.html' });
    $routeProvider.when('/getcertissuer', { controller:'CertCtrl', templateUrl:'partials/certissuer_list.html' });
    $routeProvider.when('/getaliases', { controller:'AliasCtrl', templateUrl:'partials/alias_list.html' });
    $routeProvider.when('/dividend', { controller:'DividendCtrl', templateUrl:'partials/div_calc.html' });
    $routeProvider.when('/admin', { controller:'AdminCtrl', templateUrl:'admin/admin.html' });
    $routeProvider.otherwise({ redirectTo:'/' });
}]);
