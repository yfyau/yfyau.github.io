import React from "react"
import { ReactComponent as GradHatLogo } from '../../images/GradHat.svg'
import { ReactComponent as HKUSTLogo } from '../../images/HKUST.svg'

import "./Pages.css"

const Emoji = props => (
    <span
        className="emoji"
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span>
);

const AboutMe = props => (
    <div className="pageContainer pagePadding aboutMeBackground">
        <p className="title">About me</p>

        <div className="svgContainer">
            <HKUSTLogo className="hkustSVG" />
            <GradHatLogo className="gradHatSVG" />
        </div>

        <div className="content">
            <ul className="aboutMeList">
                <li key="1"><Emoji symbol="📌" /> Hong Kong</li>
                <li key="2"><Emoji symbol="🏫" /> Hong Kong University of Science and Technology</li>
                <li key="3"><Emoji symbol="📖" /> Computer Engineering</li>
                <li key="4"><Emoji symbol="👨🏻‍🎓" /> 2019 Graduation</li>
                <li key="5"><Emoji symbol="😁" /> Freelance Developer</li>
                <li key="6"><Emoji symbol="👍" label="good at" /> Web Development / Mobile App Development / Robotic Process Automation </li>
                <li key="7"><Emoji symbol="☕" label="coffee" /> <span style={{ fontWeight: "bold" }}>+</span> <Emoji symbol="🍬" label="sweet" /> <span style={{ fontWeight: "bold" }}>=</span> <Emoji symbol="👨‍💻" label="code" /></li>
                <li key="8"><Emoji symbol="😍" label="favorite" /> <Emoji symbol="🎮" label="gaming" /> <Emoji symbol="🐕" label="dog" /> <Emoji symbol="🍵" label="matcha" /></li>
                <li key="9"><Emoji symbol="🤮" label="hate" /> <Emoji symbol="🍄" label="mushroom" /></li>
            </ul>
        </div>
    </div>
)

export default AboutMe;