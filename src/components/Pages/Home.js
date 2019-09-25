import React from "react"


import "./Pages.css"
import HomeImg from '../../images/HomeImg.jpg'

const Home = props => (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div className={"homeBackground"}
            style={{ backgroundImage: `url(${HomeImg})` }}>

        </div>
    </div>
)

export default Home;