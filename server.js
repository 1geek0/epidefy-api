var express = require("express");
var cors = require('cors')
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')
const AssistantV1 = require('ibm-watson/assistant/v1')

app.use(cors())

const service = new AssistantV1({
  version: '2019-02-28',
  iam_apikey: 'DcQf5kRwZ_9E2NRt9RjtfsVyhfsF5lG14FZTUYUb8Cng',
  url: 'https://gateway-lon.watsonplatform.net/assistant/api'
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let mydb, cloudant;
var vendor; // Because the MongoDB and Cloudant use different API commands, we
            // have to check which command should be used based on the database
            // vendor.
var dbName = 'mydb';

// Separate functions are provided for inserting/retrieving content from
// MongoDB and Cloudant databases. These functions must be prefixed by a
// value that may be assigned to the 'vendor' variable, such as 'mongodb' or
// 'cloudant' (i.e., 'cloudantInsertOne' and 'mongodbInsertOne')

var insertOne = {};
var getAll = {};
var deleteAll = {};

insertOne.cloudant = function(doc, response) {
  mydb.insert(doc, function(err, body, header) {
    if (err) {
      console.log('[mydb.insert] ', err.message);
      response.send("Error");
      return;
    }
    doc._id = body.id;
    response.send(doc);
  });
}

getAll.cloudant = function(response) {
  var reports = [];  
  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(row) {
        if(row.doc)
          reports.push(row.doc);
      });
      console.log(reports);
      response.json(reports);
    }
  });
  //return all the reports;
}

deleteAll.cloudant = function(response) {
  mydb.list({include_docs:true}, function(err, body){
    if (!err) {
      body.row.forEach(function(row) {
        if(row.doc)
          mydb.de
      })
    }
  })
}

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
*   "name": "Bob"
* }
*/
app.post("/data/cf", function (request, response, next) {
  // var userName = request.body.name;
  var doc = request.body;
  if(!mydb) {
    console.log("No database.");
    response.send(doc);
    return;
  }
  insertOne.cloudant(doc, response);
});

app.post("/data/android", function (request, response, next) {

})

app.get('/data/dashboard', function(request, response, next) {

  getAll.cloudant(response)
})

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
// app.get("/api/visitors", function (request, response) {
//   var names = [];
//   if(!mydb) {
//     response.json(names);
//     return;
//   }
//   getAll.cloudant(response);
// });

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

  // Initialize database with credentials
if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/[Cc][Ll][Oo][Uu][Dd][Aa][Nn][Tt]/)) {
  // Load the Cloudant library.
  var Cloudant = require('@cloudant/cloudant');

  // Initialize database with credentials
  if (appEnv.services['cloudantNoSQLDB']) {
    // CF service named 'cloudantNoSQLDB'
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
  } else {
     // user-provided service with 'cloudant' in its name
     cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }
} else if (process.env.CLOUDANT_URL){
  cloudant = Cloudant(process.env.CLOUDANT_URL);
}
if(cloudant) {
  //database name
  dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);

  vendor = 'cloudant';
}

//serve static file (index.html, images, css)
// app.use(express.static(__dirname + '/views'));

// const params = {
//   workspace_id: 'e818ff2d-893d-4885-8c89-6c4af0c13359'
// }


var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
