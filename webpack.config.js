const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const assetPath = '../assets';
var config = {
    entry: {
        script: __dirname + '/js/index',
        style: __dirname + '/less/index.less'
    },
    output: {
        publicPath: '',// --?
        path: path.resolve(__dirname, assetPath),
        filename: '[name].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/, //кроме
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] }// --?
                }
            },

            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },

            {
                test: /\.woff2$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 65000,
                        mimetype: 'application/font-woff2',
                    }
                }],
            },

            {
                test: /\.woff$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 65000,
                        mimetype: 'application/font-woff',
                    }
                }],
            },

            {
                test: /\.svg$/,
                use: [{
                        loader: 'svg-url-loader'
                    },

                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { removeTitle: true },
                                { convertColors: { shorthex: false } },
                                { convertPathData: false }
                            ]
                        }
                    }
                ],
            },

            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name(file) {
                            return '[hash].[ext]'
                        }
                    }
                }]
            }

        ]
    },

    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),

        new CopyPlugin({
            patterns: [
                { from: 'img/img', to: path.resolve(__dirname, assetPath + '/img') },
            ],
        }),

        new CleanWebpackPlugin(),

        new webpack.ProgressPlugin(),

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                parallel: 4,
            }),

            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
                canPrint: true
            })
        ]
    },
};

module.exports = (env, argv) => {

    if (argv.mode === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};