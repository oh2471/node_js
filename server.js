

var express = require('express'); //express 패키지를 사용하기 위해 모듈을 로딩합니다.

var app = express();

var bodyParser = require('body-parser');

var mainRouter = require('./router/main'); //라우터 모듈인 main.js 를 불러와서 app 에 전달해줍니다.


app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended : false}));

app.use(mainRouter);




// app.set('views', __dirname + '/views'); //express 서버가 읽을 수 있도록 렌더링 HTML 의 위치를 정의해줍니다.

// app.set('view engine', 'ejs'); // express 서버가 HTML 렌더링을 할 때, EJS 엔진을 사용하도록 설정합니다.

// app.engine('html', require('ejs').renderFile); //express 서버가 HTML 렌더링을 할 때, EJS 엔진을 사용하도록 설정합니다.


app.listen(3000, function(){

   console.log("Express server has started on port 3000")

});


// var mysql      = require('mysql');

// var connection = mysql.createConnection({

//  host     : 'testdb.c7jvf9ub2zap.ap-northeast-2.rds.amazonaws.com',

//  user     : 'root',

//  password : 'root1234',

//  port     : 3306 ,

//  database : 'board'

// });


// connection.connect();


// connection.query('SELECT * from post', function(err, rows, fields) {

//  if (!err)

//    console.log('The solution is: ', rows);

//  else

//    console.log('Error while performing Query.', err);

// });

// connection.end();

