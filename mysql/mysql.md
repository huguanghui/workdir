[TOC]

## 安装
    apt-get install mysql-server
    apt-get install mysql-client
    apt-get install libmysqlclient-dev

## 连接数据库
    mysql -u root -p

## 创建数据库
    mysqladmin -u root -p create 数据库名称

## 删除数据库
    mysqladmin -u root -p drop 数据库名称

## 选择数据库
    连接数据库后, use 数据库名称;

## 数据表操作
    a.创建数据表
        create table table_name (column_name column_type);
    b.删除数据表
        drop table table_name;
    c.插入数据
        insert into table_name ( field1, field2,...fieldN )
                                values
                                ( value1, value2,...valueN );
    d.查询数据  
        select column_name,colum_name from table_name [where clause] [limit n][ offset M ]

## 导出数据
    mysqldump -u root -p database_name table_name > dump.sql

## 导入数据
    mysql -u root -p database_name < dump.sql


