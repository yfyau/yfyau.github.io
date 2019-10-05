import React from "react"

import OrderEatIcon from "../../images/OrderEat.png"
import ITinHKIcon from "../../images/ITinHK.png"
import MoneyDrive from "../../images/MoneyDrive.png"
import "./Pages.css"


const Project = props => (
    <div className="pageContainer pagePadding projectBackground">
        <p className="title">Projects</p>

        <div className="content">

            <div className="projectCard">
                <div className="projectDummy"></div>
                <div className="projectContent">
                    <div className="front">
                        <img src={OrderEatIcon} className="projectImg" />
                    </div>
                    <div className="back">
                        <p>OrderEat</p>
                        <span>A food ordering system contains Client App, Business App and Admin Website that built with React, React Native and MongoDB</span>
                    </div>
                </div>
            </div>

            <div className="projectCard">
                <div className="projectDummy"></div>
                <div className="projectContent">
                    <div className="front">
                        <img src={ITinHKIcon} className="projectImg" />
                    </div>
                    <div className="back">
                        <p>ITinHK</p>
                        <span>A job website monitor Jobsdb's IT jobs and giving some statistics built with jQuery</span>
                    </div>
                </div>
            </div>

            <div className="projectCard">
                <div className="projectDummy"></div>
                <div className="projectContent">
                    <div className="front">
                        <img src={MoneyDrive} className="projectImg" />
                    </div>
                    <div className="back">
                        <p>MoneyDrive</p>
                        <span>
                            A mobile app built with Java and Firebase <br /> <br />
                            https://github.com/ yfyau/MoneyDrive
                        </span>
                    </div>
                </div>
            </div>

            <div className="projectCard">

                <div className="overlay">
                    <div className="projectText">
                        <br />

                    </div>
                </div>
            </div>
            <div style={{ paddingTop: "10px" }}>
                <p style={{ fontSize: "2vw" }}>Others: </p>
                <ul>
                    <li style={{ fontSize: "2vw" }}>Common Course Review System 2.0 - A HKUST system built with AngularJS </li>
                </ul>
            </div>
        </div>
    </div>
)

export default Project;