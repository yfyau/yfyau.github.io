import React, { Component } from 'react';
import Bee from './Bee'

import './BeeAnimation.css';

export default class BeeAnimation extends Component {

    constructor (props) {
        super(props)

        this.state = {
            beeDodging: true,
            beeLeaving: false
        }
    }

    render() {
        const { onSkip } = this.props

        const onClick = () => {
            this.setState({ 
                beeDodging: false,
                beeLeaving: true
             })

            setTimeout(() => {
                onSkip()
            }, 2000)
        }

        return (
            <div className="beeContainer">
                <Bee 
                    dodging = {this.state.beeDodging}
                    leaving = {this.state.beeLeaving}
                    onClick = {onClick}
                />
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