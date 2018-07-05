[TOC]

## FCGI的简介
	快速通用网关接口.处理fastcgi格式的数据处理.
```shell
解压处理
./configure
make & make install
```
---
## spawn-fcgi的简介
### 使用spawn-fcgi启动编写好的fastcgi程序
spawn-fcgi -a 127.0.0.1 -p 8081 -f  cgi程序位置

