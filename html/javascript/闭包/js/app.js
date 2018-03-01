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

/*
(function(window) {
	var base64 = {};

	base64._keyStr = 'ABCDEFGHIJKLMNOPQRTUVWXYZ';

	base64.decode = function(input) {
		var output = 'abc';

		return output;
	}

	window.base64 = base64;
})(window);
*/

/*
var testJS = function(h, r) {
	var k = {};

	var a = h.ceil(3.5);

	console.log('R :' + r[0]);

	console.log('A : ' + a);

	return k;
}(Math, ['aa', 'bb']);
*/


/*
function Book(name, price) {
	this.name = name;
	this.price = price;
	this.setName = function(name) {
		this.name = name;
	}
	this.setPrice = function(price) {
		this.price = price;
	}
	this.getInfo = function() {
		return this.name + ' ' + this.price;
	}
}

Book.prototype.echo = function() {
	console.log("Please OK !");
}

var book1 = new Book();

book1.echo();
*/

var test = 'hello';

var message = new Function('msg', 'alert(msg)');

// message('test');