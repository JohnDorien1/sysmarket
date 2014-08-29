// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var syscoin = require('syscoin');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

//ENABLE CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//create syscoin client for RPC commands
var sysclient = new syscoin.Client({
    host: 'localhost',
    port: 8336,
    user: 'sdfkjhsdmkfgbhsdmfjhksdhlsdfjieruesdfzheufhsdjf',
    pass: 'asdfkjdfhvkchbkhadkjwhekfbevsdbdcksjdhfksjkfklshfk',
    timeout: 180000
});

var port = process.env.PORT || 81; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//SYSCOIN JSON-RPC API
router.get('/additem', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('additem: offernew(' + req.query.category + ', ' + req.query.title + ', ' + req.query.quantity + ', ' + req.query.price + ', ' + req.query.description + ')');
    sysclient.offerNew(req.query.category, req.query.title, req.query.quantity, req.query.price, req.query.description, function(err, result, resHeaders) {
        handleError(err);

        var offernew = { hash : result[0], guid : result[1]};
        console.log('additem: offernew result = ', result);

        //activate the offer
        console.log('additem: offeractivate(' + offernew.guid + ')');
        sysclient.offerActivate(offernew.guid, function(err, result, resHeaders) {
            handleError(err);

            var offeractivate = { hash: result[0] };
            console.log('additem: offeractivate result = ', result);
            res.json(offeractivate);
        });

    });
});

router.get('/getpendingitems', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('getpendingitems: listtransactions("")');
    sysclient.listTransactions("", function(err, result, resHeaders) {
        handleError(err);

        //console.log('getpendingitems: getpendingitems result = ', result);
        var pendingItemCount = 0;
        for(var i = 0; i < result.length; i++) {
            if(result[i].address.indexOf("offeractivate") != -1 && result[i].confirmations == 0) {
                pendingItemCount ++;
            }
        }

        res.json({ pendingItems: pendingItemCount });
    });
});

router.get('/getitems', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('getitems: offerscan("")');
    sysclient.offerScan("1","100", function(err, result, resHeaders) {
    handleError(err);

    //console.log('getitems: offerlist result = ', result);

    //iterate over all of the offers and get the full data
    var items = new Array();
    var totalItems = 0;
    var callbacks = 0;
    for(var i = 0; i < result.length; i++) {
        //console.log('result[' + i + '].offer = ' +  result[i].offer + ' ' + result[i].expired);
        if (result[i].hasOwnProperty("expired") == false) {
            totalItems ++;
            sysclient.offerInfo(result[i].offer, function(err, result2, resHeaders) {
                if(result2) { //only add confirmed items
                    items.push(result2);
                }

                callbacks++;

                if(callbacks >= totalItems) {
                    res.json({ items: items });
                }
            });
        }}
    });
});

router.get('/getitem', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('getitem: offerinfo(' + req.query.guid + ')');
    sysclient.offerInfo(req.query.guid, function(err, result, resHeaders) {
        handleError(err);

        console.log('getitem: offerinfo result received');

        res.json( result );
    });
});

router.get('/getrawtransaction', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('getrawtransaction: getrawtransaction(' + req.query.guid + ')');
    sysclient.getRawTransaction(req.query.guid, function(err, result, resHeaders) {
        handleError(err);

        console.log('getrawtransaction:  result received');

        res.json( result );
    });
});

router.get('/decoderawtransaction', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('decodeRawTransaction: decodeRawTransaction(' + req.query.guid + ')');
    sysclient.decodeRawTransaction(req.query.guid, function(err, result, resHeaders) {
        handleError(err);

        console.log('decodeRawTransaction:  result received ');

        res.json( result );
    });
});

router.get('/getcertissuers', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('getitems: certissuerscan("")');
    sysclient.certissuerScan("1","100", function(err, result, resHeaders) {
    handleError(err);

    console.log('getitems: certissuerscan result = ', result);

    //iterate over all of the offers and get the full data
    var items = new Array();
    var totalItems = 0;
    var callbacks = 0;
    for(var i = 0; i < result.length; i++) {
        console.log('result[' + i + '].name = ' +  result[i].value + ' ');
        if (result[i].value != "") {
            totalItems ++;
            sysclient.certissuerInfo(result[i].certissuer, function(err, result2, resHeaders) {
                if(result2) { //only add confirmed items
                    items.push(result2);
                }

                callbacks++;

                if(callbacks >= totalItems) {
                    res.json({ items: items });
                }
            });
        }}
    });
});

router.get('/getaliases', function(req, res) {
    //category, title, quantity, price, [description], callback
    console.log('getaliases: aliasscan("")');
    sysclient.aliasScan("1","1000", function(err, result, resHeaders) {
    handleError(err);

    console.log('getaliases: aliasscan result = ', result);
    res.json( result );
    });
});

//general functions
function handleError(err) {
    if (err) {
        res.json({ error : err });
        console.log(err);
        return;
    }
}


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
