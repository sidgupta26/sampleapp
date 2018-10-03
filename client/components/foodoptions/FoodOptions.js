import React, { Component } from 'react';
import FoodOptionButton from './FoodOptionButton';
import { Field } from 'redux-form';
import classes from './foodoptions.css';
import Modal from 'react-modal';

const divStyle = {
    marginLeft: '0',
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        overlfow: 'scroll',
        width : '80%',
        height : '400px'
    },
    overlay: {
        zIndex: 10
    }

};
Modal.setAppElement('#root')
class FoodOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }
    createFoodOption(value, category) {
        
        let categoryArry = category.split('.');
        let foodoptions = this.props.foodoptions || [];
        // console.log('------------------------------------------------------------------------------------------');
        // console.log(foodoptions);
        // console.log('------------------------------------------------------------------------------------------');
        let btnStyle = value && categoryArry[1] && foodoptions[categoryArry[1].toLowerCase()] && foodoptions[categoryArry[1].toLowerCase()].indexOf(value.toLowerCase()) > -1 ?
            classes.choiceBtn + ' ' + classes.choiceBtnFullActive : classes.choiceBtn + ' ' + classes.choiceBtnFull;
        return (
            <Field
                component={FoodOptionButton}
                type="input"
                name={category}
                {...this.props}
                label={value}
                key={value}
                className={btnStyle}
            />
        );

    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const cuisineArray = ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4', 'Choice 5', 'Choice 6', 'Choice 7', 'Choice 8', 'Choice 9', 'Choice 10'];
        const moreCuisineArray = ['Choice 11', 'Choice 12', 'Choice 13', 'Choice 14', 'Choice 15', 'Choice 16', 'Choice 17', 'Choice 18', 'Choice 19', 'Choice 20'];
        const flavorsArray = ['Choice 21', 'Choice 22', 'Choice 23', 'Choice 24', 'Choice 25', 'Choice 26', 'Choice 27', 'Choice 28', 'Choice 29', 'Choice 30'];
   
        return (

            <section className={classes.foodSection}>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Cuisines">
                    <h3 style={{ marginBotton: '1%' }}>Cuisines</h3>
                    {moreCuisineArray.map(x => this.createFoodOption(x, 'foodoptions.cuisine'))}
                    <div>
                        <a
                            href="#" style={{ marginLeft: '40%', marginTop: '1%' }}
                            onClick={this.closeModal}
                            className={classes.btn + ' ' + classes.btnFull}
                        >Done</a>
                    </div>
                </Modal>


                <div>
                    <div className={classes.row}>
                        <h5>Choice Section 1</h5>
                        <div className="col span-3-of-3" style={divStyle}>
                            {cuisineArray.map(x => this.createFoodOption(x, 'foodoptions.cuisine'))}
                            <a href="#" className={classes.locationLinks} onClick={this.openModal}>More choices</a>
                        </div>
                    </div>
                    <div className={classes.row}>
                        <h5>Choice Section 2</h5>
                        <div className="col span-3-of-3" style={divStyle}>
                            {flavorsArray.map(x => this.createFoodOption(x, 'foodoptions.flavor'))}
                        </div>
                    </div>
                </div>

            </section>
        );
    }
}
export default FoodOptions;