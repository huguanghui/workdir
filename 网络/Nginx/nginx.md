[TOC]

---
## 链接

[Nginx官网](http://nginx.org/)
[第三方模块](https://www.nginx.com/resources/wiki/modules/index.html)

## 事件模块


## location的语法规则
```json
location [=|~|~*|^~] /uri/ {}


= 表示精确匹配
~ 区分大小写的正则匹配
~* 不区分大小写的正则匹配
!~和！~* 表示不匹配
^~ 表示uri以一个常规字符串开头
```
