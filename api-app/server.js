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

//create syscoin client for RPC commands
var sysclient = new syscoin.Client({
    host: 'localhost',
    port: 8368,
    user: 'syscoinrpc',
    pass: '4Pkq667pWoCZr37gUDzDRBXUiSq7uTT5Q9fzZjKCtvju',
    timeout: 180000
});

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//SYSCOIN JSON-RPC API
router.get('/additem', function(req, res) {
    //category, title, quantity, price, [description], callback
    sysclient.offerNew('debug/sysmarket', 'Test SysMarket Offer', '1', '100', 'offer description', function(err, result, resHeaders) {
        if (err) {
            res.json({ error : err });
            console.log(err);
            return;
        }

        res.json({ hash : result[0], rand : result[1]});
        console.log('additem: offernew result = ', result);
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);