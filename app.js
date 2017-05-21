document.querySelector(".buttons").onclick = e =>
  start(+e.target.innerText * 1e6);

var Module = {
  canvas: document.getElementById('canvasWasm'),
};

const canvas = document.getElementById('canvasJs');

const width = canvas.width;
const height = canvas.height;
const radius = Math.min(width, height) / 2;

const ctx = canvas.getContext('2d');
ctx.fillStyle = "white";

const green = ctx.createImageData(1, 1);
green.data[0] = 144;
green.data[1] = 238;
green.data[2] = 144;
green.data[3] = 255;

const red = ctx.createImageData(1, 1);
red.data[0] = 205;
red.data[1] = 92;
red.data[2] = 92;
red.data[3] = 255;

function pi(n) {
  let x, y, col, hits = 0;

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < n; i++) {
    x = Math.random();
    y = Math.random();
    if (x * x + y * y < 1) {
      hits++;
      col = green;
    }
    else {
      col = red;
    }
    ctx.putImageData(col, x * width, y * height);
  }
  return 4 * hits / n;
}

function start(n) {
  document.querySelector(".container").classList.add("loading");
  setTimeout(() => runSimulation(n), 100);
}

function runSimulation(iter) {
  let start = performance.now();
  let res = Module.ccall("pi", "number", ["double"], [iter]);
  showResult("wasm", res, performance.now() - start);

  start = performance.now();
  res = pi(iter);
  showResult("js", res, performance.now() - start);

  document.querySelector(".results-container").classList.remove("hidden");
  document.querySelector(".container").classList.remove("loading");
}

function showResult(type, result, time) {
  document.querySelector(`.${type} .result`).textContent = result.toFixed(4);
  document.querySelector(`.${type} .time .value`).textContent = Math.floor(time);
}
