import React from "react"

import "./Pages.css"
import svg_logo from '../../images/Poly-Bee.svg'


const Home = props => (
    <div className="page-flex all-center home-background">
        {/* <div style={{ height: 350, width: 350, background: "black", borderRadius: "100%" }}>
            <img style={{ height: "80%" }} src={svg_logo} />
        </div> */}
        <p style={{ fontSize: "5vw" }}>HELLO WORLD !</p>
        <p style={{ fontSize: "10vw" }}>I am Jason Yau</p>

    </div>
)

export default Home;