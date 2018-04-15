[TOC]

---
[菜鸟教程](http://www.runoob.com/python3/python3-tutorial.html)
[python的模块和包的知识](http://blog.csdn.net/leadai/article/details/78558086)
[python的标准接口](http://python.usyiyi.cn/translate/python_352/library/index.html)
[python搭建区块链](http://mp.weixin.qq.com/s?__biz=MjM5NTg2NTU0Ng%3D%3D&chksm=bd5d22298a2aab3f7bf5636e4ee008c16b70ab4d415174353896bc9a432bf0c8d872191775fe&idx=2&mid=2656597132&scene=0&sn=fba9c1fc06f90923415820c871b978b4#rd)

## flask的web框架的使用
[web微框架](http://docs.jinkan.org/docs/flask/)

## 常用使用
[pip使用][1]
[程序员之路：python3+PyQt5+pycharm桌面GUI开发][2]
[PyQt5教程][3]

## python知识点

- python同时支持程序和面向对象编程
- 面向对象的三个重要方面:类,变量和方法.
- pyqt5模块划分:
	- QtCore
	- QtGui
	- QtWidgets 创建经典桌面风格的用户界面的UI元素
	- QtMultimedia
	- QtBluetooth
	- QtNetwork
	- QtPositioning
	- Enginio
	- QtWebSockets
	- QtWebKit
	- QtWebKitWidgets
	- QtXml
	- QtSvg
	- QtSql
	- QtTest

pyUIC转换后的使用

```python
if __name__ == "__main__":
	import sys

    app = QtWidgets.QApplication(sys.argv)

    widget = QtWidgets.QWidget()

    ui = Ui_Form()
    ui.setupUi(widget)

    widget.show()

    sys.exit(app.exec_())
```

## [python打包成exe可执行程序][4]
pyinstaller -F myfile.py



## 注意事项
1.安装PyQt5时注意python文件夹的用户权限.

[1]:http://blog.csdn.net/u012450329/article/details/52537651
[2]:http://blog.sina.com.cn/s/blog_989218ad0102wz1k.html
[3]:http://code.py40.com/pyqt5/
[4]:http://www.51testing.com/html/25/70225-3715960.html