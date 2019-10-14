import React, { Component } from 'react';

import Bee from "./Bee/Bee"
import { Home, AboutMe, Project, Contact } from './Pages/Pages'

import './Main.css'

export default class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            animationEnd: false,
            renderPage: 0,
            HomeImgPositionY: 0
        }
    }

    componentDidMount = () => {
        setTimeout(() => { this.setState({ animationEnd: true }) }, 2000);
    }

    render() {

        const { animationEnd, renderPage, HomeImgPositionY } = this.state

        return (
            <div className="mainContainer">
                <div className="zoomOutAnimation" />
                <div className="mainRightInAnimation" style={{ position: "relative", height: "100%", width: "100%" }}>
                    <div>
                        <Bee style={{ position: "absolute", width: "2%", left: "-30%" }} />
                        <div className="rope" />
                    </div>
                    <div className="mainBackground" style={{ backgroundPositionY: HomeImgPositionY }}>
                        <Home />
                        {
                            animationEnd &&
                            [
                                <AboutMe />,
                                <Project />,
                                <Contact />
                            ]
                        }
                    </div>
                </div>
            </div>
        )
    }
}