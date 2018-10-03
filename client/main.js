import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
//import { BrowserRouter } from 'react-router-dom';
import { Router } from 'react-router-dom';
import history from './utils/history'
//import './index.css';
import App from './App';
// Import custom components
import store from './store/store';

// const app = (
//     <Provider store={store}>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </Provider>
// );

const app = (
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
);
ReactDOM.render(app, document.getElementById('root'));
