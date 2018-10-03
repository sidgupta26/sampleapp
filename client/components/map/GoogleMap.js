'use strict'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux';
import Aux from '../../hoc/aux/Aux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import classes from './GoogleMap.css';
import { Field, reduxForm } from 'redux-form';
import RenderText from '../form/RenderText';

class GoogleMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLocation: {
                lat: 37.36,
                lng: -122.012
            },
            marker: null,
            map: null
        }
        this.initialize = this.initialize.bind(this);
        // this.addMarker = this.addMarker.bind(this);
        // this.handleDone = this.handleDone.bind(this);
        // this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.initialize();
    }

    initialize() {
        // Map initialization
        var pos = null;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.setState({ selectedLocation: pos });
                this.state.map.setCenter(this.state.selectedLocation);
                this.state.marker.setPosition(pos);
                this.state.marker.setAnimation(google.maps.Animation.DROP);

                this.props.change('mapSelectedLat', position.coords.latitude);
                this.props.change('mapSelectedLng', position.coords.longitude);
                let latLngObj = new google.maps.LatLng(pos.lat, pos.lng);
                this.props.handleMapLocation(latLngObj);

            }, () => {
                alert('Location could not be retrieved');
            });
        } else {
            alert('Location could not be retrieved');
        }
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);
        var map = new google.maps.Map(node, {
            zoom: 15,
            center: this.state.selectedLocation,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            draggable: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            }
        });

        // Marker should not be created on each click 

        let markerLocation = map.getCenter();
        var marker = new google.maps.Marker({
            map: map,
            position: markerLocation,
            //draggable: true,
            title: 'Street Food',
            animation: google.maps.Animation.DROP

        });

        google.maps.event.addListener(map, 'center_changed', () => {
            let latLng = map.getCenter();
            this.setState({
                ...this.state, selectedLocation: {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                }
            });
            this.state.marker.setPosition(latLng);

            this.props.change('mapSelectedLat', latLng.lat());
            this.props.change('mapSelectedLng', latLng.lng());
            this.props.handleMapLocation(latLng);
        });

        // // This event listener calls addMarker() when the map is clicked.
        // google.maps.event.addListener(marker, 'dragend', (ev) => {
        //     //alert(marker.getPosition()); // new LatLng-Object after dragend-event...
        //     let latLng = marker.getPosition();
        //     this.setState({
        //         ...this.state, selectedLocation: {
        //             lat: latLng.lat(),
        //             lng: latLng.lng()
        //         }
        //     });

        //     this.props.change('mapSelectedLat', latLng.lat());
        //     this.props.change('mapSelectedLng', latLng.lng());
        //     this.props.handleMapLocation(latLng);
        // });



        //this.initSearchBox(map);
        const searchBoxRef = this.refs.searchBox;
        let searchBoxNode = ReactDOM.findDOMNode(searchBoxRef);

        // Search Div
        const searchDivRef = this.refs.searchBox;
        let searchDivNode = ReactDOM.findDOMNode(searchDivRef);
        var searchBox = new google.maps.places.SearchBox(searchBoxNode);

        // Continue button 
        const continueDivRef = this.refs.continueDiv;
        let continueDivDivNode = ReactDOM.findDOMNode(continueDivRef);

        // Cancel Button
        const cancelDivRef = this.refs.cancelDiv;
        let cancelDivDivNode = ReactDOM.findDOMNode(cancelDivRef);

        // Adding controls to map
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchDivNode);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(continueDivDivNode);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(cancelDivDivNode);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });
        this.setState({ ...this.state, map: map, marker: marker });
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', () => {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                // Show an error diaglog here 
                return;
            }
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry) {
                    return;
                }
                // var icon = {
                //     url: place.icon,
                //     size: new google.maps.Size(71, 71),
                //     origin: new google.maps.Point(0, 0),
                //     anchor: new google.maps.Point(17, 34),
                //     scaledSize: new google.maps.Size(25, 25)
                // };

                // Create a marker for each place.
                this.state.marker.setPosition(place.geometry.location);
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
                this.props.change('mapSelectedLat', place.geometry.location.lat());
                this.props.change('mapSelectedLng', place.geometry.location.lng());
                this.props.handleMapLocation(place.geometry.location);
            });
            map.fitBounds(bounds);

        });

        // Adding default locations data to ensure that it is captured
        this.props.change('mapSelectedLat', this.state.selectedLocation.lat);
        this.props.change('mapSelectedLng', this.state.selectedLocation.lng);
        let defaultLatLngObj = new google.maps.LatLng(this.state.selectedLocation.lat, this.state.selectedLocation.lng);
        this.props.handleMapLocation(defaultLatLngObj);

    }

    componentWillUnmout() {
        this.props.change('mapSelectedLat', this.state.selectedLocation.lat);
        this.props.change('mapSelectedLng', this.state.selectedLocation.lng);
        const containerRef = this.refs.container;
        const containerNode = ReactDOM.findDOMNode(containerRef);
        ReactDOM.unmountComponentAtNode(containerNode);

    }

    render() {
        return (
            <Aux>
                <div id="container" ref="container">
                    <div id="map" ref="map" style={{ height: '100vh' }} />
                    <div ref="searchDiv">
                        <input type="text" ref="searchBox" className={'controls ' + classes.inputField}
                            placeholder="Enter a location" />
                    </div>
                    <div ref="continueDiv">
                        <a href="#" className={classes.btn + ' ' + classes.btnFull} onClick={this.props.handleDone}>Done</a>
                    </div>
                    <div ref="cancelDiv">
                        <a href="#" className={classes.btn + ' ' + classes.btnFull} onClick={this.props.handleCancel}>Cancel</a>
                    </div>
                    <Field
                        component={RenderText}
                        type="hidden"
                        name="mapSelectedLat"
                        style={{ display: 'none' }}
                    />
                    <Field
                        component={RenderText}
                        type="hidden"
                        name="mapSelectedLng"
                        style={{ display: 'none' }}
                    />
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = state => ({
});

const googleMapReduxForm = reduxForm({
    form: 'addbusinessForm', // required by reduxForm()
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
})(GoogleMap)

export default googleMapReduxForm;