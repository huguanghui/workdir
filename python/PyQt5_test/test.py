import sys
from PyQt5.QtWidgets import QApplication, QWidget

if __name__ == '__main__':
	#创建应用程序对象，+传参
	app = QApplication(sys.argv)
	#QWidget是pyqt5中所有用户界面对象的基类
	w = QWidget()
	#resize()方法调整窗口的大小.450px宽300px高
	w.resize(450, 300)
	#move方法移动到窗口的位置x=300 y=300
	w.move(300, 300)
	#设置窗口的标题
	w.setWindowTitle('simple')
	显示在屏幕上
	w.show()

	#系统exit()方法确保应用程序干净退出
	#exec_执行python关键字
	sys.exit(app.exec_())
