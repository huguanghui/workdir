[TOC]
---

## 链接
[graphviz官网](http://www.graphviz.org/)

## 安装
- 官网下载
- 配置环境变量
    将bin目录添加到环境变量
    dot -version查看graphviz相关版本信息
- dot命令
    dot -Tpng D:\test\1.gv -o image.png

## 简介
graphviz是贝尔实验室开发的一个开源开发包,它使用一个特定的DSL(领域特定语言):dot作为脚本语言,然后使用布局引擎来解析此脚本,并完成自动布局.graphviz提供丰富的导出格式,如常用的图片格式,SVG,PDF格式等.

graphviz中包含了众多的布局器:
- dot默认布局方式,主要用于有向图
- neato基于spring-model(又称force-based)算法
- twopi径向布局
- circo圆环布局
- fdp用于无向图

graphviz的设计初衷是对有向图和无向图等进行自动布局,开发人员使用dot脚本定义图形元素,然后选择算法进行布局,最终导出结果.

## 设计流程
首先在dot脚本中定义图的顶点和边,顶点和边都具有各自的属性,比如形状,颜色,填充模式,字体,样式等.然后使用合适的布局算法进行布局.布局算法除了绘制各个顶点和边之外,需要尽可能的将顶点均匀的分布在画布上,并且尽可能的减少边的交叉(如果交叉过多,就很难看清楚顶点之间的关系了).

一般的流程:
    定义一个图,并向图中添加需要的顶点和边
    为顶点和边添加样式
    使用布局引擎进行绘制

## UML类图模板

```
digraph UML_G {
  fontname = "Courier New"
  fontsize = 10
  
  node [ fontname = "Courier New", fontsize = 10, shape = "record" ];
  edge [ fontname = "Courier New", fontsize = 10 ];
  
  Animal [ label = "{Animal |+ name : String\l+ age : int\l|+ die() : void\l}" ];
  
  subgraph clusterAnimalImpl{
      bgcolor="yellow"
      Dog [ label = "{Dog||+ bark() : void\l}" ];
      Cat [ label = "{Cat||+ meow() : void\l}" ];
  };
  
  edge [ arrowhead = "empty" ];
  
  Dog->Animal;
  Cat->Animal;
  Dog->Cat [arrowhead="none", label="0..*"];
}
```