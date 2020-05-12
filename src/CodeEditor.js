import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-haskell';
import 'prismjs/themes/prism-dark.css'
import { Button, Box } from '@material-ui/core';
import Terminal from './Terminal.js';
import io from "socket.io-client";

const code = `type Board = Array(3,3) of Player & { Empty }
type Input = Position

initialBoard : Board
initialBoard ! (x, y) = Empty
`;

const socket = io();

class CodeEditor extends React.Component{

  constructor(props){
    super(props);

    this.compile = this.compile.bind(this);
    this.ping = this.ping.bind(this);



    this.state = {
      code: code,
      greeting: ''
    };
  }

  componentDidMount() {
    socket.on("data", msg => {
      alert(msg);
      this.setState({greeting: this.state.greeting + msg});
      console.log("asdf");
    });
  }

  compile() {
    // Simple POST request with a JSON body using fetch
    fetch('/api/compile', {
      method: 'POST',
      headers:  {  
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json' 
                },
      body: JSON.stringify({ code: this.state.code })
    })
        .then(response => response.json())
        .then(data => {
          this.setState(data);
        });
  }

  ping() {
    console.log(socket);
    socket.emit('data', "asdf");
  }

  render(){
    return (
      <Box>
        <Editor
          value={this.state.code}
          onValueChange={code => this.setState({ code })}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
        <Button variant="contained" onClick={this.compile}>Run</Button>
        <Button variant="contained" onClick={this.ping}>Ping Server</Button>
        <p>{this.state.greeting}</p>
        <Terminal submit={(input)=>{return "1233";}}/>
      </Box>
    );
  }
}

export default CodeEditor;
