import React from "react"

import { ReactComponent as EmailLogo } from '../../images/Email.svg'
import { ReactComponent as GitHubLogo } from '../../images/GitHub.svg'
import { ReactComponent as GitLabLogo } from '../../images/GitLab.svg'
import "./Pages.css"


const Contact = props => {

    var CopyEmailToClipboard = () => {
        var text = "yfyau@connect.ust.hk";
        navigator.clipboard.writeText(text).then(function () {
            alert('Email address: yfyau@connect.ust.hk is copied to your clipboard !');
        }, function (err) {
            alert('Find me at: yfyau@connect.ust.hk !');
        });
    }

    return (
        <div className="pageContainer pagePadding contactBackground">
            <p className="title">Contact Me</p>

            <div className="content">
                <div className="contactWay">
                    <a onClick={CopyEmailToClipboard}>
                        <EmailLogo className="contactSVG" />
                    </a>
                </div>
                <div className="contactWay">
                    <a href="https://github.com/yfyau" target="_blank" rel="noopener noreferrer">
                        <GitHubLogo className="contactSVG" />
                    </a>
                </div>
                <div className="contactWay">
                    <a href="https://gitlab.com/yfyau" target="_blank" rel="noopener noreferrer">
                        <GitLabLogo className="contactSVG" />
                    </a>
                </div>
            </div>
        </div >
    )
}

export default Contact;