/*
var add=(function () {
	var cnt = 0;
	return function() {return cnt += 1;}
})();

add();
add();
add();
*/

/*
function a() {
	var n = 0;
	function inc() {
		n++;
		console.log(n);
	}
	inc();
	inc();
}

a();
*/

/*
function a() {
	var n = 10;
	this.inc = function() {
		n ++;
		console.log(n);
	}
}

var c = new a();

c.inc();
c.inc();
*/

/*
function a() {
	var n = 15;
	function inc() {
		n ++;
		console.log(n);
	}

	return inc;
}

var c = a();

c();
c();
*/

(function(window) {
	var base64 = {};

	base64._keyStr = 'ABCDEFGHIJKLMNOPQRTUVWXYZ';

	base64.decode = function(input) {
		var output = 'abc';

		return output;
	}

	window.base64 = base64;
})(window);