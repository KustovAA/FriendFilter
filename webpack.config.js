module.exports = env => {
    const path = require('path');
    const webpack = require('webpack');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    const config = require('./config_project');

    return {
        mode: env.mode,
        entry: {
            app: `${config.root.src}/app.js`
        },
        output: {
            filename: env.mode === 'production' ? '[name].min.js' : '[name].js',
            path: path.resolve(config.root.dest)
        },
        devServer: {
            contentBase: path.join(__dirname, 'build'),
            compress: true, 
            open: true
        }, 
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract(
                        {
                            fallback: 'style-loader',
                            use: ['css-loader']
                        })
                }, 
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract(
                        {
                            fallback: 'style-loader',
                            use: ['css-loader', 'sass-loader']
                        })
                }, 
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.(jpe?g|png|gif|svg|)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                                context: config.root.src
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                                context: config.root.src
                            }
                        }
                    ]
                },
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    options: {
                        pretty: '\t'
                    }
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(config.root.dest), 
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: `${config.root.src}/index.pug`, 
                chunks: ['app']
            }), 
            new ExtractTextPlugin({filename: 'styles/style.css'})
        ]
    }
}