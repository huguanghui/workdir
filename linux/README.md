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