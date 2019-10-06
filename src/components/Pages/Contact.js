import React from "react"

import EmailIcon from "../../images/Email.png"
import GitHubIcon from "../../images/GitHub.png"
import GitLabIcon from "../../images/GitLab.png"
import "./Pages.css"


const Contact = props => (
    <div className="pageContainer pagePadding contactBackground">
        <p className="title">Contact Me</p>

        <div className="content">
            <div className="contactWay">
                <a href="" target="_blank" rel="noopener noreferrer">
                    <img src={EmailIcon} className="contactImg" height={120} width={120} />
                </a>
                <p style={{ fontSize: "2vw" }}>yfyau@connect.ust.hk</p>
            </div>
            <div className="contactWay">
                <a href="https://github.com/yfyau" target="_blank" rel="noopener noreferrer">
                    <img src={GitHubIcon} className="contactImg" height={120} width={120} />
                </a>
                <p style={{ fontSize: "2vw" }}>https://github.com/yfyau</p>
            </div>
            <div className="contactWay">
                <a href="https://gitlab.com/yfyau" target="_blank" rel="noopener noreferrer">
                    <img src={GitLabIcon} className="contactImg" height={120} width={120} />
                </a>
                <p style={{ fontSize: "2vw" }}>https://gitlab.com/yfyau</p>
            </div>
        </div>
    </div>
)

export default Contact;