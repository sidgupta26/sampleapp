import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './hoc/layout/Layout';
import HomePage from './containers/home/HomePage';
import SearchResultList from './containers/search/SearchResultList';
import AddBusiness from './containers/addBusiness/AddBusiness';
import AddBusinessForm from './containers/addBusiness/AddBusinessForm';
import Details from './containers/detail/Details';
import GoogleMap from './components/map/GoogleMap';
import ImageUpload from './containers/imageupload/ImageUpload';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-126143263-1');

class App extends Component {
  render () {
    return (
        <Layout>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/searchResults" component={SearchResultList} />
            <Route path="/addBusiness/:id" component={AddBusinessForm} />
            <Route path="/addBusiness/" component={AddBusinessForm} />
            <Route path="/businessDetails/:id" component={Details} />
            <Route path="/locateOnMap" component={GoogleMap} />
            <Route path="/:id/uploadImage" component={ImageUpload} />
          </Switch>
           <NotificationContainer />
        </Layout>
    );
  }
}

export default App;
