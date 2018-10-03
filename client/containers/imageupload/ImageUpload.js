import React from 'react';
import Dropzone from 'react-dropzone';
import Aux from '../../hoc/aux/Aux';
import request from 'superagent';
import classes from './ImageUpload.css';
import { NotificationManager } from 'react-notifications';
import { API_URL } from '../../config/config';
import { updateEntity } from '../../services/httpService';
import ReactGA from 'react-ga';


const CLOUDINARY_UPLOAD_PRESET = 'luv2q988';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dncuyvqui/image/upload';


class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onImageDrop = this.onImageDrop.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.delete = this.delete.bind(this);
        this.handleLogoNavigation = this.handleLogoNavigation.bind(this);
        this.state = {
            fileToBeUploaded: '',
            fileDesc: '',
            dropbox: true,
            imageUploadSuccess: false
        }
    }

    onImageDrop(file) {
        this.setState({ fileToBeUploaded: file[0], dropbox: false });
    }

    uploadImage() {
        let businessId = this.props.match.params.id;
        //let uploadUrl = API_URL +'business/' +businessId + '/images'
        let upload = request.post(CLOUDINARY_UPLOAD_URL).field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            .field('file', this.state.fileToBeUploaded);

        upload.end((err, response) => {
            if (err) {
                console.error(err);
                this.setState({
                    ...this.state,
                    imageUploadSuccess: false
                });
                NotificationManager.error('Photo upload error. Please type again!');
            } else if (response.body.secure_url !== '') {
                // here call the app api to store the url 
                updateEntity('business', {
                    imageUrls: [{
                        desc: this.state.fileDesc,
                        url: response.body.secure_url
                    }
                    ]
                }, this.props.match.params.id).then((result) => {
                    this.setState({
                        fileToBeUploaded: '',
                        fileDesc: '',
                        dropbox: true,
                        imageUploadSuccess: true
                    });
                    NotificationManager.success('Photo Uploaded');
                    //this.props.history.goBack();

                }).catch(error => {
                    console.log(error);
                });
            }

        });
    }

    handleLogoNavigation() {
        this.props.history.push({
            pathname: '/'
        });
    }

    delete() {
        this.setState({
            fileToBeUploaded: '',
            fileDesc: '',
            dropbox: true,
            imageUploadSuccess: true

        });
    }

    render() {
        ReactGA.pageview('/ImageUpload');
        return (
            <Aux>
                <header className={classes.header}>
                    <img src="/img/logo.png" className={classes.logo} onClick={this.handleLogoNavigation}
                        style={{ width: '90px' }} />
                </header>
                <main>
                    <div className={classes.row}>
                        <div className="col span-1-of-5">
                        </div>
                        <div className="col span-3-of-5">
                            <div className={this.state.dropbox ? '' : classes.dropboxHidden}>
                                <Dropzone
                                    multiple={false}
                                    accept="image/*"
                                    onDrop={this.onImageDrop.bind(this)}
                                    className={classes.dropbox}
                                >
                                    <p style={{marginTop: '10%'}}>Drop an image or click to select a file to upload.</p>

                                </Dropzone>
                            </div>
                            <div className={this.state.dropbox ? classes.imagePreviewHidden : classes.imagePreview}>
                                <img src={this.state.fileToBeUploaded.preview} />
                            </div>
                        </div>
                        <div className="col span-1-of-5">
                        </div>
                    </div>
                    <div style={{ clear: 'both' }} />
                    <div className={classes.row}>
                        <div>
                             <div className="col span-1-of-5">
                            </div>
                            <div className="col span-3-of-5" style={{textAlign:'center'}}>  
                                 <div onClick={this.delete} className={classes.deleteIcon}><i className='far fa-trash-alt fa-lg' ></i></div>
                                 <a onClick={this.uploadImage}  className={classes.btn + ' ' + classes.btnFull}>Upload</a>
                                 <a onClick={this.props.history.goBack}  className={classes.btn + ' ' + classes.btnFull}>Back</a>
                                 {/*<a onClick={this.props.history.goBack}  className={classes.btn + ' ' + classes.btnFull}>Cancel</a>*/}
                            </div>   
                             <div className="col span-1-of-5">
                            </div>
                        </div>
                    </div>
                </main>
            </Aux>);
    }
}

export default ImageUpload;