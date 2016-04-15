# [WIP] DO NOT USE IN PRODUCTION 

# sigh-await-and-merge

[![build status](https://circleci.com/gh/Strate/sigh-await-and-merge.png)](https://circleci.com/gh/Strate/sigh-await-and-merge)

Sigh plugin for await initial phase completion and merge streams

## Example

`npm install --save-dev sigh-await-and-merge` then add something like this to your `sigh.js`:
```javascript
// TODO: example goes here
var awaitAndMerge, glob, postcss, babel;

module.exports = function(pipelines) {
  pipelines['build'] = [
    awaitAndMerge(
      [
        glob("src/**/*.css"),
        postcss()
      ],
      [
        glob("src/**/{*.js,*.jsx}"),
        babel()
      ]
    ),
    // this consumer executes after and only after previous 2 pipelines completes that's initial phase
    write("target") 
  ];
}
```
