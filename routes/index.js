var express = require('express');
var router = express.Router();

//archieve show article cards
var moment = require('moment');
var striptags = require('striptags');
var firebaseAdminDB = require("../connection/fireBase_admin"); // env connect firebase 但隱藏鑰匙; exports= firebaseAdmin.database();
var categoriesRef = firebaseAdminDB.ref('/categories');
var articlesRef = firebaseAdminDB.ref('/articles');

//測試 env　有連線上
/*const ref = firebaseAdminDB.ref('any');
ref.once('value',function(snapshot){
  console.log(snapshot.val());
})*/

/* GET home page. 同 dashboard/archievs */
router.get('/', function(req, res, next) {
    //取得目錄 與 文章串
    let categories = {}; 
    categoriesRef.once('value').then(function(snapshot){
      categories = snapshot.val();  
      return articlesRef.orderByChild('time').once('value'); //由舊到新 
    }).then(function(snapshot){
      const articles = [];//因為要做分頁 所以改為陣列  
      snapshot.forEach(function(snapshotChild){
        if(snapshotChild.val().status === 'public'){  //首頁僅顯示 公開文章
          articles.push(snapshotChild.val())
        }      
      })
     articles.reverse() ; //array func
      res.render('dashboard/archives', { 
        title: 'Express',
        articles,
        categories,
        striptags,
        moment
      });
    })
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
