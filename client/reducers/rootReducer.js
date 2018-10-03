
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
// import SearchReducer from './SearchReducer';
import SearchCriteriaReducer from './SearchCriteriaReducer';
import SelectedBusinessReducer from './SelectedBusinessReducer';

const rootReducer = combineReducers({
    // searchResults : SearchResultsReducer,
    //selectedBusiness : SelectedBusinessReducer,
    form: formReducer,
    searchCriteria : SearchCriteriaReducer

});

export default rootReducer;