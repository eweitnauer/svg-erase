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

	return paths;
}