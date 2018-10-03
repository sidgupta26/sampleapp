'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './RenderText.css';


class RenderText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const inputState = (meta) => {
            if (meta && meta.error && (!meta.pristine || meta.dirty)) {
                return classes.error;
            } else if (meta && (!meta.pristine || meta.dirty) && meta.warning) {
                return classes.warn;
            } else if (meta && (!meta.pristine || meta.dirty) && meta.valid) {
                return classes.pass;
            } else {
                return ''
            }
        }

        return (
            <div>
                <input  {...this.props.input}  {...this.props} className={this.props.className + ' ' + inputState(this.props.meta)} />
                {this.props.meta.touched && this.props.meta.error && <span className={classes.error}>{this.props.meta.error}</span>}
                {this.props.meta.touched && this.props.meta.warning && <span className={classes.warn}>{this.props.meta.warning}</span>}

            </div>

        )
    }
}


export default RenderText;