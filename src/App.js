import React from 'react';
import logo from './logo.svg';
import Bar from './Bar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CodeEditor from './CodeEditor';
import Documentation from './Documentation';
import Contact from './Contact';
import Examples from './Examples';


class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      greeting: ''
    };

    // Simple POST request with a JSON body using fetch
    fetch('/api/compile', {
      method: 'POST',
      headers:  {  
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json' 
                },
      body: JSON.stringify({ code: "type Board = Array(3,3) of Player & { Empty } type Input = Position initialBoard : Board initialBoard ! (x, y) = Empty" })
    })
        .then(response => response.json())
        .then(data => this.setState(data));
  }

  render(){
    return (
      <Router>
        <div>
          <Bar></Bar>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <p>{this.state.greeting}</p>
          <Switch>
            <Route path="/editor">
              <CodeEditor/>
            </Route>
            <Route path="/documentation">
              <Documentation />
            </Route>
            <Route path="/examples">
              <Examples />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/">
              <Documentation />
            </Route>
          </Switch>
        </div>
      </Router>

    );
  }
}

export default App;
