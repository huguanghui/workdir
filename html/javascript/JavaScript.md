[TOC]

---
## 链接
[理解JavaScript中的闭包](https://www.cnblogs.com/cboyce/p/6003269.html)
[JS中window](http://www.w3school.com.cn/js/js_window.asp)
[CryptoJS加密库的使用](http://blog.csdn.net/wangcunhuazi/article/details/41491995)
[JS的传参问题](http://www.jb51.net/article/89297.htm)
[JS中function的使用方式](https://www.cnblogs.com/pizitai/p/6427433.html)

## 闭包
	有权访问另一个函数作用域内变量的函数都是闭包.由于变量被应用了所以不会被回收
	目的是保护内部变量不被污染.

## 自调用匿名函数
	格式
	(function(){

	})();
	创建一个匿名函数,并在创建后立即执行一次.

## window
	表示浏览器窗口
### 对象
	全局对象,函数以及变量均自动成为window对象成员
	全局变量是window对象的属性(window.document.getElementById("header"))
	全局函数是window对象的方法

### 尺寸
	三种方法确定浏览器窗口的尺寸
	1.Internet Explorer, Chrome, Firebox, Opera以及Safari
		window.innerHeight
		window.innerWidth
	2.Internet Explorer 8, 7, 6, 5
		document.documentElement.clientHeight
		document.documentElement.clientWidth

	3.document.body.clientHeight 和 document.body.clientWidth

### 方法
- window.open()  - 打开新窗口
- window.close() - 关闭当前窗口
- window.moveTo() - 移动当前窗口
- window.resizeTo() - 调整当前窗口的尺寸

## CryptoJS
	目的是为JavaScript提供各种各样的加密算法.
	MD5
	SHA-1
	SHA-256
	AES
	Rabbit
	MARC4
	HMAC
	HMAC-MD5
	HMAC-SHA1
	HMAC-SHA256
	PBKDF2


## JS中传参的分析
	JS函数的参数与大多数其他语言的函数参数不同,函数不介意传进多少个参数,不介意传递进来的参数的类型,甚至可以不传递参数.

## JS中的function的多种使用方式
	javascript中有对象的概念,却没有类的概念.
	类是个抽象的概念,而对象是这种概念中的实体.

## JS中的原型的概念
	原型就是一个对象的本质.原型也是对象.因此，任何一个对象又可以作为其他对象的原型.Function就相当于一个系统原型,可以把它理解为"基本对象模型",是"对象"这个概念范畴类的基本数据类型.

### prototype概念
	在javascript起关键性的作用.可以说是有了prototype,才出现了原型.
	在原型的基础上通过prototype新增属性或方法.则以该对象为原型的实例化对象中,必然存在新增的属性或方法.

## JS中的this
- 普通的函数this指向
	函数的返回只一个对象还是仅执行函数体.如果完全没有引入对象和类的概念,this指的是window

- function构造类时this的指向
	指向实例化的对象