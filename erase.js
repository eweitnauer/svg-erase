/**
	The function gets an array of paths and an erase_path. It returns a new
	array of paths that are the result of removing everything in the eraser path
	from the paths.

	Each individual path is represented as an array of points, with each point being
	an [x, y] array. `[[0,0], [100,100]]` is an example of a path consisting of a single
	line segment from the origin to (100,100). `[20,10]` would also be a valid path,
	consisting of a single point at the position (20,10).

	The erase_radius is the radius of the imagined circular eraser moved over the canvas.
	It's the same as half of the stroke width. We will assume for now that the stroke width
	/ radius of the actual paths that are to be erased is zero.
*/

/*
TODO:
-write signature stuff at top
-finish logging comments, email to me, line numbers
-get point erasing to work
-read style guide, conform to those standards
-write good comments inside and outside functions
-profile for time


*/


function erase(paths, erase_path, erase_radius) {
	
	erase_radius = 20;
	
	//paths = [[[50,100],[50,300]]];
	//erase_path = [[92,227],[90,228],[90,228],[88,232],[86,235],[79,244],[76,247],[68,256],[67,259],[61,265],[54,270],[51,274],[47,276],[45,276],[42,276],[38,275],[36,273],[35,272],[34,271],[33,270],[29,265],[26,255],[24,247],[24,237],[27,217],[38,194],[45,183],[50,174],[56,166],[60,157],[60,157],[69,143],[71,140],[71,140]];
	/*
	* To get test case: uncomment this block and the block from line <num> to <num>.
	*/
	console.log( "erase radius: " + erase_radius );
	console.log( "erase path:" );
	log_path( erase_path, 1 );
	console.log( "paths:" );
	log_paths( paths );
	/**/
	
	var new_paths = [];
		
	var handle_point_erase = function(path) {
		var eX = erase_path[0][0];
		var eY = erase_path[0][1];
		
		var i = 0;
		var last = 0;
	
		// handle point path
		if ( path.length === 1 ) {
			if ( !within_circle( path[0][0], path[0][1], eX, eY, erase_radius ) ) {
				new_paths.push( path );
				return;
			}
		}
		
		var new_path;
		while ( i < (path.length - 1) ) {
			var p0 = path[i];
			var p1 = path[i+1];
			var code0 = within_circle( p0[0], p0[1], eX, eY, erase_radius );
			var code1 = within_circle( p1[0], p1[1], eX, eY, erase_radius );
		
			if ( code0 && code1 ) {
				i++;
				last = i;
			}
			else if ( code0 && !code1 ) {
				var x = get_circle_intersection( p0[0], p0[1], p1[0], p1[1], eX, eY, erase_radius );
				if ( x ) {
					path[i] = x;
					last = i;
				}
				else {
					i++;
				}
			}
			else if ( !code0 && code1 ) {
				var x = get_circle_intersection( p1[0], p1[1], p0[0], p0[1], eX, eY, erase_radius );
				if ( x ) {
					new_path = get_elements( path, last, i+1 );
					new_path.push( x );
					new_paths.push( new_path );
				}
				i++;
				last = i;
			}
			else {
				var poss_intersects = get_circle_intersections( p0[0], p0[1], p1[0], p1[1], eX, eY, erase_radius );
				if ( poss_intersects ) {
					new_path = get_elements( path, last, i+1 );
					new_path.push( poss_intersects[0] );
					new_paths.push( new_path );
					path[i] = poss_intersects[1];
					last = i;
				}
				else {
					i++;
				}
			}
		}
		if ( last !== i ) {
			new_path = get_elements( path, last, path.length );
			if ( new_path ) {
				new_paths.push( new_path );
			}
		}
	} // end handle_point_erase
		
	var handle_capsule_erase = function(path, i) {
		var e0 = erase_path[i];
		var e1 = erase_path[i+1];
		
		var i = 0;
		var last = 0;
		
		// handle point path
		if ( path.length === 1 ) {
			var code = within_capsule( path[0][0], path[0][1], e0[0], e0[1], e1[0], e1[1], erase_radius );
			if ( code.indexOf( 1 ) === -1 ) {
				new_paths.push( path );
				return;
			}
		}
		var new_path;
		while ( i < (path.length - 1) ) {
			var p0 = path[i];
			var p1 = path[i+1];
			var code0 = within_capsule( p0[0], p0[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
			var code1 = within_capsule( p1[0], p1[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
			
			if ( code0.indexOf( 1 ) !== -1 && code1.indexOf( 1 ) !== -1 ) {
				i++;
				last = i;
			}
			else if ( code0.indexOf( 1 ) !== -1 && code1.indexOf( 1 ) === -1 ) {
				var x = get_capsule_intersection( p0[0], p0[1], code0, p1[0], p1[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
				if ( x ) {
					path[i] = x;
					last = i;
				}
				else {
					i++;
				}
			}
			else if ( code0.indexOf( 1 ) === -1 && code1.indexOf( 1 ) !== -1 ) {
				/* var x = get_capsule_intersection( p1[0], p1[1], code1, p0[0], p0[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
				if ( x ) {
					new_path = get_elements( path, last, i+1 );
					new_path.push( x );
					new_paths.push( new_path );
				}
				i++;
				last = i; */
				var x = get_capsule_intersection( p1[0], p1[1], code1, p0[0], p0[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
				if ( x ) {
					new_path = get_elements( path, last, i+1 );
					new_path.push( x );
					new_paths.push( new_path );
					i++;
					last = i;
				}
				else {
					i++;
				}
			}
			else {
				var poss_intersects = get_capsule_intersections( p0[0], p0[1], p1[0], p1[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
				if ( poss_intersects ) {
					new_path = get_elements( path, last, i+1 );
					new_path.push( poss_intersects[0] );
					new_paths.push( new_path );
					path[i] = poss_intersects[1];
					last = i;
				}
				else {
					i++;
				}
			}
		}
		if ( last !== i ) {
			new_path = get_elements( path, last, path.length );
			if ( new_path ) {
				new_paths.push( new_path );
			}
		}
	} // end handle_capsule_erase
	
	// main
	erase_path = clean_path( erase_path );
	if ( erase_path.length === 1 ) {
		for ( var p = 0; p < paths.length; p++ ) {
			handle_point_erase( paths[p] );
			paths = new_paths;
		}
	}
	else {
		for ( var e = 0; e < (erase_path.length - 1); e++ ) {
			for ( var p = 0; p < paths.length; p++ ) {
				handle_capsule_erase( paths[p], e );
			}
			paths = new_paths;
			new_paths = [];
		}
	} // end main
	
	// round all coordinates	
	for ( var r = 0; r < paths.length; r++ ) {
		for ( var rr = 0; rr < paths[r].length; rr++ ) {
			paths[r][rr][0] = Math.round( paths[r][rr][0] );
			paths[r][rr][1] = Math.round( paths[r][rr][1] );
		}
	}
	
	/*
	* To get test case: uncomment this block and the block from line <num> to <num>.
	*/
	console.log( "erase path (cleaned):" );
	log_path( erase_path, 1 );
	console.log( "paths:" );
	log_paths( paths );
	/**/
	
	return paths;
} // end erase

/* Helper functions:
*  display_path (path)
*  clean_path (path)
*  get_elements (arr, begin, end)
*  get_distance (p0_x, p0_y, p1_x, p1_y)
*  within_circle (x, y, c_x, c_y, r)
*  within_box (p_x, p_y, a_x, a_y, b_x, b_y, r)
*  within_capsule (p_x, p_y, a_x, a_y, b_x, b_y, r)
*  get_parallel_segments (a_x, a_y, b_x, b_y, r)
*  get_cirle_intersection (a_x, a_y, b_x, b_y, c_x, c_y, r)
*  get_circle_intersections (a_x, a_y, b_x, b_y, c_x, c_y, r)
*  get_line_intersection (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y)
*  get_capsule_intersection (p0_x, p0_y, code, p1_x, p1_y, c0_x, c0_y, c1_x, c1_y, r)
*  get_capsule_intersections (p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, c1_x, c1_y, r)
*/

function display_path (path) {
		document.write( "[" );
		for ( var i = 0; i < path.length-1; i++ ) {
			document.write( "[" + path[i][0] + "," + path[i][1] + "]," );
		}
		document.write( "[" + path[i][0] + "," + path[i][1] + "]" );
		document.write( "]" );
}

function display_paths (paths) {
	document.write( "[" );
	for ( var i = 0; i < paths.length-1; i++ ) {
		display_path( paths[i] );
		document.write( ",<br />" );
	}
	display_path( paths[i] );
	document.write( "]" );
}

function log_path (path, display_switch) {
	var log = "";
	log += "[";
	for ( var i = 0; i < path.length-1; i++ ) {
		log += "[" + path[i][0] + "," + path[i][1] + "],";
	}
	log += "[" + path[i][0] + "," + path[i][1] + "]";
	log += "]";
	
	// log path to console
	if ( display_switch ) {
		console.log( log );
	}
	// return string for use elsewhere
	else {
		return log;
	}
}

function log_paths (paths) {
	log = "";
	log += "[";
	for ( var i = 0; i < paths.length-1; i++ ) {
		log += log_path( paths[i], 0 );
		log += ",";
	}
	log += log_path( paths[i], 0 );
	log += "]";
	
	console.log( log );
}

function clean_path (path) {
	var cleaned = [];
	if ( path.length === 1 ) {
		cleaned = path;
	}
	else {
		pClean = 0;
		while ( pClean < (path.length-1) ) {
			if ( path[pClean][0] !== path[pClean+1][0] || path[pClean][1] !== path[pClean+1][1] ) {
				cleaned.push( path[pClean] );
			}
			pClean++;
		}
		if ( path.length !== 0 && cleaned.length === 0 ) {
			cleaned.push( path[0] );
		}
		if ( path[path.length-1][0] !== path[cleaned.length-1][0] || path[path.length-1][1] !== path[cleaned.length-1][1] ) {
			cleaned.push( path[pClean] );
	    }
	}
	return cleaned;
}

function get_elements (arr, begin, end) {
	var elements = [];
	for ( var n = begin; n < end; n++ ) {
		elements.push( arr[n] );
	}
	return elements;
}

function get_distance (p0_x, p0_y, p1_x, p1_y) {
	return ( Math.sqrt( Math.pow( (p1_x - p0_x), 2 ) + Math.pow( (p1_y - p0_y), 2 ) ) );
}

/*
* Takes x, y: the point in question
* Takes c_x, c_y: the center of the circle
* Takes r: the radius of the circle
* Returns 0 or 1: 0 if the point is outside the circle, 1 if within
*/
function within_circle (x, y, c_x, c_y, r) {
	var dist = get_distance( x, y, c_x, c_y );
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
function get_circle_intersection (a_x, a_y, b_x, b_y, c_x, c_y, r) {
	
	var vec_ac = [ (c_x - a_x), (c_y - a_y) ];
	var vec_ab = [ (b_x - a_x), (b_y - a_y) ];
	
	//if ( get_distance( a_x, a_y, c_x, c_y ) === r ) return null;
	
	var mag_ab = Math.sqrt( Math.pow( vec_ab[0], 2 ) + Math.pow( vec_ab[1], 2 ) );
	var u_vec_ab = [ (vec_ab[0]/mag_ab), (vec_ab[1]/mag_ab) ];
	var ac_proj_ab = vec_ac[0]*u_vec_ab[0] + vec_ac[1]*u_vec_ab[1];
	
	var right_point = [ (a_x + ac_proj_ab*u_vec_ab[0]), (a_y + ac_proj_ab*u_vec_ab[1]) ];
	var dist_c_to_right_point = Math.sqrt( Math.pow( (c_x - right_point[0]), 2 ) + Math.pow( (c_y - right_point[1]), 2) );
	var b;
	if ( dist_c_to_right_point === 0 ) {
		b = r;
	}
	else {
		var b = Math.sqrt( Math.pow( r, 2 ) - Math.pow( dist_c_to_right_point, 2 ) );
	}
	var intersection = [ (a_x + ac_proj_ab*u_vec_ab[0] + b*u_vec_ab[0]), (a_y + ac_proj_ab*u_vec_ab[1] + b*u_vec_ab[1]) ];
	
	if ( a_x === intersection[0] && a_y === intersection[1] ) return null;
	return intersection;
}

function get_circle_intersections (a_x, a_y, b_x, b_y, c_x, c_y, r) {
	
	var vec_ac = [ (c_x - a_x), (c_y - a_y) ];
	var vec_ab = [ (b_x - a_x), (b_y - a_y) ];
	
	var dist_ac = get_distance( a_x, a_y, c_x, c_y );
	var dist_bc = get_distance( b_x, b_y, c_x, c_y );
	
	/*
	if ( a_x < b_x ) {
		if ( c_x <= a_x ) {
			return null;
		}
	}
	else {
		if ( c_x <= b_x ) {
			return null;
		}
	}
	*/
	
	var vec_n = [ -vec_ab[1], vec_ab[0] ];
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	
	var mag_d = vec_ac[0]*u_vec_n[0] + vec_ac[1]*u_vec_n[1];
	if ( Math.abs(mag_d) >= r ) return null;
	else {
		if ( (a_x <= c_x && b_x <= c_x) || (a_x >= c_x && b_x >= c_x) ) return null; 
	}
	 
	
	var x = Math.sqrt( Math.pow( r, 2 ) - Math.pow( mag_d, 2 ) );
	var vec_cd = [ (c_x - mag_d*u_vec_n[0]), (c_y - mag_d*u_vec_n[1]) ];
	
	var mag_ab = Math.sqrt( Math.pow( vec_ab[0], 2 ) + Math.pow( vec_ab[1], 2 ) );
	var u_vec_ab = [ (vec_ab[0]/mag_ab), (vec_ab[1]/mag_ab) ];
	
	var intersections = [[(vec_cd[0] - u_vec_ab[0]*x), (vec_cd[1] - u_vec_ab[1]*x)], [(vec_cd[0] + u_vec_ab[0]*x), (vec_cd[1] + u_vec_ab[1]*x)]];
	
	
	if ( (intersections[1][0] === a_x && intersections[1][1] === a_y)   
		 || (intersections[0][0] === b_x && intersections[0][1] === b_y) ) return null;	
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
	if ( (-s2_x * s1_y + s1_x * s2_y) === 0 ) return null;
	s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y); 
	t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
	
	if (s > 0 && s < 1 && t > 0 && t < 1) {	// these were all with equals 
	// Collision detected 
		var intX = p0_x + (t * s1_x); 
		var intY = p0_y + (t * s1_y); 
		return [intX, intY]; 
	} 
	return null; // No collision 

}

/*
* Use this when p0 is in the capsule and p1 isn't.  Pass in p0's code.
*
*/
function get_capsule_intersection (p0_x, p0_y, code, p1_x, p1_y, c0_x, c0_y, c1_x, c1_y, r) {

	var box = get_parallel_segments( c0_x, c0_y, c1_x, c1_y, r );
	var intersections = [];
	
	if ( code[0] && !code[1] ) {
		intersections.push( get_circle_intersection( p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, r ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[0][0], box[0][1], box[3][0], box[3][1] ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[1][0], box[1][1], box[2][0], box[2][1] ) );
		var i = get_circle_intersections( p0_x, p0_y, p1_x, p1_y, c1_x, c1_y, r );
		if ( i ) intersections.push( i[0], i[1] );
	}
	else if ( !code[0] && code[1] ) {
		intersections.push( get_circle_intersection( p0_x, p0_y, p1_x, p1_y, c1_x, c1_y, r ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[0][0], box[0][1], box[3][0], box[3][1] ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[1][0], box[1][1], box[2][0], box[2][1] ) );
		var i = get_circle_intersections( p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, r );
		if ( i ) intersections.push( i[0], i[1] );
	}
	else if ( code[0] && code[1] ) {
		intersections.push( get_circle_intersection( p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, r ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[0][0], box[0][1], box[3][0], box[3][1] ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[1][0], box[1][1], box[2][0], box[2][1] ) );
		intersections.push( get_circle_intersection( p0_x, p0_y, p1_x, p1_y, c1_x, c1_y, r ) );
	}
	else {
		var i = get_circle_intersections( p0_x, p0_y, p1_x, p1_y, c1_x, c1_y, r );
		var j = get_circle_intersections( p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, r );
		if ( i ) intersections.push( i[0], i[1] );
		if ( j ) intersections.push( j[0], j[1] );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[0][0], box[0][1], box[3][0], box[3][1] ) );
		intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[1][0], box[1][1], box[2][0], box[2][1] ) );		
	}
	var intersection = [p0_x, p0_y];
	for ( var n = 0; n < intersections.length; n++ ) {
		if ( intersections[n] ) {
			if ( get_distance( intersections[n][0], intersections[n][1], p1_x, p1_y ) < get_distance( intersection[0], intersection[1], p1_x, p1_y ) ) {
				intersection = intersections[n];
			}
		}	
	}
	if ( intersection[0] === p0_x && intersection[1] === p0_y ) return null;
	return intersection;
}

/*
* Use this when neither of the points are in the capsule.
*
*/
function get_capsule_intersections (p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, c1_x, c1_y, r) {

	var box = get_parallel_segments( c0_x, c0_y, c1_x, c1_y, r );
	var intersections = [];
	
	var tmp = get_circle_intersections( p0_x, p0_y, p1_x, p1_y, c0_x, c0_y, r );
	if ( tmp ) intersections.push( tmp[0], tmp[1] );
	tmp = get_circle_intersections( p0_x, p0_y, p1_x, p1_y, c1_x, c1_y, r );
	if ( tmp ) intersections.push( tmp[0], tmp[1] );
	intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[0][0], box[0][1], box[3][0], box[3][1] ) );
	intersections.push( get_line_intersection( p0_x, p0_y, p1_x, p1_y, box[1][0], box[1][1], box[2][0], box[2][1] ) );
	var intersection0 = [p1_x, p1_y];
	var intersection1 = [p0_x, p0_y];
	
	for ( var n = 0; n < intersections.length; n++ ) {
		if ( intersections[n] ) {
			if ( get_distance( intersections[n][0], intersections[n][1], p0_x, p0_y ) < get_distance( intersection0[0], intersection0[1], p0_x, p0_y ) ) {
				intersection0 = intersections[n];
			}
		}
	}
	for ( var m = 0; m < intersections.length; m++ ) {
		if ( intersections[m] ) {
			if ( get_distance( intersections[m][0], intersections[m][1], p1_x, p1_y ) < get_distance( intersection1[0], intersection1[1], p1_x, p1_y ) ) {
				intersection1 = intersections[m];
			}
		}
	}
	if ( (intersection0[0] === p1_x && intersection0[1] === p1_y) ||
		 (intersection1[0] === p0_x && intersection1[1] === p0_y)    ) return null;
	else return [intersection0, intersection1];
}
	
	