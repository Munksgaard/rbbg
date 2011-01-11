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
    gCanvasElement.addEventListener("click", hexOnClick, false);
    gDrawingContext = gCanvasElement.getContext("2d");
    document.body.appendChild(canvasElement);

    init_hexgrid();
    //init_squaregrid();
}

function hexOnClick(evt) {
    var hex_coords = findHexagon(evt);
    
    //alert(hex_coords);
    add_hexagon(hex_coords[0], hex_coords[1], "red");
}

function findHexagon(evt) {
    var b = tip_base(side_length);
    var h = tip_height(side_length);
    var block_width = b * 2 + side_length * 2;
    var block_height = 2*h;

    var block_x = parseInt(evt.offsetX / block_width);
    var block_y = parseInt(evt.offsetY / block_height);

    var block_internal_x = evt.offsetX - block_x * block_width;
    var block_internal_y = evt.offsetY - block_y * block_height;
    
    var est_x_hex = block_x * 2
    var est_y_hex = block_y - block_x

    if (block_internal_x < block_width / 2) {
        // Venstre halvdel af en blok
        if (block_internal_x < b) {
            // Venstre spids af hexagonet
            if (block_internal_y >= h &&
                h/b * block_internal_x < (block_internal_y - h)) {
                return [est_x_hex -1, est_y_hex +1];
            } else if (block_internal_y < h &&
                       h/b * block_internal_x < h-block_internal_y) {
                return [est_x_hex -1, est_y_hex];
            } else {
                return [est_x_hex, est_y_hex];
            }
        } else {
            // Midten af hexagonet
            return [est_x_hex, est_y_hex];
        }
    } else {
        if (block_internal_x < side_length + 2*b) {
            // Højre spids af hexagonet
            var cropped_x = block_internal_x - (b + side_length)
            if (block_internal_y < h &&
                h/b * cropped_x > block_internal_y) {
                return [est_x_hex +1, est_y_hex -1];
            } else if (block_internal_y >= h &&
                       h/b * cropped_x > h - (block_internal_y - h)) {
                return [est_x_hex +1, est_y_hex];
            } else {
                return [est_x_hex, est_y_hex];
            }
        } else {
            // Højre kvarte af blokken
            if (block_internal_y < h) {
                return [est_x_hex +1, est_y_hex -1];
            } else {
                return [est_x_hex +1, est_y_hex];
            }
        }            
    }
}

function init_squaregrid() {
    for (var x = 0.5; x < 600; x += 90) { 
        gDrawingContext.moveTo(x, 0); 
        gDrawingContext.lineTo(x, 500); 
    }

    for (var y = 0.5; y < 500; y += 52) { 
        gDrawingContext.moveTo(0, y); 
        gDrawingContext.lineTo(600, y); 
    }

    gDrawingContext.strokeStyle = "black"; 
    gDrawingContext.stroke();
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
            
            
            //alert(x_pixel);
            //alert(y_pixel);
            add_hexagon(x, y, "white")
        }
    }
}

function hexgrid_underflow(grid_width) {
  // Calculates the amount of hexagons needed on the vertical axis to get a 
  //rectangular grid of a certain size
  return(grid_width - 1) + 1;
}

function add_hexagon(x, y, color){
    var h = tip_height(side_length);
    var b = tip_base(side_length);
    var x_pixel = (2*side_length - b) * x;
    var y_pixel = (2 * h * y) + ((x + 1) * h);
    draw_hexagon(x_pixel, y_pixel, color);
}

// brug x_pixel og y_pixel
function draw_hexagon(x_pixel, y_pixel, color) {
    var vertices = hexagon_vertices(x_pixel, y_pixel, side_length);
    
    len = vertices.length;
//    alert(len);

    gDrawingContext.lineWidth = 2;
    gDrawingContext.beginPath();
    gDrawingContext.moveTo(vertices[0][0], vertices[0][1]);
    for (i=0; i<len; i++) {
        gDrawingContext.lineTo(vertices[(i+1) % len][0], vertices[(i+1) % len][1])
    }

    gDrawingContext.fillStyle = color;
    gDrawingContext.fill();
    gDrawingContext.stroke();

    gDrawingContext.closePath();
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
