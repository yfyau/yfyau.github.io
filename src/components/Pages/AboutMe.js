import React from "react"

import "./Pages.css"


const AboutMe = props => (
    <div className="page-flex horizontal-center aboutme-background">
        <p className="title">About me 🙆‍♂️</p>

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