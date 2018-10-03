'use strict';
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const paths = require('../client/config/paths');


/*
 * so process.cwd() is used instead to determine the correct base directory
 * Read more: https://nodejs.org/api/process.html#process_process_cwd
 */
const CURRENT_WORKING_DIR = process.cwd();

const config = {
    context: path.resolve(CURRENT_WORKING_DIR, 'client'),
    entry: {
        app: [
            'webpack-hot-middleware/client', // bundle the client for hot reloading
            'react-hot-loader/patch',   // activate HMR for React
            './main.js'  // the entry point of app
        ]
    },
    output: {
        path: path.resolve(CURRENT_WORKING_DIR, './dist'), //  destination
        filename: 'client.bundle.js',
        publicPath: '/dist/'
    },
    // node: {
    //     fs: "empty"
    // },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NoEmitOnErrorsPlugin(),  // do not emit compiled assets that include errors
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //check for all js files
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=env,presets[]=stage-0,presets[]=react',
                }]
            }, {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    // "url" loader works like "file" loader except that it embeds assets
                    // smaller than specified limit in bytes as data URLs to avoid requests.
                    // A missing `test` is equivalent to a match.
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    // Process JS with Babel.
                    {
                        test: /\.(js|jsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {

                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: true,
                        },
                    },
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader turns CSS into JS modules that inject <style> tags.
                    // In production, we use a plugin to extract that CSS to a file, but
                    // in development "style" loader enables hot editing of CSS.
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    localIdentName: '[name]__[local]__[hash:base64:5]'
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ],
                    },
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader don't uses a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // it's runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
        ],
    },
    devtool: "source-map",
};

module.exports = config;