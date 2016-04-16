import Promise from 'bluebird'
import { Bacon } from 'sigh-core'
import merge from "sigh/lib/plugin/merge"
import {toFileSystemState} from "sigh-core/lib/stream"

export default function(op, ...pipelines) {
  let bufferedCount = 0;
  let buffer = [];
  let pushToBuffer;
  let buffering = true;
  const promise = new Promise(resolve => {
    pushToBuffer = function push(events) {
      buffer = buffer.concat(events)
      if (events.every(event => event.initPhase)) {
        bufferedCount++;
      }
      if (bufferedCount === pipelines.length) {
        buffering = false;
        resolve(buffer)
      }
    }
  })
  return merge(op, ...pipelines)
    .then(stream => stream.flatMapLatest(events => {
      if (buffering) {
        pushToBuffer(events)
        return toFileSystemState(Bacon.fromPromise(promise))
      } else {
        return Bacon.constant(events)
      }
    }))
}
