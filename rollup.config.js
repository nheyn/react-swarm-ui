module.exports =  {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
  ],
};

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
 input: 'src/index.js',
 plugins: [
   resolve(),
   commonjs({
     include: 'node_modules/**',
   }),
   babel({
     exclude: 'node_modules/**', // only transpile our source code
     runtimeHelpers: true,
     babelrc: false,
     presets: [
       ['@babel/preset-env', { modules: false }],
       '@babel/preset-flow',
     ],
     plugins: [
       '@babel/plugin-transform-runtime',
       '@babel/plugin-proposal-object-rest-spread',
     ],
   }),
 ],
 external: [
  'react',
  'ws',
 ],
};
