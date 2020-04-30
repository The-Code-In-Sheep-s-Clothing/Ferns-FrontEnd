import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-haskell';
import 'prismjs/themes/prism-dark.css'
import Button from '@material-ui/core/Button';

const code = `
  type Board = Array(3,3) of Player & { Empty }
  type Input = Position

  initialBoard : Board
  initialBoard ! (x, y) = Empty
`;

class CodeEditor extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      code: code,
      greeting: ''
    };

    // Simple POST request with a JSON body using fetch
    fetch('/api/compile', {
      method: 'POST',
      headers:  {  
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json' 
                },
      body: JSON.stringify({ code: code })
    })
        .then(response => response.json())
        .then(data => this.setState(data));
  }

  render(){
    return (
      <div>
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
      </div>
    );
  }
}

export default CodeEditor;
