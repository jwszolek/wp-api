
var express = require('express');
var basicAuth = require('express-basic-auth');
var bodyParser = require('body-parser');

var app = express();
var port = 8889;

invsRouter = require('./Routes/investmentsRoutes')();
offRouter = require('./Routes/offersRoutes')();

app.use(basicAuth({users: { 'admin': 'supersecret'}}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/api/v1/investments", invsRouter);
app.use("/api/v1/offers", offRouter);

app.listen(port, function(){
	console.log("I am running on PORT !!: " + port);
})