
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

const multer = require('multer');

var index  = 1;
var file_to_be_proc = ''
var file_to_be_proc2
var did = 0;
var fresAr = new Array();
var str ='';


var bodyParser = require('body-parser');

var fs = require('fs');
var util = require('util');
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
};

var imgfilename="nothing";
var pdflength = 0;


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload');
  },
  filename: function (req, file, cb) {
    file_to_be_proc = 'sheet' + did.toString()  + '.' + file.fieldname;
    cb(null,  file_to_be_proc );
    
  }
})

var storageb = multer.diskStorage({
  destination: function(req, files, cb){
    cb(null, 'upload');
  },
  filename: function (req, files, cb){
   // console.log(req.files[0].size);
    file_to_be_proc2 = 'sheet' + did.toString() +'-' + index.toString()  + '.' + files.fieldname;
    cb(null,  file_to_be_proc2 );
    index= index + 1;
  }
})
var upload = multer({ storage: storage })


var uploadb = multer({ storage:storageb })
app.use(express.static('images'));

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended:true
}));

app.listen(port, () => console.log(`Express server listening on port ${port}!`));



var logFile = fs.createWriteStream('response.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

var ocrFile = fs.createWriteStream('coord.txt', {flags: 'a'});

var ansFile = fs.createWriteStream('answerkey.txt', {flags: 'a'});

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
writeans = function(){
  ansFile.write(util.format.apply(null, arguments) + ' ');
}

function openFile(req, res){

  const { spawn } = require("child_process");
  var file_to_be_opened = 'upload/' + file_to_be_proc;
  str = did.toString();

  console.log("python has started working");
  console.log(file_to_be_opened + ' ' + str);
  var pyProcess = spawn("python", ["pdf2img.py",file_to_be_opened, str]);

  pyProcess.stdout.setEncoding("utf8");

  pyProcess.stdout.on("data", data => {
    console.log(data);
  var img = data.toString();

  var imgAr = img.split('\n');

  pdflength = imgAr.length - 2;

  imgfilename = imgAr[imgAr.length-2];

  console.log("imgfilename: " + imgfilename);  
  console.log("img " + img);

  res.send({
    status: true,

    length: imgAr.length-2,

    imgArr: imgAr,

  });

});
console.log("python has stopped");
}
function startprocess(req, res){
  const {spawn} = require("child_process");
  for(var i = 1; i<index; i++){
    var file_to_be_opened2 ='upload/' + 'sheet' + did.toString() + '-' + i.toString() + '.pdf';
    console.log("file_to_be_opened2: " + file_to_be_opened2);
    console.log(" pdf2img.py  working ");
    //console.log('2: ' + 'images/' + imgfilename);
    //console.log('2.5 : ' + did.toString() + '-' + i.toString() + '0001-' + ' 3: '+ pdflength);
    var pyProcess = spawn("python", ["pdf2img.py",file_to_be_opened2, did.toString() + '-' + i.toString()]);
  }
  res.send({
    status:true,
    msg:"image conversion complete",
  })
}
function startml2(req, res){
  const {spawn} = require("child_process");
  fresAr = [];
  for(var  i = 1; i<index ; i++){
    var imgpath2 = "images/" + did.toString() + '-' + i.toString() + '0001-';
    console.log("imgpath2: " + imgpath2);
    var pyProcess = spawn("python", ["ocr2.py", imgpath2, i.toString()]);
    pyProcess.stdout.setEncoding("utf8");

    pyProcess.stdout.on("data", data => {
      console.log(data.toString());
      ansstr = data.toString();
      ansAr = ansstr.split('\n');
      fresAr.push(ansAr);
      console.log("ML Complete2");
    });
  }
  console.log(fresAr);
  res.send({
    status: true,
    no: index - 1,
    msg:"call array of arrays",
  })
}

function startapp(req, res){
  const { spawn } = require("child_process");
  var pyProcess = spawn("python", ["clean.py"]);
  res.send({
    status:true,
    msg:"cleaned" ,
  });
}

function setdate(req, res){
  did = Date.now();
  index = 1;
  console.log("date set");
  res.send({
    status:true,
    msg:"date has been set",
  });
}
function fetchar(req, res){
  console.log(fresAr);
  res.send({
    newar:fresAr,
  })
}
function align(req, res){
const exec = require("child_process").execSync;

  for(i = 1; i<index ; i++){
    console.log("Alignment Starts");
    var s = "images/";
    var string_to_be_passed = " ";
    var t = str + '0001-';
    string_to_be_passed = s + t + ' ' + s + did.toString() + "-" + i.toString() + "0001-" +" "+ pdflength.toString();
    console.log(string_to_be_passed);
    var pyProc  = exec("python feat-align.py " + string_to_be_passed);
    console.log(pyProc.toString("utf8"));
  }
  res.send({
    status:true,
    msg:"Align Complete",
  })
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
  write1('qtype: ', formData.qtype);
  write1(')');
  write2();

  write11(formData.page);
  write11(((formData.xref11*1653)/840 + 5).toFixed(0));
  write11(((formData.yref11*2337)/990 + 5).toFixed(0));
  write11(((formData.xref21*1653)/840 - 5).toFixed(0));
  write11(((formData.yref21*2337)/990 - 5).toFixed(0));
  write11(formData.qtype);
  write21();

  writeans(formData.ans);

  console.log('succesful post');
  res.send({
    status: true,
  });

});

app.post('/upload', upload.single('pdf'), (req, res) =>{
console.log('upload successful');
res.send({
    status: true,
    message: 'successful upload',
  });
}); 

app.post('/uploadmultiple', uploadb.array('pdf'), (req, res)=>{
  console.log("bulk upload successful");
  res.send({
    status:true,
    msg:"bulk upload successful..processing may start",
  });
});

app.get('/align', align);
app.get('/fetchar', fetchar);
app.get('/startprocess', startprocess);
app.get('/startml2', startml2);
app.get('/process', openFile);
app.get('/startapp', startapp);
app.get('/', (req, res) => res.send('You are being redirected to the FrontEnd!<meta http-equiv="Refresh" content="1;url=http://localhost:4200">'));
app.get('/upload', (req, res) => res.send('Access Restricted: Contact Sarthak Rout or Naman Gupta'));
app.get('/setdate', setdate);