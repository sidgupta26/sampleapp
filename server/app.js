import path from 'path';
import app from './config/express';
// config should be imported before importing any other file
const config = require('./config/config');
// enable webpack hot module replacement in development mode
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack/webpack.config.dev';
const mongoose = require('mongoose');
const util = require('util');


// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
mongoose.set('debug', true);

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri);
//admin user password - admin/T7hh2fGbSY36UWUC
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

if (process.env.NODE_ENV === 'development') {

    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
    //app.use(webpackHotMiddleware(compiler));
}


// Landing page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Server running at ${app.get('port')}`);
});

export default app;