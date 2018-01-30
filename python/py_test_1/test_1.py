#coding=utf-8
import os,sys
import time

'''
print (time.altzone/360)
'''

print (os.getcwd())

fd = os.open("test.log", os.O_RDWR|os.O_CREAT)

os.write(fd, )

os.close(fd)

print ("关闭文件成功")