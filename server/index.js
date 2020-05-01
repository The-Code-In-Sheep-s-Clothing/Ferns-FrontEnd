const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
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
      if (error) { res.send(JSON.stringify({ greeting: `error: ${error.message}` })); return; }
      if (stderr) { res.send(JSON.stringify({ greeting: `stderr: ${stderr}` })); return; }

      fs.writeFile(`compiled/${currentFile}/code.bgl`, req.body.code, function (err) {
        if (err) { res.send(JSON.stringify({ greeting: `error: ${err}` })); return; }
      }); 



      exec(`cd BottomUp/ && cabal new-exec BottomUp ../compiled/${currentFile}/code.bgl ; cp Output* ../compiled/${currentFile}/ ;  cd ..`, (error, stdout, stderr) => {    
        //report errors
        if (error) { res.send(JSON.stringify({ greeting: `error: ${error.message}` })); return; }
        if (stderr) { res.send(JSON.stringify({ greeting: `stderr: ${stderr}` })); return; }
        if (stdout) { res.send(JSON.stringify({ greeting: `stdout: ${stdout}` })); return; }

        res.status(201).send(JSON.stringify({ greeting:`id: ${currentFile}` }));
      });
    });
  } else {
    res.status(400).send({
      greeting: "Missing code body" + JSON.stringify(req.body)
    });
  }
});

io.on('connection', (socket) => {
  let id = '_3oR4aJVi';
  
  console.log("a user connected");
  //var proc = spawn(`ghci`, [`${id}/OutputCode.hs`]);


  /*proc.stdout.on('data', (data) => {
    socket.broadcast.emit('data', data.toString());
  });
  
  proc.stderr.on('data', (data) => {
    socket.broadcast.emit('data', data.toString());
  });
  
  proc.on('exit', (code) => {
    socket.broadcast.emit('data', 'Program Terminated');
  });*/

  socket.on('data', (msg) => {
    console.log("asdfsadf");
    socket.broadcast.emit('data', "asdf");
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});




http.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);