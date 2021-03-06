// Global values
var gCanvasElement;
var gDrawingContext;
var gWidth;
var gHeight;
var gColor;
var side_length;
var whiteColors = ["white", "#white", "#fff", "#ffffff"];
var hexagonTable;

// Default values
gWidth = 15;
gHeight = 10;
gColor = "red";
side_length = 30;

function init() {
    var pixel_width = pixelwidth(gWidth, side_length); 
    var pixel_height = pixelheight(gHeight, side_length);

	initHexagonTable();
    //alert(hexagonTable);

    var canvasElement = document.createElement("canvas");
    canvasElement.id = "rb_canvas";
    gCanvasElement = canvasElement;
    gCanvasElement.style.border = "1px solid black";
    gCanvasElement.width = pixel_width;
    gCanvasElement.height = pixel_height;
    gCanvasElement.addEventListener("click", hexOnClick, false);
    gDrawingContext = gCanvasElement.getContext("2d");
    document.body.appendChild(canvasElement);

    color_set(gColor);

    document.getElementById("hexwidth").value = gWidth;
    document.getElementById("hexheight").value = gHeight;

    init_hexgrid();
    //init_squaregrid();
}

function initHexagonTable() {
	var underflow = hexgrid_underflow(gWidth)
    hexagonTable = Array(underflow);
    for (i=0; i<hexagonTable.length; i++) {
        hexagonTable[i] = Array(2 * underflow + gHeight);
    }
}

function hexOnClick(evt) {
    var hex_coords = findHexagon(evt);

    if (evt.ctrlKey) {
        add_hexagon(hex_coords[0], hex_coords[1], "white");
    } else {
        add_hexagon(hex_coords[0], hex_coords[1], gColor);
    }
}

function findHexagon(evt) {
	var tmp = getCursorPosition(evt);
	var x = tmp[0];
	var y = tmp[1];

    var b = tip_base(side_length);
    var h = tip_height(side_length);
    var block_width = b * 2 + side_length * 2;
    var block_height = 2*h;

    var block_x = parseInt(x / block_width);
    var block_y = parseInt(y / block_height);

    var block_internal_x = x - block_x * block_width;
    var block_internal_y = y - block_y * block_height;
    
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
    var n = hexgrid_underflow(gWidth);
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
  return (grid_width);
}

function add_hexagon(x, y, color){
    var h = tip_height(side_length);
    var b = tip_base(side_length);
    var x_pixel = (2*side_length - b) * x;
    var y_pixel = (2 * h * y) + ((x + 1) * h);

    var isWhite = false;
    for (i=0; i<whiteColors.length; i++) {
        if (color == whiteColors[i]) isWhite = true
    }

    if (isWhite) {
        hexagonTable[x][y+hexgrid_underflow(gWidth)] = "";
    } else {
        hexagonTable[x][y+hexgrid_underflow(gWidth)] = color;
    }

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

function hexagon_vertices(x_pixel, y_pixel, side_length) {
    var h = tip_height(side_length);
    var b = tip_base(side_length);
    var vertices = new Array(6);
    vertices[0] = [x_pixel, y_pixel];
    vertices[1] = [x_pixel + b, y_pixel - h];
    vertices[2] = [x_pixel + b + side_length, y_pixel - h];
    vertices[3] = [x_pixel + (2 * b) + side_length, y_pixel];
    vertices[4] = [x_pixel + b + side_length, y_pixel + h];
    vertices[5] = [x_pixel + b, y_pixel + h];
  
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

function clickChangeColor() {
  var color = document.getElementById("hexcolor").value;
  //gColor = color;
  color_set(color);
}

function color_set(color) {
  gColor = color;
  var colorindicator = document.getElementById("colorindicator");
  colorindicator.style.backgroundColor = color;
  var colortext = document.getElementById("colortext");
  colortext.innerText = color;
}

function size_set() {
  var answer = confirm("Changing the grid size will reset the grid.\n\nAre you sure you want to continue?");
  if (answer) {
      var newwidth = document.getElementById("hexwidth").value;
      var newheight = document.getElementById("hexheight").value;

      gWidth = parseInt(newwidth)
      gHeight = parseInt(newheight)

      var pixel_width = pixelwidth(newwidth, side_length);
      var pixel_height = pixelheight(newheight, side_length);
      
      gCanvasElement.width = pixel_width;
      gCanvasElement.height = pixel_height;

      initHexagonTable();
      init_hexgrid()
  }
}

function generateSVG() {
    var pixel_width = pixelwidth(gWidth, side_length);
    var pixel_height = pixelheight(gHeight, side_length);

    var content = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
    content += '<svg xmlns="http://www.w3.org/2000/svg" width="' + pixel_width + 'pt" height="' + pixel_height + 'pt" version="1.1">';
//    var content = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg">\n';
  //  content += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
    var polygon;
    var h, b, x_pixel, y_pixel;
    var underflow = hexgrid_underflow(gWidth);
    //alert(hexagonTable)
    for (x=0; x<hexagonTable.length; x++) {
        for (y=0; y<hexagonTable[x].length; y++) {
            if (document.getElementById("drawWhiteHexagons").checked || hexagonTable[x][y]) {
				var color;
				if (document.getElementById("drawWhiteHexagons").checked && !hexagonTable[x][y]) {
					color = "white";
				} else {
					color = hexagonTable[x][y];
				}
				
                polygon = "<polygon points=\"";
                h = tip_height(side_length);
                b = tip_base(side_length);
                x_pixel = (2*side_length - b) * x;
                y_pixel = (2 * h * y) + ((x + 1) * h) - (2* h * hexgrid_underflow(gWidth)) + 1;
                
                vertices = hexagon_vertices(x_pixel, y_pixel, side_length);

                for (i=0; i<vertices.length; i++) {
                    polygon += vertices[i][0] + "," + (vertices[i][1]) + " ";
                }

                polygon += "\" style=\"fill:" + color + "; stroke: black; stroke-width: 2;\" />\n";
//0,86.60254 50.0,0.0 150.0,0.0 200.0,86.60254 150.0,173.20508 50.0,173.20508 50.0,173.20508" style="fill:WHITE; stroke:BLACK; stroke-width:10" />
                //alert(polygon);
                content += polygon;
            }
        }
    }

    content += "</svg>";

    //alert(content);
    //data:text/html;base64;charset=utf-8,data
    //var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    //alert(uriContent);
    //newWindow=window.open(uriContent, '_blank');
    //newWindow2=window.open('data:application/octet-stream;base64,SGVyZSBpcyBzb21lIHRleHQgdG8gZGF0YWZ5Lgo=');

   return(content);
}

function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
    }
    else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
	
	return [x,y];
}
