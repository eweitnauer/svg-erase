/// testing with nodeunit
var erase  = require('./erase.js').erase;

exports['cut single segment with circle at middle'] = function(test) {
	var res = erase([[[0,0],[40,0]]], [[20,0]], 10);
  test.deepEqual(res, [[[0,0],[10,0]], [[30,0],[40,0]]]);

	var res = erase([[[0,0],[40,0]]], [[10,0]], 10);
  test.deepEqual(res, [[[20,0],[40,0]]]);

	var res = erase([[[0,0],[40,0]]], [[30,0]], 10);
  test.deepEqual(res, [[[0,0],[20,0]]]);

  test.done();
}

exports['cut single segment with circle at start'] = function(test) {
	var res = erase([[[0,0],[40,0]]], [[0,0]], 10);
  test.deepEqual(res, [[[10,0],[40,0]]]);
  test.done();
}

exports['cut single segment with circle at end'] = function(test) {
	var res = erase([[[0,0],[40,0]]], [[40,0]], 10);
  test.deepEqual(res, [[[0,0],[30,0]]]);
  test.done();
}

exports['cut segments with circle at middle'] = function(test) {
	var res = erase([[[0,0],[20,0]]
		              ,[[20,0],[40,0]]], [[20,0]], 10);
  test.deepEqual(res, [[[0,0] ,[10,0]]
  	                  ,[[30,0],[40,0]]]);
  test.done();
}

exports['cut 2 segments with circle at end of middle point'] = function(test) {
	var res = erase([[[0,0],[20,0],[40,0],[60,0]]]
		              ,[[15,0]], 5);
  test.deepEqual(res, [[[0,0] ,[10,0]]
  	                  ,[[20,0],[40,0],[60,0]]]);
  test.done();
}

exports['cut vertical segment with circle in middle'] = function(test) {
	var res = erase([[[0,0],[0,40]]], [[0,20]], 10);
  test.deepEqual(res, [[[0,0],[0,10]], [[0,30],[0,40]]]);

	var res = erase([[[0,0],[0,40]]], [[0,10]], 10);
  test.deepEqual(res, [[[0,20],[0,40]]]);

	var res = erase([[[0,0],[0,40]]], [[0,30]], 10);
  test.deepEqual(res, [[[0,0],[0,20]]]);

  test.done();
}
