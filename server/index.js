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


// POST method route
app.post('/api/compile', function (req, res) {
  if (req.body && req.body.code) {
    let currentFile = shortid.generate();
    exec(`mkdir compiled/${currentFile}`, (error, stdout, stderr) => {
      //report errors
      if (error) { res.send(JSON.stringify({ error: `error: ${error.message}` })); return; }
      if (stderr) { res.send(JSON.stringify({ error: `stderr: ${stderr}` })); return; }

      fs.writeFile(`compiled/${currentFile}/code.bgl`, req.body.code, function (err) {
        if (err) { res.send(JSON.stringify({ error: `error: ${err}` })); return; }
      }); 

      exec(`cd BottomUp/ && cabal new-exec BottomUp ../compiled/${currentFile}/code.bgl ; cp Output* ../compiled/${currentFile}/ ;  cd ..`, (error, stdout, stderr) => {    
        //report errors
        if (stdout) { res.send(JSON.stringify({ error: `stdout: ${stdout}` })); return; }
        if (error) { res.send(JSON.stringify({ error: `error: ${error.message}` })); return; }
        if (stderr) { res.send(JSON.stringify({ error: `stderr: ${stderr}` })); return; }


        res.status(201).send(JSON.stringify({ programID:`${currentFile}` }));
      });
    });
  } else {
    res.status(400).send({
      error: "Missing code body" + JSON.stringify(req.body)
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