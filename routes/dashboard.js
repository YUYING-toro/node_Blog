var express = require('express');
var router = express.Router();
//archieve show article cards
var moment = require('moment');
var striptags = require('striptags');

var firebaseAdminDB = require("../connection/fireBase_admin"); 
var categoriesRef = firebaseAdminDB.ref('/categories');
var articlesRef = firebaseAdminDB.ref('/articles');

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
  let categories ={};
  categoriesRef.once('value').then(function(snapshot){ 
    categories = snapshot.val();  //id: '-MrykWiPvwWyYp4H6yfV', name: '12', path: '12'
     return articlesRef.child(id).once('value'); 
  }).then(function(snapshot){ 
    const article = snapshot.val();
    res.render('dashboard/article', { 
      title: 'Express',
      categories,
      article
     });
  })
})
router.post('/article/create', function(req, res) {
  const data = req.body;
  const articleRef = articlesRef.push();
  const key = articleRef.key; // article uniqle num
  const updateTime = Math.floor(Date.now()/1000);
  data.id = key;
  data.time = updateTime;
  articleRef.set(data).then(function(){
    res.redirect(`/dashboard/archives`);
  })  
})
router.post('/article/update/:id', function(req, res) {
  console.log("update");
  const data = req.body;
  const id = req.param('id');
  const updateTime = Math.floor(Date.now()/1000);
  data.time = updateTime;
  articlesRef.child(id).update(data).then(function(){
    res.redirect(`/dashboard/archives`);
  })  
})
router.get('/archives', function(req, res) {    
  const status = req.query.status || 'public';  // 77
  let categories = {}; 
  categoriesRef.once('value').then(function(snapshot){
    categories = snapshot.val();  
    return articlesRef.orderByChild('time').once('value'); 
  }).then(function(snapshot){
    const articles = [];
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
  res.send("Delete Successfully");
  res.end();
})
router.get('/categories', function(req, res, next) {
  const messageFromSession = req.flash('info');
  categoriesRef.once('value',function(snapshot){
    const categories = snapshot.val(); 
    res.render('dashboard/categories', { 
      title: 'Express',
      message : messageFromSession,
      hasInfo : messageFromSession.length > 0,  
      categories
     });
  })  
});
router.post('/categories/create', function(req, res) {
  var data = req.body;
  const categoryRef = categoriesRef.push();
  data.id = categoryRef.key ; 
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
  .then(function(snapshot){
    if(snapshot.val() !== null){
      req.flash('info'," You have this caterory name.")
      res.redirect('/dashboard/categories');
    }else{      
      categoryRef.set(data).then(function(){
        res.redirect('/dashboard/categories');
      })
    }
  })
});
//delete
router.post('/categories/delete/:id', function(req, res) {
  //crab id
  var id = req.param("id");
  categoriesRef.child(id).remove();
  req.flash('info',"You have deleted successfully")
  res.redirect('/dashboard/categories');
})
module.exports = router;
