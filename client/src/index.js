const Rx = require("rxjs");
const { fromEvent, merge } = Rx;
const { 
  takeUntil,
  switchMap,
  mergeMap,
  scan,
  ...operators
} = require("rxjs/operators");

const {
  getId
} = require("../lib/utils");

const map = (fn, xs) => xs.map(fn);

const body = document.getElementsByTagName("body")[0];

// Builder listeners

const mouseMove = fromEvent(body, "mousemove");
const mouseDown = fromEvent(body, "mousedown");
const mouseUp = fromEvent(body, "mouseup");

const drop = mouseDown.pipe(
  switchMap(startEvent => {
    return mouseUp.pipe(
      operators.map(endEvent => {
        const top = endEvent.pageY;
        const left = endEvent.pageX;
        const dx = endEvent.pageX - startEvent.pageX;
        const dy = endEvent.pageY - startEvent.pageY;
        
        return {
          dx,
          dy,
          top,
          left
        };
      })
    );
  })
);

const continousDrag = 
  mouseDown
    .pipe(
      mergeMap(startEvent => mouseMove.pipe(
        takeUntil(mouseUp)
      ))
    )
    .pipe(
      operators.map(e => {
        // console.log("Continous drag");
        return {
          top: e.pageY,
          left: e.pageX
        };
      })
    );

const initialCoords = 
  mouseDown
    .pipe(
      operators.map(e => {
        // console.log("Initial Coords");
        return {
          startTop: e.pageY,
          startLeft: e.pageX,
          id: getId()
        };
      })
    );

const drawDiv = merge(
  initialCoords,
  continousDrag
)
  .pipe(
    scan(({ newDiv, startX, startY }, coords) => {
      if (coords.hasOwnProperty("startTop")) {
        newDiv = document.createElement("div");
        newDiv.classList.add("block");
        startY = coords.startTop;
        startX = coords.startLeft;
        newDiv.style.top = startY + "px";
        newDiv.style.left = startX + "px";
        newDiv.id = coords.id;
      }
      else {
        const left = (startX < coords.left ? startX : coords.left) + "px";
        const top = (startY < coords.top ? startY : coords.top) + "px";
        const width = Math.abs(startX - coords.left) + "px";
        const height = Math.abs(startY - coords.top) + "px";
        const style = 
          [{left}, {top}, {width}, {height}]
            .reduce((styleString, prop) => {
              return styleString.concat(
                Object.keys(prop)[0],
                ": ",
                Object.values(prop)[0],
                ";"
              );
            }, "");

        newDiv.style.cssText = style;
      }

      return { newDiv, startX, startY };
    }, {
      newDiv: null,
      startX: 0,
      startY: 0
    })
  )
  .pipe(
    operators.map(({ newDiv }) => newDiv)
  )

drawDiv.subscribe(div => {
  const id = div.id;
  const existingDiv = document.getElementById(id);
  if (existingDiv) {
    existingDiv.parentNode.removeChild(existingDiv);
  }
  body.appendChild(div);
});
