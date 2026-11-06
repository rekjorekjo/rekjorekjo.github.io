---
title: adworld_misc_6
description: Steganography 7-2 答辩 regexpire 没啥意思 Mysterious-GIF 有一些诡异，
  不过binwalk从gif分离出zip是没想到的 随波逐流不知道为啥分不出 流量分析 arrdeepee 没有见过的流量...不会喵 看看官wp吧
  HITB4451
date: 2026-01-21T10:23:30.000Z
categories:
  - Practice
tags: []
minutes: 4
demo: false
draft: false
---


***


## Steganography

### 7-2

答辩

### regexpire

没啥意思



### Mysterious-GIF

有一些诡异，

不过binwalk从gif分离出zip是没想到的

随波逐流不知道为啥分不出



## 流量分析

### arrdeepee

没有见过的流量...不会喵

看看官wp吧

`HITB{44519a67ffc654e40febc09e20e8e745}`



### 神奇的压缩文件

答辩



### Wireshark

本题疑似无法完整复现，大致思路参考：

https://blog.csdn.net/m0_73360524/article/details/147644477

看到流量包体积不小，大概藏了东西，可以试探一下的

```bash
strings abf1976e192a4bc382328d0014ed3ab1.pcapng | grep "png"
(jpg/bmp/gif/png)
                                <p><img src="/static/api/img_add_info/demo1.png"></p>
                                <p><img src="/static/api/img_add_info/demo2.png"></p>
</p><p><img src="http://tools.jb51.net/images/weixin.png" width="180" /></p><p style="color:#757474;">
priority=0&product=(FX Print Driver for Mac OS X)ipdl=application/octet-stream,application/pdf,application/postscript,image/jpeg,image/png,image/pwg-raster)UUID=c6a73a48-54d8-3599-42f4-4b5cb477b992
priority=0&product=(FX Print Driver for Mac OS X)ipdl=application/octet-stream,application/pdf,application/postscript,image/jpeg,image/png,image/pwg-raster)UUID=c6a73a48-54d8-3599-42f4-4b5cb477b992
priority=0&product=(FX Print Driver for Mac OS X)ipdl=application/octet-stream,application/pdf,application/postscript,image/jpeg,image/png,image/pwg-raster)UUID=c6a73a48-54d8-3599-42f4-4b5cb477b992
priority=0&product=(FX Print Driver for Mac OS X)ipdl=application/octet-stream,application/pdf,application/postscript,image/jpeg,image/png,image/pwg-raster)UUID=c6a73a48-54d8-3599-42f4-4b5cb477b992
upload.png
image/png
Content-Disposition: form-data; name="file"; filename="upload.png"
Content-Type: image/png
GET /674874/7782abccd820677fs.png HTTP/1.1
Accept: image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5
=GET /674874/fd2f6f3479d1741es.png HTTP/1.1
Accept: image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5
Content-Type: image/png
priority=0&product=(FX Print Driver for Mac OS X)ipdl=application/octet-stream,application/pdf,application/postscript,image/jpeg,image/png,image/pwg-raster)UUID=c6a73a48-54d8-3599-42f4-4b5cb477b992
priority=0&product=(FX Print Driver for Mac OS X)ipdl=application/octet-stream,application/pdf,application/postscript,image/jpeg,image/png,image/pwg-raster)UUID=c6a73a48-54d8-3599-42f4-4b5cb477b992
```

foremost可以分理处html，这个在本题中需要用到

随后tcp contains "png"，追踪tcp流可以获取到两张png，不是常见的双图隐写

观察一开始strings搜索的结果前三行，在html网页应该有此功能，但是现在无法访问。


