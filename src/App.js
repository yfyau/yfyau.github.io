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
import HomeImg from './images/HomeImg.jpg'

class App extends Component {

  componentDidMount() {
    const img = new Image();
    img.src = HomeImg;
  }

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
