import React from "react"

import Bee from "../Bee/Bee"

import "./Pages.css"
import HomeImg from '../../images/HomeImg.jpg'

const Home = props => (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Bee
            rightIn
            style={{ position: "absolute", width: "2%", left: "70%" }}
        >
            <div className="rope" />
        </Bee>

        <div className={"homeBackground homeRightInAnimation"}
            style={{ backgroundImage: `url(${HomeImg})` }}>

        </div>
    </div>
)

export default Home;