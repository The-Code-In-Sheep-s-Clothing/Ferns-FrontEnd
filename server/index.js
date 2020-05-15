const express = require('express');
const bodyParser = require('body-parser');
const { exec, spawn } = require("child_process");
const pino = require('express-pino-logger')();
var fs = require('fs');
const shortid = require('shortid');
shortid.seed(1476245624);
const app = express();
app.use(bodyParser.json());
app.use(pino);

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.post('/api/code', function(req, res){
  if(req.body && req.body.id){
      //check if id is valid
      let currentFile = req.body.id;
      if(currentFile == "" || !fs.existsSync(`compiled/${currentFile}/code.bgl`)){
        res.status(400).send({
          error: "ID does not exist: " + JSON.stringify(req.body.id)
        });
        return;
      }

      fs.readFile(`compiled/${currentFile}/code.bgl`, (err, data) => {
        if (err) {
          res.status(400).send({
            error: err.toString()
          });
          return;
        }
        res.status(201).send(JSON.stringify({ code: data.toString() }));
      });
  }
  else{
    res.status(400).send({
      error: "ID does not exist: " + JSON.stringify(req.body.id)
    });
  }
});

// POST method route
app.post('/api/compile', function (req, res) {
  if (req.body && req.body.code) {
    let currentFile = shortid.generate();
    if(req.body.id && /^[a-z0-9]$/.test(req.body.id)){
      currentFile = req.body.id;
    }
    
    if(!fs.existsSync(`compiled/${currentFile}`)){
      fs.mkdir(`compiled/${currentFile}`, (err) => {
        if (err) {res.send(JSON.stringify({ programID:`${currentFile}`, error: `error: ${err}` })); return;};
      });
    }

    fs.writeFile(`compiled/${currentFile}/code.bgl`, req.body.code, function (err) {
      if (err) { res.send(JSON.stringify({ programID:`${currentFile}`, error: `error: ${err}` })); return; }
    }); 

    exec(`cd BottomUp/ && cabal new-exec BottomUp ../compiled/${currentFile}/code.bgl ; cp Output* ../compiled/${currentFile}/ ;  cd ..`, (error, stdout, stderr) => {    
      //report errors
      if (stdout) { res.send(JSON.stringify({ programID:`${currentFile}`, error: `stdout: ${stdout}` })); return; }
      if (error) { res.send(JSON.stringify({ programID:`${currentFile}`, error: `error: ${error.message}` })); return; }
      if (stderr) { res.send(JSON.stringify({ programID:`${currentFile}`, error: `stderr: ${stderr}` })); return; }


      res.status(201).send(JSON.stringify({ programID:`${currentFile}` }));
    });
  } else {
    res.status(400).send({
      error: "Empty request body" + JSON.stringify(req.body)
    });
  }
});

io.on("connection", (socket) => {  
  console.log("a user connected");
  var proc = null;

  socket.on("data", (msg) => {
    if(proc){
      proc.stdin.write(msg + "\n", ()=>{});
    }
    else{
      socket.emit('data', "No program running -- please run a program before sending commands\n");
    }
  });

  socket.on("id", (id) => {
    console.log(JSON.stringify(id));
    if(proc){
      proc.kill();
    }
    if(!(fs.existsSync(`compiled/${id}`)) || id == ""){
      socket.emit('data', "Not a valid Program ID\n");
      return;
    }
    proc = spawn('ghci', ['OutputCode.hs'], {cwd: `compiled/${id}`});
    setTimeout(function(){ if(proc) proc.kill()}, 3600000);
  
    proc.stdout.on('data', (data) => {
      socket.emit('data', data.toString());
    });
    
    proc.stderr.on('data', (data) => {
      socket.emit('data', data.toString());
    });
    
    proc.on('exit', (code) => {
      socket.emit('data', 'Process was terminated\n');
      socket.disconnect();
    });
  });
  
  socket.on("disconnect", () => {
    if(proc){
      proc.kill();
    }
    console.log("user disconnected");
  });
});




http.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);