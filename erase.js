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

function erase(paths, erase_path, erase_radius) {
	//erase_radius = 10;
	/*
	for ( var s = 0; s < paths.length; s++ ) {
		
		if ( paths[s].length > 10 ) {
				document.write( "s: " + s + " paths[s].length: " + paths[s].length + " paths[s]: <br />" );
				
				for ( var s2 = 0; s2 < paths[s].length; s2++ ) {
					document.write( "s2: " + s2 + " " + paths[s][s2] + ", " );
					if ( s2 % 10 === 0 ) {
						document.write( "<br />" );
					}
				}
				
		}
		else {
			
			document.write( "s: " + s + " paths[s].length: " + paths[s].length + ", paths[s]: " + paths[s] + "<br />" ); 
		}
	}
	for ( var s = 0; s < paths.length; s++ ) {
		document.write( "path " + s + ": " );
		for ( var ss = 0; ss < paths[s].length-1; ss++ ) {
			if ( paths[s][ss][0] === paths[s][ss+1][0] && paths[s][ss][1] === paths[s][ss+1][1] ) {
				document.write( " same point " );
			}
		}
		document.write( "<br />" );
	}
	*/
	
	var display_path = function (path) {
		document.write( "[" );
		for ( var i = 0; i < path.length; i++ ) {
			document.write( "[" + path[i][0] + "," + path[i][1] + "], " );
		}
		document.write( "]<br />" );
	}
	/*
	for ( var i = 0; i < paths.length; i++ ) {
		display_path( paths[i] );
	}
	*/
	//erase_radius = 6;
	// The code should iterate over all paths and then call a method that deals with a
	// single path and the erase_path. Inside that method, we need to iterate over all
	// line segments of the path paired with all line segments of the erase_path and
	// call a method for each that handles intersecting two lines (or rather, a line with
	// a line that has a radius == a capsule).
    
	//document.write( "paths: " + paths + "<br />" );
	//document.write( "erase_path: " + erase_path + "<br />" );
	var new_paths = [];
	/*
	var handle_erase_clean = function(e_path) {
		var clean_erase = [];
		// no repeated points with a single point path
		if ( e_path.length === 1 ) {
			clean_erase = e_path;
		}
		else {
			var eClean = 0;
			while ( eClean < (e_path.length-1) ) {
				// put non-unique points into clean_erase(_path)
				if ( e_path[eClean][0] !== e_path[eClean+1][0] || e_path[eClean][1] !== e_path[eClean+1][1] ) {
					clean_erase.push( e_path[eClean] );
			    }
				eClean++;
			}
			// this occurs if all points in path were the same
			if ( e_path.length !== 0 && clean_erase.length === 0 ) {
				clean_erase.push( e_path[0] );
			}
			// to get the last point from e_path
			if ( e_path[e_path.length-1][0] !== e_path[clean_erase.length-1][0] || e_path[e_path.length-1][1] !== e_path[clean_erase.length-1][1] ) {
				clean_erase.push( e_path[eClean] );
			}
		}
		return clean_erase;
	}
	*/
	var handle_path_clean = function( path ) {
		var clean_path = [];
		if ( path.length === 1 ) {
			clean_path = path;
		}
		else {
			pClean = 0;
			while ( pClean < (path.length-1) ) {
				if ( path[pClean][0] !== path[pClean+1][0] || path[pClean][1] !== path[pClean+1][1] ) {
					clean_path.push( path[pClean] );
				}
				pClean++;
			}
			if ( path.length !== 0 && clean_path.length === 0 ) {
				clean_erase.push( path[0] );
			}
			if ( path[path.length-1][0] !== path[clean_path.length-1][0] || path[path.length-1][1] !== path[clean_path.length-1][1] ) {
				clean_path.push( path[pClean] );
		    }
		}
		return clean_path;
	}
	
	var handle_point_erase = function(path) {
		
		var i = 0;
		var last = 0;
	
		// handle point path
		if ( path.length === 1 ) {
			if ( !within_circle( path[0][0], path[0][1], erase_path[0][0], erase_path[0][1], erase_radius ) ) {
				new_paths.push( path );
				return;
			}
		}
		
		var new_path;
		while ( i < (path.length - 1) ) {
		
			if ( within_circle( path[i][0], path[i][1], erase_path[0][0], erase_path[0][1], erase_radius ) &&
				 within_circle( path[i+1][0], path[i+1][1], erase_path[0][0], erase_path[0][1], erase_radius ) ) {
				i++;
				last = i;
			}
			else if ( within_circle( path[i][0], path[i][1], erase_path[0][0], erase_path[0][1], erase_radius ) &&
					  !within_circle( path[i+1][0], path[i+1][1], erase_path[0][0], erase_path[0][1], erase_radius ) ) {
				var x = get_circle_intersection( path[i][0], path[i][1], path[i+1][0], path[i+1][1], erase_path[0][0], erase_path[0][1], erase_radius );
				path[i] = x;
				last = i;
			}
			else if ( !within_circle( path[i][0], path[i][1], erase_path[0][0], erase_path[0][1], erase_radius ) &&
					  within_circle( path[i+1][0], path[i+1][1], erase_path[0][0], erase_path[0][1], erase_radius ) ) {
				var x = get_circle_intersection( path[i+1][0], path[i+1][1], path[i][0], path[i][1], erase_path[0][0], erase_path[0][1], erase_radius );
				//new_paths.push( path.slice( last, i+1 ).push( x ) );
				//new_paths.push( get_elements( path, last, i+1 ).push( x ) );
				new_path = get_elements( path, last, i+1 );
				new_path.push( x );
				new_paths.push( new_path );
				i++;
				last = i;
			}
			else {
				var poss_intersects = get_circle_intersections( path[i][0], path[i][1], path[i+1][0], path[i+1][1], erase_path[0][0], erase_path[0][1], erase_radius );
				if ( poss_intersects ) {
					//new_paths.push( path.slice( last, i+1 ).push( poss_intersects[0] ) );
					//new_paths.push( get_elements( path, last, i+1 ).push( poss_intersects[0] ) );
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
			new_paths.push( new_path );
		}
	} // end handle_point_erase
	
	var handle_capsule_erase = function(path, i) {
		var e0 = erase_path[i];
		var e1 = erase_path[i+1];
		
		var i = 0;
		var last = 0;
		
		//document.write ( "*** " + path + " ***" );
		
		// handle point path
		if ( path.length === 1 ) {
			var code = within_capsule( path[0][0], path[0][1], e0[0], e0[1], e1[0], e1[1], erase_radius );
			if ( code.indexOf( 1 ) !== -1 ) {
				//document.write( "point path pushed: " + path + "<br />" );
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
				path[i] = x;
				last = i;
			}
			else if ( code0.indexOf( 1 ) === -1 && code1.indexOf( 1 ) !== -1 ) {
				var x = get_capsule_intersection( p1[0], p1[0], code1, p0[0], p0[1], e0[0], e0[1], e1[0], e1[1], erase_radius );
				new_path = get_elements( path, last, i+1 );
				new_path.push( x );
				new_paths.push( new_path );
				i++;
				last = i;
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
			new_paths.push( new_path );
		}
	} // end handle_capsule_erase
	/*
	if ( erase_path.length === 1 ) {
		for ( var p = 0; p < paths.length; p++ ) {
			handle_point_erase( paths[p] );
		}
	}
	else {
		//document.write( "<br />" + erase_path );
		erase_path = handle_path_clean( erase_path );
		//document.write( "<br />" + erase_path );
		
		for ( var e = 0; e < (erase_path.length - 1); e++ ) {
			
			for ( var p = 0; p < paths.length; p++ ) {
				handle_capsule_erase( paths[p], e );
			}
			paths = new_paths;
			new_paths = [];
			
			document.write( e + " " );
		}
		
	}
	*/
	for ( var r = 0; r < paths.length; r++ ) {
		for ( var rr = 0; rr < paths[r].length; rr++ ) {
			paths[r][rr][0] = Math.round( paths[r][rr][0] );
			paths[r][rr][1] = Math.round( paths[r][rr][1] );
		}
	}
	
	/*
	document.write( "<br />" );
	for ( var s = 0; s < paths.length; s++ ) {
		
		if ( paths[s].length > 10 ) {
				document.write( "s: " + s + " paths[s].length: " + paths[s].length + " paths[s]: <br />" );
				
				for ( var s2 = 0; s2 < paths[s].length; s2++ ) {
					document.write( "s2: " + s2 + " " + paths[s][s2] + ", " );
					if ( s2 % 10 === 0 ) {
						document.write( "<br />" );
					}
				}
				
		}
		else {
			
			document.write( "s: " + s + " paths[s].length: " + paths[s].length + ", paths[s]: " + paths[s] + "<br />" ); 
		}
	}
	*/
	//document.write( "<br />check" );
	//document.write( "<br /><br />" + paths );
	paths = [[[100,50],[194,50]],[[206,50],[300,50]],[[727,152], [727,151], [725,150], [721,148], [713,144], [704,140], [692,137], [678,135], [667,134], [656,134], [646,134], [635,137], [625,142], [615,148], [603,603] ]];
	return paths;
} // end erase

/* Helper functions:
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
	return intersection;
}

function get_circle_intersections (a_x, a_y, b_x, b_y, c_x, c_y, r) {
	
	var vec_ac = [ (c_x - a_x), (c_y - a_y) ];
	var vec_ab = [ (b_x - a_x), (b_y - a_y) ];
	
	var vec_n = [ -vec_ab[1], vec_ab[0] ];
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	
	var mag_d = vec_ac[0]*u_vec_n[0] + vec_ac[1]*u_vec_n[1];
	if ( Math.abs(mag_d) >= r ) return null;
	
	var x = Math.sqrt( Math.pow( r, 2 ) - Math.pow( mag_d, 2 ) );
	var vec_cd = [ (c_x - mag_d*u_vec_n[0]), (c_y - mag_d*u_vec_n[1]) ];
	
	var mag_ab = Math.sqrt( Math.pow( vec_ab[0], 2 ) + Math.pow( vec_ab[1], 2 ) );
	var u_vec_ab = [ (vec_ab[0]/mag_ab), (vec_ab[1]/mag_ab) ];
	
	var intersections = [[(vec_cd[0] - u_vec_ab[0]*x), (vec_cd[1] - u_vec_ab[1]*x)], [(vec_cd[0] + u_vec_ab[0]*x), (vec_cd[1] + u_vec_ab[1]*x)]];
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
	
	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { 
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
	
	