import React from "react"
import { ReactComponent as GradHatLogo } from '../../images/GradHat.svg'

import "./Pages.css"


const AboutMe = props => (
    <div className="aboutMeBackground">
        <p style={{ margin: 0 }}>About me</p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30%" }}>
            <GradHatLogo className="gradHatSVG"/>
        </div>

        <div className="contentBlock">
            <ul className="aboutMeList">
                <li>🌐 Hong Kong</li>
                <li>🏫 Hong Kong University of Science and Technology</li>
                <li>📖 Computer Engineering Year 4</li>
                <li>👨‍💻 ☕ 🍬</li>
                <li>😍 🎮 🐕 🍵</li>
                <li>🤮 🍄</li>
            </ul>
        </div>
    </div>
)

export default AboutMe;