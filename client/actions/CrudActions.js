import * as httpService from '../services/httpService';

// export function fetchById(entity, id) {
//     return function (dispatch) {
//         // if (id === 'new') {
//         //     console.log('returning new object');
//         //     dispatch({
//         //         type: 'SELECTED_BUSINESS',
//         //         entity: entity,
//         //         data: {
//         //             businessName: '',
//         //             description: '',
//         //             location: {
//         //                 addressLine: '',
//         //                 landmark: '',
//         //                 city: '',
//         //                 state: '',
//         //                 country: '',
//         //                 zip: '',
//         //                 geocoordinates: {
//         //                     lat: '',
//         //                     lng: ''
//         //                 },
//         //             },
//         //             foodoptions: {
//         //                 cuisine: [],
//         //                 mealtype: [],
//         //                 dishtype: [],
//         //                 flavor: [],
//         //                 dishes: [],
//         //                 beverages: []
//         //             },
//         //             contactdetails: {
//         //                 phoneNumber: ''
//         //             },
//         //             hours: {
//         //                 monday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',
//         //                     },

//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 },
//         //                 tuesday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',
//         //                     },
//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 },
//         //                 wednesday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',

//         //                     },
//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 },
//         //                 thursday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',
//         //                     },
//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 },
//         //                 friday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',
//         //                     },
//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 },
//         //                 saturday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',
//         //                     },
//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 },
//         //                 sunday: {
//         //                     from: {
//         //                         hour: '00',
//         //                         minute: '00',
//         //                     },
//         //                     to: {
//         //                         hour: '23',
//         //                         minute: '59',
//         //                     },
//         //                     closed: false,
//         //                     userProvidedTime: false
//         //                 }
//         //             },
//         //         }
//         //     })
//         // } else {
//             return httpService.fetchEntityById(entity, id).then((response) => {
//                 dispatch({
//                     type: 'SELECTED_BUSINESS',
//                     entity: entity,
//                     data: response.data
//                 });
//             }).catch((error) => {
//                 dispatch({
//                     type: FAILURE,
//                     error: error
//                 });
//             });
//         }
//     }
// //}

