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
import { Container } from '@material-ui/core';


class App extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return (
      <Router>
          <Bar></Bar>
          <Container maxWidth='xl'>
            <Switch>
              <Route path="/editor/:code" component={CodeEditor}>
              </Route>
              <Route path="/editor" >
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
          </Container>
      </Router>

    );
  }
}

export default App;
