import React, { Component } from 'react';

import Main from './components/Main'
import BeeAnimation from './components/Bee/BeeAnimation'

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSkip: true
    }
  }

  onSkip = () => {
    this.setState({ isSkip: true })
  }


  render() {
    return (
      <div className="App">
        {
          this.state.isSkip
            ?
            <Main />
            :
            <BeeAnimation onSkip={this.onSkip} />
        }
      </div>
    );
  }
}

export default App;
