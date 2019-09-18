import React, { Component } from 'react';

import Bee from "./Bee/Bee"

import './Main.css'

export default class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {

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
                </div>
            </div>
        )
    }
}