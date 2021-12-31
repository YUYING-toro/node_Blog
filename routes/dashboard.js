var express = require('express');
var router = express.Router();
//archieve show article cards
var moment = require('moment');
var striptags = require('striptags');

var firebaseAdminDB = require("../connection/fireBase_admin"); // env connect firebase 但隱藏鑰匙; exports= firebaseAdmin.database();
var categoriesRef = firebaseAdminDB.ref('/categories');
var articlesRef = firebaseAdminDB.ref('/articles');

/* GET users listing. */
//抓總分類目錄
router.get('/article/create', function(req, res) {
  categoriesRef.once('value').then(function(snapshot){
    const categories = snapshot.val(); 
    res.render('dashboard/article', { 
      title: 'Express',
      categories
     });
  })  
});
router.get('/article/:id', function(req, res) { 
  var id = req.param("id");
  // console.log(id);
  let categories ={};
  categoriesRef.once('value').then(function(snapshot){ // 取得文章類別
    categories = snapshot.val();  //id: '-MrykWiPvwWyYp4H6yfV', name: '12', path: '12'
    //snapshot send to html
     return articlesRef.child(id).once('value'); // 用id 快照文章 再 撈取 用 once(value).then(function) 避免層層包疊 
  }).then(function(snapshot){ //快照該id 找到的文章
    const article = snapshot.val();
    // console.log(article);

    res.render('dashboard/article', { 
      title: 'Express',
      categories,
      article
     });
  })
})
router.post('/article/create', function(req, res) {
  // console.log(req.body);  //{title: '123',  content: '<p>23</p>\r\n',  category: '-L2TajOWL1ycB_hwyiK-'}
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key; // article uniqle num
  const updateTime = Math.floor(Date.now()/1000);
  data.id = key;
  data.time = updateTime;
  articleRef.set(data).then(function(){
    // res.redirect(`/dashboard/article/${key}`);
    res.redirect(`/dashboard/archives`);

  })  
})
router.post('/article/update/:id', function(req, res) {
  const data = req.body;
  const id = req.param('id');
  const updateTime = Math.floor(Date.now()/1000);
  data.time = updateTime;
  articlesRef.child(id).update(data).then(function(){
    res.redirect(`/dashboard/article/${id}`);
  })  
})
//顯示文章列表
router.get('/archives', function(req, res) {    
  //控制 "草稿" 及 "公開" 文章 > '/archives? status = public
  const status = req.query.status || 'public';  // 77

  //取得目錄 與 文章串
  let categories = {}; 
  categoriesRef.once('value').then(function(snapshot){
    categories = snapshot.val();  
    // console.log(categories);
    return articlesRef.orderByChild('time').once('value'); //由舊到新 
  }).then(function(snapshot){
    const articles = [];//因為要做分頁 所以改為陣列  
    snapshot.forEach(function(snapshotChild){
      if(snapshotChild.val().status === status){
        articles.push(snapshotChild.val())
      }      
    })
   articles.reverse() ; //array func
    res.render('dashboard/archives', { 
      title: 'Express',
      articles,
      categories,
      striptags,
      moment,
      status
    });
  })
});
//delete
router.post('/article/delete/:id', function(req, res) {
  const id = req.param("id");
   console.log("delete id is "+ id);
  articlesRef.child(id).remove();
  req.flash('info',"You have deleted successfully")
 // res.redirect('/dashboard/categories'); //用ajax 刪除 因此用 res.send("data")傳資料 、 end()結束
  res.send("文章已刪除");
  res.end();
})

router.get('/categories', function(req, res, next) {
  //retrive post delete flash 我有載入套件connect-flash & express-session
  const messageFromSession = req.flash('info');  // line 46 flash('info'," You have deleted successfully.") 得字串
  //retrive create categories 
  categoriesRef.once('value',function(snapshot){
    const categories = snapshot.val();  //id: '-MrykWiPvwWyYp4H6yfV', name: '12', path: '12'
    //snapshot send to html
    res.render('dashboard/categories', { 
      title: 'Express',
      message : messageFromSession,
      hasInfo : messageFromSession.length > 0,  // html 判斷有無資料
      categories
     });
  })
  
});
router.post('/categories/create', function(req, res) {
  // console.log(req.body);
  var data = req.body; // array
  const categoryRef = categoriesRef.push(); // 路徑 root/categories/亂碼 {id:亂碼, mame~, path~ } // push 會產亂碼 此亂碼可用 key取用
  // console.log(categoryRef.key); //!!!!!!!!!!!!!!!!!!!!! 取得亂碼
  data.id = categoryRef.key ; //array add one more data
//判斷有無此已創建此目錄名稱
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
  .then(function(snapshot){
    if(snapshot.val() !== null){
      // 有撈取相同
      req.flash('info'," You have this caterory name.")
      res.redirect('/dashboard/categories');
    }else{
      
      categoryRef.set(data).then(function(){
        // res.require('/dashboard/categories');
        res.redirect('/dashboard/categories');
      })
    }
  })

});
//delete
router.post('/categories/delete/:id', function(req, res) {
  //crab id
  var id = req.param("id");
  // console.log("id is "+ id);
  categoriesRef.child(id).remove();
  req.flash('info',"You have deleted successfully")
  res.redirect('/dashboard/categories');
})

module.exports = router;
