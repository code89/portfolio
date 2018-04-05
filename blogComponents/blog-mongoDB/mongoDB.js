const express = require('express')
const app = express()
const bodyparser = require('body-parser')
let mongoClient = require('mongodb').MongoClient
let fs = require('fs')
let path = require('path')
const mongoConnection = require('./mongo-connect.js')

module.exports = {

    form: function(req, res) {
      let body = req.body;
      res.set('Content-Type', 'application/json')
      mongoConnection.connect(function(err, db) {
        if (err) {
          console.log('Error', err);
          let errObj = {
            status: false,
            message: 'There was an error'
          }
          return res.send(JSON.stringify(errObj))
        }
        insertDocs(body, db, function(err, result) {
          
          if (err) {
            console.log("ERR:", err);
          }
          let query = result.ops[0]
          getData(query, db, function(err, data) {
            res.set('Content-Type', 'application/json')
            let response = { authorized:true, data};     
            res.end(JSON.stringify(response));
          })
        });
      })
    },
    view: function(req, res) {
      mongoConnection.connect(function(err, db) {
        if (err) {
          console.log('Error', err);
          let errObj = {
            status: false,
            message: 'There was an error'
          }
          return res.send(JSON.stringify(errObj))
        }
        let query = {};
        getData(query, db, function(err, data) {
          res.set('Content-Type', 'application/json')
          let response = { authorized:true, data };
          console.log('r', response);
          
          res.end(JSON.stringify(response));
        })
      })
    },
    remove: function(req, res) {
      let body = req.body;
      console.log('remove', body);
      res.set('Content-Type', 'application/json')
      mongoConnection.connect(function(err, db) {
        if (err) {
          console.log('Error', err);
          let errObj = {
            status: false,
            message: 'There was an error'
          }
          return res.send(JSON.stringify(errObj))
        }
        removeData(body, db, function(err, result) {
          if (err) {
            console.log("ERR:", err);
          }
          let query = {}
          getData(query, db, function(err, data) {
            res.set('Content-Type', 'application/json')
            let json = JSON.stringify(data)
            console.log('get data', json);
            res.send(json)
          })
        });
      })
    }
  }
  
  
  const getData = function(query, db, callback) {
    let collection = db.collection('inputs')
    let projection = {
      _id: 0
    }
    collection.find(query, {
      'projection': projection
    }).toArray(function(err, result) {
      if (err) {
        return callback(err)
      }
      console.log(result);
      callback(null, result)
    })
  }
  
  const insertDocs = function(data, db, callback) {
    let collection = db.collection('inputs')
    collection.insert(data, function(err, result) {
      if (err) {
        console.log('Error inserting collection...' + err);
      }
      console.log('Data inserted!');
      callback(null, result)
    })
  }
  
  const removeData = function(data, db, callback) {
    let collection = db.collection('inputs')
    collection.deleteOne(data, function(err, result) {
      if (err) {
        console.log('Error removing collection...' + err);
      }
      console.log(result);
      callback(null, result)
    })
  }
  