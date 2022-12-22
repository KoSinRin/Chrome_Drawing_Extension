// Create a canvas element and append it to the body
var canvas = document.createElement('canvas');
canvas.id = 'drawing-layer';
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = 100000;
document.body.appendChild(canvas);

// Set the canvas size to match the size of the active tab
var setCanvasSize = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
setCanvasSize();

// Update the canvas size when the window is resized
window.addEventListener('resize', setCanvasSize);

// Initialize the drawing context
var ctx = canvas.getContext('2d');
ctx.lineWidth = 5;
ctx.lineCap = 'round';

// Set up the drawing state
var isDrawing = false;
var lastX = 0;
var lastY = 0;

// Set up the eraser state
var isErasing = false;

// Create a button for switching between drawing and erasing
var switchButton = document.createElement('button');
switchButton.id = 'switch-button';
switchButton.innerHTML = 'Drawing';
document.body.appendChild(switchButton);

// Set the button style
switchButton.style.position = 'absolute';
switchButton.style.zIndex = 100001;
switchButton.style.top = '10px';
switchButton.style.left = '10px';

// Set up the event listener for the switch button
switchButton.addEventListener('click', function() {
  isErasing = !isErasing;
  switchButton.innerHTML = isErasing ? 'Erasing' : 'Drawing';
});

// Disable the switch button and hide the canvas when the extension is disabled
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleDrawingLayer" && !request.extensionEnabled) {
    switchButton.style.display = 'none';
    canvas.style.display = 'none';
  }
});


// Enable the switch button when the extension is enabled
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleDrawingLayer" && request.extensionEnabled) {
    switchButton.disabled = false;
  }
});


// Set up the event listeners for the canvas
canvas.addEventListener('mousedown', function(e) {
  isDrawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener('mousemove', function(e) {
  if (isDrawing) {
    if (isErasing) {
      ctx.clearRect(lastX - ctx.lineWidth, lastY - ctx.lineWidth, ctx.lineWidth * 2, ctx.lineWidth * 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
    lastX = e.clientX;
    lastY = e.clientY;
  }
});
canvas.addEventListener('mouseup', function() {
  isDrawing = false;
});

// Disable the switch button and hide the canvas when the extension is disabled
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleDrawingLayer" && !request.extensionEnabled) {
    switchButton.style.display = 'none';
    canvas.style.display = 'none';
  }
});

// Enable the switch button and show the canvas when the extension is enabled
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleDrawingLayer" && request.extensionEnabled) {
    switchButton.style.display = 'block';
    canvas.style.display = 'block';
  }
});