var gCanvasElement;
var gDrawingContext;
var gWidth = 15;
var gHeight = 10;

var side_length = 30;

function init() {
    var pixel_width = pixelwidth(gWidth, side_length);
    var pixel_height = pixelheight(gHeight, side_length);

    //alert(pixel_width + ", " + pixel_height);

    var canvasElement = document.createElement("canvas");
    canvasElement.id = "rb_canvas";
    gCanvasElement = canvasElement;
    gCanvasElement.style = "border: 1px solid black;";
    gCanvasElement.width = pixel_width;
    gCanvasElement.height = pixel_height;
    //gCanvasElement.addEventListener("click", halmaOnClick, false);
    gDrawingContext = gCanvasElement.getContext("2d");
    document.body.appendChild(canvasElement);

    init_hexgrid();
}

function pixelwidth(n, l) {
  return((n * 2 * l) - ((n - 1) * tip_base(l)));
}

function pixelheight(n, l) {
  return(2 * tip_height(l) * n);
}

function init_hexgrid() {
    n = hexgrid_underflow(gWidth);
    //alert(n);
    for (var x = 0; x < n; x++) {
    for (var y = (0 - n); y < (n + gHeight); y++) {
//    for (var x = -4; x < 4; x++) {
//        for (var y = -4; y < 4; y++) {
            
            var h = tip_height(side_length);
            var b = tip_base(side_length);
            var x_pixel = (2*side_length - b) * x;
            var y_pixel = (2 * h * y) + ((x + 1) * h);
            //alert(x_pixel);
            //alert(y_pixel);
            add_hexagon(x_pixel, y_pixel, x, y, side_length)
        }
    }
}

function hexgrid_underflow(grid_width) {
  // Calculates the amount of hexagons needed on the vertical axis to get a 
  //rectangular grid of a certain size
  return(grid_width - 1) + 1;
}

function add_hexagon(x_pixel,y_pixel, x, y, side_length){
  draw_hexagon(x_pixel, y_pixel, side_length);
}

// brug x_pixel og y_pixel
function draw_hexagon(x_pixel, y_pixel, side_length) {
    var vertices = hexagon_vertices(x_pixel, y_pixel, side_length);
    
    len = vertices.length;
//    alert(len);

    gDrawingContext.lineWidth = 2;
    gDrawingContext.beginPath();
    for (i=0; i<len; i++) {

        gDrawingContext.moveTo(vertices[i][0], vertices[i][1]);
        gDrawingContext.lineTo(vertices[(i+1) % len][0], vertices[(i+1) % len][1])
    }
    gDrawingContext.stroke();
}

function hexagon_vertices(x, y, side_length) {
    var h = tip_height(side_length);
    var b = tip_base(side_length);
    var vertices = new Array(6);
    vertices[0] = [x, y];
    vertices[1] = [x + b, y - h];
    vertices[2] = [x + b + side_length, y - h];
    vertices[3] = [x + (2 * b) + side_length, y];
    vertices[4] = [x + b + side_length, y + h];
    vertices[5] = [x + b, y + h];
  
    return(vertices);
}


function tip_height(side_length) {
    var result=Math.sqrt(Math.pow(side_length, 2) - Math.pow(side_length / 2, 2));
    //alert(result);
    return result;
}

function tip_base(side_length) {
  var result=Math.sqrt(Math.pow(side_length, 2) - Math.pow(tip_height(side_length), 2));
  //alert(result);
  return(result);
}
