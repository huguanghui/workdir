[TOC]

---

## 链接

[DLL中调用约定和名称修饰符](http://blog.csdn.net/thimin/article/details/1529386)

## __stdcall的功能
	用于调用Win32 API函数.
	函数参数按照从右向左的顺序入栈,被调用的函数再返回前清理传送参数的栈.函数参数的个数必须固定.
