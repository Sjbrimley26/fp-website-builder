const Rx = require("rxjs");
const { fromEvent } = Rx;
const { takeUntil, switchMap, mergeMap, concatMap, ...operators } = require("rxjs/operators");

const map = (fn, xs) => xs.map(fn);

const builder = document.getElementById("builder");

// Builder listeners

const mouseMove = fromEvent(builder, "mousemove");
const mouseDown = fromEvent(builder, "mousedown");
const mouseUp = fromEvent(builder, "mouseup");

const drag = mouseDown.pipe(
  switchMap(startEvent => {
    return mouseUp.pipe(
      operators.map(endEvent => {
        const dx = endEvent.clientX - startEvent.clientX;
        const dy = endEvent.clientY - startEvent.clientY;
        return { dx, dy };
      })
    );
  })
);

drag.subscribe(val => console.log(val));
