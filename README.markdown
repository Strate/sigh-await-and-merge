# sigh-await-and-merge

Sigh plugin for await initial phase completion and merge streams
Works like merge builtin, but better.

You can read more on https://github.com/sighjs/sigh/issues/32
To get it work you can ask @ohjames to merge this PR: https://github.com/sighjs/sigh/pull/45

## Example

`npm install --save-dev sigh-await-and-merge` then add something like this to your `sigh.js`:
```javascript
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
