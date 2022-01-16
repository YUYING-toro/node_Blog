var express = require('express');
var router = express.Router();
const pagination = require('../partial_controller/pagination') //37

//archieve show article cards
var moment = require('moment');
var striptags = require('striptags');
var firebaseAdminDB = require("../connection/fireBase_admin"); 
var categoriesRef = firebaseAdminDB.ref('/categories');
var articlesRef = firebaseAdminDB.ref('/articles');

router.get('/', function(req, res, next) {
    let categories = {}; 
    categoriesRef.once('value').then(function(snapshot){
      categories = snapshot.val();  
      return articlesRef.orderByChild('time').once('value'); 
    }).then(function(snapshot){
      const articles = [];
      snapshot.forEach(function(snapshotChild){
        if(snapshotChild.val().status === 'public'){  
          articles.push(snapshotChild.val())
        }      
      })
      articles.reverse() ; //array func
      const currentPage = Number.parseInt(req.query.page) || 1; 
      const data =pagination(articles,currentPage);
     
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
router.get('/post/:id', (req, res) => {
  const id = req.param('id');
  let categories = {};
  categoriesRef.once('value').then((snapshot) => {
    categories = snapshot.val();
    return articlesRef.child(id).once('value');
  }).then((snapshot) => {
    console.log(snapshot.val());
    const article = snapshot.val();
    if (!article) {
      return errorPage(res, 'Not found!!');
    }
    res.render('post', {
      title: 'Express',
      categoryId: null,
      article,
      categories,
      moment, // Time plug-in
    });
  });
});
router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
