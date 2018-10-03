'use strict'
import React, { Component } from 'react';


const HoursDropDown = (props) => {
    return (
        <select {...props.input} className="select timingSelect" onChange={props.onTimeChange} value={props.value} disabled={props.disabled}>
            <option>12:00 AM</option>
            <option>12:30 AM</option>
            <option>01:00 AM</option>
            <option>01:30 AM</option>
            <option>02:00 AM</option>
            <option>02:30 AM</option>
            <option>03:00 AM</option>
            <option>03:30 AM</option>
            <option>04:00 AM</option>
            <option>04:30 AM</option>
            <option>05:00 AM</option>
            <option>05:30 AM</option>
            <option>06:00 AM</option>
            <option>06:30 AM</option>
            <option>07:00 AM</option>
            <option>07:30 AM</option>
            <option>08:00 AM</option>
            <option>08:30 AM</option>
            <option>09:00 AM</option>
            <option>09:30 AM</option>
            <option>10:00 AM</option>
            <option>10:30 AM</option>
            <option>11:00 AM</option>
            <option>11:30 AM</option>
            <option>12:00 PM</option>
            <option>12:30 PM</option>
            <option>01:00 PM</option>
            <option>01:30 PM</option>
            <option>02:00 PM</option>
            <option>02:30 PM</option>
            <option>03:00 PM</option>
            <option>03:30 PM</option>
            <option>04:00 PM</option>
            <option>04:30 PM</option>
            <option>05:00 PM</option>
            <option>05:30 PM</option>
            <option>06:00 PM</option>
            <option>06:30 PM</option>
            <option>07:00 PM</option>
            <option>07:30 PM</option>
            <option>08:00 PM</option>
            <option>08:30 PM</option>
            <option>09:00 PM</option>
            <option>09:30 PM</option>
            <option>10:00 PM</option>
            <option>10:30 PM</option>
            <option>11:00 PM</option>
            <option>11:30 PM</option>
        </select>
    );

}
export default HoursDropDown;