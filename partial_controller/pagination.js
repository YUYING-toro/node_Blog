const convertPagination = function(articleData,currentPage){
    const totalResult = articleData.length;
      const prepage = 3; // each page has three articleData
      const pageTotal = Math.ceil(totalResult/prepage);
      
      if(currentPage > pageTotal)
        currentPage = pageTotal
        //假設 每頁顯示三筆，若在第二頁  則取得第四~六筆文章開始
      var minItem = (currentPage *prepage) - prepage +1; //4, 7 
      var maxItem = (currentPage * prepage);
      const data = [];
        // 重新載特定區間文章
      articleData.forEach(function(item,index){
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
      }
      return {
          page,data
      }
}

module.exports = convertPagination;