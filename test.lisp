(defstruct hexagon
  x ; få lavet alias ting
  y
  (color 'white)
  (border-color 'black))

(defun print-hexagon (h stream depth)
  (format stream "#<~A,~A>" (hexagon-x h) (hexagon-y h)))

(defun x (coords)
  (car coords))

(defun y (coords)
  (cdr coords))

(defun up (coords)
  (cons (x coords) (1- (y coords))))

(defun down (coords)
  (cons (x coords) (1- (y coords))))

(defun up-right (coords)
  (cons (1+ (x coords)) (1- (y coords))))

(defun up-left (coords)
  (cons (1- (x coords)) (1- (y coords))))

(defun down-right (coords)
  (cons (1+ (x coords)) (1+ (y coords))))

(defun down-left (coords)
  (cons (1- (x coords)) (1+ (y coords))))

(defun tip-height (side-length)
  (sqrt (- (expt side-length 2) (expt (/ side-length 2) 2))))

(defun tip-base (side-length)
  (sqrt (- (expt side-length 2) (expt (tip-height side-length) 2))))

(defun vertices-pixel-coords (a-offset side-length)
  (let* ((h (tip-height side-length))
         (j (tip-base side-length)))
    (list a-offset 
          (cons (+ (x a-offset) j) (- (y a-offset) h))
          (cons (+ (x a-offset) j side-length) (- (y a-offset) h))
          (cons (+ (x a-offset) (* 2 j) side-length) (y a-offset))
          (cons (+ (x a-offset) j side-length) (+ (y a-offset) h))
          (cons (+ (x a-offset) j) (+ (y a-offset) h))
          (cons (+ (x a-offset) j) (+ (y a-offset) h)))))

(defun hexagon-pixel-offset (hexagon side-length)
  (let ((h (tip-height side-length))
        (j (tip-base side-length)))
    (cons (* (+ side-length (- side-length j)) (hexagon-x hexagon))
          (+ (* 2 h (hexagon-y hexagon)) 
             (* (1+ (hexagon-x hexagon)) h)))))
         
(defun vertices->pixelpairs (vertices)
  (mapcar #'pair->string vertices))

(defun pair->string (ls)
  (format nil "~d,~d" (car ls) (cdr ls)))

(defun list->string (ls)
  (reduce #'(lambda (x y) (concatenate 'string x " " y)) ls))

(defun svg-header ()
  (princ  "<?xml version=\"1.0\" standalone=\"no\"?>\
<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" 
\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\
\
<svg width=\"100%\" height=\"100%\" version=\"1.1\"\
xmlns=\"http://www.w3.org/2000/svg\">")
  (terpri))

(defun svg-hexagon (hexagon side-length)
  (princ "<polygon points=\"")
  (princ (list->string (vertices->pixelpairs 
                        (vertices-pixel-coords 
                         (hexagon-pixel-offset hexagon side-length)
                         side-length))))
  (format t "\" style=\"fill:~A; stroke:~A; stroke-width:2\" />" 
          (hexagon-color hexagon) 
          (hexagon-border-color hexagon)))

(defun svg-hexagons (hexagons side-length)
  (mapc #'(lambda (x) (progn 
                         (svg-hexagon x side-length)
                         (terpri))) hexagons))

(defun svg-footer ()
  (princ "</svg>"))

(defun hexagons->svg (hexs side-length)
  (svg-header)
  (svg-hexagons hexs side-length)
  (svg-footer))

