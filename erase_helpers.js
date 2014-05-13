/* Helper functions:
*  within_circle (x, y, c_x, c_y, r)
*  within_box (p_x, p_y, a_x, a_y, b_x, b_y, r)
*  get_parallel_segments (a_x, a_y, b_x, b_y, r)
*  get_cirle_intersection (a_x, a_y, b_x, b_y, c_x, c_y, r)
*  get_circle_intersections (a_x, a_y, b_x, b_y, c_x, c_y, r)
*  get_line_intersection (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y)
*/


/*
* Takes x, y: the point in question
* Takes c_x, c_y: the center of the circle
* Takes r: the radius of the circle
* Returns 0 or 1: 0 if the point is outside the circle, 1 if within
*/
function within_circle (x, y, c_x, c_y, r) {
	var dist = Math.sqrt( Math.pow((x - c_x), 2) + Math.pow((y - c_y), 2) );
	if ( dist < r ) return 1;
	else return 0;
}

/*
* Takes p_x, p_y: the point in question
* Takes a_x, a_y, b_x, b_y: the components of the points that define the line segment
* Takes r: the "erase_radius"
* Returns 0 or 1: 0 if the point is outside the box, 1 if within
*/
function within_box (p_x, p_y, a_x, a_y, b_x, b_y, r) {

	// vectors
	var vec_ab = [ (b_x - a_x), (b_y - a_y) ];
	var vec_ap = [ (p_x - a_x), (p_y - a_y) ];
	
	// tools for calculating projections
	var vec_n    = [ -vec_ab[1], vec_ab[0] ];
	var mag_n    = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n  = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	var mag_ab   = Math.sqrt( Math.pow( vec_ab[0], 2 ) + Math.pow( vec_ab[1], 2 ) );
	var u_vec_ab = [vec_ab[0]/mag_ab, vec_ab[1]/mag_ab];
	
	var ap_proj_ab = vec_ap[0]*u_vec_ab[0] + vec_ap[1]*u_vec_ab[1];
	if ( ap_proj_ab <= 0 || ap_proj_ab >= mag_ab ) return 0;
	
	var ap_proj_n = vec_ap[0]*u_vec_n[0] + vec_ap[1]*u_vec_n[1];
	if ( ap_proj_n >= r || ap_proj_n <= -r ) return 0;
	
	return 1;
}

/*
* Takes p_x, p_y: the point in question
* Takes a_x, a_y, b_x, b_y: the components of the points that define the line segment
* Takes r: the "erase_radius"
* Returns 0 or 1: 0 if the point is outside the capsule, 1 if within
*/
function within_capsule (p_x, p_y, a_x, a_y, b_x, b_y, r) {
	
	var space_code = [];
	space_code.push( within_circle( p_x, p_y, a_x, a_y, r ) );
	space_code.push( within_circle( p_x, p_y, b_x, b_y, r ) );
	space_code.push( within_box( p_x, p_y, a_x, a_y, b_x, b_y, r ) );
	return space_code;
	
}

/*
* Takes a_x, a_y, b_x, b_y: the points that define a line segment
* Takes r: the "erase_radius"
* Returns an array of arrays: the points that define a box around that line segment.  Length: mag_ab, width: r.
*/
function get_parallel_segments (a_x, a_y, b_x, b_y, r) {

	var vec_v = [(b_x - a_x), (b_y - a_y)];
	var vec_n = [-vec_v[1], vec_v[0]];
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	
	var b0 = [(a_x + r*u_vec_n[0]), (a_y + r*u_vec_n[1])];
	var b1 = [(a_x - r*u_vec_n[0]), (a_y - r*u_vec_n[1])];
	var b2 = [(b_x - r*u_vec_n[0]), (b_y - r*u_vec_n[1])];
	var b3 = [(b_x + r*u_vec_n[0]), (b_y + r*u_vec_n[1])];

	return [b0, b1, b2, b3];
}

/*
* Takes a_x, a_y: the coordinates of the point inside the circle
* Takes b_x, b_y: the coordinates of the point outside the circle
* Takes c_x, c_y: the center point of the circle
* Takes r: the radius of the circle
* Returns an array: the x and y coordinates of the intersection between the line segment ab and the circle.
*/
function get_cirle_intersection (a_x, a_y, b_x, b_y, c_x, c_y, r) {
	
	var vec_ac = [ (c_x - a_x), (c_y - a_y) ];
	var vec_ab = [ (b_x - a_x), (b_y - a_y) ];
	
	var mag_ab = Math.sqrt( Math.pow( vec_ab[0], 2 ) + Math.pow( vec_ab[1], 2 ) );
	var u_vec_ab = [ (vec_ab[0]/mag_ab), (vec_ab[1]/mag_ab) ];
	var ac_proj_ab = vec_ac[0]*u_vec_ab[0] + vec_ac[1]*u_vec_ab[1];
	
	var right_point = [ (a_x + ac_proj_ab*u_vec_ab[0]), (a_y + ac_proj_ab*u_vec_ab[1]) ];
	var dist_c_to_right_point = Math.sqrt( Math.pow( (c_x - right_point[0]), 2 ) + Math.pow( (c_y - right_point[1]), 2) );
	var b = Math.pow( r, 2 ) - Math.pow( dist_c_to_right_point, 2 );
	
	var intersection = [ (a_x + ac_proj_ab*u_vec_ab[0] + b*u_vec_ab[0]), (a_x + ac_proj_ab*u_vec_ab[1] + b*u_vec_ab[1]) ];
	return intersection;
}

function get_circle_intersections (a_x, a_y, b_x, b_y, c_x, c_y, r) {
	
	var vec_ac = [ (c_x - a_x), (c_y - a_y) ];
	var vec_ab = [ (b_x - a_x), (b_y - a_y) ];
	
	var vec_n = [ -vec_ab[1], vec_ab[0] ];
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	
	var mag_d = vec_ac[0]*u_vec_n[0] + vec_ac[1]*u_vec_n[1];
	if ( mag_d >= r ) return null;
	
	var x = Math.pow( r, 2 ) - Math.pow( mag_d, 2 );
	var vec_cd = [ (c_x - mag_d*u_vec_n[0]), (c_y - mag_d*u_vec_n[1]) ];
	
	var mag_ab = Math.sqrt( Math.pow( vec_ab[0], 2 ) + Math.pow( vec_ab[1], 2 ) );
	var u_vec_ab = [ (vec_ab[0]/mag_ab), (vec_ab[1]/mag_ab) ];
	
	var intersections = [ [(vec_cd[0] + u_vec_ab[0]*x), (vec_cd[1] + u_vec_ab[1]*x)], [(vec_cd[0] - u_vec_ab[0]*x), (vec_cd[1] - u_vec_ab[1]*x)] ];
	return intersections;
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