var a = ["A", "B", "C"];
a.name = 'jack';
console.log(a)
console.log("for of")
for (var arr_val of a) {
	console.log(arr_val);
}
console.log("for in")

for (var arr_val in a) {
	console.log(arr_val);
}