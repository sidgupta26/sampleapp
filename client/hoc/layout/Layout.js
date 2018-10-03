import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Aux from '../aux/Aux'

// Import custom components
import classes from './Layout.css';



class Layout extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Aux>
                <div>
                    <main className={classes.content}>
                        {this.props.children}
                    </main>
                </div>
                
            </Aux>
        )
    }
}

export default Layout