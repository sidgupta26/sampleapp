'use strict'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Aux from '../../hoc/aux/Aux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import classes from './Details.css';
import { fetchEntityById } from '../../services/httpService';
import { fetchById } from '../../actions/CrudActions';
import ImageGallery from 'react-image-gallery';




class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            business: {},
            modalIsOpen: false,
            dataRetreivalDone: false

        }
        this.renderImage = this.renderImage.bind(this);
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.renderAddress = this.renderAddress.bind(this);
        this.getFoodOptions = this.getFoodOptions.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAddPhoto = this.handleAddPhoto.bind(this);
        this.goBack = this.goBack.bind(this);
        this.handleLogoNavigation = this.handleLogoNavigation.bind(this);
        this.getDishes = this.getDishes.bind(this);
        this.handleFoodOptionsBtnClick = this.handleFoodOptionsBtnClick.bind(this);
        this.getAddressLine1 = this.getAddressLine1.bind(this);
        this.getLandmark = this.getLandmark.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getImageList = this.getImageList.bind(this);
        this.getGoogleMapDirectionsUrl = this.getGoogleMapDirectionsUrl.bind(this);
        this.getGoogleMapDisplayUrl = this.getGoogleMapDisplayUrl.bind(this);
        this.getGoBackButton = this.getGoBackButton.bind(this);

    }

    getGoBackButton() {
        return (
            <a className={classes.btn + ' ' + classes.btnFull} onClick={this.props.history.goBack}>Back</a>
        );
    }

    getGoogleMapDirectionsUrl() {
        let location = this.state.business.location;
        if (location) {
            let lat = location.geocoordinates.lat;
            let lng = location.geocoordinates.lng;
            let url = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;
            return url;
        }
    }

    getGoogleMapDisplayUrl() {
        let location = this.state.business.location;
        if (location) {
            let lat = location.geocoordinates.lat;
            let lng = location.geocoordinates.lng;
            let url = 'https://www.google.com/maps/@?api=1&map_action=map&center=' + lat + ',' + lng + '&zoom=12';
            return url;
        }
    }

    getImageList() {
        let images = this.state.business.imageUrls;
        let modifiedImageList = images ? images.map(item => {
            let imageUlr = item.url;
            //image url stord in database
            //https://res.cloudinary.com/dugvao0q8/image/upload/v1536541675/businessimages/Screen_Shot_2017-06-24_at_7.16.45_PM_g1dc0p.png
            // compressed image url 
            //https://res.cloudinary.com/dugvao0q8/image/upload/fl_progressive:steep,q_auto:low/v1536635978/businessimages/Screen_Shot_2017-06-24_at_7.16.45_PM_bbun01.png
            //http://res.cloudinary.com/dugvao0q8/image/upload/q_auto:low/v1536628207/businessimages/image_apk8ew.jpg
            let compressedImageUrl = imageUlr.replace('image/upload/', 'image/upload/fl_progressive:steep,q_auto:low/');
            return {
                original: compressedImageUrl
            }
        }) : [];
        return modifiedImageList;

    }
    handleEdit() {
        //this.props.fetchByIdLocal('business', this.state.business._id);
        this.props.history.push({
            pathname: '/addBusiness/' + this.state.business._id,
        });
    }

    handleAddPhoto() {
        this.props.history.push({
            pathname: '/' + this.state.business._id + '/uploadImage/'
        });
    }

    goBack() {
        this.props.history.goBack();
    }

    handleLogoNavigation() {
        this.props.history.push({
            pathname: '/'
        });
    }

    openModal() {
        this.setState({ ...this.state, modalIsOpen: true });
    }

    closeModal() {
        this.setState({ ...this.state, modalIsOpen: false });
    }


    componentDidMount() {
        let businessId = this.props.match.params.id;

        fetchEntityById('business', businessId).then(result => {
            this.setState({ business: result.data, dataRetreivalDone: true });
            this.handleMapLoad();
        }).catch(error => {
            console.log(error);
            this.handleMapLoad();
            this.setState({ dataRetreivalDone: true });
        });
    }

    renderAddress() {
        const location = this.state.business.location;
        return (
            <div className={classes.searchResultAddress}>
                {this.getAddressLine1(location)}
                {this.getLandmark(location)}
                {location ? location.city : ''} , {location ? location.state : ''} <br />
                {location ? location.country : ''},{location ? location.zip : ''} <br />
            </div>
        );
    }

    getAddressLine1(location) {
        if (location && location.addressLine && location.addressLine.trim() !== '') {
            return (
                <div>
                    {location.addressLine} <br />
                </div>
            )
        }
    }


    getLandmark(location) {
        if (location && location.landmark && location.landmark.trim() !== '') {
            return (
                <div>
                    {location.landmark} <br />
                </div>
            )
        }
    }


    handleMapLoad() {
        var location = {
            lat: Number(this.state.business.location.geocoordinates.lat),
            lng: Number(this.state.business.location.geocoordinates.lng)
        }
        var map = new google.maps.Map(this.refs.map, {
            zoom: 12,
            center: location
        });
        this.addMarker(location, map, this.state.business.businessName);
    }

    // Adds a marker to the map.
    addMarker(location, map, businessName) {
        var marker = new google.maps.Marker({
            position: location,
            label: businessName,
            map: map
        });
    }
    handleFoodOptionsBtnClick(e) {
        e.preventDefault();
    }

    renderImage() {
        if (this.state.business && this.state.business.imageUrls && this.state.business.imageUrls.length > 0) {
            return (
                <ImageGallery items={this.getImageList()} showBullets={true} showThumbnails={false} autoPlay={true} />
            );
        }
        return (<img src={'/img/No_image_available.png'} className={classes.businessImage} style={{ objectFit: 'cover', height: '400px', width: '400px' }} />);
    }

    getDishes() {
        let dishes = 'Dishes : ';
        let dishesArray = this.state.business.dishes;
        if (dishesArray && dishesArray.length > 0) {
            for (var i = 0; i < dishesArray.length; i++) {
                if (i <= dishes.length - 2)
                    dishes += dishesArray[i].name + ', ';
                else
                    dishes += dishesArray[i].name;
            }
        } else {
            return '';
        }
        return dishes;

    }

    renderHours() {
        if (this.state && this.state.business && this.state.business.hours) {
            return (
                <div>
                    Hours
                    <br /> Monday : {this.state.business.hours.monday.closed ? 'Closed' : this.state.business.hours.monday.from.hour + ':' + this.state.business.hours.monday.from.minute + ' to ' + this.state.business.hours.monday.to.hour + ':' + this.state.business.hours.monday.to.minute}
                    <br /> Tuesday : {this.state.business.hours.tuesday.closed ? 'Closed' : this.state.business.hours.tuesday.from.hour + ':' + this.state.business.hours.tuesday.from.minute + ' to ' + this.state.business.hours.tuesday.to.hour + ':' + this.state.business.hours.tuesday.to.minute}
                    <br /> Wednesday : {this.state.business.hours.wednesday.closed ? 'Closed' : this.state.business.hours.wednesday.from.hour + ':' + this.state.business.hours.wednesday.from.minute + ' to ' + this.state.business.hours.wednesday.to.hour + ':' + this.state.business.hours.wednesday.to.minute}
                    <br /> Thursday : {this.state.business.hours.thursday.closed ? 'Closed' : this.state.business.hours.thursday.from.hour + ':' + this.state.business.hours.thursday.from.minute + ' to ' + this.state.business.hours.thursday.to.hour + ':' + this.state.business.hours.thursday.to.minute}
                    <br /> Friday : {this.state.business.hours.friday.closed ? 'Closed' : this.state.business.hours.friday.from.hour + ':' + this.state.business.hours.friday.from.minute + ' to ' + this.state.business.hours.friday.to.hour + ':' + this.state.business.hours.friday.to.minute}
                    <br /> Satruday : {this.state.business.hours.saturday.closed ? 'Closed' : this.state.business.hours.saturday.from.hour + ':' + this.state.business.hours.saturday.from.minute + ' to ' + this.state.business.hours.saturday.to.hour + ':' + this.state.business.hours.saturday.to.minute}
                    <br /> Sunday : {this.state.business.hours.sunday.closed ? 'Closed' : this.state.business.hours.sunday.from.hour + ':' + this.state.business.hours.sunday.from.minute + ' to ' + this.state.business.hours.sunday.to.hour + ':' + this.state.business.hours.sunday.to.minute}
                </div>
            );
            // } else {
            //     return (
            //         //This code should never be executed, there will be default values stored in database.
            //         <div>
            //             Hours
            //             <br /> Monday : 00:00 to 23:59
            //             <br /> Tuesday : 00:00 to 23:59
            //             <br /> Webnesday : 00:00 to 23:59
            //             <br /> Thursday : 00:00 to 23:59
            //             <br /> Friday : 00:00 to 23:59
            //             <br /> Satruday :00:00 to 23:59
            //             <br /> Sunday : 00:00 to 23:59
            //         </div>
            //     );
            // }
        }
    }
    getFoodOptions() {
        let foodOptions = this.state.business.foodoptions;
        let foodOptionArray = [];
        if (foodOptions) {
            for (var property in foodOptions) {
                for (let i = 0; i < foodOptions[property].length; i++)
                    foodOptionArray.push(foodOptions[property][i]);
            }
        }
        return foodOptionArray;
    }
    renderData() {
        if (this.state.dataRetreivalDone) {
            return (<Aux>
                <header className={classes.header}>
                    <img src="/img/logo.png" className={classes.logo} onClick={this.handleLogoNavigation}
                        style={{ width: '90px' }} />
                    {/*<span onClick={this.goBack}><i class="fas fa-long-arrow-alt-left"></i></span>*/}
                </header>
                <main className={classes.mainSection}>
                    <div className={classes.row}>
                        <div className="col span-3-of-5">
                            <div className={classes.row}>
                                <h2>{this.state.business.businessName ? this.state.business.businessName : "No Name Available"}</h2>
                            </div>
                            <div className={classes.row}>
                                {this.renderImage()}
                                {/*<span style={{ fontSize: '.75em', lineHeight: '0.5em', width: '100%' }}><a href="#" onClick={this.openModal}>View All</a></span>*/}
                            </div>
                            <div className={classes.row}>{this.state.business.description ? this.state.business.description : "No Description available."}</div>

                            <div className={classes.row}>
                                {this.getDishes()}
                            </div>

                            <div className={classes.row}>
                                {this.getFoodOptions().map(item => {
                                    return (
                                        <a onClick={this.handleFoodOptionsBtnClick} key={item} className={classes.choiceBtn + ' ' + classes.choiceBtnFull}>{item}</a>
                                    );

                                })}
                            </div>
                        </div>
                        <div className="col span-2-of-5" >
                            <div className={classes.row}>
                                <a className={classes.btn + ' ' + classes.btnFull} onClick={this.handleEdit}>Edit</a>
                                <a className={classes.btn + ' ' + classes.btnFull} onClick={this.handleAddPhoto}>Add Photo</a>
                                {this.getGoBackButton()}
                                {/*<a className={classes.btn + ' ' + classes.btnFull} onClick={this.goBack}>Go Back to Search Results</a>*/}
                            </div>
                            <div className={classes.row}>
                                <div className={classes.map}
                                    id="map"
                                    ref="map">
                                </div>
                                <br />

                            </div>
                            <div className={classes.row}>
                                <div className={'col ' + classes.span1Of12}>
                                    <i className="fas fa-map-marker-alt" style={{ color: '#4bcca5', fontSize: '150%', float: 'left', marginRight: '5px' }}></i>
                                </div>
                                <div className={'col ' + classes.span11Of12}>
                                    {this.renderAddress()}
                                    <a href={this.getGoogleMapDirectionsUrl()} className={classes.mapUrl} target="_blank">Get Directions</a>
                                    <a href={this.getGoogleMapDisplayUrl()} target="_blank" className={classes.mapUrl} style={{ marginLeft: '7px' }}>View On Map</a>
                                </div>
                            </div>
                            <div className={classes.row}>
                                {this.renderHours()}
                            </div>
                        </div>
                    </div>
                </main>
            </Aux>);
        } else {
            return (

                <Aux>
                    <header className={classes.header}>
                        <img src="/img/package5.png" className={classes.logo} onClick={this.handleLogoNavigation}
                            style={{ width: '90px' }} />
                        {/*<span onClick={this.goBack}><i class="fas fa-long-arrow-alt-left"></i></span>*/}
                    </header>
                    <main className={classes.mainSection}>
                        <div className={classes.row}>
                            <div>
                                <div className="col span-1-of-5"></div>
                                <div className={"col span-3-of-5 " + classes.noResultsFound}>
                                    Fetching Data...
                                 </div>
                                <div className="col span-1-of-3"></div>
                            </div>
                        </div>
                    </main>

                </Aux>
            );

        }

    }
    render() {
        return this.renderData();
    }
}
const mapDispatchToProps = function (dispatch) {
    return {
        fetchByIdLocal: (entity, id) => dispatch(fetchById(entity, id))
    };
    // return bindActionCreators({ fetchById: dispatch(fetchById) }, dispatch);
};
export default connect(null, mapDispatchToProps)(Details);