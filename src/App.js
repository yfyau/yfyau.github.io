import React, { Component } from 'react';
import {
  BrowserRouter,
  Redirect,
  Switch,
  Route
} from "react-router-dom";

import Main from './components/Main'
import BeeAnimation from './components/Bee/BeeAnimation'

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={BeeAnimation} />
            <Route path="/about" component={Main} />
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
