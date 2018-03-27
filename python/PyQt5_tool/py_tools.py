# --* coding: utf-8 -*-
# --* coding: utf-8 -*-

"""
author: hugh
data: 2018/3/27
"""

import sys
from PyQt5.QtWidgets import QMainWindow, QAction, qApp, QApplication
from PyQt5.QtGui import QIcon

class Example(QMainWindow):
	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):
		
		exitAction = QAction(QIcon('exit24.png'), 'Exit', self)
		exitAction.setShortcut('Ctrl + Q')
		exitAction.triggered.connect(qApp.quit)

		self.toolbar = self.addToolBar('Exit')
		self.toolbar.addAction(exitAction)

		self.setGeometry(300, 300, 300, 200)
		self.setWindowTitle('ToolBar')
		self.show()

if __name__ == '__main__':

	app = QApplication(sys.argv)

	ex = Example()

	sys.exit(app.exec_())