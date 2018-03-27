# --* coding: utf-8 -*-

"""
absolute positioning

author: hugh
data: 2018/3/27
"""

import sys
from PyQt5.QtWidgets import QWidget, QLabel, QApplication

class Example(QWidget):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):
		lbl1 = QLabel('ZetCode', self)
		lbl1.move(15, 10)

		lbl2 = QLabel('tutorials', self)
		lbl2.move(35, 40)

		lbl3 = QLabel('for programmers', self)
		lbl3.move(55, 70)

		self.setGeometry(300, 300, 250, 150)
		self.setWindowTitle('Abosulte')
		self.show()

if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()

	sys.exit(app.exec_())