var express = require('express');
var router = express.Router();
var firebaseAdminDB = require("../connection/fireBase_admin"); // env connect firebase 但隱藏鑰匙

//測試 env　有連線上
/*const ref = firebaseAdminDB.ref('any');
ref.once('value',function(snapshot){
  console.log(snapshot.val());
})*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});
router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});
/* //轉dashboard.js
router.get('/dashboard/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/dashboard/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});
router.get('/dashboard/categories', function(req, res, next) {
  res.render('dashboard/categories', { title: 'Express' });
});
*/

module.exports = router;
