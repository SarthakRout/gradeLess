
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

var logFile = fs.createWriteStream('response.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
write1 = function(){
  logFile.write(util.format.apply(null, arguments) + ' ');
}
write2 = function(){
	logFile.write('\n');
}
app.post('/', upload.none(),  (req, res) => {
  const formData = req.body;
  write1('xref11: ', formData.xref11);
  write1('yref11: ', formData.yref11);
  write1('type: ', formData.qtype);
  write1('roll:',formData.roll);
  write2();
  console.log('succesful post');
  res.send({
  	status: true,
  });

});

function openFile(req, res){
	const { spawn } = require("child_process");
var file_to_be_opened = 'D:/upload/' + file_to_be_proc;
var str =index2 + ''
console.log("python has started working");
var pyProcess = spawn("python", ["D:/pdf2img.py",file_to_be_opened, str]);
index2 = index2 + 10;

pyProcess.stdout.setEncoding("utf8");
pyProcess.stdout.on("data", data => {
  console.log(data.toString());
  res.send({
  	pyoutput: (JSON.stringify(data)),
  	status: true,
  });
});
console.log("python has stopped");
}

app.post('/upload', upload.single('pdf'), (req, res) =>{
console.log('upload successful');
res.send({
  	status: true,
  	message: 'successful upload',
  });
});

app.get('/process', openFile);