    // webpack.config.js
    const path = require('path');
    const webpack = require('webpack');

    module.exports = {
      // ... other webpack configurations
      resolve: {
        fallback: {
          "util": require.resolve("util/"),
          // You might need other fallbacks as well depending on other errors
          // "buffer": require.resolve("buffer/"),
          // "stream": require.resolve("stream-browserify"),
          // "crypto": require.resolve("crypto-browserify"),
          // "os": require.resolve("os-browserify/browser"),
          // "path": require.resolve("path-browserify"),
        }
      },
      plugins: [
        // Only necessary if you use Node.js global variables like `process`
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
      // ...
    };
    