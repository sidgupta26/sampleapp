import  { createStore, applyMiddleware, compose, combineReducers }  from 'redux';
//import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import history from '../utils/history';
//const middleware = routerMiddleware(history);

// Import custom components
import rootReducer from '../reducers/rootReducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/**
 * Create redux store that holds the app state.
 */
const store = createStore(rootReducer, composeEnhancers(
    //applyMiddleware(thunkMiddleware,  logger)
    applyMiddleware(thunkMiddleware)
));

export default store;