
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

const multer = require('multer');

var index  = 1;
var index2 = 1;
var file_to_be_proc
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/upload');
  },
  filename: function (req, file, cb) {
  	file_to_be_proc = 'sheet' + Date.now()  + '.' + file.fieldname;
    cb(null,  file_to_be_proc );
    index= index + 1;
  }
})
app.use(express.static('images'));
var upload = multer({ storage: storage })
var bodyParser = require('body-parser');

var fs = require('fs');
var util = require('util');
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
	extended:true
}));

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/upload', (req, res) => res.send('Access Restricted: Contact Sarthak Rout'));
app.listen(port, () => console.log(`Express server listening on port ${port}!`));



var logFile = fs.createWriteStream('D:/response.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

var ocrFile = fs.createWriteStream('D:/coord.txt', {flags: 'a'});

console.log = function () {
  
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
write1 = function(){
  logFile.write(util.format.apply(null, arguments) + ' ');
}
write11 = function(){
  ocrFile.write(util.format.apply(null, arguments) + ' ');
}
write2 = function(){
	logFile.write('\n');
}
write21 = function(){
  ocrFile.write('\n');
}
app.post('/', upload.none(),  (req, res) => {
  const formData = req.body;
  write1('(');
  write1('roll:',formData.roll);
  write1('xref11: ', formData.xref11);
  write1('yref11: ', formData.yref11);
  write1('xref21: ', formData.xref21);
  write1('yref21: ', formData.yref21);
  write1('ans: ', formData.ans);
  write1(')');
  write2();

  write11(formData.page);
  write11(((formData.xref11*1653)/700 + 10).toFixed(0));
  write11(((formData.yref11*2337)/990 + 10).toFixed(0));
  write11(((formData.xref21*1653)/700 - 10).toFixed(0));
  write11(((formData.yref21*2337)/990 - 10).toFixed(0));
  write21();

  console.log('succesful post');
  res.send({
  	status: true,
  });

});

var imgfilename="null";
var pdflength = 0;

function openFile(req, res){

	const { spawn } = require("child_process");

var file_to_be_opened = 'D:/upload/' + file_to_be_proc;
var str =index2 + ''

console.log("python has started working");

var pyProcess = spawn("python", ["D:/pdf2img.py",file_to_be_opened, str]);

index2 = index2 + 10;



pyProcess.stdout.setEncoding("utf8");

pyProcess.stdout.on("data", data => {

  var img = data.toString();

  var imgAr = img.split('\n');

  pdflength = imgAr.length - 2;

  imgfilename = imgAr[imgAr.length-2]

  console.log(imgfilename);  console.log(img);

  res.send({
  	status: true,

    length: imgAr.length-2,

    imgArr: imgAr,

  });

});

console.log("python has stopped");
}

function startML(req, res){
  const { spawn } = require("child_process");

  var imgindex = 0;
  if(imgfilename=="null"){
    res.send({

      status:false,

      message: "No file has been uploaded",

    });
  }

    var imgpath = "D:/images/" + imgfilename.substring(0, imgfilename.length -1 );

    console.log(imgpath);

    var pyProcess = spawn("python", ["D:/ocr2.py",imgpath]);
    pyProcess.stdout.setEncoding("utf8");

    pyProcess.stdout.on("data", data => {
      console.log(data);

      ansstr = data.toString();

      ansAr = ansstr.split('\n');

      res.send({
        AnsAr:ansAr,
      });

    });
  console.log("reached here");
}


app.post('/upload', upload.single('pdf'), (req, res) =>{
console.log('upload successful');
res.send({
  	status: true,
  	message: 'successful upload',
  });
});
function startapp(req, res){
  const { spawn } = require("child_process");
  var pyProcess = spawn("python", ["D:/clean.py"]);
  res.send({
    status:true,
    msg:"cleaned" ,
  });
}
app.get('/process', openFile);
app.get('/startml', startML);
app.get('/startapp', startapp);