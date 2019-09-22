import React, { Component, Suspense } from 'react';

import { Home, AboutMe } from './Pages/Pages'

import './Main.css'

export default class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            renderPage: 0
        }
    }

    componentDidMount = () => {
        // Waiting for bee leaving animation
        setTimeout(() => { }, 2500)

        window.addEventListener('scroll', this.onWindowScrolled, true);
        window.addEventListener('resize', this.onWindowResized);
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.onWindowScrolled);
        window.removeEventListener('resize', this.onWindowResized);
    };

    onWindowResized = () => {
        this.forceUpdate();
    };

    isBottom(window) {
        return window.target.scrollHeight - window.target.scrollTop === window.target.clientHeight;
    }

    onWindowScrolled = (window, element) => {
        console.log("scrolling")
        if (this.isBottom(window)) {
            console.log("reach bottom")
            this.setState((prevState) => ({ renderPage: prevState.renderPage + 1 }))
        }
    };

    render() {

        const { renderPage } = this.state

        return (
            <div className="mainContainer" >
                <div className="zoomOutAnimation" />
                <div className="background">
                    <Home />
                    <AboutMe />
                    {
                        renderPage >= 1 && <Home />
                    }
                    {

                        renderPage >= 2 && <Home />
                    }
                </div>
            </div >
        )
    }
}