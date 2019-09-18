import React, { Component } from 'react';

import Bee from "./Bee/Bee"

import './Main.css'

export default class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            overflowYHidden: true
        }
    }

    componentDidMount = () => {
        // Waiting for bee leaving animation
        setTimeout(() => this.setState({ overflowYHidden: false }), 2500)

        window.addEventListener('resize', this.onWindowResized);
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.onWindowResized);
    };

    onWindowResized = () => {
        this.forceUpdate();
    };

    render() {

        const { overflowYHidden } = this.state

        return (
            <div className="mainContainer" style={{ overflowY: overflowYHidden ? "hidden" : "scroll" }}>
                <div className="zoomOutAnimation" />
                <div className="background">
                    <Bee
                        leaving
                        style={{
                            position: "absolute",
                            width: "2%"
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(0%, -50%)",
                                height: "20%",
                                width: "50vw",
                                backgroundColor: "black"
                            }}
                        />
                    </Bee>

                    <div className={"rightInAnimation"} style={{ position: "relative", display: "block", height: "100%", width: "100%", backgroundColor: "pink" }}>

                    </div>

                    <div style={{ position: "relative", display: "block", height: "100%", width: "100%", backgroundColor: "green" }}>

                    </div>
                </div>
            </div>
        )
    }
}