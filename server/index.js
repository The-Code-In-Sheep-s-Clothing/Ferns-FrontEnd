const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
var fs = require('fs');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.json());
app.use(pino);

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var totalCompiledFiles = 0; // return the number of files
fs.readdir( 'compiled', (error, files) => { 
  global.totalCompiledFiles = files.length - 1;
  console.log('Total compiled files: ' + global.totalCompiledFiles);
});

// POST method route
app.post('/api/compile', function (req, res) {
  if (req.body && req.body.code) {
    exec(`mkdir compiled/${global.totalCompiledFiles}`, (error, stdout, stderr) => {
      //report errors
      if (error) { res.send(JSON.stringify({ greeting: `error: ${error.message}` })); return; }
      if (stderr) { res.send(JSON.stringify({ greeting: `stderr: ${stderr}` })); return; }

      var currentFile = global.totalCompiledFiles;
      global.totalCompiledFiles++;

      fs.writeFile(`compiled/${currentFile}/code.bgl`, req.body.code, function (err) {
        if (err) { res.send(JSON.stringify({ greeting: `error: ${err}` })); return; }
      }); 



      exec(`cd BottomUp/ && cabal new-exec BottomUp ../compiled/${currentFile}/code.bgl ; cp Output* ../compiled/${currentFile}/ ;  cd ..`, (error, stdout, stderr) => {    
        //report errors
        if (error) { res.send(JSON.stringify({ greeting: `error: ${error.message}` })); return; }
        if (stderr) { res.send(JSON.stringify({ greeting: `stderr: ${stderr}` })); return; }


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
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);