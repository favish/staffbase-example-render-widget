/*!
 * Copyright 2024, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as dotenv from 'dotenv'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'
// @ts-expect-error - This library is not typed
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin'

// Load environment variables from .env file
const envFile = process.env.ENV_FILE || '.env' // Default to .env if not specified
const env = dotenv.config({ path: path.resolve(__dirname, envFile) }).parsed

// Convert environment variables to Webpack DefinePlugin format
const envKeys = env
  ? Object.keys(env).reduce(
      (prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])

        if (next === 'REACT_APP_BUILD_DATE') {
          prev[`process.env.${next}`] = JSON.stringify(new Date().toISOString())
        }
        return prev
      },
      {} as { [key: string]: string },
    )
  : {}

const config: webpack.Configuration = {
  entry: {
    'favish.staffbase-example-render-widget': './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              cacheDirectory: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/i,
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      },
      {
        test: /staffbase-example-render-widget\.svg$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(css|less)$/,
        exclude: /iframe-styles\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /iframe-styles\.css$/,
        type: 'asset/source',
      },
      {
        test: /iframe-scripts\.js$/,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin(envKeys),
    new ForkTsCheckerWebpackPlugin(),
    /**
     * This fixes CloudFlare blaming the widget for the script tag
     */
    new ReplaceInFileWebpackPlugin([
      {
        dir: 'dist', // Output directory where the files will be replaced
        test: /\.js$/, // Files to be replaced
        rules: [
          {
            search: /\.innerHTML\s*=\s*"<script><\\\/script>"/g, // Regular expression to find the string to be replaced
            replace: '.innerHTML="<scr"+"ipt><"+"/script>"', // Replacement string
          },
        ],
      },
    ]),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],

  /** If we need to export multiple modules, we can use this to split them out */
  /*
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
   */

  optimization: {
    minimize: true,
  },
}

console.log('Environment Variables during Webpack build:', envKeys)

export default config
