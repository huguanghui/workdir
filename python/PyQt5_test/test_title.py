# -*- coding: utf-8 -*-

"""

author: hugh
data: 2018/3/27
"""

import sys
from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtGui import QIcon

class Example(QWidget):

	def __init__(self):
		super().__init__()
		# 界面绘制放到initUI接口中
		self.initUI()

	def initUI(self):
		# 设置窗口的位置和大小
		self.setGeometry(300, 300, 300, 220)
		# 设置窗口的标题
		self.setWindowTitle('Icon')
		# 设置窗口的图标
		self.setWindowIcon(QIcon('web.png'))

		#显示窗口
		self.show()

if __name__ == '__main__':
	# 创建应用程序和对象
	app = QApplication(sys.argv)
	ex = Example()
	sys.exit(app.exec_())

