var add=(function () {
	var cnt = 0;
	return function() {return cnt += 1;}
})();

add();
add();
add();