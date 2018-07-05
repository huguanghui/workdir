[TOC]

## 链接
- [SQLite官网](http://www.sqlite.org/index.html)

---
## SQLite的扩展-JSON1的使用
### 创建数据库
```shell
sqlite3 databasename.db
```

### 创建JSON表
```shell
sqlite3>create table faceinfo (
		ID INT PRIMARY KEY NOT NULL,
		INFO JSON,
		PATH CHAR(128)
	);
```

### 删除表
```shell
sqlite3>drop table userinfo;
```

### 填充表
```shell

```