(defstruct field
  (color 'white)
  (border 'black))

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

(defun get-field (coords hexgrid)
  (nth (y coords) (nth (x coords) hexgrid)))


