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

	// The code should iterate over all paths and then call a method that deals with a
	// single path and the erase_path. Inside that method, we need to iterate over all
  // line segments of the path paired with all line segments of the erase_path and
  // call a method for each that handles intersecting two lines (or rather, a line with
  // a line that has a radius == a capsule).
  
  // Facts:
  // - because we iterate over each path in "paths," we do not have to follow paths
  // - a path segment will either: not be in erase zone, enter erase zone, cross erase zone, or be completely inside erase zone
  // The least amount of data needed to account for these cases is: ...
  // - line segments parallel to each erase segment on both sides
  
  // Cases to consider:
  // - path which is a single point: calculate distance to each erase_path, if within, delete
  // - path of finite length:
  //   - path is within erase_radius of an erase_path, but does not intersect path or border
  //   - path crosses one or more of: erase_path, erase_path border
  
  // put the following on hold for a second...
  // My idea is this:
  // for each segment of erase_path, calculate the lines parallel to each, as determined by erase_radius
  // for the endpoints of erase_path, calculate the circle surrounding it as determined by erase_radius
  // for each path
	/*
	for ( var i = 0; i < (erase_path.length - 1); i++ ) {
		document.write( erase_path[i][0] + " " );
	}
	*/
	/*
	for ( var i = 0; i < (erase_path.length - 1); i++ ) {
		var dist = Math.sqrt( Math.pow( (erase_path[i+1][0] - erase_path[i][0]), 2 ) + Math.pow( (erase_path[i+1][1] - erase_path[i][1]), 2 ) );
		document.write( erase_path[i][0] + " " + erase_path[i][1] + " " + dist + "<br />" );
	}
	*/
	var new_paths = [];
	for (
	return paths;
}

/*
* Takes the x and y coordinates of two points, representing a line segment.
* Takes the erase_radius (half the height of the box).
* Returns an array containing the four point coordinate-pairs that represent the vertices of the box.
*/
function getBox (p0_x, p0_y, p1_x, p1_y, erase_radius) {

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
	var vec_n = [-vec_v[1], vec_v[0]];
	var mag_n = Math.sqrt( Math.pow( vec_n[0], 2 ) + Math.pow( vec_n[1], 2 ) );
	var u_vec_n = [vec_n[0]/mag_n, vec_n[1]/mag_n];
	var vec = [x-vec_v[0], y-vec_v[1]];
	var h = u_vec_n[0]*vec[0] + u_vec_n[1]*vec[1];
	
	if (h > 0) return 1;
	else return 0;
}
/*
* Takes the points that represent two line segments:
* 	p0 and p1 are line segment 1, p2 and p3 are line segment 2.
* Returns null if the line segments do not intersect.
* Returns the coordinate-pair of the intersection if it exists.
*/
function getLineIntersection (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) { 

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


	
	
	