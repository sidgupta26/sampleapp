import React, { Component } from 'react';
import { connect } from 'react-redux';
import RenderText from '../../components/form/RenderText';
import RenderTextArea from '../../components/form/RenderTextArea';
import HoursComponentSimplified from '../../components/hours/HoursComponentSimplified';
import FoodOptions from '../../components/foodoptions/FoodOptions';
import { Field, reduxForm } from 'redux-form';
import classes from './AddBusiness.css';
import Aux from '../../hoc/aux/Aux';
import { bindActionCreators } from 'redux';
//import { fetchById } from '../../actions/CrudActions'
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { registerField, unregisterField } from 'redux-form';
import Modal from 'react-modal';
import { updateEntity, storeEntity, fetchEntityById } from '../../services/httpService';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        overlfow: 'scroll',
        maxWidth: '320px',
        width: '80%'

    }
};

const customStylesGeolocation = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        overlfow: 'scroll',
        maxWidth: '320px',
        width: '80%'

    }
};
class AddBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessName: '',
            description: '',
            location: {
                addressLine: '',
                landmark: '',
                city: '',
                state: '',
                country: '',
                zip: '',
                geocoordinates: {
                    lat: '',
                    lng: ''
                },
            },
            foodoptions: {
                cuisine: [],
                mealtype: [],
                dishtype: [],
                flavor: [],
                beverages: []
            },
            dishes: [],
            contactdetails: {
                phoneNumber: ''
            },
            hours: {
                monday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                tuesday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },
                    closed: false,
                    userProvidedTime: false
                },
                wednesday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',

                    },
                    closed: false,
                    userProvidedTime: false
                },
                thursday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },
                    closed: false,
                    userProvidedTime: false
                },
                friday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },
                    closed: false,
                    userProvidedTime: false
                },
                saturday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },
                    closed: false,
                    userProvidedTime: false
                },
                sunday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },
                    closed: false,
                    userProvidedTime: false
                }
            },
            autocompleteDone: false,
            modalIsOpen: false,
            suggestedDish: {
                suggestedDishName: '',
                suggestedDishSaved: false
            },
            invalidLocation: true,
            locErrorModalIsOpen: false,
            modalMessage: '',
            lastFilledAddress: '',
            selectedDayButton: '',
            selectedDayCheckboxes: [],
            hoursModalIsOpen: false

        }
        this.handleAddBusinessrBtn = this.handleAddBusinessrBtn.bind(this);
        this.handleCancelBtn = this.handleCancelBtn.bind(this);
        this.handleBusinessNameChange = this.handleBusinessNameChange.bind(this);
        this.fillInAddressDetails = this.fillInAddressDetails.bind(this);
        this.renderAutocomplete = this.renderAutocomplete.bind(this);
        this.addressChange = this.addressChange.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        // this.submitForm = this.submitForm.bind(this);
        this.handleInitialize = this.handleInitialize.bind(this);
        this.loadBusinessData = this.loadBusinessData.bind(this);
        this.handleLogoNavigation = this.handleLogoNavigation.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
        this.loadDishOptions = this.loadDishOptions.bind(this);
        //this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.suggestDish = this.suggestDish.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveSugestedDish = this.saveSugestedDish.bind(this);
        this.handleSuggestedDishNameChange = this.handleSuggestedDishNameChange.bind(this);
        this.messageRead = this.messageRead.bind(this);
        this.onAddressBlur = this.onAddressBlur.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.openLocErrorModal = this.openLocErrorModal.bind(this);
        this.closeLocErrorModal = this.closeLocErrorModal.bind(this);

        // Hours component 
        this.toTimeHoursChanged = this.toTimeHoursChanged.bind(this);
        this.toTimeMinutesChanged = this.toTimeMinutesChanged.bind(this);
        this.fromTimeHoursChanged = this.fromTimeHoursChanged.bind(this);
        this.fromTimeMinutesChanged = this.fromTimeMinutesChanged.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.handleHoursModalOkBtn = this.handleHoursModalOkBtn.bind(this);
        this.openHoursModal = this.openHoursModal.bind(this);
        this.closeHoursModal = this.closeHoursModal.bind(this);
        this.handleCloseCheckboxClick = this.handleCloseCheckboxClick.bind(this);


    }

    submitForm(form) {
        if (form._id) {
            //update data
            updateEntity('business', form, form._id).then(result => {
                this.props.history.push({
                    pathname: '/businessDetails/' + result.data._id,
                });
            }).catch(err => {
                console.log(err)
            });

        } else {
            storeEntity('business', form).
                then(result => {
                    this.props.history.push({
                        pathname: '/businessDetails/' + result.data._id,
                    });
                }).
                catch(err => {
                    console.log(err);
                });

        }
        this.props.destroy('addbusinessForm');
    }



    messageRead() {
        let suggestedDish = {
            suggestedDishName: '',
            suggestedDishSaved: false
        }
        this.setState({ ...this.state, modalIsOpen: false, suggestedDish: suggestedDish });
    }

    handleSuggestedDishNameChange(e) {
        let suggestedDishName = e.target.value;
        let suggestedDish = { ...this.state.suggestedDish, suggestedDishName: suggestedDishName }
        this.setState({ ...this.state, suggestedDish: suggestedDish });
    }

    openModal() {
        this.setState({ ...this.state, modalIsOpen: true });
    }

    saveSugestedDish() {
        storeEntity('dish', { suggestedDishName: this.state.suggestedDish.suggestedDishName }).then(result => {
            // set the saved flag to true
            let suggestedDish = {
                suggestedDishName: '',
                suggestedDishSaved: true
            }
            this.setState({ ...this.state, suggestedDish: suggestedDish });

        }).catch(error => { console.log(error) });
    }
    closeModal() {
        this.setState({ ...this.state, modalIsOpen: false });
    }

    suggestDish() {
        this.setState({ ...this.state, modalIsOpen: true });
    }


    closeLocErrorModal() {
        this.setState({ ...this.state, locErrorModalIsOpen: false });
    }

    openLocErrorModal() {
        this.setState({ ...this.state, locErrorModalIsOpen: true });
    }

    handleInitialize() {
        const initData = {
            businessName: '',
            location: {
                addressLine: '',
                landmark: '',
                city: '',
                state: '',
                country: '',
                zip: '',
                geocoordinates: {
                    lat: '',
                    lng: ''
                },
            },
            foodoptions: {
                cuisine: [],
                mealtype: [],
                dishtype: [],
                flavor: [],
                dishes: [],
                beverages: []

            },
            dishes: [],
            contactdetails: {
                phoneNumber: ''
            },
            hours: {
                monday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                tuesday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                wednesday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                thursday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                friday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                saturday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                },
                sunday: {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                }
            },
            autocompleteDone: false,
            invalidLocation: true
        };

        this.props.initialize(initData);
    }


    handleAddBusinessrBtn(event) {
        event.preventDefault();
        document.getElementById('submitBtn').click();

    }

    handleCancelBtn() {
        event.preventDefault();
        this.props.destroy('addbusinessForm');
        this.props.history.goBack();
    }

    handleBusinessNameChange(event) {
        this.setState({ ...this.state, businessName: this.state.businessName + event.target.value })
    }

    handleLogoNavigation() {
        this.props.destroy('addbusinessForm');
        this.props.history.push({
            pathname: '/'
        });
    }

    updateFoodOption(event, value, key) {
        event.preventDefault();
        // value = 'foodoptions.cuisine.Chinese'
        var object = value.split('.');
        var foodOptionsCategoryArray = this.state && this.state.foodoptions && object[1] && this.state.foodoptions[object[1]] ? this.state.foodoptions[object[1]] : [];
        let updatedDishesWithRemovedItem = [];
        if (foodOptionsCategoryArray && foodOptionsCategoryArray.indexOf(key.toLowerCase()) > -1) {
            // Remove it from the array
            updatedDishesWithRemovedItem = foodOptionsCategoryArray.filter(function (e) { return e !== key.toLowerCase() })
            //foodOptionsCategoryArray.splice(foodOptionsCategoryArray.indexOf(key.toLowerCase(), 1));
        } else {
            // push it in the array 
            updatedDishesWithRemovedItem = [...foodOptionsCategoryArray, key.toLowerCase()];
            //foodOptionsCategoryArray.push(key.toLowerCase());
        }
        let currentFoodOptions = { ...this.state.foodoptions, }
        currentFoodOptions[object[1]] = updatedDishesWithRemovedItem;
        let updatedState = { ...this.state, foodoptions: currentFoodOptions };
        this.setState(updatedState);
        this.props.change(value, updatedDishesWithRemovedItem);
    }

    componentDidMount() {
        this.props.dispatch(registerField('addbusinessForm', 'dishes', 'Field'))
        this.loadBusinessData();
        var autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(this.refs.autoCompletePlaces), { types: ['geocode'] });
        autocomplete.addListener('place_changed', () => {
            this.fillInAddressDetails(autocomplete.getPlace())
        });
        if (this.props.selectedMapLocation.lat !== -9999) {
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({ 'location': this.props.selectedMapLocation }, (results, status) => {
                this.fillInAddressDetails(results[0]);
            });

        }
        if (!this.state.autocompleteDone) {
            this.refs.autoCompletePlaces.value = this.state.lastFilledAddress;
        }
    }

    loadBusinessData() {
        // if form is dirty then dont load data from database
        if (this.props.dirty) {
            // Dont do anything now, just 
            //console.log('form is dirty. Not doing anything');
            // Set form values to state
            this.setState({ ...this.state, foodoptions: this.props.data.foodoptions, dishes: this.props.data.dishes, hours: this.props.data.hours });
        } else if (this.props && this.props.match && this.props.match.params && this.props.match.params.id) {
            let businessId = this.props.match.params.id;
            fetchEntityById('business', businessId).then((response) => {
                // initialize redux form  with the response
                console.log(response);
                this.props.initialize(response.data);
                this.setState({ ...this.state, ...response.data, autocompleteDone: true });
            }).catch(error => { });
        }
        else {
            // Initialize redux form with empty values 
            console.log('Neither the form is dirty not its existing business');
        }
    }

    componentDidUpdate() {
        var autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(this.refs.autoCompletePlaces), { types: ['geocode'] });
        autocomplete.addListener('place_changed', () => {
            this.fillInAddressDetails(autocomplete.getPlace())
        });
        if (this.refs && this.refs.autoCompletePlaces && !this.state.autocompleteDone) {
            this.refs.autoCompletePlaces.value = this.state.lastFilledAddress;
        }
    }

    fillInAddressDetails(place) {
        let address = '';
        let identifiedLocation = {
            addressLine: '',
            landmark: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            geocoordinates: {
                lat: '',
                lng: ''
            }
        };
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            // window.alert("No details available for input: '" + place.name + "'");
            this.setState({ ...this.state, locErrorModalIsOpen: true, modalMessage: 'Select a location from suggested places.' });
            let invalidLocation = {};
            invalidLocation.city = '';
            invalidLocation.state = '';
            invalidLocation.country = '';
            invalidLocation.zip = '';
            invalidLocation.addressLine = '';
            let geocoordinates = {};
            geocoordinates.lng = '';
            geocoordinates.lat = '';
            invalidLocation.geocoordinates = geocoordinates;
            this.setState({ ...this.state, location: invalidLocation, autocompleteDone: false, invalidLocation: true });
            this.props.change('location.city', '');
            this.props.change('location.state', '');
            this.props.change('location.country', '');
            this.props.change('location.zip', '');
            this.props.change('location.addressLine', '');
            this.props.change('location.geocoordinates.lng', '');
            this.props.change('location.geocoordinates.lat', '');
            return;
        }

        // var place = this.state.autocomplete.getPlace();
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            //City = 'locality'
            //State = 'administrative_area_level_1'
            //Country = 'country'
            //Postal Code  = 'postal_code'
            if (addressType === 'locality') {
                identifiedLocation.city = place.address_components[i].long_name;
            } else if (addressType === 'administrative_area_level_1') {
                identifiedLocation.state = place.address_components[i].long_name;
            } else if (addressType === 'country') {
                identifiedLocation.country = place.address_components[i].long_name;
            } else if (addressType === 'postal_code') {
                identifiedLocation.zip = place.address_components[i].long_name;
            } else if (addressType !== 'administrative_area_level_2') {
                identifiedLocation.addressLine = identifiedLocation.addressLine + ' ' + place.address_components[i].long_name;
            }
        }
        identifiedLocation.geocoordinates.lng = place.geometry.viewport.b.b;
        identifiedLocation.geocoordinates.lat = place.geometry.viewport.f.f;
        if (identifiedLocation && identifiedLocation.addressLine && identifiedLocation.city && identifiedLocation.country) {
            this.setState({ ...this.state, location: identifiedLocation, autocompleteDone: true, invalidLocation: false });
            this.props.change('location.city', identifiedLocation.city);
            this.props.change('location.state', identifiedLocation.state);
            this.props.change('location.country', identifiedLocation.country);
            this.props.change('location.zip', identifiedLocation.zip);
            this.props.change('location.addressLine', identifiedLocation.addressLine);
            this.props.change('location.geocoordinates.lng', place.geometry.viewport.b.b);
            this.props.change('location.geocoordinates.lat', place.geometry.viewport.f.f);
        }
        else if (!identifiedLocation.addressLine || identifiedLocation.addressLine === '') {
            this.setState({ ...this.state, locErrorModalIsOpen: true, modalMessage: 'Select a more specific location.', invalidLocation: true });
            //window.alert("No details available for input: '" + place.name + "'");
            return;
        } else if (this.state.invalidLocation && this.refs.autoCompletePlaces.value !== '') {
            this.setState({ ...this.state, locErrorModalIsOpen: true, modalMessage: 'Select a location from suggested places.' });
            return;
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialValues && !isEmpty(nextProps.initialValues) && nextProps.initialValues.businessName && nextProps.initialValues.businessName.length > 0) {
            this.setState({ ...nextProps.initialValues, autocompleteDone: true });
            console.log({ ...nextProps.initialValues });
            this.forceUpdate();
        }

    }

    getCurrentLocation() {
        var geocoder = new google.maps.Geocoder;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                geocoder.geocode({ 'location': pos }, (results, status) => {
                    this.fillInAddressDetails(results[0]);
                })

            }, (error) => {
                this.setState({ ...this.state, locErrorModalIsOpen: true, modalMessage: 'Location is disabled in your browser. Please select a location from suggested places.' });
                //this.handleLocationError();
            });
        } else {
            // Browser doesn't support Geolocation
            this.setState({ ...this.state, locErrorModalIsOpen: true, modalMessage: 'Location is disabled in your browser. Please select a location from suggested places.' });
            //this.handleLocationError();
        }
    }

    handleLocationError() {
        alert('Location could not be retrieved');
    }

    addressChange(event) {
        this.refs.autoCompletePlaces.value = this.state.location.addressLine;
        let invalidLocation = {};
        invalidLocation.city = '';
        invalidLocation.state = '';
        invalidLocation.country = '';
        invalidLocation.zip = '';
        invalidLocation.addressLine = '';
        let geocoordinates = {};
        geocoordinates.lng = '';
        geocoordinates.lat = '';
        invalidLocation.geocoordinates = geocoordinates;
        this.setState({ ...this.state, location: invalidLocation, autocompleteDone: false, invalidLocation: true });
        this.props.change('location.city', '');
        this.props.change('location.state', '');
        this.props.change('location.country', '');
        this.props.change('location.zip', '');
        this.props.change('location.addressLine', '');
        this.props.change('location.geocoordinates.lng', '');
        this.props.change('location.geocoordinates.lat', '');

        // this.setState({ ...this.state, autocompleteDone: false, invalidLocation:true });
        this.forceUpdate();
    }

    onAddressBlur() {
        let lastFilledAddress = this.state.location.addressLine;
        let invalidLocation = {};
        invalidLocation.city = '';
        invalidLocation.state = '';
        invalidLocation.country = '';
        invalidLocation.zip = '';
        invalidLocation.addressLine = '';
        let geocoordinates = {};
        geocoordinates.lng = '';
        geocoordinates.lat = '';
        invalidLocation.geocoordinates = geocoordinates;
        this.setState({ ...this.state, location: invalidLocation, autocompleteDone: false, invalidLocation: true, lastFilledAddress: lastFilledAddress });
        this.props.change('location.city', '');
        this.props.change('location.state', '');
        this.props.change('location.country', '');
        this.props.change('location.zip', '');
        this.props.change('location.addressLine', '');
        this.props.change('location.geocoordinates.lng', '');
        this.props.change('location.geocoordinates.lat', '');
        this.forceUpdate();
    }



    handleChange(input, data) {
        let action = data.action;
        let selectedOption = data.option;
        if (action === 'select-option') {
            let selectedDish = { name: selectedOption.value, value: selectedOption.value, label: selectedOption.value }
            let existingDishes = this.state.dishes || [];
            let updatedDishes = [...existingDishes, selectedDish];
            this.setState({ ...this.state, dishes: updatedDishes });
            this.props.change('dishes', updatedDishes);
        } else if (action === 'remove-value') {
            // Remove item 'seven' from array
            let updatedDishesWithRemovedItem = this.state.dishes.filter(function (e) { return e.value !== data.removedValue.value })
            this.setState({ ...this.state, dishes: updatedDishesWithRemovedItem });
            this.props.change('dishes', updatedDishesWithRemovedItem);
        } else if (action === 'clear') {
            this.setState({ ...this.state, dishes: [] });
            this.props.change('dishes', []);
        }

    }

    loadDishOptions(inputValue) {
        let queryObj = {
            name: inputValue
        }
        return storeEntity('dish/query', queryObj).then(results => {
            return results.data;
        }).catch(error => { console.log(error) });
    }
    renderAutocomplete() {
        if (!this.state.autocompleteDone) {
            return (
                <input type="text"
                    id="autocomplete"
                    className={classes.inputField}
                    ref="autoCompletePlaces"
                />
            );
        } else {
            return (
                <Field component={RenderText}
                    type="input"
                    name="location.addressLine"
                    className={classes.inputField}
                    placeholder="Address Line"
                    value={this.state.dishes}
                    onFocus={this.onAddressBlur}

                />
            );
        }
    }
    // Code for Hours component start here
    //---------------------------------------------------------------------------------------------------------------------

    toTimeHoursChanged(e) {
        let updatedHours = { ...this.state.hours };
        updatedHours[this.state.selectedDayButton].to.hour = e.target.value;
        this.setState({ ...this.state, hours: updatedHours });
    }

    fromTimeHoursChanged(e) {
        let updatedHours = { ...this.state.hours };
        updatedHours[this.state.selectedDayButton].from.hour = e.target.value;
        this.setState({ ...this.state, hours: updatedHours });
    }

    toTimeMinutesChanged(e) {
        let updatedHours = { ...this.state.hours };
        updatedHours[this.state.selectedDayButton].to.minute = e.target.value;
        this.setState({ ...this.state, hours: updatedHours });

    }

    fromTimeMinutesChanged(e) {
        let updatedHours = { ...this.state.hours };
        updatedHours[this.state.selectedDayButton].from.minute = e.target.value;
        this.setState({ ...this.state, hours: updatedHours });
    }

    handleCheckboxClick(e) {
        let checkedDays = [...this.state.selectedDayCheckboxes];
        let updatedCheckedDays = [];
        if (checkedDays.indexOf(e.target.value) == -1) {
            e.target.checked = true;
            updatedCheckedDays = [...checkedDays, e.target.value];
        }
        else {
            e.target.checked = false;
            updatedCheckedDays = checkedDays.filter(item => item !== e.target.value);
        }
        this.setState({ ...this.state, selectedDayCheckboxes: updatedCheckedDays });
    }

    handleHoursModalOkBtn(event) {
        event.preventDefault();
        let updatedHours = { ...this.state.hours };
        let daysUpdated = [...this.state.selectedDayCheckboxes, this.state.selectedDayButton];
        // set hours of all the days for which checkbox have been checkedl 
        for (var i = 0; i < daysUpdated.length; i++) {
            let selectedDayCheckox = daysUpdated[i];
            if (!updatedHours[selectedDayCheckox]) {
                updatedHours[selectedDayCheckox] = {
                    from: {
                        hour: '00',
                        minute: '00',
                    },
                    to: {
                        hour: '23',
                        minute: '59',
                    },

                    closed: false,
                    userProvidedTime: false
                }
            }
            this.props.change('hours.' + selectedDayCheckox + '.from', this.state.hours[this.state.selectedDayButton].from);
            this.props.change('hours.' + selectedDayCheckox + '.to', this.state.hours[this.state.selectedDayButton].to);
            this.props.change('hours.' + selectedDayCheckox + '.userProvidedTime', true);
            this.props.change('hours.' + selectedDayCheckox + '.closed', this.state.hours[this.state.selectedDayButton].closed);
            updatedHours[selectedDayCheckox].from = this.state.hours[this.state.selectedDayButton].from;
            updatedHours[selectedDayCheckox].to = this.state.hours[this.state.selectedDayButton].to;
            updatedHours[selectedDayCheckox].userProvidedTime = true;
            updatedHours[selectedDayCheckox].closed = this.state.hours[this.state.selectedDayButton].closed;
        }
        this.setState({ ...this.state, hours: updatedHours, selectedDayButton: '', hoursModalIsOpen: false, selectedDayCheckboxes: [] });
    }

    handleCloseCheckboxClick(e) {
        let updatedHours = { ...this.state.hours };
        updatedHours[this.state.selectedDayButton].closed = !this.state.hours[this.state.selectedDayButton].closed;
        this.setState((prevState, props) => {
            return { ...prevState, hours: updatedHours }
        });
    }

    openHoursModal(event, name) {
        event.preventDefault();
        if (name) {
            this.setState((prevState, props) => {
                // Hours object does not exist in state, Initializing the object with default values.
                let updatedHours = { ...prevState.hours } || initializeHours();
                // Hours for that particular day does not exist
                if (!updatedHours[name.toLowerCase()]) {
                    updatedHours[name.toLowerCase()] = {
                        from: {
                            hour: '00',
                            minute: '00',
                        },
                        to: {
                            hour: '23',
                            minute: '59',
                        },

                        closed: false,
                        userProvidedTime: false
                    }
                }
                return { ...prevState, selectedDayButton: name.toLowerCase(), hoursModalIsOpen: true, hours: updatedHours };
            });
            this.props.change('hours.' + name.toLowerCase() + '.userProvidedTime', true);
        }
    }

    initializeHours() {
        return ({
            monday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',
                },

                closed: false,
                userProvidedTime: false
            },
            tuesday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',
                },
                closed: false,
                userProvidedTime: false
            },
            wednesday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',

                },
                closed: false,
                userProvidedTime: false
            },
            thursday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',
                },
                closed: false,
                userProvidedTime: false
            },
            friday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',
                },
                closed: false,
                userProvidedTime: false
            },
            saturday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',
                },
                closed: false,
                userProvidedTime: false
            },
            sunday: {
                from: {
                    hour: '00',
                    minute: '00',
                },
                to: {
                    hour: '23',
                    minute: '59',
                },
                closed: false,
                userProvidedTime: false
            }
        });
    }

    closeHoursModal() {
        this.setState({ ...this.state, selectedDayButton: '', hoursModalIsOpen: false, selectedDayCheckboxes: [] });
    }
    //---------------------------------------------------------------------------------------------------------------------
    // Code for Hours component end here

    render() {
        let suggestedDishInputStyle = this.state.suggestedDish.suggestedDishSaved ? { display: 'none' } : {};
        let suggestedDishLabelStyle = this.state.suggestedDish.suggestedDishSaved ? {} : { display: 'none' };
        let suggestedDishSaveBtnStyle = this.state.suggestedDish.suggestedDishSaved ?
            { display: 'none' } : { marginLeft: '10%', marginTop: '1%' }
        let suggestedDishCancelBtnStyle = this.state.suggestedDish.suggestedDishSaved ?
            { display: 'none' } : { marginTop: '1%' };
        let suggestedDishOkBtnStyle = this.state.suggestedDish.suggestedDishSaved ?
            { marginTop: '1%' } : { display: 'none' };


        const { handleSubmit, onSubmit } = this.props;
        return (
            <Aux>
                <Modal
                    isOpen={this.state.locErrorModalIsOpen}
                    onRequestClose={this.closeLocErrorModal}
                    style={customStylesGeolocation}
                    contentLabel="Invalid Location">

                    <label>{this.state.modalMessage}</label>
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={this.closeLocErrorModal}
                            className={classes.btnPopUp + ' ' + classes.btnPopUpFull}
                        >Ok</a>
                    </div>
                </Modal>
                <header className={classes.header}>
                    <img src="/img/logo.png" className={classes.logo}
                        onClick={this.handleLogoNavigation} style={{ width: '90px' }} />
                </header>
                <main className={classes.mainSection}>
                    <div className={classes.row}>
                        <h3>
                            Add Data
                        </h3>
                    </div>
                    <form method="post" id="addBusinssForm" onSubmit={handleSubmit(this.submitForm)}>
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="businessName">Name</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderText}
                                    type="input"
                                    name="businessName"
                                    className={classes.inputField}
                                    placeholder="Name"

                                />
                            </div>
                        </div>
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="description">Description</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderTextArea}
                                    type="textarea"
                                    name="description"
                                    className={classes.inputField}
                                    placeholder="Description"

                                />
                            </div>
                        </div>
                        {/*=============================== Business Address Fields * ===============================/}
                        {/*Business Address*/}
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="address1">Address</label>
                            </div>
                            <div className="col span-1-of-2">
                                {this.renderAutocomplete()}
                            </div>
                            <a href="#" className={classes.locationLinks} onClick={this.getCurrentLocation}>Current Location</a>
                            <a href="#" onClick={this.props.locateOnMap}
                                className={classes.locationLinks}>Locate On Map</a>
                        </div>
                        {/*Business Address 2*/}
                        <div className={classes.clearFloat} />
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="landmark">Landmark/Shop Details</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderText}
                                    type="input"
                                    name="location.landmark"
                                    className={classes.inputField}
                                    placeholder="Landmark"
                                />
                            </div>
                        </div>
                        {/*Business City*/}
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="city">City</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderText}
                                    type="input"
                                    name="location.city"
                                    className={classes.inputField}
                                    placeholder="City"
                                    disabled="true"

                                />
                            </div>
                        </div>
                        {/*Business State*/}
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="state">State</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderText}
                                    type="input"
                                    name="location.state"
                                    className={classes.inputField}
                                    placeholder="State"
                                    disabled="true"
                                />
                            </div>
                        </div>
                        {/*Business Country*/}
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="country">Country</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderText}
                                    type="input"
                                    name="location.country"
                                    className={classes.inputField}
                                    placeholder="Country"
                                    disabled="true"
                                />
                            </div>
                        </div>
                        {/*Business Country*/}
                        <div className={classes.row}>
                            <div className={'col span-1-of-2 ' + classes.label}>
                                <label htmlFor="zip">Zip/Pin</label>
                            </div>
                            <div className="col span-1-of-2">
                                <Field
                                    component={RenderText}
                                    type="input"
                                    name="location.zip"
                                    className={classes.inputField}
                                    placeholder="Zip/Pin"
                                />
                            </div>
                        </div>
                        {/*===============================Address Fields End* ===============================*/}

                        <div className={classes.row}>
                            <h4>Choice Sections</h4>
                        </div>
                        <FoodOptions onClick={(event, value, key) => { this.updateFoodOption(event, value, key) }} foodoptions={this.state.foodoptions} />
                        <HoursComponentSimplified
                            reduxchangefunc={this.props.change}
                            hours={this.state.hours || this.initializeHours()}
                            dirty={this.props.dirty}
                            toTimeHoursChanged={this.toTimeHoursChanged}
                            toTimeMinutesChanged={this.toTimeMinutesChanged}
                            fromTimeHoursChanged={this.fromTimeHoursChanged}
                            fromTimeMinutesChanged={this.fromTimeMinutesChanged}
                            handleCheckboxClick={this.handleCheckboxClick}
                            handleHoursModalOkBtn={this.handleHoursModalOkBtn}
                            openHoursModal={this.openHoursModal}
                            closeHoursModal={this.closeHoursModal}
                            selectedDayButton={this.state.selectedDayButton}
                            hoursModalIsOpen={this.state.hoursModalIsOpen}
                            handleCloseCheckboxClick={this.handleCloseCheckboxClick}

                        />
                        <div className={classes.row}>
                            <div className="col span-1-of-1"
                                className={classes.btnRow}>
                                <a
                                    onClick={this.handleCancelBtn}
                                    className={classes.btn + ' ' + classes.btnFull}
                                >Cancel</a>

                                <a
                                    onClick={this.handleAddBusinessrBtn}
                                    className={classes.btn + ' ' + classes.btnFull}
                                >Save</a>
                                <button
                                    id="submitBtn"
                                    type="submit"
                                    className={classes.hiddenBtn}
                                >SaveBtn</button>
                            </div>
                        </div>
                    </form>
                </main>
            </Aux>
        );
    }
}

// const mapStateToProps = function (state) {
//     return {
//         //formData: state.form,
//         initialValues: state.selectedBusiness
//     }
// }


// const mapStateToProps = state => ({
//     //formData: state.form,
//     initialValues: state.selectedBusiness
// });


//Client side validation
function validate(values) {
    const errors = {
        location: {}
    };
    if (values) {
        // Business Name 
        if (!values.businessName || values.businessName.trim() === '') {
            errors.businessName = 'Enter name';
        }
        // Address Line
        if (!values.location || !values.location.addressLine || values.location.addressLine.trim() === '') {
            errors.location.addressLine = 'Enter address line';
        }
        if (!values.location || !values.location.city || values.location.city.trim() === '') {
            errors.location.city = 'Enter city';
        }
        // state
        if (!values.location || !values.location.state || values.location.state.trim() === '') {
            errors.location.state = 'Enter state';
        }
        // country
        if (!values.location || !values.location.country || values.location.country.trim() === '') {
            errors.location.country = 'Enter country';
        }
    }

    return errors;
}


//Client side validation
function warn(values) {
    const warnings = {
        location: {}
    };
    // if (values) {
    //     if (!values.description || values.description.trim() === '') {
    //         warnings.description = 'Providing description helps users to decide';
    //     }
    //     if (!values.location || !values.location.zip || values.location.zip.trim() === '') {
    //         warnings.location.zip = 'Providing zip help to locate business';

    //     }
    //     if (!values.location || !values.location.landmark || values.location.landmark.trim() === '') {
    //         warnings.location.landmark = 'Providing landmark helps user find the business';
    //     }
    // }
    return warnings;
}

const mapDispatchToProps = function (dispatch) {
    return {
        fetchByIdLocal: (entity, id) => dispatch(fetchById(entity, id))
    };
    // return bindActionCreators({ fetchById: dispatch(fetchById) }, dispatch);
};


let addBusinessReduxForm = reduxForm({
    form: 'addbusinessForm',
    validate: validate,
    warn: warn,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
})(AddBusiness)

addBusinessReduxForm = connect(
    state => {
        if (state.form && state.form.addbusinessForm && state.form.addbusinessForm.values) {
            return {
                data: { ...state.form.addbusinessForm.values }
            }
        } else {
            return {
                data: {
                    businessName: '',
                    description: '',
                    location: {
                        addressLine: '',
                        landmark: '',
                        city: '',
                        state: '',
                        country: '',
                        zip: '',
                        geocoordinates: {
                            lat: '',
                            lng: ''
                        },
                    },
                    foodoptions: {
                        cuisine: [],
                        mealtype: [],
                        dishtype: [],
                        flavor: [],
                        beverages: []
                    },
                    dishes: [],
                    contactdetails: {
                        phoneNumber: ''
                    },
                    hours: {
                        monday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',
                            },

                            closed: false,
                            userProvidedTime: false
                        },
                        tuesday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',
                            },
                            closed: false,
                            userProvidedTime: false
                        },
                        wednesday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',

                            },
                            closed: false,
                            userProvidedTime: false
                        },
                        thursday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',
                            },
                            closed: false,
                            userProvidedTime: false
                        },
                        friday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',
                            },
                            closed: false,
                            userProvidedTime: false
                        },
                        saturday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',
                            },
                            closed: false,
                            userProvidedTime: false
                        },
                        sunday: {
                            from: {
                                hour: '00',
                                minute: '00',
                            },
                            to: {
                                hour: '23',
                                minute: '59',
                            },
                            closed: false,
                            userProvidedTime: false
                        }
                    }
                }
            }
        }
    }
)(addBusinessReduxForm);






export default connect(null, mapDispatchToProps)(addBusinessReduxForm);


