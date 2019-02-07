import React from 'react'

import './SideDrawer.css'

const SideDrawer = props => {

    let drawerClasses = ["side-drawer"]

    if (props.show)
        drawerClasses.push("open");

    return (
        <nav className={drawerClasses.join(" ")}>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/">About me</a></li>
            </ul>
        </nav>
    )
}

export default SideDrawer;