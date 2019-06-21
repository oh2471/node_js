var express = require("express");
var router = express.Router(); // 
var mysql = require("mysql");
var fs = require("fs");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var app = express();

// app.set("views"+__dirname+"/views");

router.use(bodyParser.urlencoded({ extended: false }));
//게시판 페이징

router.get("/list/:cur", function(req, res) {
   //페이지당 게시물 수 : 한 페이지 당 10개 게시물
   var page_size = 10;
   //페이지의 갯수 : 1 ~ 10개 페이지
   var page_list_size = 10;
   //limit 변수
   var no = "";
   //전체 게시물의 숫자
   var totalPageCount = 0;
 
   var queryString = "select count(*) as cnt from post where status=0";
   getConnection().query(queryString, function(error2, data) {
     if (error2) {
       console.log(error2 + "메인 화면 mysql 조회 실패");
       return;
     }
     //전체 게시물의 숫자
     totalPageCount = data[0].cnt;
 
     //현제 페이지
     var curPage = req.params.cur;
  
     //전체 페이지 갯수
     if (totalPageCount < 0) {
       totalPageCount = 0;
     }
 
     var totalPage = Math.ceil(totalPageCount / page_size); // 전체 페이지수 1500/10
     var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
     var curSet = Math.ceil(curPage / page_list_size); // 현재 셋트 번호
     var startPage = (curSet - 1) * 10 + 1; //현재 세트내 출력될 시작 페이지
     var endPage = startPage + page_list_size - 1; //현재 세트내 출력될 마지막 페이지

     //현재페이지가 0 보다 작으면
     if (curPage < 0) {
       no = 0;
     } else {
       //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
       no = (curPage - 1) * 10;
     }
 
 
     var result2 = {
       curPage: curPage, // 현재페이지
       page_list_size: page_list_size, // 현재 페이지 셋
       page_size: page_size, // 페이지 사이즈
       totalPage: totalPage,
       totalSet: totalSet,
       curSet: curSet,
       startPage: startPage,
       endPage: endPage
     };
 
     fs.readFile("list.html", "utf-8", function(error, data) {
       if (error) {
         console.log("ejs오류" + error);
         return;
       }
 
       var queryString = "select * from post where status=0 order by id desc limit ?, ?";
       getConnection().query(queryString, [no, page_size], function(
         error,
         result
       ) {
         if (error) {
           console.log(error);
           return;
         }
         
         console.log(result);
         //RESPONSE 
         res.send(
           ejs.render(data, {
             data: result,
             list: result2
           })
         );
       });
     });
   });
 });


router.get("/", function(req,res){
   console.log("메인화면");
   res.redirect('/list/1');
});

// 글쓰기 페이지를 로드 하는 요청을 처리
router.get("/insert", function(req, res){
   fs.readFile("insert.html", "utf-8", function(err, data){
      res.send(ejs.render(data));
   });
});


// 글쓰기폼에서 요청된 데이터를 DB에 입력하는 요청을 처리
router.post('/insert', function(req, res){
   var title = req.body.title;
   var content = req.body.contents;

   var queryString = 'insert into post (title, content) values (?, ?)';
   getConnection().query(queryString, [title, content], function(err, data){
      if (err){
         console.log("insert error : " + err);
      }
      res.redirect('/list/'+1);
   });
});


router.get('/edit/:id', function(req, res){
   var id = req.params.id;
  
   var queryString = "select * from post where id=?";
   
   getConnection().query(queryString,[id], function(err, data){
      console.log(data);
      var result = data[0];
      fs.readFile('edit.html', 'utf-8', function(err, data){
         if (err){
            console.log('파일 에러');
         }
         res.send(ejs.render(data, {
            data: result,
         }))
      });
   });
});


router.get("/delete/:id", function(req, res){
  var id = req.params.id;
  var queryString = "delete from post where id=?"

  getConnection().query(queryString,[id], function(err,data){
    if(err){
      console.log(err);
    }
    res.redirect("/list/1");
  });
});

router.get("/detail/:id", function(req,res){
  var id = req.params.id;
  var queryString = " select * from post where id=?";

  getConnection().query(queryString,[id],function(err,data){
    if(err){
      console.log(err);
    }

    var result = data[0];

    fs.readFile("detail.html",'utf-8',function(err,data){
      if (err){
        console.log(err);
      }
      res.send(ejs.render(data,{
        data : result
      }));
    });
    
  });
});


// MYSQL 연결
var connection = mysql.createPool({
  connectionLimit: 10,
  host: 'testdb.c7jvf9ub2zap.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  database: 'board',
  password: 'root1234'
});
 
 //디비 연결 함수
 function getConnection() {
   return connection;
 }


 module.exports = router;
