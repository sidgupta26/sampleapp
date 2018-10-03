'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchResult from './SearchResult';
import Aux from '../../hoc/aux/Aux';
import classes from './SearchResultList.css';
import { bindActionCreators } from 'redux';
import { search } from '../../actions/SearchAction';
import { fetchEntity } from '../../services/httpService';
import { storeEntity } from '../../services/httpService';
import queryString from 'query-string';
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

class SearchResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            searchTerm: '',
            location: {
                lat: '',
                lng: '',
                place: '',
                blank: false
            },
            modalIsOpen: false,
            modalMessage: '',
            invalidLocation: false,
            dataRetrievalComplete: false,
            locationFetchModalIsOpen :false


        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.initAutocomplete = this.initAutocomplete.bind(this);
        this.renderSearchResults = this.renderSearchResults.bind(this);
        this.selectBusiness = this.selectBusiness.bind(this);
        this.handleLogoNavigation = this.handleLogoNavigation.bind(this);
        this.retrieveAndPopulateSearchResults = this.retrieveAndPopulateSearchResults.bind(this);
        this.retrieveSearchResult = this.retrieveSearchResult.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.navigateToSearchResultsPage = this.navigateToSearchResultsPage.bind(this);
        this.onPlaceChange = this.onPlaceChange.bind(this);
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

    componentDidMount() {
        this.initAutocomplete();
        let queryParameters = queryString.parse(this.props.location.search);
        let searchTerm = queryParameters.searchTerm && queryParameters.searchTerm !== 'undefined' ? queryParameters.searchTerm : '';
        let searchLat = '';
        let searchLng = '';
        let place = '';
        if (queryParameters.lat && queryParameters.long) {
            console.log('COmponent mounted');
            searchLat = queryParameters.lat;
            searchLng = queryParameters.long;
            place = queryParameters.place;
            let updatedLocation = {
                ...this.state.location,
                lat: searchLat,
                lng: searchLng,
                place: place,
                blank: false
            }
            this.refs.autoCompletePlaces.value = place;
            this.setState({
                ...this.state, searchTerm: searchTerm, location: updatedLocation,
                searchResults: [], dataRetrievalComplete: false
            }, () => this.retrieveAndPopulateSearchResults(searchTerm, searchLat, searchLng, place));


        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.location.search !== prevProps.location.search || this.state.emptyLocation) {
            let queryParameters = queryString.parse(this.props.location.search);
            let searchTerm = queryParameters.searchTerm && queryParameters.searchTerm !== 'undefined' ? queryParameters.searchTerm : '';
            let searchLat = '';
            let searchLng = '';
            let place = ''
            if (queryParameters.lat && queryParameters.long) {
                searchLat = queryParameters.lat;
                searchLng = queryParameters.long;
                place = queryParameters.place;
            }
            this.setState({ ...this.state, searchResults: [], dataRetrievalComplete: false });
            this.retrieveAndPopulateSearchResults(searchTerm, searchLat, searchLng, place);
        }
    }
    retrieveAndPopulateSearchResults(searchTermLocal, latLocal, lngLocal) {
        if (!latLocal && !lngLocal || this.state.location.blank) {
            this.setState({
                ...this.state,
                modalIsOpen: true,
                modalMessage: 'Select a location from suggested places.',
                dataRetrievalComplete: true,
                searchResults: []

            });
            return;

        } else {
            this.retrieveSearchResult(searchTermLocal, latLocal, lngLocal);
        }
    }

    retrieveSearchResult(searchTerm, searchLat, searchLng) {
        let trimmedSearchTerm = searchTerm ? searchTerm.trim() : '';
        let results = storeEntity('business/query', {
            searchTerm: trimmedSearchTerm,
            searchLat: searchLat,
            searchLng: searchLng
        }
        );
        // let results = fetchEntity('business');
        results.then(results => {
            this.setState({
                ...this.state,
                searchResults: results.data,
                dataRetrievalComplete: true
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                ...this.state,
                searchResults: [],
                dataRetrievalComplete: true
            });

        });
    }

    navigateToSearchResultsPage() {
        let searchTerm = this.state.searchTerm && this.state.searchTerm !== 'undefined' ? this.state.searchTerm : '';
        this.props.history.push({
            pathname: '/searchResults',
            search: '?searchTerm=' + searchTerm + '&lat=' +
            this.state.location.lat + '&long=' + this.state.location.lng + '&place=' + this.state.location.place
        });
    }

    initAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete((this.refs.autoCompletePlaces), { types: ['geocode'] });
        autocomplete.addListener('place_changed', () => {
            // Place has changed, so setting the invalid location flag to true, 
            // This will be set to false once the location has been selected
            // by the user. 
            console.log('Place changed');
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
                    lng: place.geometry.location.lng(),
                    place: this.refs.autoCompletePlaces.value,
                    blank: false
                },
                invalidLocation: false
            }
            )
        });
    }

    selectBusiness(selectedBusiness) {
        //Setting search term and location in component state.
        this.props.history.push({
            pathname: '/businessDetails/' + selectedBusiness._id,
        });
    }

    componentDidCatch(error, info) {
        console.log('Error thrown');
        // Display fallback UI
        this.setState({ ...this.state, searchResults: [], dataRetrievalComplete: true });
        // // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
    }


    handleOnClick(event) {
        //Setting search term and location in component state.
        event.preventDefault();
        console.log(this.state);
        if (this.state.invalidLocation || this.state.location.lat === '' || this.state.location.blank) {
            this.setState({ ...this.state, modalIsOpen: true, modalMessage: 'Select a location from suggested places or get current location.' });
            return;
        }
        // proper location is selected by user with the help 
        // of google places API, Just redirect to search page 
        // again with new query parameters
        this.navigateToSearchResultsPage();
    }

    handleLogoNavigation() {
        this.props.history.push({
            pathname: '/'
        });
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
        this.setState({ ...this.state, searchTerm: '' });
    }


    handleSearchTermChange(event) {
        this.setState({
            ...this.state, searchTerm: event.target.value
        })
    }

    routeToAddStreetFood() {
        this.props.history.push({
            pathname: '/addBusiness'
        });
    }

    renderSearchResults() {
        if (this.state.searchResults && this.state.searchResults.length > 0) {
            return this.state.searchResults.map((business, index) => <SearchResult key={index} searchResult={business} selectBusiness={this.selectBusiness} />);
        } else if ((!this.state.searchResults || this.state.searchResults.length === 0) && this.state.dataRetrievalComplete) {
            return (<div>
                <div className="col span-1-of-5"></div>
                <div className={"col span-3-of-5 " + classes.noResultsFound}>
                    No results found. Add data <Link to='/addBusiness'>here</Link>.
                        </div>
                <div className="col span-1-of-3"></div>
            </div>);
        } else if (!this.state.dataRetrievalComplete) {
            //Data fetching not complete
            return (<div>
                <div className="col span-1-of-5"></div>
                <div className={"col span-3-of-5 " + classes.noResultsFound}>
                    Fetching Data...
                        </div>
                <div className="col span-1-of-3"></div>
            </div>);

        }

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
                            lng: position.coords.longitude,
                            place: address,
                            blank: false
                        },
                        invalidLocation: false,
                        locationFetchModalIsOpen: false 
                    });
                });
            }, error => {
                this.setState({ ...this.state, modalIsOpen: true, modalMessage: 'Error getting your location. Please select a location from suggested places.', locationFetchModalIsOpen: false  });
            });
        } else {
            this.setState({ ...this.state, modalIsOpen: true, modalMessage: 'Location is disabled in your browser. Please select a location from suggested places.' });
        }

    }
    onPlaceChange(e) {
        console.log(e.target.value);
        // Locatin is invalid only when there is some characters in 
        // place input html
        if (e.target.value !== '') {
            let updatedLocation = { ...this.state.location, blank: false };
            this.setState({ ...this.state, location: updatedLocation });
        } else {
            let updatedLocation = { ...this.state.location, blank: true };
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
        if (this.state.searchTerm !== '') {
            return (
                <i onClick={this.clearSearchTermField} className={'far fa-times-circle fa-lg ' + classes.errspan} ></i>
            );

        }
    }

    render() {
        const buttonStyle = classes.btn + ' ' + classes.btnFull;
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
                    <img src="/img/logo.png" className={classes.logo} style={{ width: '90px' }}
                        onClick={this.handleLogoNavigation} />
                    <div className={classes.row}>
                        <input
                            type="text"
                            className={classes.inputField}
                            placeholder="Find: Tacos, Momos, Samosa..."
                            onChange={this.handleSearchTermChange}
                            value={this.state.searchTerm}
                        />
                        {this.getSearchTermInputIcon()}
                        <input
                            type="text"
                            id="autocomplete"
                            className={classes.inputField}
                            placeholder="Near: address, neighborhood, city or zip"
                            ref="autoCompletePlaces"
                            onChange={this.onPlaceChange}
                        />
                        {this.getLocationInputIcon()}
                        <a
                            className={buttonStyle}
                            onClick={this.handleOnClick}>
                            Search</a>
                    </div>
                </header>
                <main>
                    <section>
                        {this.renderSearchResults()}
                    </section>
                </main>
            </Aux>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ search: search }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchResultList)
