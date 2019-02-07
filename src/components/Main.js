import React, { Component } from 'react';

import Toolbar from './Toolbar/Toolbar'
import SideDrawer from './SideDrawer/SideDrawer'
import Backdrop from './Backdrop/Backdrop'
import PageScroller from './PageScroller/PageScroller'
import FloatButtonGroup from './FloatButtonGroup/FloatButtonGroup'
import { Home } from './Pages/Pages'

import './Main.css'

export default class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sideDrawerOpen: false,
            currentPage: 1,
            scrolling: false
        }

        this.containerHeight = 0;
        this.containerWidth = 0;
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

    drawerToggleClickHandler = () => {
        this.setState((prevState) => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen }
        })
    }

    backdropClickHandler = () => {
        this.setState({ sideDrawerOpen: false })
    }

    goToPage = (index) => {
        this._pageScroller.goToPage(index);
    }

    render() {
        const { sideDrawerOpen } = this.state

        let backdrop;

        if (sideDrawerOpen) {
            backdrop = <Backdrop click={this.backdropClickHandler} />
        }

        return (
            <div className="mainContainer">
                <div className="background">
                    {/* For Moblie */}
                    <Toolbar drawerClick={this.drawerToggleClickHandler} />
                    <SideDrawer show={sideDrawerOpen} />
                    {backdrop}

                    {/* For PC */}
                    <FloatButtonGroup />
                    <main className="content" ref={ref => this._content = ref}>
                        <PageScroller
                            ref={ref => this._pageScroller = ref}
                            containerHeight="100%"
                            containerWidth="100%">
                            <Home />
                            <div style={{ height: "100%" }}><h1>2</h1></div>
                            <div style={{ height: "100%" }}><h1>3</h1></div>
                            <div style={{ height: "100%" }}><h1>4</h1></div>
                        </PageScroller>
                    </main>
                </div>
            </div>
        )
    }
}