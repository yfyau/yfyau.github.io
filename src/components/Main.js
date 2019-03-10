import React, { Component } from 'react';

import PageScroller from './PageScroller/PageScroller'
import { Home, Contact, AboutMe, Project } from './Pages/Pages'

import './Main.css'

const navOptions = [
    // {
    //     text: "Home",
    //     color: "rgb(50, 50, 50)"
    // },
    // {
    //     text: "Page 2",
    //     color: "rgb(100, 100, 100)"
    // },
    // {
    //     text: "Home",
    //     color: "rgb(150, 150, 150)"
    // },
    // {
    //     text: "Page 2",
    //     color: "rgb(200, 200, 200)"
    // },
    // {
    //     text: "Contact Me",
    //     color: "rgb(250, 250, 250)"
    // }
    {
        text: "Home",
        color: "#FFF"
    },
    {
        text: "Page 2",
        color: "#000"
    },
    {
        text: "Home",
        color: "#FFF"
    },
    {
        text: "Page 2",
        color: "#000"
    },
    {
        text: "Contact Me",
        color: "#FFF"
    }
]

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
                <div className="background">
                    <main className="content">
                        <PageScroller
                            ref={ref => this._pageScroller = ref}
                            navOptions={navOptions}
                            containerHeight="100%"
                            containerWidth="100%"
                        >
                            <Home />
                            <AboutMe />
                            <Project />
                            <div style={{ height: "100%", background: `linear-gradient(rgb(240, 156, 68), rgb(240, 128, 34))` }}></div>
                            <Contact />
                        </PageScroller>
                    </main>
                </div>
            </div>
        )
    }
}