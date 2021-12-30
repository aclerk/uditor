import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

// the path(s) that should be cleaned
let pathsToClean = ['dist'];

// the clean options to use
let cleanOptions = {
  root: path.resolve(__dirname),
  verbose: true,
  dry: false
};

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  devtool: 'source-map', // 打包出的js文件是否生成map文件（方便浏览器调试）
  mode: 'production',
  entry: {
    uditor: './src/uditor.ts'
  },
  output: {
    filename: '[name].js', // 生成的fiename需要与package.json中的main一致
    path: path.resolve(__dirname, 'dist'),
    library: ['uditor'],
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: path.resolve(__dirname, './tslint.json')
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, './tsconfig.json')
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(pathsToClean, cleanOptions)]
};
