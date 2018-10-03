import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './RenderText.css'
class RenderTextArea extends Component{
    constructor(props){
        super(props);


    }

    render(){
         const inputState = (meta) => {
            // if (meta && meta.error && meta.touched) {
            //     return classes.error;
            // } else if (meta && meta.touched && meta.warning) {
            //     return classes.warn;
            // } else if (meta && meta.touched && meta.valid) {
            //     return classes.pass;
            // }
            // else {
            //     return ''
            // }
        }
        return   (
        <div>
            <textarea {...this.props.input} {...this.props} style={{ resize: 'none' }}  className={this.props.className + ' ' + inputState(this.props.meta)}/>
            {this.props.meta.touched && this.props.meta.error && <span className={classes.error}>{this.props.meta.error}</span>}
            {this.props.meta.touched && this.props.meta.warning && <span className={classes.warn}>{this.props.meta.warning}</span>}
        </div>

    );
    }
}



export default RenderTextArea;