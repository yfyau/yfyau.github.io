import React from "react"


import "./Pages.css"
import HomeImg from '../../images/HomeImg.jpg'

const Home = props => (
    <div className="pageContainer homeBackground" style={{ backgroundImage: `url(${HomeImg})` }}>
        <div className="homeTitleContainer">
            <h2 className="homeTitleH2">Hi. I am</h2>
            <h1 className="homeTitleH1">Jason Yau</h1>
            <div>
                <span className="spacer"></span>
                <h3 className="homeTitleH3">A Small Potato Programmer</h3>
            </div>
        </div>
    </div >
)

export default Home;