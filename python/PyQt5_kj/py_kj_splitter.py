# --* coding: utf-8 -*-

"""
author: hugh
data: 2018/3/27
"""

import sys
from PyQt5.QtWidgets import (QWidget, QHBoxLayout, QFrame,
							QSplitter, QStyleFactory, QApplication)
from PyQt5.QtCore import Qt

class Example(QWidget):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):
		hbox = QHBoxLayout(self)

		topleft = QFrame(self)
		topleft.setFrameShape(QFrame.StyledPanel)

		topright = QFrame(self)
		topright.setFrameShape(QFrame.StyledPanel)

		bottom = QFrame(self)
		bottom.setFrameShape(QFrame.StyledPanel)

		splitter1 = QSplitter(Qt.Horizontal)
		splitter1.addWidget(topleft)
		splitter1.addWidget(topright)

		splitter2 = QSplitter(Qt.Vertical)
		splitter2.addWidget(splitter1)
		splitter2.addWidget(bottom)

		hbox.addWidget(splitter2)
		self.setLayout(hbox)

		self.setGeometry(300, 300, 250, 150)
		self.setWindowTitle('QSlitter')
		self.show()	

if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()

	sys.exit(app.exec_())