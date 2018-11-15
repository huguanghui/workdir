# -*- coding: utf-8 -*-

import sys
from PyQt5.QtWidgets import QWidget, QPushButton, QApplication

class Example(QWidget):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):

		self.setGeometry(300, 300, 800, 650)
		self.setWindowTitle('Samples')
		self.show()


if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()

	sys.exit(app.exec_())