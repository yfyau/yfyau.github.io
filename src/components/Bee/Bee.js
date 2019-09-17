import React from 'react';
import './Bee.css'

const Bee = (props) => {

    var className = "bee";

    className += props.dodging ? " dodging" : "";
    className += props.leaving ? " leaving" : "";
    className += props.onClick ? " pointer" : "";

    return (
        <div className={className} style={props.style} onClick={props.onClick}>
            <div className="stinger" />
            <div className="wing1" />
            <div className="body" />
            <div className="wing2" />
            <div className="eyes" />
        </div>
    )
}

export default Bee;