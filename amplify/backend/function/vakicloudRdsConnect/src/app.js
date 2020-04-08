/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authVakicloud0e5f92bfUserPoolId = process.env.AUTH_VAKICLOUD0E5F92BF_USERPOOLID
var apiVakicloudAuthGraphQLAPIIdOutput = process.env.API_VAKICLOUDAUTH_GRAPHQLAPIIDOUTPUT
var apiVakicloudAuthGraphQLAPIEndpointOutput = process.env.API_VAKICLOUDAUTH_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**************************
 * Connect To RDS database *
 **************************/
var AWS = require("aws-sdk");
var mysql = require("mysql");

var config = require("./config.json");
var spotliceConfig = require("./spotliceConfig.json");

var s3Files = new AWS.S3({
  region: "eu-west-1",
  apiVersion: "2006-03-01",
  params: { Bucket: "vakicloud-dev-counters" }
});

var s3Thumbnail = new AWS.S3({
  region: "eu-west-1",
  apiVersion: "2006-03-01",
  params: { Bucket: "spotlice-dev-thumbnails" }
});
var s3Images = new AWS.S3({
  region: "eu-west-1",
  apiVersion: "2006-03-01",
  params: { Bucket: "spotlice-dev-images" }
});

var pool = mysql.createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  port: config.dbport,
  database: config.dbname
});

var spotlicePool = mysql.createPool({
  host: spotliceConfig.dbhost,
  user: spotliceConfig.dbuser,
  password: spotliceConfig.dbpassword,
  port: spotliceConfig.dbport,
  database: spotliceConfig.dbname
});

/***********************
 * Counters Get methods.
 ************************/
app.get("/counters", async function(req, res) {
  var { organisationId, counterID } = req.apiGateway.event.queryStringParameters;
  var query = `SELECT * FROM vakicloud_dev.Fact_Counter_Reports where Organisation_ID = ${organisationId} and Counter_ID = ${counterID} ORDER BY Timestamp desc limit 800;`;

  pool.getConnection(function(err, connection) {
    /*if(err) throw err;*/
    connection.query(query, function(error, results) {
      connection.release();
      if (error) {
        console.log(error);
        /*res.status(400).send(error);*/
        res.json({ failed: "Call failed", status: error });
      } else {
        // Connected!
        console.log("Connected!");

        var regex = /.mse/gi;

        var newResults = results.map(obj => {
          var lastThree = obj.S3Path.substr(obj.S3Path.length - 3);
          var pdfFilePath = "";
          var blcFilePath = "";
          var cntFilePath = "";

          if (lastThree === lastThree.toUpperCase()) {
            //'upper case true';
            pdfFilePath = obj.S3Path.replace(regex, ".PDF");
            blcFilePath = obj.S3Path.replace(regex, ".BLC");
            cntFilePath = obj.S3Path.replace(regex, ".CNT");
          } else if (lastThree === lastThree.toLowerCase()) {
            pdfFilePath = obj.S3Path.replace(regex, ".pdf");
            blcFilePath = obj.S3Path.replace(regex, ".blc");
            cntFilePath = obj.S3Path.replace(regex, ".cnt");
          }

          var params = { Bucket: "vakicloud-dev-counters", Key: obj.S3Path };
          //, ResponseContentType: 'application/mse'

          var mseFile = s3Files.getSignedUrl("getObject", params);
          obj.mseFile = mseFile;

          var pdf_params = {
            Bucket: "vakicloud-dev-counters",
            Key: pdfFilePath,
            ResponseContentType: "binary/octet-stream"
          };
          //, ResponseContentType: 'application/pdf'
          var pdfFile = s3Files.getSignedUrl("getObject", pdf_params);
          obj.pdfFile = pdfFile;
          obj.pdfFilePath = pdfFilePath;

          var blc_params = {
            Bucket: "vakicloud-dev-counters",
            Key: blcFilePath
          };
          //, ResponseContentType: 'application/blc'
          var blcFile = s3Files.getSignedUrl("getObject", blc_params);
          obj.blcFile = blcFile;
          obj.blcFilePath = blcFilePath;

          var cnt_params = {
            Bucket: "vakicloud-dev-counters",
            Key: cntFilePath
          };
          var cntFile = s3Files.getSignedUrl("getObject", cnt_params);
          obj.cntFile = cntFile;
          obj.cntFilePath = cntFilePath;

          return obj;
        });
        res.status(200).send(newResults);
      }
    });
  });

  //res.json({success: 'get call succeed!', url: req.url});
});

app.post("/counters", function(req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/adminview/createOrganisation", function(req, res) {
  var {
    Organisation_ID,
    Name,
    Email,
    Address,
    Phone_Number,
    Created_Date,
    Time_Zone_ID,
    Is_Active
  } = req.apiGateway.event.queryStringParameters;
  var query = `INSERT INTO vakicloud_dev.Dim_Organisation ( Organisation_ID, Name, Email, Address, Phone_Number, Created_Date, Time_Zone_ID, Is_Active) VALUES ('${Organisation_ID}', '${Name}', '${Email}', '${Address}', '${Phone_Number}', '${Created_Date}', '${Time_Zone_ID}', ${Is_Active});`;
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(query, function(error, results) {
      connection.release();
      if (error) {
        //Error!
        res.status(400).send(error);
      } else {
        //Connected!
        res.status(200).send("Organisation Created Successfully");
      }
    });
  });
  //res.json({success: 'post call succeed! You created a counter' + query, url: req.url, body: req.body });
});

app.post("/adminview/updateOrganisation", function(req, res) {
  var {
    Organisation_ID,
    Name,
    Email,
    Address,
    Phone_Number,
    Time_Zone_ID,
    Is_Active
  } = req.apiGateway.event.queryStringParameters;
  var query = `UPDATE vakicloud_dev.Dim_Organisation SET Name = '${Name}', Email = '${Email}', Address = '${Address}', Phone_Number = '${Phone_Number}', Time_Zone_ID = '${Time_Zone_ID}', Is_Active = ${Is_Active} WHERE Organisation_ID=${Organisation_ID};`;

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(query, function(error, results) {
      connection.release();
      if (error) {
        //Error!
        res.status(400).send(error);
      } else {
        //Connected!
        res.status(200).send("Organisation Updated Successfully");
      }
    });
  });
  //res.json({success: 'post call succeed! You created a counter' + query, url: req.url, body: req.body });
});

app.post("/adminview/createCounter", function(req, res) {
  var {
    Counter_ID,
    Organisation_ID,
    Farm_ID,
    Product_Serial,
    Type_ID,
    Process_Data,
    Description
  } = req.apiGateway.event.queryStringParameters;
  var query = `INSERT INTO vakicloud_dev.Dim_Counter (Counter_ID, Organisation_ID, Farm_ID, Product_Serial, Description, Type_ID, Process_Data) VALUES ('${Counter_ID}', '${Organisation_ID}', '${Farm_ID}','${Product_Serial}', '${Description}', '${Type_ID}', '${Process_Data}');`;

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(query, function(error, results) {
      connection.release();
      if (error) {
        //Error!
        res.json({ status: res.status, message: error });
        //res.status(400).send(error);
      } else {
        //Connected!
        //res.status(200).send("Counter Created Successfully");
        res.json({ status: res.status, message: results });
      }
    });
  });
  //res.json({success: 'post call succeed! You created a counter'+ query, url: req.url, body: req.body });
});

app.post("/adminview/updateCounter", function(req, res) {
  var {
    Counter_ID,
    Organisation_ID,
    Farm_ID,
    Product_Serial,
    Type_ID,
    Process_Data,
    Description
  } = req.apiGateway.event.queryStringParameters;

  var query = `UPDATE vakicloud_dev.Dim_Counter SET Organisation_ID = '${Organisation_ID}', Farm_ID = '${Farm_ID}', Product_Serial = '${Product_Serial}', Description = '${Description}', Type_ID = '${Type_ID}', Process_Data = '${Process_Data}' WHERE Counter_ID = '${Counter_ID}';`;

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(query, function(error, results) {
      connection.release();
      if (error) {
        //Error!
        res.status(400).send(error);
      } else {
        //Connected!
        res.status(200).send("Counter Updated Successfully");
      }
    });
  });
  //res.json({success: 'post call succeed! You created a counter'+ query, url: req.url, body: req.body });
});

app.get("/getFile", function(req, res) {
  var { S3Path } = req.apiGateway.event.queryStringParameters;
  var params = {
    Bucket: "vakicloud-dev-counters",
    Key: S3Path
  };
  s3Files.getObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      res.json({ success: data.Body.toString("ascii"), url: req.url });
    }
  });
});

app.get("/getFileBlob", function(req, res) {
  var { S3Path } = req.apiGateway.event.queryStringParameters;
  var params = {
    Bucket: "vakicloud-dev-counters",
    Key: S3Path
  };
  s3Files.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      res.json({ failed: true, error: err, url: req.url });
    } else {
      res.json({
        failed: false,
        error: null,
        data: data,
        success: "Call succeded!"
      });
      //res.status(200).send(data.Body.toString('ascii'));
    }
  });
});

app.get("/spotlice/thumbnailList", function(req, res) {
  var { startDate, endDate, population_ID } = req.apiGateway.event.queryStringParameters;
  var query =
    "SELECT p.Photo_ID, p.Farm_ID, p.Population_ID, p.Camera_ID, p.S3Key,p.Classification_ID, c.Name, p.Recorded_Datetime, p.S3Region, p.S3Bucket, p.S3ThumbnailKey FROM spotlice_dev.Fact_UnderwaterPhoto p, spotlice_dev.Dim_PhotoClassification c " +
    "Where p.Classification_ID = c.Classification_ID and p.Population_ID = " + population_ID + " " +
    `and p.Recorded_Datetime between '${startDate} 00:00:00' and '${endDate} 23:59:59';`;

  spotlicePool.getConnection(function(err, connection) {
    // use the connection
    connection.query(query, function(error, results, fields) {
      // And done with the connection
      connection.release();
      // Handle error after release
      if (error) {
        console.log(error);
        res.json({ failed: "Call failed", status: error });
        // connection.destroy();
      } else {
        // Connected!

        var newResults = results.map(
          // Keys expires in 8 hours
          o => {
            var params = {
              Key: o.S3ThumbnailKey,
              ResponseContentEncoding: "base64",
              ResponseContentType: "image/jpeg",
              ResponseExpires: 28800 // 8 hour expiration
            };
            var imageParams = {
              Key: o.S3Key,
              ResponseContentEncoding: "base64",
              ResponseContentType: "image/jpeg",
              ResponseExpires: 28800 // 8 hour expiration
            };

            return {
              Photo_ID: o.Photo_ID,
              Population_ID: o.Population_ID,
              Camera_ID: o.Camera_ID,
              Classification_ID: o.Classification_ID,
              Classification_Name: o.Name,
              Recorded_Datetime: o.Recorded_Datetime,
              thumbnailUrl: s3Thumbnail.getSignedUrl("getObject", params),
              imageUrl: s3Images.getSignedUrl("getObject", imageParams)
            };
          }
        );
        res.status(200).send(newResults);
        //callback(null, newResults);
      }
    });
  });
});

app.get("/spotlice/images", function(req, res) {
  var {population_ID, photo_ID} = req.apiGateway.event.queryStringParameters;
  spotlicePool.getConnection(function(err, connection) {
    // use the connection
    connection.query("SELECT S3Key FROM spotlice_dev.Fact_UnderwaterPhoto where Photo_ID = " + photo_ID + " and Population_ID = " + population_ID + ";",
      function(error, results, fields) {
        // And done with the connection
        connection.release();
        // Handle error after release
        if (error) {
          console.log(error);
          res.json({ failed: "Call failed", status: error });
          // connection.destroy();
        } else {
          // Connected!
          var imageURL = results[0].S3Key;
          //callback(null, imageURL);
          res.status(200).send(imageURL);
        }
      }
    );
  });
});

app.get("/spotlice/getImageAttribute", function(req, res){
  var {photo_ID} = req.apiGateway.event.queryStringParameters;
  var getQuery = "SELECT * FROM spotlice_dev.Fact_UnderwaterPhotoAttribute Where Photo_ID = " + photo_ID + ";";
  
  spotlicePool.getConnection(function (err, connection) {
    // use the connection
    connection.query(getQuery,
      function (error, results, fields) {
          // And done with the connection
          connection.release();
          // Handle error after release
          if (error) {
              console.log(error);
                res.json({ failed: "Call failed", status: error });
              // connection.destroy();
          } else {
              // Connected!
              //callback(null, results);
              res.status(200).send(results);
          }
      }
    )
  });
});

app.post("/spotlice/postImageAttribute", function(req, res) {
  var { 
    Photo_ID, PosX, PosY, AttributeType_ID, Attribute_Details, Attribute_Index, Comment,LiceAge_ID, LiceGender_ID, LiceType_ID, Description, LiceMobility_ID, LiceEggs_ID, Population_ID
    } = req.apiGateway.event.queryStringParameters;
    var postQuery = "INSERT INTO spotlice_dev.Fact_UnderwaterPhotoAttribute(Photo_ID, Attribute_Index, PosX, PosY, AttributeType_ID, Attribute_Details, Comment, LiceAge_ID, LiceGender_ID, LiceType_ID, Description, LiceMobility_ID, LiceEggs_ID, Inserted_Datetime, Population_ID) " +
                "Values(" + Photo_ID + "," + Attribute_Index + "," + PosX + "," + PosY + "," + AttributeType_ID + "," + Attribute_Details + "," + Comment + "," + LiceAge_ID + "," + LiceGender_ID + "," + LiceType_ID + "," + Description + "," + LiceMobility_ID + "," + LiceEggs_ID + ",NOW()," + Population_ID +");";

  spotlicePool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(postQuery, function(error, results) {
      connection.release();
      if (error) {
        //Error!
        res.status(400).send(error);
      } else {
        //Connected!
        res.status(200).send("Post was succsesfull");
      }
    });
  });
  //res.json({success: 'post call succeed! You created a counter'+ query, url: req.url, body: req.body });
});


app.post("/spotlice/deleteAttribute",function(req, res){
  var { Attribute_ID } = req.apiGateway.event.queryStringParameters;
  var deleteQuery = "DELETE FROM spotlice_dev.Fact_UnderwaterPhotoAttribute WHERE Attribute_ID = " + Attribute_ID +";";
    pool.getConnection(function (err, connection) {
      connection.query(deleteQuery,
          function (error, results, fields) {
              // And done with the connection
              connection.release();
              // Handle error after release
              if (error) {
                  console.log(error);
                  //callback("Delete mark",error);
                  res.json({ failed: "Call failed", status: error });
              } else {
                  // Connected!
                  //callback(null, "Attribute Deleted Successfully");
                  res.status(200).send("Attribute Deleted Successfully");
              }
          }
      )
  });
});

app.post("/spotlice/updateImageClassification", function(req,res){
  var { Photo_ID, Classification_ID } = req.apiGateway.event.queryStringParameters;
  // By default, the callback will wait until the event loop is empty before freezing
  // the process and returning the results to the caller
  var updateIC = "UPDATE spotlice_dev.Fact_UnderwaterPhoto SET Classification_ID = " + Classification_ID + " WHERE Photo_ID = " + Photo_ID + ";";

  pool.getConnection(function (err, connection) {
      connection.query(updateIC,
          function (error, results, fields) {
              // And done with the connection
              connection.release();
              // Handle error after release
              if (error) {
                  console.log(error);
                  //callback(error);
                  res.json({ failed: "Call failed", status: error });
              } else {
                  // Connected!
                  console.log(results);
                  //callback(null, "Updated Sucessfull!");
                  res.status(200).send("Updated Sucessfull!");
              }
          }
      )
  });
});

app.listen(3000, function() {
  console.log("App started");
});
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
