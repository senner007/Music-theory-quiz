const path = require('path');

module.exports = {
    mode: 'development',
    target: "node",
    entry: './src/main.ts',
    output: {
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules', "pkg-prebuilds"]
      },
    module: {
        rules: [
          {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      
      },
      externals: {
        easymidi: "require('easymidi')",
       
     }
};