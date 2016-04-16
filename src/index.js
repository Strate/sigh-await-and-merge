// import Promise from 'bluebird'
// import { Bacon } from 'sigh-core'
// import { toFileSystemState } from 'sigh-core/lib/stream'
//
// export default function(op, ...pipelines) {
//   let bufferedCount = 0;
//   let buffer = [];
//   let pushToBuffer;
//   const promise = new Promise(resolve => {
//     pushToBuffer = function push(events) {
//       bufferedCount++;
//       buffer = buffer.concat(events)
//       if (bufferedCount === pipelines.length) {
//         resolve(buffer)
//       }
//     }
//   })
//   // Promise.map(..., { concurrency: 1 }) delivers the items to the iterator
//   // out of order which messes with opTreeIndex ordering.
//   return Promise.reduce(
//     pipelines,
//     (streams, pipeline) => {
//       return op.compiler.compile(pipeline, op.stream || null)
//       .then(stream => {
//         streams.push(stream)
//         return streams
//       })
//     },
//     []
//   )
//   .then(streams =>
//     Bacon.mergeAll(streams.filter(stream => stream !== op.compiler.initStream)).flatMapLatest(events => {
//       let isInitialPhase = events.every(event => event.initPhase);
//       if (isInitialPhase) {
//         pushToBuffer(events)
//         return Bacon.fromPromise(promise)
//       } else {
//         return Bacon.constant(events)
//       }
//     })
//   ).then(toFileSystemState)
// }


import Promise from 'bluebird'
import { Bacon } from 'sigh-core'
import { toFileSystemState } from 'sigh-core/lib/stream'
import merge from "sigh/lib/plugin/merge"
import {flatten} from "lodash"

export default function(op, ...pipelines) {
  let bufferedCount = 0;
  let buffer = [];
  let pushToBuffer;
  const promise = new Promise(resolve => {
    pushToBuffer = function push(events) {
      bufferedCount++;
      buffer = buffer.concat(events)
      if (bufferedCount === pipelines.length) {
        resolve(buffer)
      }
    }
  })
  return merge(op, ...pipelines)
    .then(stream => stream.flatMapLatest(events => {
      let isInitialPhase = events.every(event => event.initPhase);
      if (isInitialPhase) {
        pushToBuffer(events)
        return Bacon.fromPromise(promise)
      } else {
        return Bacon.constant(events)
      }
    })).then(toFileSystemState)
}
