import React, { Component } from 'react';
import Particles from 'react-particles-js';

import HoneySVG1 from './honey1.svg'
import HoneySVG2 from './honey2.svg'
import HoneySVG3 from './honey3.svg'

import './App.css';
import './Bee.css';

const particles_params = {
  "particles": {
    // "shape": {
    //   "type": "circle",
    //   "stroke": {
    //     "width": 0,
    //     "color": "#000000"
    //   },
    // },
    "shape": {
      "type": 'images',
      "images": [
          {"src": HoneySVG1, "height": 20, "width": 20},
          {"src": HoneySVG2, "height": 20, "width": 20},
          {"src": HoneySVG3, "height": 20, "width": 20},
      ]
    },
    "color": {
      "value": "#FFB733"
    },
    "number": {
        "value": 30,
        "density": {
            "enable": false,
        }
    },
    "size": {
        "value": 20,
        // "random": true
    },
    "opacity": {
      "value": 0.6,
      // "random": true
    },
    "move": {
        "direction": "none",
        "out_mode": "bounce",
        "speed": 5
    },
    "line_linked": {
        "enable": false
    },
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": false
      },
      "resize": true
    },
    "modes": {
      "bubble": {
        "distance": 40,
        "size": 40,
        "duration": 0.3,
        "opacity": 1,
        "speed": 3
      }
    }
  },
  "retina_detect": true
}

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      isSkip: false
    }
  }

  testClick = () => {
    this.setState({isSkip: true})
  }

  renderMain = () => (
    <div className="main">
      <div className="particles">
        <Particles height={'100%'} params={particles_params} />
      </div>
    </div>
  )

  renderFlyingBee = () => (
    <div className="beeContainer">
      <p className="skip" onClick={this.testClick}> SKIP >>> </p>
      <div className="bee">
        <div className="body" />
        <div className="wing1" />
        <div className="wing2" />
        <div className="stinger" />
        <div className="eyes" />
      </div>
      <div className="cloud1" />
      <div className="cloud2" />
      <div className="cloud3" />
      <div className="cloud4" />

      <div className="debri1" />
      <div className="debri2" />
      <div className="debri3" />
      <div className="debri4" />
      <div className="debri5" />
      <div className="debri6" />
    </div>
  )

  render() {
    return (
      <div className="App">
        {this.state.isSkip ? this.renderMain() : this.renderFlyingBee()}
      </div>
    );
  }
}

export default App;
