var express = require('express');
var router = express.Router();
const pagination = require('../partial_controller/pagination') //37

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
      //分頁
      const currentPage = Number.parseInt(req.query.page) || 1; // 用querystring 抓當前頁數
      const data =pagination(articles,currentPage);
      /*const totalResult = articles.length;
      const prepage = 3; // each page has three articles
      const pageTotal = Math.ceil(totalResult/prepage);
      const currentPage = Number.parseInt(req.query.page) || 1; // 用querystring 抓當前頁數
      if(currentPage > pageTotal)
        currentPage = pageTotal
        //假設 每頁顯示三筆，若在第二頁  則取得第四~六筆文章開始
      var minItem = (currentPage *prepage) - prepage +1; //4, 7 
      var maxItem = (currentPage * prepage);
      const data = [];
        // 重新載特定區間文章
      articles.forEach(function(item,index){
        let itemNum = index + 1; //index 由零開始，但文章 line 39 由 索引一號開始
        if(itemNum >= minItem && itemNum <= maxItem ){
          data.push(item);
        }
      })
      const page = {
        pageTotal,
        currentPage,
        hasPre : currentPage > 1,  //do btn disabled
        hasNext : currentPage < pageTotal
      }*/
      //分頁 結束；下面 L27 由新到舊 > 網頁面傳資料
     
      res.render('index', { 
        title: 'Express',
        articles: data.data,
        categories,
        striptags,
        moment,
        page: data.page
      });
    })
});
router.get('/post/:id', function(req, res, next) {  //same dashBoard.js > router.get('/article/:id'
  var id = req.param("id");  
  console.log(id);
  let categories ={};
  categoriesRef.once('value').then(function(snapshot){
    categories = snapshot.val();  
     return articlesRef.child(id).once('value'); 
  }).then(function(snapshot){ 
    const article = snapshot.val();
    if(!article){
      return res.render('error', { // 使用 return 直行至此
        title : "沒有此文",
        categories: {},
        article: {}
      })
    }else{
      console.log(article);
    }
    res.render('post', { 
      title: 'Express',
      categories,
      article
     });
  })
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
