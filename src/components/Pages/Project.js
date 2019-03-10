import React from "react"

import OrderEatIcon from "../../images/OrderEat.png"
import ITinHKIcon from "../../images/ITinHK.png"
import MoneyDrive from "../../images/MoneyDrive.png"
import "./Pages.css"


const Project = props => (
    <div className="page-flex horizontal-center project-background">
        <p className="title">Projects</p>

        <div className="contentBlock">

            <div className="projectContainer">
                <img src={OrderEatIcon} className="projectImg" />
                <div class="overlay">
                    <div class="projectText">
                        OrderEat<br /><br />
                        A food ordering system contains Client App, Business App and Admin Website that built with React, React Native and MongoDB
                    </div>
                </div>
            </div>

            <div className="projectContainer">
                <img src={ITinHKIcon} className="projectImg" />
                <div class="overlay">
                    <div class="projectText">
                        ITinHK<br /><br />
                        A job website monitor Jobsdb's IT jobs and giving some statistics built with jQuery
                    </div>
                </div>
            </div>

            <div className="projectContainer">
                <img src={MoneyDrive} className="projectImg" />
                <div class="overlay">
                    <div class="projectText">
                        MoneyDrive<br /><br />
                        A mobile app built with Java and Firebase<br /><br />
                        https://github.com/yfyau/MoneyDrive
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