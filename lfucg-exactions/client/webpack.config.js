module.exports = {
  entry: {
    // 'main': './js/main.js',
    // 'dashboard': './js/dashboard.js',
    'dashboard': ['core-js/fn/object', './js/dashboard.js'],
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: __dirname + '../dist',
    publicPath: '/js',
    filename: '[name].js',
  },
};