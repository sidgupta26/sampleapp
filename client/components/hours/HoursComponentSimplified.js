'use strict'
import React, { Component } from 'react';
import DaysCheckbox from './DaysCheckbox';
import { Field } from 'redux-form';
import moment from 'moment';
//import classes from './Hours.css';
import classes from './HoursComponentSimplified.css';
import DaysButton from './DaysButton';
import Modal from 'react-modal';
import HoursDropDown from './HoursDropDown';
import HoursDropDownSimplified from './HoursDropDownSimplified';

const divStyle = {
    marginLeft: '0',
};
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        overlfow: 'scroll',
        width: '50%',
        height: '400px'
    },
    overlay: {
        zIndex: 10
    }
};

class HoursComponentSimplified extends Component {
    constructor(props) {
        super(props);
        this.getFromTimeField = this.getFromTimeField.bind(this);
        this.getToTimeField = this.getToTimeField.bind(this);
        this.createDaysButton = this.createDaysButton.bind(this);
    }
 
    createDaysButton(value) {
        let btnStyle = this.props.hours && value && this.props.hours[value.toLowerCase()] && this.props.hours[value.toLowerCase()].userProvidedTime ?
            classes.choiceBtn + ' ' + classes.choiceBtnFullActive : classes.choiceBtn + ' ' + classes.choiceBtnFull;
        return (
            // <DaysButton
            //     type="input"
            //     name={value}
            //     {...this.props}
            //     label={value}
            //     key={value}
            //     className={btnStyle}
            //     onClick={this.openModal}
            // />

            <Field
                component={DaysButton}
                type="input"
                name={value}
                {...this.props}
                label={value}
                key={value}
                className={btnStyle}
                onClick={this.props.openHoursModal}
            />
        );

    }

    

    getFromTimeField() {
        if (this.props.selectedDayButton) {
            let hourValue = this.props && this.props.hours && this.props.hours[this.props.selectedDayButton]
                && this.props.hours[this.props.selectedDayButton].from && this.props.hours[this.props.selectedDayButton].from.hour ? this.props.hours[this.props.selectedDayButton].from.hour : '00';

            let minuteValue = this.props && this.props.hours && this.props.hours[this.props.selectedDayButton]
                && this.props.hours[this.props.selectedDayButton].from && this.props.hours[this.props.selectedDayButton].from.minute ? this.props.hours[this.props.selectedDayButton].from.minute : '00';


            let closed = this.props && this.props.hours && this.props.hours[this.props.selectedDayButton]
                && this.props.hours[this.props.selectedDayButton].closed ? this.props.hours[this.props.selectedDayButton].closed : false;

            return (
                <HoursDropDownSimplified
                    className={classes.inputField}
                    name={'hours.' + this.props.selectedDayButton + '.from'}
                    onTimeHoursChange={this.props.fromTimeHoursChanged}
                    onTimeMinutesChange={this.props.fromTimeMinutesChanged}
                    hourvalue={hourValue}
                    minutevalue={minuteValue}
                    disabled={closed}
                />);
        }
        return '';
    }

    getToTimeField() {
        if (this.props.selectedDayButton) {
            let hourValue = this.props && this.props.hours && this.props.hours[this.props.selectedDayButton]
                && this.props.hours[this.props.selectedDayButton].to && this.props.hours[this.props.selectedDayButton].from.hour ? this.props.hours[this.props.selectedDayButton].to.hour : '00';

            let minuteValue = this.props && this.props.hours && this.props.hours[this.props.selectedDayButton]
                && this.props.hours[this.props.selectedDayButton].to && this.props.hours[this.props.selectedDayButton].from.minute ? this.props.hours[this.props.selectedDayButton].to.minute : '00';

            let closed = this.props && this.props.hours && this.props.hours[this.props.selectedDayButton]
                && this.props.hours[this.props.selectedDayButton].closed ? this.props.hours[this.props.selectedDayButton].closed : false;
            return (<HoursDropDownSimplified
                className={classes.inputField}
                name={'hours.' + this.props.selectedDayButton + '.to'}
                onTimeHoursChange={this.props.toTimeHoursChanged}
                onTimeMinutesChange={this.props.toTimeMinutesChanged}
                hourvalue={hourValue}
                minutevalue={minuteValue}
                disabled={closed}
            />);
        }
        return '';
    }


    render() {
        const daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return (
            <section>
                <Modal
                    isOpen={this.props.hoursModalIsOpen }
                    onRequestClose={this.props.closeHoursModal}
                    style={customStyles}
                    contentLabel="Hours"
                    selectedDayButton={this.props.selectedDayButton}>

                    <h3 style={{ marginBotton: '1%', textAlign: 'center' }}>{this.props.selectedDayButton.charAt(0).toUpperCase() + this.props.selectedDayButton.slice(1) + ' Hours'}</h3>
                    <div className={classes.row}>
                        <div className='col span-1-of-2'>
                            Open Time
                        </div>
                        <div className='col span-1-of-2'>
                            {this.getFromTimeField()}
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className='col span-1-of-2'>
                            Close Time
                        </div>
                        <div className='col span-1-of-2'>
                            {this.getToTimeField()}
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className='col span-1-of-2'>
                            <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                                <input type="checkbox" onClick={event => { this.props.handleCloseCheckboxClick(event) }} value='closed' checked={this.props.hours && this.props.selectedDayButton && this.props.hours[this.props.selectedDayButton] ? this.props.hours[this.props.selectedDayButton].closed : false} />
                                <label style={{ marginLeft: '5px' }}>Closed</label>
                            </div>
                        </div>
                        <div className='col span-1-of-2'>

                        </div>
                    </div>
                    <div style={{ clear: 'both' }}></div>

                    <br />
                    <div className={classes.row} style={{ marginTop: '20px' }}>
                        <label>Apply these hours to : </label>
                    </div>

                    <div className={classes.row}>

                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='monday' />
                            <label style={{ marginLeft: '5px' }}>Monday</label>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='tuesday' />
                            <label style={{ marginLeft: '5px' }}>Tuesday</label>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='wednesday' />
                            <label style={{ marginLeft: '5px' }}>Wednesday</label>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='thursday' />
                            <label style={{ marginLeft: '5px' }}>Thursday</label>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='friday' />
                            <label style={{ marginLeft: '5px' }}>Friday</label>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='saturday' />
                            <label style={{ marginLeft: '5px' }}>Saturday</label>
                        </div>
                        <div style={{ display: 'inline-block', margin: '0 1% 0 1%' }}>
                            <input type="checkbox" onClick={this.props.handleCheckboxClick} value='sunday' />
                            <label style={{ marginLeft: '5px' }}>Sunday</label>
                        </div>

                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <a
                            href="#"
                            onClick={this.props.handleHoursModalOkBtn}
                            className={classes.btn + ' ' + classes.btnFull}
                        >Ok</a>
                    </div>
                </Modal>
                <div className={classes.row}>
                    <h4>Hours</h4>
                </div>
                <div className={classes.row}>
                    <div className="col span-3-of-3" style={divStyle}>
                        {daysArray.map(x => this.createDaysButton(x))}
                    </div>
                </div>
            </section >
        );

    }
}

export default HoursComponentSimplified;
