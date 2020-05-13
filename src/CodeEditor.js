import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-haskell';
import 'prismjs/themes/prism-dark.css'
import { Button, Box, TextField } from '@material-ui/core';
import Terminal from './Terminal.js';
import io from "socket.io-client";

const code = `type Board = Array(3,3) of Player & { Empty }
type Input = Position

initialBoard : Board
initialBoard ! (x, y) = Empty
`;

var socket = io();

class CodeEditor extends React.Component{

  constructor(props){
    super(props);

    this.compile = this.compile.bind(this);
    this.ping = this.ping.bind(this);

    this.terminalRef = React.createRef();


    this.state = {
      code: code,
      error: '',
      programID: ''
    };

    this.handleChange = this.handleChange.bind(this);

    socket.on("disconnect", () => {
      socket.connect({forceNew: true});
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

  handleChange(event) {
      this.setState({programID: event.target.value});
  }

  ping() {
    socket.emit('id', this.state.programID);
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
        <Button variant="contained" onClick={this.compile}>Compile</Button>
        <Button variant="contained" onClick={this.ping}>Run Program</Button>
        <br></br>
        <TextField label="Program ID" onChange={this.handleChange} value={this.state.programID}></TextField>
        <p>{this.state.error}</p>
        <Terminal socket={socket}
          submit={(input)=>{
            socket.emit('data', input); 
            return input;
          }}/>
      </Box>
    );
  }
}

export default CodeEditor;
