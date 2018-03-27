# --* coding: utf-8 -*-
# --* coding: utf-8 -*-

"""
author: hugh
data: 2018/3/27
"""

import sys
from PyQt5.QtWidgets import (QWidget, QHBoxLayout,
							QLabel, QApplication)
from PyQt5.QtGui import QPixmap

class Example(QWidget):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):

		hbox = QHBoxLayout(self)
		pixmap = QPixmap('icon.png')

		lbl = QLabel(self)
		lbl.setPixmap(pixmap)

		hbox.addWidget(lbl)
		self.setLayout(hbox)

		self.setGeometry(300, 300, 250, 150)
		self.setWindowTitle('Red Rock')
		self.show()	

if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()

	sys.exit(app.exec_())