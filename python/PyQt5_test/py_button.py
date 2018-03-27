# -*- coding: utf-8 -*-

import sys
from PyQt5.QtWidgets import (QWidget, QToolTip, QPushButton, QApplication)
from PyQt5.QtGui import QFont


class Example(QWidget):

	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):
		# 设置显示工具的字体
		QToolTip.setFont(QFont('SansSerif', 10))

		# 创建一个提示
		self.setToolTip('This is a <b>QWidget</b> widget')

		# 创建一个PushButton并为它设置一个tooltip
		btn = QPushButton('Button', self)
		btn.setToolTip('This is a <b>QPushButton</b> widget')

		# 显示默认尺寸
		btn.resize(btn.sizeHint())

		# 移动button位置
		btn.move(50, 50)

		self.setGeometry(300, 300, 300, 200)
		self.setWindowTitle('Tooltips')
		self.show()


if __name__ == '__main__':

	app = QApplication(sys.argv)
	ex = Example()

	sys.exit(app.exec_())