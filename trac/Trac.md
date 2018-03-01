[TOC]
---

## 链接
[Trac的安装设置](http://wiki.ubuntu.org.cn/Trac%E7%9A%84%E5%AE%89%E8%A3%85%E8%AE%BE%E7%BD%AE)
[windows上Trac的管理经验](http://cn.waterlin.org/ProjectManagement/Trac.html)

## 简介
	Trac采用Python语言开发.

### 模型
	Trac是以面向进度模型为项目管理模型的，很明显的特点就是它以里程碑(Milestone)方式进行项目管理的。每个里程碑中的具体要做哪些事情，就使用Ticket来进行定义、跟踪等。里程碑是什么呢？为什么我不用时间点呢？原因在于使用时间点往往让人误以为，里程碑是按照时间来设计的，而不是按照事件来设立的。
	另外，Trac做一个SCM配置管理平台，意味着它有良好的扩充性。通过WebAdmin界面中的Plugin功能，可以很方便的安装下载的插件，也可以通过此功能查看已经安装的插件，并可对其中的插件进行启用或停用操作。