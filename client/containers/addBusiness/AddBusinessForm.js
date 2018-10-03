'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddBusiness from './AddBusiness'
import GoogleMap from '../../components/map/GoogleMap';
import { updateEntity, storeEntity } from '../../services/httpService';


class AddBusinessForm extends Component {
    constructor(props) {
        super(props)
        this.handleDone = this.handleDone.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.locateOnMap = this.locateOnMap.bind(this);
        // this.submitForm = this.submitForm.bind(this);
        this.handleMapLocation = this.handleMapLocation.bind(this);
        this.state = {
            page: 1,
            selectedMapLocation: {
                lat: -9999,
                lng: -9999
            }
        }
    }
   
    handleDone() {
        this.setState({ page: this.state.page - 1 });
    }

    handleCancel() {
        this.setState({
            ...this.state, page: this.state.page - 1,
             selectedMapLocation: {
                lat: -9999,
                lng: -9999
            }
        });


    }

    locateOnMap() {
        this.setState({ page: this.state.page + 1 });
    }

    handleMapLocation(latLngObject) {
        let lat = latLngObject.lat();
        let lng = latLngObject.lng();
        this.setState({
            ...this.state, selectedMapLocation: {
                lat: lat,
                lng: lng
            }
        });
    }

    render() {
        const { page } = this.state
        return (
            <div>
                {page === 1 && (
                    <AddBusiness
                        locateOnMap={this.locateOnMap} {...this.props}
                        selectedMapLocation={this.state.selectedMapLocation}
                    />
                )}
                {page === 2 && (
                    <GoogleMap
                        handleCancel={this.handleCancel}
                        handleDone={this.handleDone}
                        handleMapLocation={this.handleMapLocation}
                    />
                )}
            </div>
        )
    }
}

export default AddBusinessForm