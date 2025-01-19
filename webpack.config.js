const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/index.jsx'],
    output: {
      filename: 'script.min.js',
      path: path.resolve(__dirname, 'public')
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
        minify: isProduction,
        scriptLoading: 'blocking',
        cdn: isProduction ? {
          rete: 'https://cdn.jsdelivr.net/npm/rete@1.4.4/build/rete.min.js',
          vueRenderPlugin: 'https://cdn.jsdelivr.net/npm/rete-vue-render-plugin@0.3.0/build/vue-render-plugin.min.js',
          connectionPlugin: 'https://cdn.jsdelivr.net/npm/rete-connection-plugin@0.9.0/build/connection-plugin.min.js'
        } : {}
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.min.css'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 9000, // Set the port for the development server
      open: true, // Automatically open the link in the web browser
      hot: true, // Enable hot module replacement
      liveReload: true // Automatically reload the browser when there is a change
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  };
};
