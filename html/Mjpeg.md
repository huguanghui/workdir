[TOC]

---
## MJPEG和JPEG简介
### MJPEG
<p>MJPEG是在JPEG基础上发展起来的动态图像压缩技术.单独对一帧进行压缩,不考虑帧与帧之间的变化，
优点:
a.可以获取到清晰度很高的视频图像;
b.可灵活设置每路的视频清晰度和压缩帧数;
c.压缩后的图像可以进行裁剪;
缺点:
a.丢帧现象严重;
b.实时性差;
c.保证每路是高清晰的前提下，很难完成实时压缩;
d.压缩效率低，存储空间大;
</p> 
### JPEG
<p>JPEG是所有图像压缩的基础.适合静态图像的压缩,直接处理整个画面,压缩倍数为20-80倍,分辨率没有选择的余地.</p>

### JPEG格式

#### JFIF文件格式
JFIF是JPEG File Interchange Format的缩写.JFIF是图片文件格式标准.
JFIF文件格式定义的内容是JPEG压缩标准未定义的.如resolution/aspect ratio，color space.
![](./img/JFIF_segment.png)
术语解释:

|术语|解释|
:---: | :---:
 SOI(Start Of Image)               | 图像开始
 EOI(End of Image)                 | 图像结束
 APPn(Application-specific)        | 应用描述
 DHT(Define Huffman Table(s))      | Huffman表(DC,AC,色度,亮度)
 DQT(Define Quantization Table(s)) | 量化表
 DRI(Define Restart Interval)      | 定义重启间隔
 RSTn(Restart)                     | 如果没有DRI,该参数无效.
 SOS(Start Of Scan)                | 开始扫描
 COM(Comment)                      | 包含一个text文本
 SOF(Start Of Frame)               s| 图像大小信息

APP段的结构
![](./img/JFIF_seg_app.png)

DQT段的结构
![](./img/JFIF_seg_dqt.png)
![](./img/JFIF_seg_dqt_1的的e的基础啊.png)

## 资源列表
[JPEG官网](https://jpeg.org/jpeg)
[维基上JPEG简介](https://en.wikipedia.org/wiki/JPEG)