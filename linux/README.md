## Linux常用的使用技巧

---
### readelf的使用
#### 1.查看动态依赖
    -d 
    eg: readelf -d onvifserver

### 2.查看是否为debug编译
    -S 
    eg: readelf -S libmpr.so
    观察是不是带有debug字段

---
## ubuntu系统的bug解决
- [/dev/sda1报错无法启动](https://blog.csdn.net/zhang_danf/article/details/23821819)