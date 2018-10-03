import React, { Component } from 'react';

const FoodOptionButton = (props) => {
    return (
        <a {...props.input} {...props} onClick={(event) => props.onClick(event, props.input.name, props.label.toLowerCase())} >{props.label}</a>
    );
}
export default FoodOptionButton;