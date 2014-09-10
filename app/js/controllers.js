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
    
    .controller('AdminCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        //get active item list
        var request  = syscoinService.getItems();
        request.then(function(response) {
            $scope.items = response.data.items;
            console.log("got items:", $scope.items);
        });
        
        $scope.submitData = function (data, resultVarName)
        {
	        var config = {
		        params: {
		        	//id: id,
			        title: $scope.items.title,
			        price: $scope.items.price,
			        category: $scope.items.category,
			        quantity: $scope.items.quantity
			        }
			    };
			    console.log("submit func called: ", config);
			    $.ajax({
				    type: "POST",
				    url: "admin/backend.php",
				    data: data
				    
			    });
		/*$http.post("backend.php", null, config)
        	.success(function (data, status, headers, config)
        	{
	        	$scope[resultVarName] = data;
	        })
	        .error(function (data, status, headers, config)
	        {
		        $scope[resultVarName] = "SUBMIT ERROR";
		    });*/
		};
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
        updateNavClasses($route.current.$$route.originalPath);
        //get certissuers from rpc
        var request  = syscoinService.getcertissuers();
        request.then(function(response) {
            $scope.items = response.data.items;
            console.log("Got Cert info: ", response.data.items);
        });
    }])

     .controller('AliasCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);
        //get certissuers from rpc
        var request  = syscoinService.getaliases();
        request.then(function(response) {
            $scope.items = response.data;
            console.log("Got Alias info: ", response.data);
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
            console.log("var title = ", title);
            var data;
            var returnstring ="sendmany";
            var request = syscoinService.getItem(title);
              request.then(function(response) { 
              	data = response.data; 
			  	//console.log("RESPONSE: ",response);         
				var items = new Array();
				var shares = new Array();
				//console.log("data var = ", data);
				console.log("return data accepts 1 = ", data.id);
				//create a loop to get 1) the buyers Tx and 2) the amount of shares bought
                for(var i = 0; i < data.accepts.length; i++){
                       items.push(data.accepts[i].txid);
                       shares.push(data.accepts[i].quantity);
					   }
				//console.log("data.title = ", data.title);
				//console.log("return data accepts 1 = ", data.accepts[1].txid);
				//Do the final calculation
				var total_dividend = $('#inputCategory').val(); 
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
				// console.log("data array 2 = ", items[2]);
				var raw;
				var txdata;
				var i = 0;
            
				//async.whilst(function() {
				for(var i = 0; i < items.length; i++){
                	raw = syscoinService.getrawtransaction(items[i]);
					raw.then(function(response) { 
						raw = response.data; 
						console.log("GetRawTX response: ",response);
                  
						txdata = syscoinService.decoderawtransaction(raw);
						txdata.then(function(response) { 
							txdata = response.data; 
							console.log("decoderaw response: ",response);
							items[i] = txdata.vout.addresses;
							i++;
							for(var i = 0; i < items.length; i++){
                    			returnstring += " \"" + items[i] + " \"" + payperbuyer[i] + ",";            
								} 
							});                  
					});
				}
              });
         });
    }])

    .controller('DividendCertCtrl', ['$scope', '$route', '$routeParams', 'syscoinService', function($scope, $route, $routeParams, syscoinService) {
        updateNavClasses($route.current.$$route.originalPath);

        $('#dividendBtn').click(function() {
            console.log("controller click");
            
            //collect input offerGUID and retrieve info from daemon
            var title = $('#inputTitle').val();
            console.log("var title = ", title);
            var data;
            var returnstring ="sendmany";
            var request = syscoinService.certissuerinfo(title);
              request.then(function(response) { 
              	data = response.data;        
				var items = new Array();
				var shares = new Array();
                for(var i = 0; i < data.accepts.length; i++){
                       items.push(data.accepts[i].txid);
                       }
				var total_dividend = $('#inputCategory').val(); 
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
				// console.log("data array 2 = ", items[2]);
				var raw;
				var txdata;
				var i = 0;
            
				//async.whilst(function() {
				for(var i = 0; i < items.length; i++){
                	raw = syscoinService.getrawtransaction(items[i]);
					raw.then(function(response) { 
						raw = response.data; 
						console.log("GetRawTX response: ",response);
                  
						txdata = syscoinService.decoderawtransaction(raw);
						txdata.then(function(response) { 
							txdata = response.data; 
							console.log("decoderaw response: ",response);
							items[i] = txdata.vout.addresses;
							i++;
							for(var i = 0; i < items.length; i++){
                    			returnstring += " \"" + items[i] + " \"" + payperbuyer[i] + ",";            
								} 
							});                  
					});
				}
              });
         });
    }])
    
function updateNavClasses(currentRoute) {
    $('#home-nav').removeClass("active");
    $('#items-nav').removeClass("active");
    $('#certs-nav').removeClass("active");
    $('#additem-nav').removeClass("active");
    $('#dividend-nav').removeClass("active");
    $('#dividend-cert-nav').removeClass("active");
    $('#alias-nav').removeClass("active");
    $('#admin-nav').removeClass("active");

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
            
        case "/aliases":
            $('#alias-nav').addClass("active");
            break;      
        
		case "/dividendcert":
            $('#dividend-cert-nav').addClass("active");
            break;
        
        case "/admin":
            $('#admin-nav').addClass("active");
            break;
    }
}
