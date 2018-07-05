[TOC]

## gSoap生成代码框架的调整

### 编译选项
	-DWITH_NOIDREF
		eliminates href/ref and id attributes to (de)serialize multi-ref data,
		or alternatively use the SOAP_XML_TREE runtime flag
		清除href/ref和id属性,目的是为了序列化和反序列化多ref数据.或者使用SOAP_XML_TREE运行时标志.

	-DWITH_LEAN
		creates a small-footprint executable
		创建一个精简的可执行程序

	-DWITH_LEANER
		creates an even smaller footprint executable
		创建一个更加精简的可执行程序

### 生成前模块的选择
	去掉已经被抛弃的image10.wsdl和ptz10.wsdl

### 修改生成的代码
	去掉所有的soap_default_xxx, 使用memset来代替

### 工作记录
&emsp;裁剪前的程序的大小:
- 3516a: 4767968(4.6M)
- 3519:  5196620(5M)
- 3516cv300: 4679856(4.5M)
- ms316: 3027884(2.9M)

&emsp;裁掉设备管理中部分功能,裁掉存储管理模块,裁掉media和media2中配置增删的功能,去掉event中seek

[1]:https://blog.csdn.net/tongjing524/article/details/45847911
[2]:https://blog.csdn.net/tongjing524/article/details/45847929