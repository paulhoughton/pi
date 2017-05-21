document.querySelector(".buttons").onclick = e => start(+e.target.innerText * 1e6)

var Module = { canvas: canvasWasm }
const width = canvasJs.width,
  height = canvasJs.height,
  radius = Math.min(width, height) / 2,
  ctx = canvasJs.getContext('2d'),
  green = pixel(144, 238, 144),
  red = pixel(205, 92, 92)

ctx.fillStyle = "white"

function pi(iter) {
  let x, y, colour, hits = 0

  ctx.fillRect(0, 0, width, height)
  for (let i = 0; i < iter; i++) {
    x = Math.random()
    y = Math.random()
    if (x * x + y * y < 1) {
      hits++
      colour = green
    }
    else {
      colour = red
    }
    ctx.putImageData(colour, x * width, y * height)
  }
  return 4 * hits / iter
}

function start(n) {
  document.querySelector(".container").classList.add("loading")
  setTimeout(() => runSimulation(n), 100)
}

function runSimulation(iter) {
  let start = performance.now()
  let res = Module.ccall("pi", "number", ["double"], [iter])
  showResult("wasm", res, performance.now() - start)

  start = performance.now()
  res = pi(iter)
  showResult("js", res, performance.now() - start)

  document.querySelector(".results").classList.remove("hide")
  document.querySelector(".container").classList.remove("loading")
}

function showResult(type, result, time) {
  document.querySelector(`.${type} .result`).textContent = result.toFixed(4)
  document.querySelector(`.${type} .value`).textContent = Math.floor(time)
}

function pixel(r, b, g) {
  let col = ctx.createImageData(1, 1)
  col.data[0] = r
  col.data[1] = b
  col.data[2] = g
  col.data[3] = 255
  return col
}
