import React from "react"

import "./FloatButtonGroup.css"

const FloatButtonGroup = props => (
    <div className="fbg_container">
        <nav className="fbg_nav">
            <div className="fbg_nav-items">
                <ul>
                    <li><a href="/"> Home </a></li>
                    <li><a href="/"> About me </a></li>
                </ul>
            </div>
        </nav>
    </div>
)

export default FloatButtonGroup;