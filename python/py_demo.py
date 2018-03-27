# --* coding: utf-8 -*-

"""
author: hugh
data: 2018/3/27
"""

import sys

class Example(QWidget):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):

		self.setGeometry(300, 300, 250, 150)
		self.setWindowTitle('')
		self.show()	

if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()

	sys.exit(app.exec_())