import React, { Component } from 'react';
import classes from './SearchResult.css'
import Aux from '../../hoc/aux/Aux';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.renderAddress = this.renderAddress.bind(this);
        this.getFoodOptions = this.getFoodOptions.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.getLandmark = this.getLandmark.bind(this);
        this.getAddressLine1 = this.getAddressLine1.bind(this);
    }

    renderAddress() {
        let location = this.props.searchResult.location;
        return (
            <div className={classes.searchResultAddress}>
                {this.getAddressLine1(location)}
                {this.getLandmark(location)}
                {location.city} , {location.state} <br />
                {location.country},{location.zip} <br />
            </div>
        );
    }

    getAddressLine1(location) {
        if (location.addressLine && location.addressLine.trim() !== '') {
            return (
                <div>
                    {location.addressLine} <br />
                </div>
            )
        }
    }


    getLandmark(location) {
        if (location.landmark && location.landmark.trim() !== '') {
            return (
                <div>
                    {location.landmark} <br />
                </div>
            )
        }
    }


    getFoodOptions() {
        let foodOptions = this.props.searchResult.foodoptions;
        let foodOptionArray = [];
        if (foodOptions) {
            for (var property in foodOptions) {
                for (let i = 0; i < foodOptions[property].length; i++)
                    foodOptionArray.push(foodOptions[property][i]);
            }
        }
        return foodOptionArray;
    }


    renderImage() {
        if (this.props.searchResult.imageUrls && this.props.searchResult.imageUrls.length > 0) {
            let imageUrl = this.props.searchResult.imageUrls[0].url;
            let thumbnailUrl = imageUrl.replace('image/upload/','image/upload/f_jpg,q_auto:eco/');
            return (
                <img src={thumbnailUrl}
                    onError={() => {
                        return (<img src={'/img/No_image_available.png'} />);
                    }} />
            );
        }
        return (<img src={'/img/No_image_available.png'} />);
    }

    render() {
        const rowStyle = classes.row + ' ' + classes.searchResult;
        return (
            <Aux>
                <div className={rowStyle} onClick={() => this.props.selectBusiness(this.props.searchResult)}>
                    <div className="col span-2-of-8">
                        {this.renderImage()}

                    </div>
                    <div className="content col span-4-of-8">
                        <h4>
                            {this.props.searchResult.businessName}
                        </h4>
                        <p>{this.props.searchResult.description}</p>
                        {this.getFoodOptions().map(item => {
                            return (
                                <a href="#" key={item} className={classes.choiceBtn + ' ' + classes.choiceBtnFull}>{item}</a>
                            );
                        })}
                    </div>
                    <div className="content col span-2-of-8">
                        <div className={'content col '+ classes.span1Of12}>
                         <i className="fas fa-map-marker-alt" style={{ color: '#4bcca5', fontSize: '150%', float: 'left', marginRight: '5px' }}></i>
                         </div>
                        <div className={'content col '+ classes.span11Of12}>
                            {this.renderAddress()}
                        </div>
                   </div>


                </div>
                <hr className={classes.styleFive} />
            </Aux>

        );

    }

}

export default SearchResult;