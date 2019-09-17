import React, { Component } from 'react';

import Bee from "./Bee/Bee"

import './Main.css'

export default class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sideDrawerOpen: false,
            scrolling: false
        }
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.onWindowResized);
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.onWindowResized);
    };

    onWindowResized = () => {
        this.forceUpdate();
    };

    render() {

        return (
            <div className="mainContainer">
                <div className="zoomOutAnimation" />
                <div className="background">
                    <Bee 
                        // leaving={true}
                        // style={{height: 25, width: 58}}
                    />
                    <main className="content">

                    </main>
                </div>
            </div>
        )
    }
}