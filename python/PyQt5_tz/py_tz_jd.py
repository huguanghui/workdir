# --* coding: utf-8 -*-

"""
author: hugh
data: 2018/3/27
"""

import sys
from PyQt5.QtWidgets import (QWidget, QPushButton, 
							QLineEdit, QApplication)

class Button(QPushButton):
	def __init__(self, title, parent):
		super().__init__(title, parent)

		self.setAcceptDrops(True)

	def dragEnterEvent(self, e):

		if e.mimeData().hasFormat('text/plain'):
			e.accept()
		else:
			e.ignore()

	def dropEvent(self, e):

		self.setText(e.mimeData().text())

class Example(QWidget):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):

		edit = QLineEdit('', self)
		edit.setDragEnabled(True)
		edit.move(30, 65)

		button = Button("Button", self)
		button.move(190, 65)

		self.setGeometry(300, 300, 300, 150)
		self.setWindowTitle('Simple drag & drop')

if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()
	ex.show()

	sys.exit(app.exec_())