import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-haskell';
import 'prismjs/themes/prism-dark.css'
 

const code = `function add(a, b) {
  return a + b;
}
`;

class CodeEditor extends React.Component{
  state = { code };

  render(){
    return (
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
    );
  }
}

export default CodeEditor;
