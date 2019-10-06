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
        window.addEventListener('scroll', this.onWindowScrolled, true);
        // window.addEventListener('resize', this.onWindowResized);

        setTimeout(() => { this.setState({ animationEnd: true }) }, 2500);
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.onWindowScrolled);
        // window.removeEventListener('resize', this.onWindowResized);
    };

    // onWindowResized = () => {
    //     this.forceUpdate();
    // };

    isBottom(window) {
        return window.target.scrollHeight - window.target.scrollTop === window.target.clientHeight;
    }

    onWindowScrolled = (window, element) => {
        // console.log(window.target.scrollHeight, window.target.scrollTop)
        if (this.isBottom(window)) {
            this.setState((prevState) => ({ renderPage: prevState.renderPage + 1 }))
        }
    };

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