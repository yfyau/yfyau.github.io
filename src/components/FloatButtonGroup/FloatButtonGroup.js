import React from "react"
import PropTypes from "prop-types"

import "./FloatButtonGroup.css"


export default class FloatButtonGroup extends React.Component {
    static propTypes = {
        number: PropTypes.number,
        index: PropTypes.number,
        options: PropTypes.array,
        onClickHandler: PropTypes.func,
        animationTimer: PropTypes.number,
        transitionTimingFunction: PropTypes.string
    };

    static defaultProps = {
        number: 0,
        index: 0,
        options: [],
        animationTimer: 1000,
        transitionTimingFunction: "ease"
    };

    constructor(props) {
        super(props)
    }

    render() {
        const { number, index, options, onClickHandler, animationTimer, transitionTimingFunction } = this.props

        let buttons = []
        const color = options[index] ? options[index].color ? options[index].color : "#000" : "#000"

        for (let i = 0; i < number; i++) {
            buttons.push(
                <li className={index === i ? "active" : ""} key={"fgb_" + i}>
                    <a href="#" onClick={() => { onClickHandler(i) }}>
                        <span
                            style={{
                                color: color,
                                backgroundColor: color,
                                transition: `background ${animationTimer}ms, width ${animationTimer}ms, transform ${animationTimer}ms ${transitionTimingFunction}`
                            }}
                        />
                    </a>
                </li>
            )
        }

        return (
            <div className="fbg_container">
                <nav className="fbg_nav">
                    <div className="fbg_nav-items"
                        ref={ref => this._navItems = ref}
                        style={{
                            transform: `translate3d(0, calc(50% - ${(index * 55)}px), 0)`,
                            transition: `transform ${animationTimer}ms ${transitionTimingFunction}`
                        }}
                    >
                        <ul>
                            {buttons}
                        </ul>
                    </div>
                </nav>
            </div >
        )
    }
}