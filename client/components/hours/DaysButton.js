import React, { Component } from 'react';

const DaysButton = (props) => {
    return (
        <a {...props.input} {...props.hours} 
        className={props.className} 
        type={props.type}
        meta={props.meta}
        onClick={(event) => props.onClick(event, props.input.name)}>{props.label}</a>
    );
}
export default DaysButton;