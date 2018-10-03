export default function(state = null, action){
    console.log('Selected Business Reducer : ' + action.type);
    switch(action.type){
        case 'SELECTED_BUSINESS':
            return action.data;
        default : 
            return state;
    }    
}