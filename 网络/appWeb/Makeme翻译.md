## MakeMe

### 简介
    创建MakeMe项目是为了替换掉过时的make和没有流行的autoconf单元.
    MakeMe根据一份独立统一的项目描述文档来直接编译或生成本地
    Makefiles和IDE工程环境.

### embedthis的makeme特性
    - 自动搜索配置和组件(取代autoconf的功能)
    - 检测编译能力
    - 源代码头文件配置
    - Xcode,Visual Studio, Make, Nmake和shell脚本
    - C/C++源代码的依赖自动化
    - 跨平台(很容易处理Windows,Linux和Mac编译)
    - 支持交叉编译
    - 对于只读的文件系统编译可以编译外在的资源树
    - MakeMe文件非常方便修改和扩展(javascript格式)
    - 多种编译方式(调试版本,发行版本...)
    - 即使在windows上配置和编译时间非常快
    - 开源可以自由使用(GPL)

### 格外的亮点
    - 统一的工程结构, 和make递归风格不一样
    - MakeMe配置可能包含多个MakeMe文件
    - MakeMe文件中目标和脚本相对与他们的目录
    - 目标可以命名为模型
    - MakeMe提供了一个"why"选项去显示编译成功或失败的原因
    - MakeMe文件和目标智能继承了其他功能的属性

### 安装
```shell
wget https://s3.amazonaws.com/embedthis.software/makeme-0.10.5-src.tgz
tar xfz makeme-0.10.5-0-src.tgz
cd me-0.10.5
make boot
sudo make install 
##卸载
cd /usr/local/lib/makeme/latest
sudo ./uninstall
```
---
### 用户指引

#### 使用MakeMe
##### 执行流程
    当执行me命令时, 程序会在当前目录下搜索start.me文件.如果没有找到,它会继续在上一级目录继续搜索.加载最近的一个start.me文件,开始执行编译.这意味着可以在工程任何地方调用me.start.me可以直接编译,或者转向加载其他MakeMe文件.
    MakeMe的使用场景
    - Stand-alone 
    - Configured
##### Stand-alone
    一个单独start.me文件可以不需要预先配置编译一个简单目标.start.me中包含了编译指定的方法.可以编译源码,编译库和执行脚本.

##### Configured Project
    带配置的工程.开始前调用一次configure.在查询本地工具和模块,MakeMe搜索工程描述的main.me.最后, 生成一份描述工程编译和系统start.me和platformme.me文件.

##### 查看错误
    MakeMe的打印默认是十分精简的.不会滚屏刷很多的信息.传统的Make编译,会丢失掉一个关键的编译和链接警告.相比下来,MakeMe会显示最关键的部分.

##### 追踪命令
    显示完整的编译信息
    me --show(-s)

#### 运行中的配置
##### 运行中的配置
    如果你用于配置工程, 你将会有一个描述工程的main.me文件.
    对于配置型功能,开发者可以通过一份配置脚本模拟和autoconf配置方式.这个脚本使用配置配置target调用.
    MakeMe也可以直接在你的工程中配置
    me configure
    me -configure .

    注意: MakeMe开关可以通过--或-前缀来指定

##### 配置输出


### 相关资料
[官方文档](https://www.embedthis.com/makeme/)