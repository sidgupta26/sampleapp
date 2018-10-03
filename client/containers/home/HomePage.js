import React, { Component } from 'react';
import classes from './HomePage.css'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { search } from '../../actions/SearchAction';
import Aux from '../../hoc/aux/Aux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';


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

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serchTerm: '',
            location: {
                place: '',
                lat: '',
                long: '',
                blank: true

            },
            modalIsOpen: false,
            modalMessage: '',
            invalidLocation: true,
            locationFetchModalIsOpen :false
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.initAutocomplete = this.initAutocomplete.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.clearLocationField = this.clearLocationField.bind(this);
        this.getSearchTermInputIcon = this.getSearchTermInputIcon.bind(this);
        this.clearSearchTermField = this.clearSearchTermField.bind(this);

    }

    closeModal() {
        this.setState({ ...this.state, modalIsOpen: false });
    }

    openModal() {
        this.setState({ ...this.state, modalIsOpen: true });
    }

    getCurrentLocation() {

        if (navigator.geolocation) {
            this.setState({ ...this.state, locationFetchModalIsOpen: true });
            navigator.geolocation.getCurrentPosition((position) => {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var geocoder = new google.maps.Geocoder;
                var address = '';
                geocoder.geocode({ 'location': pos }, (results, status) => {
                    let result = results[0];
                    console.log(result);
                    if (result) {
                        for (var i = 0; i < result.address_components.length; i++) {
                            var addressType = result.address_components[i].types[0];
                            if (addressType === 'locality') {
                                address = address + ' ' + result.address_components[i].long_name;
                            } else if (addressType === 'administrative_area_level_1') {
                                address = address + ' ' + result.address_components[i].long_name;
                            } else if (addressType === 'country') {
                                address = address + ' ' + result.address_components[i].long_name;
                            } else if (addressType === 'postal_code') {
                                address = address + ' ' + result.address_components[i].long_name;
                            } else if (addressType !== 'administrative_area_level_2') {
                                address = address + ' ' + result.address_components[i].long_name;
                            }
                        }
                    } else {
                        address = position.coords.latitude + ',' + position.coords.longitude;
                    }
                    address = address ? address.trim() : '';
                    this.refs.autoCompletePlaces.value = address;
                    this.setState({
                        ...this.state,
                        location: {
                            lat: position.coords.latitude,
                            long: position.coords.longitude,
                            place: address,
                            blank:false
                        },
                        invalidLocation: false,
                        locationFetchModalIsOpen: false
                    });
                });
            }, error => {
                this.setState({ ...this.state, modalIsOpen: true, modalMessage: 'Error getting your location. Please select a location from suggested places.',   locationFetchModalIsOpen: false });
            });
        } else {
            this.setState({ ...this.state, modalIsOpen: true, modalMessage: 'Location is disabled in your browser. Please select a location from suggested places.' });
        }

    }
    handleOnClick(event) {
        event.preventDefault();
        let place = this.refs.autoCompletePlaces.value;
        this.setState({ ...this.state, place: place });
        // this.props.search(this.state.serchTerm, this.state.location);
        if ((this.state.invalidLocation && this.refs.autoCompletePlaces.value !== '') || this.state.location.lat === '') {
            this.setState({ ...this.state, modalIsOpen: true, modalMessage: 'Select a location from suggested places.' });
            return;
        }
        else {
            this.navigateToSearchResultsPage();
        }
    }

    navigateToSearchResultsPage() {
        this.props.history.push({
            pathname: '/searchResults',
            search: '?searchTerm=' + (this.state.serchTerm) + '&lat=' +
            this.state.location.lat + '&long=' + this.state.location.long + '&place=' + this.state.location.place
        });
    }

    initAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete((this.refs.autoCompletePlaces), { types: ['geocode'] });
        autocomplete.addListener('place_changed', () => {
            this.setState({ ...this.state, invalidLocation: true });
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                return;
            }

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
            this.setState({
                ...this.state,
                location: {
                    lat: place.geometry.location.lat(),
                    long: place.geometry.location.lng(),
                    place: this.refs.autoCompletePlaces.value,
                    blank:false
                },
                invalidLocation: false
            }
            )
        });
    }

    componentDidMount() {
        this.initAutocomplete();
    }

    handleSearchTermChange(event) {
        this.setState({
            ...this.state, serchTerm: event.target.value
        })
    }

    clearLocationField() {
        this.refs.autoCompletePlaces.value = '';
        this.setState({
            ...this.state,
            location: {
                place: '',
                lat: '',
                long: '',
                blank: true
            }
        });
    }

    clearSearchTermField() {
        this.setState({ ...this.state, serchTerm: '' });
    }

    handleLocationChange(e) {
        if (e.target.value === '') {
            let updatedLocation = { ...this.state.location, blank: true }
            this.setState({ ...this.state, location: updatedLocation });
        } else {
            let updatedLocation = { ...this.state.location, blank: false }
            this.setState({ ...this.state, location: updatedLocation });
        }
    }

    getLocationInputIcon() {
        console.log(this.state.location.blank);
        if (!this.state.location.blank) {
            return (
                <i onClick={this.clearLocationField} className={'far fa-times-circle fa-lg ' + classes.errspan} ></i>
            )
        } else {
            return (
                <i onClick={this.getCurrentLocation} className={'fas fa-location-arrow fa-lg ' + classes.errspan}></i>
            )
        }
    }

    getSearchTermInputIcon() {
        if (this.state.serchTerm !== '') {
            return (
                <i onClick={this.clearSearchTermField} className={'far fa-times-circle fa-lg ' + classes.errspan} ></i>
            );

        }
    }

    render() {
        const btnStyleAdd = classes.btnAddBusiness + ' ' + classes.btnFull;
        const btnStyleSearch = classes.btn + ' ' + classes.btnFull;
        return (
            <Aux>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Invalid Location">

                    <label>{this.state.modalMessage}</label>
                    <div style={{ textAlign: 'center' }}>
                        <a
                            onClick={this.closeModal}
                            className={classes.btnPopUp + ' ' + classes.btnPopUpFull}
                        >Ok</a>
                    </div>
                </Modal>
                 <Modal
                    isOpen={this.state.locationFetchModalIsOpen}
                    style={customStyles}
                    contentLabel="Fetching Location">
                    <label>Fetching Location...</label>
                </Modal>
                <header className={classes.header}>
                    <nav>
                        <div>
                            <img src="/img/logo.png" alt="Company Logo"
                                className={classes.logo} />
                            <ul className={classes.homepageNav} >
                                <li>
                                    <Link className={btnStyleAdd} to="/addBusiness">Add Data</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className={classes.heroTextBox}>
                        <div>
                            <input type="input"
                                className={classes.inputField}
                                placeholder="Find:"
                                value={this.state.serchTerm}
                                onChange={this.handleSearchTermChange}

                            />
                            {this.getSearchTermInputIcon()}
                            <input type="input"
                                id="autocomplete"
                                className={classes.inputField}
                                placeholder="Near: address, neighborhood, city or zip"
                                ref="autoCompletePlaces"
                                onChange={(e) => this.handleLocationChange(e)}
                            />
                            {this.getLocationInputIcon()}
                            <a className={btnStyleSearch}
                                onClick={this.handleOnClick}>Search</a>
                        </div>
                    </div>
                </header>
                <section style={{ backgroundColor: '#e4e2e2' }}>
                    <div className={classes.row}>
                        <h2 className={classes.heading + ' ' + classes.homePageH2}>
                            Sample App</h2>
                    </div>
                    <div className={classes.row}>
                        <p className={classes.tagLine}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>

                </section>
                <section style={{ marginBottom: '30px' }}>
                    <div className={classes.row}>
                        <h2 className={classes.heading + ' ' + classes.homePageH2} style={{ backgroundColor: 'white' }}>
                            SECTION 2</h2>
                    </div>
                    <div className={classes.row}>
                        <div className={'col span-1-of-3 ' + classes.phoneImage}>
                            <img style={{ height: '300px' }} src="/img/phone.jpg" alt="screenshot" />
                        </div>
                        <div className={'col span-1-of-3 ' + classes.contributor}>
                            <b>Column 1</b>
                            <ul>
                                <li>a pellentesque sit amet porttitor</li>
                                <li>sed risus ultricies tristique nulla</li>
                                <li>quam quisque id diam vel</li>
                            </ul>
                        </div>
                        <div className={'col span-1-of-3 ' + classes.seeker}>
                            <b>Column 2</b>
                            <ul>
                                <li>at augue eget arcu dictum</li>
                                <li>vel quam elementum pulvinar etiam</li>
                                <li>ac odio tempor orci dapibus</li>
                            </ul>
                        </div>
                    </div>
                </section>
                <div style={{ clear: 'both' }}></div>
                <footer>
                    <div className="row">
                        <p>
                            Copyright &copy; 2018 by Sample Company. All rights reserved.
                        </p>
                    </div>

                </footer>
            </Aux>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ search: search }, dispatch);

}
export default withRouter(connect(null, mapDispatchToProps)(HomePage));
