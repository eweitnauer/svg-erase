var test_p0 = [1,1];
var test_p1 = [5,1];
var test_erase_width = 2;
var test_p_in = [3,2];
var test_p_out = [6,4];




/*
* Takes the x and y coordinates of two points, representing a line segment.
* Takes the erase_radius (half the height of the box).
* Returns an array containing the four point coordinate-pairs that represent the vertices of the box.
*/
function make_box (p0_x, p0_y, p1_x, p1_y, erase_radius) {

	var vec_v = [(p1_x - p0_x), (p1_y - p0_y)];
	var vec_n = [-vec_v[1], vec_v[0]];
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	
	var b0 = [(p0_x + erase_radius*u_vec_n[0]), (p0_y + erase_radius*u_vec_n[1])];
	var b1 = [(p0_x - erase_radius*u_vec_n[0]), (p0_y - erase_radius*u_vec_n[1])];
	var b2 = [(p1_x - erase_radius*u_vec_n[0]), (p1_y - erase_radius*u_vec_n[1])];
	var b3 = [(p1_x + erase_radius*u_vec_n[0]), (p1_y + erase_radius*u_vec_n[1])];
	
	return [b0, b1, b2, b3];
}

/*
* Takes the x and y coordinates of a point, and the x and y coordinates of a line segment.
* Returns 1 if the point is on the left side of the line, 0 otherwise.
*/
function is_left (x, y, p0_x, p0_y, p1_x, p1_y) {

	var vec_v = [(p1_x - p0_x), (p1_y - p0_y)]; 
	// document.write( "vec_v: " + vec_v[0] + ", " + vec_v[1] + "<br />" );
	var vec_n = [-vec_v[1], vec_v[0]]; 			
	// document.write( "normal: " + vec_n[0] + ", " + vec_n[1] + "<br />" );
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) ); 
	// document.write( "mag_n: " + mag_n + "<br />" );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n]; 
	// document.write( "u_vec_n: " + u_vec_n[0] + ", " + u_vec_n[1] + "<br />" );
	var vec = [x-p0_x, y-p0_y]; 
	// document.write( "vec: " + vec[0] + ", " + vec[1] + "<br />" );
	var h = u_vec_n[0]*vec[0] + u_vec_n[1]*vec[1];  
	// document.write( "h: " + h + "<br />" );
	
	if (h > 0) return 1;
	else return 0;
}

/*
* Takes the x and y coordinates of a point.
* Takes the array of box coordinate-pairs.
* Returns an array with 1's and 0's, which represent the point's location w.r.t. the box.

	   (0)			   (1)				
 0101	|     1101	    | 	1001
---------------------------------------	(2)
 0111	|	  1111		|   1011
--------------------------------------- (3)
 0110  	|	  1110		|   1010
*
* (0) = b1 - b0
* (1) = b3 - b2
* (2) = b0 - b3
* (3) = b2 - b1
*/
function is_inside (p_x, p_y, box) {
	var in_bounds = [];
	
	// check on (0)
	in_bounds.push( is_left( p_x, p_y, box[0][0], box[0][1], box[1][0], box[1][1] ) );
	// check on (1)
	in_bounds.push( is_left( p_x, p_y, box[2][0], box[2][1], box[3][0], box[3][1] ) );
	// check on (2)
	in_bounds.push( is_left( p_x, p_y, box[3][0], box[3][1], box[0][0], box[0][1] ) );
	// check on (3)
	in_bounds.push( is_left( p_x, p_y, box[1][0], box[1][1], box[2][0], box[2][1] ) );
	
	return in_bounds;
}


/*
* Takes the points that represent two line segments:
* 	p0 and p1 are line segment 1, p2 and p3 are line segment 2.
* Returns null if the line segments do not intersect.
* Returns the coordinate-pair of the intersection if it exists.
*/
function get_line_intersection (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) { 

	var s1_x, s1_y, s2_x, s2_y; 
	s1_x = p1_x - p0_x;
	s1_y = p1_y - p0_y; 
	s2_x = p3_x - p2_x; 
	s2_y = p3_y - p2_y; 

	var s, t;
	s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y); 
	t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
	
	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { 
	// Collision detected 
		var intX = p0_x + (t * s1_x); 
		var intY = p0_y + (t * s1_y); 
		return [intX, intY]; 
	} 
	return null; // No collision 

}