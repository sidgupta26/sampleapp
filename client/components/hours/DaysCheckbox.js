'use strict'
import React, { Component } from 'react';


class DaysCheckbox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                <input  type="checkbox" name={this.props.input.name} value={this.props.value} />
                <label style={{marginLeft:'5px'}} {...this.props}>{this.props.label}</label>
                
            </div>
        );


    }
}
export default DaysCheckbox;