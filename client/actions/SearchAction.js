import { fetch } from '../utils/httpUtil';

const URL = 'http://127.0.0.1:3000/api';
const END_POINT = '/business';

export function search(searchTerm, searchLocation) {
    return (dispatch, getState) => {
        dispatch({
            type: 'SEARCH_TERM',
            payload : {
                searchTerm : searchTerm,
                searchLocation : searchLocation
            }

        });
   }
}