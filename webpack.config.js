// config/webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * process.cwd() will return a path to our active project directory
 * For example, on windows will look like:
 * c:\Users\username\project\webpack-boilerplate
 * On Mac:
 * /Users/username/project/webpack-boilerplate
 */
const ROOT_DIRECTORY = process.cwd();

module.exports = {
  /**
   * Define webpack mode
   * Which webpack will set NODE_ENV to 'development'
   * Docs: https://webpack.js.org/configuration/mode/
   */
  mode: 'development',
  /**
   * Here, we tell webpack where the entry point of our code
   * If you only have a single entry point you can also do it like below
   * entry: path.resolve(ROOT_DIRECTORY, 'src/index.js'),
   * Docs: https://webpack.js.org/configuration/entry-context/
   */
  entry: {
    main: path.resolve(ROOT_DIRECTORY, 'src/index.js'),
  },
  /**
   * Tell webpack where it should output
   * our bundles, assets, and anything else
   * In this example, it will be inside /build folder
   * Docs: https://webpack.js.org/configuration/output/
   */
  output: {
    path: path.resolve(ROOT_DIRECTORY, 'public'),
    filename: 'bundle.js',
  },
  /**
   * This devServer option is our development server that get picked up by webpack-dev-server
   * Docs: https://webpack.js.org/configuration/dev-server/
   */
  devServer: {
    // Serves everything from our build folder which is our output folder
    static: path.resolve(ROOT_DIRECTORY, 'public'),
    // Enable gzip compression
    compress: true,
    // Which port we want to use, in this case, we use port 3000
    port: 3000,
  },
  /**
   * Generate source-maps to make it easier to track down errors and warnings
   * In this example, we're using cheap-module-eval-source-map (recommend by webpack)
   * Docs: https://webpack.js.org/configuration/devtool/
   */
  plugins: [],
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      /**
       * Here we kinda tell webpack if it comes across js file
       * Please use babel-loader
       * Docs: https://github.com/babel/babel-loader
       */
        {
        test: /\.s?css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Enabled cache for faster recompilation
            cacheDirectory: true,
            /**
             * Here we tell babel where to find babel config file
             * Note that we can also put our babel config (presets and plugins) here
             * Since Babel 7, using .babelrc filename not recommended
             * Here we are using the new recommended filename
             * using babel.config.js filename
             * Docs: https://babeljs.io/docs/en/config-files
             */
            /*configFile: path.resolve(ROOT_DIRECTORY, 'config/babel.config.js'),*/
          },
        },
      },
    ],
  },
};