import React, { Component } from 'react';
import './App.css';
import './Bee.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="wrap">
          <div className="wrap2">
            <div className="body"></div>
            <div className="wing1"></div>
            <div className="wing2"></div>
            <div className="stinger"></div>
            <div className="eyes"></div>
          </div>
          <div className="cloud1"></div>
          <div className="cloud2"></div>
          <div className="cloud3"></div>
          <div className="cloud4"></div>

          <div className="debri1"></div>
          <div className="debri2"></div>
          <div className="debri3"></div>
          <div className="debri4"></div>
          <div className="debri5"></div>
          <div className="debri6"></div>
        </div>
      </div>
    );
  }
}

export default App;
