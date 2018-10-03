import React, { Component } from 'react';
import classes from './SearchBar.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { search } from '../../actions/SearchAction';
import Aux from '../../hoc/aux/Aux';
import { withRouter } from 'react-router'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serchTerm: '',
            location: {
                lat: '',
                long: ''
            }
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
        this.initAutocomplete = this.initAutocomplete.bind(this);
    }
    componentDidMount() {
        this.initAutocomplete();
    }

    initAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete((this.refs.autoCompletePlaces), { types: ['geocode'] });
        autocomplete.addListener('place_changed', () => {

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
                    lat: 40.7128,
                    long: 74.0060
                }
            }
            )
        });
    }

    handleOnClick(event) {
        this.props.search(this.state.serchTerm, this.state.location);
        this.props.history.push({
            pathname: '/searchResults',
            search: '?searchTerm=' + (this.state.serchTerm) + '&lat=' +
            this.state.location.lat + '&long=' + this.state.location.lat
        });

    }

    handleSearchTermChange(event) {
        this.setState({
            ...this.state, serchTerm: event.target.value
        })
    }
    render() {
        return (
            <form style={{height: '100%'}}>
                    <div className="row align-items-center" style={{height:'inherit'}}>
                        <div className="col-md-2" />
                        <div className="col-md-4" style={{ paddingRight: '0px', verticalAlign: 'middle' }}>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-default">Find</span>
                                </div>
                                <input type="text"
                                    className="form-control"
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={this.state.serchTerm}
                                    onChange={this.handleSearchTermChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-4" style={{ paddingLeft: '0px', verticalAlign: 'middle' }}>
                            <div className="input-group">
                                <input
                                    id="autocomplete"
                                    placeholder="Enter your address"
                                    ref="autoCompletePlaces"
                                    className="form-control"
                                    placeholder="Location"
                                    aria-label="Location"
                                    aria-describedby="basic-addon2" />

                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={this.handleOnClick}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2" />
                </div>
            </form >


        );


    }


}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ search: search }, dispatch);

}
export default withRouter(connect(null, mapDispatchToProps)(SearchBar));