[TOC]
---

## DOT语言语法
```cpp
// 有向图
digraph graphname {

}

// 无向图
graph graphname {

}

// 属性(颜色,形状,线形)
node [fontname="Verdana", fontsize=10, color="skyblue", shape="record"];
edge [fontname="Verdana", fontsize=10, color="crimson", style="solid"];

bgcolor="blue";
center="" // 是否居中绘制
// label属性改变节点的显示名称
a [label="Foo"]

// 节点形状被改变
b [shape=box]

// 字体和大小,颜色
fontname="Verdana";
fontsize=10;
fontcolor="blue";

//

// 样式
style="solid";

// a-b边和b-c边有相同的属性
a -- b -- c [color=blue];
b -- d [style=dotted];
```