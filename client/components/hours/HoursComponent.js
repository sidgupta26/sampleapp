'use strict'
import React, { Component } from 'react';
import HoursDropDown from './HoursDropDown';
import { Field } from 'redux-form';
import classes from './Hours.css';
class HoursComponent extends Component {
    render() {
        return (
            <section className={classes.timingsSections}>
                <div className={classes.row}>
                    <h4>Hours</h4>
                </div>
                <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="monday" className={classes.timingLabel}>Monday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.monday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.monday.to"
                        />
                    </div>
                </div>
                <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="tuesday" className={classes.timingLabel}>Tuesday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.tuesday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.tuesday.to"
                        />
                    </div>
                </div>

                <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="wednesday" className={classes.timingLabel}>Wednesday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.wednesday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.wednesday.to"
                        />
                    </div>
                </div>

                 <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="thursday" className={classes.timingLabel}>Thursday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.thursday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.thursday.to"
                        />
                    </div>
                </div>
                <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="friday" className={classes.timingLabel}>Friday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.friday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.friday.to"
                        />
                    </div>
                </div>
                 <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="saturday" className={classes.timingLabel}>Saturday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.saturday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.saturday.to"
                        />
                    </div>
                </div>
                 <div className={classes.row}>
                    <div className="col span-2-of-4">
                        <label htmlFor="sunday" className={classes.timingLabel}>Sunday</label>
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.sunday.from"
                            className={classes.timingSelect}
                        />
                        <label className={classes.timingTo} style={{float:'right'}}>To</label>
                        <div style={{clear: 'both'}} />
                    </div>
                    <div className="col span-1-of-4">
                        <Field
                            component={HoursDropDown}
                            type="select"
                            name="hours.sunday.to"
                        />
                    </div>
                </div>
            </section>
        );

    }
}

export default HoursComponent;
