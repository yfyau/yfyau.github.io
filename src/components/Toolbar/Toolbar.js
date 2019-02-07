import React from 'react';

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton'
import './Toolbar.css'

const Toolbar = props => (
    <header className="toolbarContainer">
        <nav className="toolbar_nav">
            <div className="toolbar_toggle-button"><DrawerToggleButton click={props.drawerClick} /></div>
            <div className="toolbar_logo"><a href="/"> LOGO </a></div>
            <div className="spacer"></div>
            <div className="toolbar_nav-items">
                <ul>
                    <li><a href="/"> Home </a></li>
                    <li><a href="/"> About me </a></li>
                </ul>
            </div>
        </nav>
    </header>
)

export default Toolbar;