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
                        <div style={{ padding: 20 }}>
                            <p>OrderEat</p>
                            <span>A food ordering system contains Client App, Business App and Admin Website that built with React, React Native and MongoDB</span>
                            <p><a href="https://youtu.be/Wba5NTLquDY" target="_blank" rel="noopener noreferrer">Link</a></p>
                        </div>
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
                        <div style={{ padding: 20 }}>
                            <p>ITinHK</p>
                            <span>A job website monitor Jobsdb's IT jobs and giving some statistics built with jQuery</span>
                            <p><a href="https://itinhk.com" target="_blank" rel="noopener noreferrer">Link</a></p>
                        </div>
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
                        <div style={{ padding: 20 }}>
                            <p>MoneyDrive</p>
                            <span>A simple money management native mobile app built with Android Studio and Firebase</span>
                            <p><a href="https://youtu.be/T6QNeXXliwQ" target="_blank" rel="noopener noreferrer">Link</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ paddingTop: "10px" }}>
                <p>Others: </p>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>
                        Common Course Review System 2.0 - <br />
                        A HKUST internal system built with AngularJS
                    </li>
                </ul>
            </div>
        </div>
    </div>
)

export default Project;