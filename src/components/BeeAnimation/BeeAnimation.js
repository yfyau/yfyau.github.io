import React, { Component } from 'react';

import './BeeAnimation.css';

export default class BeeAnimation extends Component {

    constructor (props) {
        super(props)

        this.state = {
            beeClassName: "bee"
        }
    }

    render() {
        const { onSkip } = this.props

        const onClick = () => {
            this.setState({ beeClassName: "bee leaving" })

            setTimeout(() => {
                onSkip()
            }, 2000)
        }

        return (
            <div className="beeContainer">
                <div className={this.state.beeClassName} onClick={onClick}>
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
    }
}