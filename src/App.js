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

  render(){
    return (
      <Router>
        <div>
          <Bar></Bar>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
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
