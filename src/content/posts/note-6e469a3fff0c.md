---
title: adworld_misc_5
description: Steganography 4433 答辩 pyHAHA 难度爆炸，看wp吧 flagH4pPy_pY_C0dlng 传感器2
  题目重复 Russian-zips ^附件:c0716ce42b364edd8e0801180ae52705.zip zip是伪加密，改掉就行 剩下的没
date: 2026-01-21T06:55:57.000Z
categories:
  - Practice
tags: []
minutes: 28
demo: false
draft: false
---


***


## Steganography

### 4433

答辩



### pyHAHA

难度爆炸，看wp吧

`flag{H4pPy_pY_C0dlng} `



### 传感器2

题目重复



### Russian-zips

[ ^附件]:c0716ce42b364edd8e0801180ae52705.zip

zip是伪加密，改掉就行

剩下的没啥意思，说是和Minecraft的地图文件有关。没兴趣

`ZCTF{N4t1Ve_!}`



### clemency

炸裂。没必要花时间做，插件没更新基本上用不了（太难修改了）

`flag{I_love_cLEMENCy,so_I_want_to_share_it_with_you}`

硬要看的话参考https://www.52pojie.cn/thread-658507-1-1.html



### ext3

>今天是菜狗的生日，他收到了一个linux系统光盘

[ ^附件]:f1fc23f5c743425d9e0073887c846d23

#### 非预期1

直接strings搜索

```bash
strings f1fc23f5c743425d9e0073887c846d23 | grep "flag{"
```

没有输出，猜测是以某种编码写在光盘里面，不妨试试base64

```bash
strings f1fc23f5c743425d9e0073887c846d23 | grep "Zmxh"
ZmxhZ3tzYWpiY2lienNrampjbmJoc2J2Y2pianN6Y3N6Ymt6an0=
```

解码可得flag

#### 非预期2

```bash
strings f1fc23f5c743425d9e0073887c846d23 | grep "flag"
.flag.txt.swp
flag.txtt.swx
~root/Desktop/file/O7avZhikgKgbF/flag.txt
.flag.txt.swp
flag.txtt.swx
.flag.txt.swp
flag.txtt.swx
```

最自然的是搜索flag，发现了文件，那么可以7z打开

注意7z里面没有desktop这个文件夹但是可以直接打开O7avZhikgKgbF文件夹，读取flag。

#### 预期解：

可以直接挂载光盘

```bash
sudo mkdir /mnt/disk
sudo mount -o loop,ro f1fc23f5c743425d9e0073887c846d23 /mnt/disk
cd /mnt/disk/O7avZhikgKgbF
cat flag.txt
```

可得**ZmxhZ3tzYWpiY2lienNrampjbmJoc2J2Y2pianN6Y3N6Ymt6an0=**，解码可得

`flag{sajbcibzskjjcnbhsbvcjbjszcszbkzj}`



### SimpleRAR

> 菜狗最近学会了拼图，这是他刚拼好的，可是却搞错了一块(ps:双图层)

[ ^附件]:18c5326aada0499eafbe03ad8a52e40c.rar

这题目挺好的，有些水平

直接解压发现报错，winrar也报错，说是secret.png有异常，于是打算试试7z

结果7z里面根本就看不到这个文件，这就是真正的隐写吧哈哈哈哈哈

随波逐流梭不了，只好打开010editor看看

发现模板竟然也没报错，这就有点稀奇了

问题一定在secret.png，所以关注block1就行。这个题需要对rar的结构有认识

CRC后面的SUBBLOCK (122)是异常的。122即0x7A(010editor绿色标注)，

- RAR 中，`0x7A` 是**子块（子流）**，通常用于存储额外信息
- 普通文件应该是 `0x74`（文件头）

所以应该把0x7A改成0x74，否则文件不显示

改完可以正常解压了，得到secret.png，zsteg报错，没想到是gif

随波逐流分帧，只有两张图

一开始以为是双图盲水印什么的，结果直接stegsolve就行了，可以发现残缺的二维码，每个图片都是半边，可以直接保存当前帧，裁剪一下。随波逐流纵向合并图片，注意当前目录下不留其它图片，且需要规范命名，保证拼接的二维码正确性

最后随波逐流自动添加定位符解码可得

`flag{yanji4n_bu_we1shi}`

### base64stego

> 菜狗经过几天的学习，终于发现了如来十三掌最后一步的精髓

[ ^附件]:a2eb7ceaf5ab49f7acb33de2e7eed74a.zip

解压发现stego.txt加密，伪加密修改后可以正常解密

```text
U3RlZ2Fub2dyYXBoeSBpcyB0aGUgYXJ0IGFuZCBzY2llbmNlIG9m
IHdyaXRpbmcgaGlkZGVuIG1lc3NhZ2VzIGluIHN1Y2ggYSB3YXkgdGhhdCBubyBvbmV=
LCBhcGFydCBmcm9tIHRoZSBzZW5kZXIgYW5kIGludGVuZGVkIHJlY2lwaWVudCwgc3VzcGU=
Y3RzIHRoZSBleGlzdGVuY2Ugb2YgdGhlIG1lc3M=
YWdlLCBhIGZvcm0gb2Ygc2VjdXJpdHkgdGhyb3VnaCBvYnNjdXJpdHkuIFS=
aGUgd29yZCBzdGVnYW5vZ3JhcGh5IGlzIG9mIEdyZWVrIG9yaWdpbiBhbmQgbWVhbnMgImNvbmNlYW==
bGVkIHdyaXRpbmciIGZyb20gdGhlIEdyZWVrIHdvcmRzIHN0ZWdhbm9zIG1lYW5pbmcgImNv
dmVyZWQgb3IgcHJvdGVjdGVkIiwgYW5kIGdyYXBoZWluIG1lYW5pbmcgInRvIHc=
cml0ZSIuIFRoZSBmaXJzdCByZWNvcmRlZCB1c2Ugb2YgdGhlIHRlcm0gd2FzIGluIDE0OTkgYnkgSm9o
YW5uZXMgVHJpdGhlbWl1cyBpbiBoaXMgU3RlZ2Fub2dyYXBoaWEsIGEgdHJlYV==
dGlzZSBvbiBjcnlwdG9ncmFwaHkgYW5kIHN0ZWdhbm9ncmFwaHkgZGlzZ8==
dWlzZWQgYXMgYSBib29rIG9uIG1hZ2ljLiBHZW5lcmFsbHksIG1lc3P=
YWdlcyB3aWxsIGFwcGVhciB0byBiZSBzb21ldGhpbmcgZWxzZTogaW1hZ2VzLCBhcnRp
Y2xlcywgc2hvcHBpbmcgbGlzdHMsIG9yIHNvbWUgb3R=
aGVyIGNvdmVydGV4dCBhbmQsIGNsYXNzaWNhbGx5LCB0aGUgaGlkZGVuIG1lc3NhZ2UgbWF5IGJlIGluIGludmm=
c2libGUgaW5rIGJldHdlZW4gdGhlIHZpc2libGUgbGluZXMgb2YgYSBwcml2YXRlIGxldHRlci4NCg0KVGhl
IGFkdmFudGFnZSBvZiBzdGVnYW5vZ3JhcGh5LCBvdmVyIGNy
eXB0b2dyYXBoeSBhbG9uZSwgaXMgdGhhdCBtZXNzYWdlcyBkbyBub3QgYXR0cmFjdCBhdHRlbnRpb25=
IHRvIHRoZW1zZWx2ZXMuIFBsYWlubHkgdmlzaWJsZSBlbmNyeXB0ZWQgbWVzc2FnZXOXbm8gbWF0dGVyIF==
aG93IHVuYnJlYWthYmxll3dpbGwgYXJvdXNlIHN=
dXNwaWNpb24sIGFuZCBtYXkgaW4gdGhlbXNlbHZlcyBiZSBpbmNyaW1pbmF0aW5nIP==
aW4gY291bnRyaWVzIHdoZXJlIGVuY3J5cHRpb24gaXMgaWxsZWdhbC4gVGhlcmVmb3JlLH==
IHdoZXJlYXMgY3J5cHRvZ3JhcGh5IHByb3RlY3RzIHRoZSBjb250ZW50cyBvZj==
IGEgbWVzc2FnZSwgc3RlZ2Fub2dyYXBoeSBjYW4gYmUgc2FpZCB0byBwcm90ZWN0IGJ=
b3RoIG1lc3NhZ2VzIGFuZCBjb21tdW5pY2F0aW5nIHBhcnRpZXMuDQoNClN0ZWdhbm9ncmFwaHkgaW5jbHW=
ZGVzIHRoZSBjb25jZWFsbWVudCBvZiBpbmZvcm1hdGlvbiB3aXRoaW4gY29t
cHV0ZXIgZmlsZXMuIEluIGRpZ2l0YWwgc3RlZ2Fub2dyYXBoeSwgZWxlY3Ryb25pYyBjb21tdW5pY2F0aW9u
cyBtYXkgaW5jbHVkZSBzdGVnYW5vZ3JhcGhpYyBjb2RpbmcgaW5zaZ==
ZGUgb2YgYSB0cmFuc3BvcnQgbGF5ZXIsIHN1Y2ggYXMgYSBkb2N1bWVudCBmaWxlLCBpbWFnZSBmaWx=
ZSwgcHJvZ3JhbSBvciBwcm90b2NvbC4gTWVkaWEg
ZmlsZXMgYXJlIGlkZWFsIGZvciBzdGVnYW5vZ3JhcGhpYyB0cmFuc21pc3Npb+==
biBiZWNhdXNlIG9mIHRoZWlyIGxhcmdlIHNpemUuIEFzIB==
YSBzaW1wbGUgZXhhbXBsZSwgYSBzZW5kZXIgbWlnaHQgc3RhcnQgd2l0aCBh
biBpbm5vY3VvdXMgaW1hZ2UgZmlsZSBhbmQgYWRqdXN0IHRoZSBjb2xvciBvZiBldmVyeSAxMDB0aCBwaXhlbCD=
dG8gY29ycmVzcG9uZCB0byBhIGxldHRlciBpbiB0aGUgYWxwaGFiZXQsIGF=
IGNoYW5nZSBzbyBzdWJ0bGUgdGhhdCBzb21lb25lIG5vdCBzcGVjaWZpY2FsbHkgbG9va2luZyBm
b3IgaXQgaXMgdW5saWtlbHkgdG8gbm90aWNlIGl0Lg0KDQpUaGU=
IGZpcnN0IHJlY29yZGVkIHVzZXMgb2Ygc3RlZ2Fub2dyYXBoeSBjYW4gYmUgdHJ=
YWNlZCBiYWNrIHRvIDQ0MCBCQyB3aGVuIEhlcm9kb3R1cyBtZW50aW9ucyB0d28gZXhhbXBsZXMgb+==
ZiBzdGVnYW5vZ3JhcGh5IGluIFRoZSBIaXN0b3JpZXMgb2Yg
SGVyb2RvdHVzLiBEZW1hcmF0dXMgc2VudCBhIHdhcm5pbmcgYWJvdXQgYSB=
Zm9ydGhjb21pbmcgYXR0YWNrIHRvIEdyZWVjZSBieSB3
cml0aW5nIGl0IGRpcmVjdGx5IG9uIHRoZSB3b29kZW4gYmFja2luZyBvZiBhIHdheCB0YWJsZXQgYmVm
b3JlIGFwcGx5aW5nIGl0cyBiZWVzd2F4IHN1cmZhY2UuIFdheCB0YWJsZXRzIHdlcmUgaW4gY29tbW9uIHVzZV==
IHRoZW4gYXMgcmV1c2FibGUgd3JpdGluZyBzdXJmYWNlcywgc29tZXRpbWX=
cyB1c2VkIGZvciBzaG9ydGhhbmQuIEFub3RoZXIgYW5jaWVudCBleGFtcGxlIGlzIHRoYXQgb9==
ZiBIaXN0aWFldXMsIHdobyBzaGF2ZWQgdGhlIGhlYWQgb2YgaGlzIG1vc3QgdHJ1c3RlZCBz
bGF2ZSBhbmQgdGF0dG9vZWQgYSBtZXNzYWdlIG9uIGl0LiBBZnRlciBoaXMgaGFpciBoYWQgZ5==
cm93biB0aGUgbWVzc2FnZSB3YXMgaGlkZGVuLiBUaGUgcHVycG9zZSB3YXMgdG+=
IGluc3RpZ2F0ZSBhIHJldm9sdCBhZ2FpbnN0IHRoZSBQZXJzaWFucy4NCg0KU3RlZ2Fub2dyYXBoeSBoYXMgYm==
ZWVuIHdpZGVseSB1c2VkLCBpbmNsdWRpbmcgaW4gcmVjZW50IGhpc3RvcmljYWwgdGltZXMgYW5kIHT=
aGUgcHJlc2VudCBkYXkuIFBvc3NpYmxlIHBlcm11dGF0aW9ucyBhcmUgZW5kbGVzcyBhbmT=
IGtub3duIGV4YW1wbGVzIGluY2x1ZGU6DQoqIEhpZGRlbiBtZXNzYWdlcyB3aXRoaW4gd2F4IHRh
YmxldHM6IGluIGFuY2llbnQgR3JlZWNlLCBwZW9wbGUgd3JvdGUgbWV=
c3NhZ2VzIG9uIHRoZSB3b29kLCB0aGVuIGNvdmVyZWQgaXQgd2l0aCB3YXggdXBvbiB3aGljaCBhbiBpbm5vY2Vu
dCBjb3ZlcmluZyBtZXNzYWdlIHdhcyB3cml0dGVu
Lg0KKiBIaWRkZW4gbWVzc2FnZXMgb24gbWVzc2VuZ2VyJ3MgYm9keTogYWxzbyB1c2VkIGluIGFuY2llbt==
dCBHcmVlY2UuIEhlcm9kb3R1cyB0ZWxscyB0aGUgc3Rvcnkgb1==
ZiBhIG1lc3NhZ2UgdGF0dG9vZWQgb24gYSBzbGF2ZSdzIHNoYXZlZCBoZWFkLCBoaWRkZW4gYnkgdGhl
IGdyb3d0aCBvZiBoaXMgaGFpciwgYW5kIGV4cG9zZWQgYnkgc2hhdmluZyBoaXMgaGVhZM==
IGFnYWluLiBUaGUgbWVzc2FnZSBhbGxlZ2VkbHkgY2FycmllZCBhIHdhcm5pbmcgdG8gR3JlZWNlIGFib5==
dXQgUGVyc2lhbiBpbnZhc2lvbiBwbGFucy4gVGh=
aXMgbWV0aG9kIGhhcyBvYnZpb3VzIGRyYXdiYWNrcyz=
IHN1Y2ggYXMgZGVsYXllZCB0cmFuc21pc3Npb24gd2hpbGUgd2FpdGluZyBmb3IgdGhlIHP=
bGF2ZSdzIGhhaXIgdG8gZ3JvdywgYW5kIHRoZSByZXN0cmljdGlvbnMgb3==
biB0aGUgbnVtYmVyIGFuZCBzaXplIG9mIG1lc3M=
YWdlcyB0aGF0IGNhbiBiZSBlbmNvZGVkIG9uIG9uZSBwZXJzb24=
J3Mgc2NhbHAuDQoqIEluIFdXSUksIHRoZSBGcmVuY2ggUmVzaXN0YW5jZSBzZW50IHNvbWUgbWVzc2FnZXMgd2==
cml0dGVuIG9uIHRoZSBiYWNrcyBvZiBjb3VyaWVycyD=
dXNpbmcgaW52aXNpYmxlIGluay4NCiogSGlkZGVuIG1lc3NhZ2VzIG9uIHBhcGVyIHdy
aXR0ZW4gaW4gc2VjcmV0IGlua3MsIHVuZGVyIG90aGVyIG1lc3NhZ2Vz
IG9yIG9uIHRoZSBibGFuayBwYXJ0cyBvZiBvdGhlct==
IG1lc3NhZ2VzLg0KKiBNZXNzYWdlcyB3cml0dGVuIGluIE1vcnNlIGNvZGUgb24ga25pdHRpbmcgeWFybiBhbmQg
dGhlbiBrbml0dGVkIGludG8gYSBwaWVjZSBvZiBjbG90aGluZyB3b3K=
biBieSBhIGNvdXJpZXIuDQoqIE1lc3NhZ2VzIHdyaXR0ZW4gb24gdGhlIGJhY2sgb5==
ZiBwb3N0YWdlIHN0YW1wcy4NCiogRHVyaW5nIGFuZCBhZnRlcm==
IFdvcmxkIFdhciBJSSwgZXNwaW9uYWdlIGFnZW50cyB1c2VkIHBob3RvZ3JhcGhpY2FsbHkgcO==
cm9kdWNlZCBtaWNyb2RvdHMgdG8gc2VuZCBpbmZvcm1hdGlvbiBiYWNrIGFuZH==
IGZvcnRoLiBNaWNyb2RvdHMgd2VyZSB0eXBpY2FsbHkg
bWludXRlLCBhcHByb3hpbWF0ZWx5IGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgcGVyaW9kIHByb2R=
dWNlZCBieSBhIHR5cGV3cml0ZXIuIFdXSUkgbWljcm9kb3RzIG5lZWRlZCB0byBiZSBlbWJlZGRlZB==
IGluIHRoZSBwYXBlciBhbmQgY292ZXJlZCB3aXRoIGFuIGFkaGVzaXZlIChzdWNoIGFzIGNvbGxvZGlvbikuIFR=
aGlzIHdhcyByZWZsZWN0aXZlIGFuZCB0aHVzIGRldGVjdGFibGUg
Ynkgdmlld2luZyBhZ2FpbnN0IGdsYW5jaW5nIGxpZ2h0LiBBbHRlcm5hdGl2ZSB0ZWNobmlxdWVzIGluY2x1ZGVk
IGluc2VydGluZyBtaWNyb2RvdHMgaW50byBzbGl0cyBjdXQgaW50byB0aGUgZWRnZSBvZv==
IHBvc3QgY2FyZHMuDQoqIER1cmluZyBXb3JsZCBXYXIgSUksIGEgc3B5IGZvciB=
SmFwYW4gaW4gTmV3IFlvcmsgQ2l0eSwgVmVsdmFsZWW=
IERpY2tpbnNvbiwgc2VudCBpbmZvcm1hdGlvbiB0byBhY2NvbW1vZGF0aW9=
biBhZGRyZXNzZXMgaW4gbmV1dHJhbCBTb3V0aCBBbWVyaWO=
YS4gU2hlIHdhcyBhIGRlYWxlciBpbiBkb2xscywgYW5kIG==
aGVyIGxldHRlcnMgZGlzY3Vzc2VkIGhvdyBtYW55IG9mIHRoaXMgb3IgdGhhdCBkb2xs
IHRvIHNoaXAuIFRoZSBzdGVnb3RleHQgd2FzIHRoZSBkb2xsIG9yZGVycywgd2hpbGUgdGhl
IGNvbmNlYWxlZCAicGxhaW50ZXh0IiB3YXMgaXRzZWxmIGVuY2+=
ZGVkIGFuZCBnYXZlIGluZm9ybWF0aW9uIGFib3V0IHNoaXAgbW92ZW1lbnRzLF==
IGV0Yy4gSGVyIGNhc2UgYmVjYW1lIHNvbWV3aGF0IGZh
bW91cyBhbmQgc2hlIGJlY2FtZSBrbm93biBhcyB0aGX=
IERvbGwgV29tYW4uDQoqIENvbGQgV2FyIGNvdW50
ZXItcHJvcGFnYW5kYS4gSW4gMTk2OCwgY3JldyBtZW1iZW==
cnMgb2YgdGhlIFVTUyBQdWVibG8gKEFHRVItMikgaW50ZWxsaWdlbmNlIHNoaXAgaGVsZCBhcyBwcm==
aXNvbmVycyBieSBOb3J0aCBLb3JlYSwgY29tbXVuaWNhdGVkIGluIHNpZ25=
IGxhbmd1YWdlIGR1cmluZyBzdGFnZWQgcGhvdG8gb3Bwb3J0
dW5pdGllcywgaW5mb3JtaW5nIHRoZSBVbml0ZWQgU3RhdGVzIHRoZXkg
d2VyZSBub3QgZGVmZWN0b3JzIGJ1dCByYXRoZXIgd2VyZSBiZWluZyBoZWxkIGNh
cHRpdmUgYnkgdGhlIE5vcnRoIEtvcmVhbnMuIEluIG90aGVyIHBob3Rv
cyBwcmVzZW50ZWQgdG8gdGhlIFVTLCBjcmV3IG1lbWJlcnMgZ2F2ZSAidGhlIGZpbmdlciIgdG8g
dGhlIHVuc3VzcGVjdGluZyBOb3J0aCBLb3JlYW5zLCBpbiBhbiBhdHRlbXB0IHRvIE==
ZGlzY3JlZGl0IHBob3RvcyB0aGF0IHNob3dlZCB0aGVtIHNtaQ==
bGluZyBhbmQgY29tZm9ydGFibGUuDQoNCi0tDQpodHRwOi8vZW4ud2lraXBlZGlhLm9yZw==
L3dpa2kvU3RlZ2Fub2dyYXBoeQ0K
```

根据题目名字也可知道是base64隐写。puzzlesolver一把梭可得**Base_sixty_four_point_five**

具体原理可以参考https://blog.csdn.net/2203_75647316/article/details/146255826

`flag{Base_sixty_four_point_five}`



### 北京地铁

> Color Threshold 提示:AES ECB密钥为小写字母 提示2:密钥不足位用斜杠0补全 提示3:不要光记得隐写不看图片本身啊

[ ^附件]:fedbef663d4048d3b290f45da999fe1c.zip

出的一般

随波逐流嗦一下发现RGB有base64，**7SsQWmZ524i/yVWoMeAIJA==**，根据题目提示是AES但是找不到密钥

观察图片bmp可见魏公村站颜色不对，所以是weigongcun\0\0\0



### MulTzor

算了吧，题目有些问题



### A-Weird-C-Program

> 提交flag的格式为：flag{XXX}

[ ^附件]:23bf9cc9da7542e3bbad8a559ee6b8ba.cpp

打开发现格式奇葩，空格和制表符一大堆，必然是01转换了

尝试几次后发现每行当作一个字节处理，才正确

```python
with open('23bf9cc9da7542e3bbad8a559ee6b8ba.cpp', 'r') as f:
    lines = f.readlines()

flag = ''
for line in lines:
    bits = ''
    for ch in line:
        if ch == ' ':
            bits += '0'
        elif ch == '\t':
            bits += '1'
    if bits:
        num = int(bits, 2)
        if 32 <= num <= 126:
            flag += chr(num)

print("过滤可打印字符:", flag)
```

得到**the_flag_is_WpUAItsadmhak**，即`flag{WpUAItsadmhak}`



### broken_secret

千年老题，谁做谁知道

`flag{I_REALLY_MISS_THE_ELDER_DAY}`



### EASY_EVM

题目有问题



### 你猜他是什么文件

[ ^附件]:1f724823-aa2e-4699-bfc8-c8925b44d7b5.zip

文件打开啥也不是，010一看文件头似乎是被置零了

那就猜猜猜吧，看起来不像zip，png。文件尾没有FF D9，不是jpg，猜测是rar

使用文件头52 61 72 21 1A 07 00发现损坏，看来rar被加密了，则换成52 61 72 21 1A 07 01

密码尝试爆破，但是此处无法使用ARCHPR，貌似是因为rar版本太高，需要使用**John the ripper**

```bash
sudo apt install john
```

john的原理是哈希匹配，所以使用方法是先转哈希再爆破

使用john内置攻击rar2john，转为哈希

```bash
rar2john 119.rar > rar_hash.txt
```

再进行攻击

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e]
└─$ john --wordlist=/mnt/f/tools/misc/archpr/rockyou.txt rar_hash.txt
Using default input encoding: UTF-8
Loaded 1 password hash (RAR5 [PBKDF2-SHA256 256/256 AVX2 8x])
Cost 1 (iteration count) is 32768 for all loaded hashes
Will run 14 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
123456           (119.rar)
1g 0:00:00:00 DONE (2026-01-19 17:01) 7.142g/s 3200p/s 3200c/s 3200C/s 123456..miamor
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

密码是123456

解压得到1.png和test.zip，发现test.zip也加密了

拖进7z看一眼，发现里面有1.png和flag.txt，破案了

包明文攻击的，先用WinRAR把1.png压缩为1.zip，用ARCHPR明文攻击，成功解压

得到flag

`flag{3f76318f507fe7eb6422cd0703c64c88}`



### 我们生活在南京-1

> 他们用无线电中惯用的方法区分字符串中读音相近的字母。

[ ^附件]:78b52c84-6dc5-4520-9066-013d3ace1f8a.zip

这题目有点意思

读音奇怪，需要想到反转，可以听到alpha什么的

参考https://blog.csdn.net/m0_73559432/article/details/133050440

`flag{radiowavesacrosstime}`



### 我们生活在南京-2

> 在交流过程中发声音被干扰，于是使用了更加稳定的方法（CW）（字母全小写，请在合适的位置添加大括号）

[ ^附件]:44b775f1-911a-4f2e-b637-a654dd307f24.zip

Audacity看频谱，摩斯密码

```text
..-. .-.. .- --. -.-. .-- .. ..... ....- - .-. ....- -.. .. - .. ----- -. -- ...-- - .... ----- -..
```

`flag{cwi54tr4diti0nm3th0d}`



### 再见李华1

重复

### easy_misc

可不做



### base编码

无聊

`flag{ff02af1f28f5c275f2449ffe37ab6b86}`



### misc_xor

[ ^附件]:491d0473-d7dd-457f-ad67-3b817d1caf5a.zip

```text
cidb~0f<f==0f634014`5g734c0=g34ag=f`fx
```

cyberchef一把梭，xor_key是5

`flag{5c9c885c361541e0b261f58b61db8cec}`



### 简单的图片

> 题目来源：XSCTF
>
> 图片隐写是很重要的一种隐写

[ ^附件]:63c188c3-2853-4927-88e7-8a5bd93cd68b.zip

png，check没问题

zsteg发现隐写

```text
"['xxfxc', 'xxfst', 'xxtfc', 'xxfxt', 'xxfft', 'xxttc', 'xxffs', 'xxsft', 'xxftc', 'xxtfx', 'xxtfc', 'xxfcf', 'xxfxs', 'xxtfx', 'xxctx', 'xxfcx', 'xxtfx', 'xxsff', 'xxfsf', 'xxtfc', 'xxfxt', 'xxcxs', 'xxtfx', 'xxfsf', 'xxtfc', 'xxftx', 'xxfts', 'xxfxs', '"
```

略微需要一点点脑洞，一共只有xfcst五个字母，是五进制

题目来源是XSCTF，则xsctf对应0-4

```python
arr = ['xxfxc', 'xxfst', 'xxtfc', 'xxfxt', 'xxfft', 'xxttc', 'xxffs', 'xxsft', 'xxftc', 'xxtfx', 
       'xxtfc', 'xxfcf', 'xxfxs', 'xxtfx', 'xxctx', 'xxfcx', 'xxtfx', 'xxsff', 'xxfsf', 'xxtfc', 
       'xxfxt', 'xxcxs', 'xxtfx', 'xxfsf', 'xxtfc', 'xxftx', 'xxfts', 'xxfxs']

m = {'x':0, 's':1, 'c':2, 't':3, 'f':4}
nums = [sum(m[c] * (5**i) for i,c in enumerate(reversed(s))) for s in arr]

# 转ASCII字符
chars = [chr(num) for num in nums]

print("ASCII:", chars)
print("字符串:", ''.join(chars))
```

`flag{\y0u_are_An_1mag3_maste`，发现zsteg没有提完整，手动stegsolve也行

```text
['xxfxc', 'xxfst', 'xxtfc', 'xxfxt', 'xxfft', 'xxttc', 'xxffs', 'xxsft', 'xxftc', 'xxtfx', 'xxtfc', 'xxfcf', 'xxfxs', 'xxtfx', 'xxctx', 'xxfcx', 'xxtfx', 'xxsff', 'xxfsf', 'xxtfc', 'xxfxt', 'xxcxs', 'xxtfx', 'xxfsf', 'xxtfc', 'xxftx', 'xxfts', 'xxfxs', 'xxfcf', 'xxsfc', 'xsxxx']
```

重新运行可得`flag{\y0u_are_An_1mag3_master/}`



### guess-xsctf

感觉没啥意思

`flag{8c4afcb52e31da7}`



## 流量分析

### 功夫再高也怕菜刀

https://blog.csdn.net/m0_73360524/article/details/144939015

暂时不能完全理解分析流程



### 恶臭的数据包

> 野兽前辈想玩游戏，但是hacker妨碍了他连上无线网，前辈发出了无奈的吼声。

[ ^附件]:36f5d271cbed4bf2ad4e9de97e2ba095.7z

这难度真的只有5分吗

打开wireshark看见满屏的白色十分懵

协议是802.11

+ IEEE 802.11 是由电气与电子工程师协会（IEEE）制定的**无线局域网（WLAN）**通信标准，也就是我们日常所说的WiFi 技术的核心协议族。
+ 无线网络通常使用加密协议（如 WPA/WPA2）来保护数据流。这意味着，捕获的数据包如果没有正确的密码，是无法被解密和分析的。

需要使用工具破解密码（也可以NetA一把梭）

```bash
sudo apt install aircrack-ng
```

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e/36f5d271cbed4bf2ad4e9de97e2ba095]
└─$ aircrack-ng cacosmia.cap -w /mnt/f/tools/misc/archpr/rockyou.txt
Reading packets, please wait...
Opening cacosmia.cap
Read 4276 packets.

   #  BSSID              ESSID                     Encryption

   1  1A:D7:17:98:D0:51  mamawoxiangwantiequan     WPA (1 handshake)

Choosing first network as target.

Reading packets, please wait...
Opening cacosmia.cap
Read 4276 packets.

1 potential targets

                               Aircrack-ng 1.7

      [00:00:00] 778/10303727 keys tested (11804.08 k/s)

      Time left: 14 minutes, 32 seconds                          0.01%

                           KEY FOUND! [ 12345678 ]


      Master Key     : B4 2C 77 C0 A8 F4 E6 E9 9F 85 1B ED 7B 3F 5A 91
                       3C AA D4 42 B9 6D 5C D2 A1 90 E3 F9 75 B3 6D 9F

      Transient Key  : AB C0 B8 8B A7 19 92 61 5D CC DE 35 CD 8F 85 97
                       A5 D0 19 8B D7 4A 1F 2A 0D B7 40 C1 3B BC C9 13
                       60 46 E5 49 4E 9B 9A AF BD E3 89 33 5A 73 C8 95
                       AC 53 94 AF 92 D1 D9 ED E4 B2 AF 40 C1 03 D8 98

      EAPOL HMAC     : D8 97 A1 FD CF F2 87 89 6A 19 EF 14 44 33 E0 3C
```

破解成功。

账号（ESSID）为：mamawoxiangwantiequan，密码是12345678。

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e/36f5d271cbed4bf2ad4e9de97e2ba095]
└─$ airdecap-ng cacosmia.cap -e mamawoxiangwantiequan -p 12345678
Total number of stations seen            6
Total number of packets read          4276
Total number of WEP data packets         0
Total number of WPA data packets       685
Number of plaintext data packets         0
Number of decrypted WEP  packets         0
Number of corrupted WEP  packets         0
Number of decrypted WPA  packets       538
Number of bad TKIP (WPA) packets         0
Number of bad CCMP (WPA) packets         0
```

当前目录下生成新文件cacosmia-dec.cap，可以正常打开了

首先尝试过滤tcp contains "flag"，发现有一条tcp，点进去看看，发现是png且后面附了一个zip

直接提取会发现文件损坏（zip不全），直接过滤tcp contains "png"没有搜索到，只能过滤tcp一条条看

会发现有且仅有一条流量传输png，果断追踪tcp流。这条流量数据确实完整。

复制保存为二进制文件，再binwalk分离出zip，发现加密

尝试伪加密和爆破密码发现都不对，这里虽然是zip crypto但是无法明文攻击（flag.txt内容未知）

strings搜索一下，发现了cookie，base64解密

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoaW50IjoiZm9yIHNlY3VyaXR5LCBJIHNldCBteSBwYXNzd29yZCBhcyBhIHdlYnNpdGUgd2hpY2ggaSBqdXN0IHBpbmdlZCBiZWZvcmUifQ
-> 
{"alg":"HS256","typ":"JWT"}{"hint":"for security, I set my password as a website which i just pinged before"}
```

密码是最新ping的网址，ping流量是icmp协议，但是过滤后没有结果

于是过滤DNS流量

找到26rsfb.dnslog.cn，解密成功

`flag{f14376d0-793e-4e20-9eab-af23f3fdc158}`



### tunnel

[ ^附件]:d81aa1ba-172f-4ca7-8b5e-b2be7d767904.zip

strings一下发现大量base64字符串，wireshark打开可以发现全部集中在DNS流量，需要解析提取

```python
import pyshark
import re

cap = pyshark.FileCapture(
    "tunnel.pcap",
    display_filter="dns && ip.dst == 8.8.8.8 && dns.qry.type == 1",
    tshark_path="D:/Program Files/Wireshark/tshark.exe"
)

# Base64正则：严格匹配Base64字符
base64_pattern = re.compile(r'^[A-Za-z0-9+/]+=*$')

with open("true_base64.txt", "w") as f:
    for c in cap:
        try:
            domain = str(c.dns.qry_name)
            
            # 提取第一个子域
            first_part = domain.split('.')[0]
            
            # 验证是否是Base64
            if base64_pattern.match(first_part):
                f.write(first_part + "\n")
                print(first_part)
                
        except AttributeError:
            continue
```

看见几百行的base64是否想起来是base64隐写呢

得到的base64扔进puzzle solver可得隐写**password: B@%MG"6FjbS8^c#r**

把**补全等于号**的base64扔进cyberchef，to hex得到zip，解压即可

`flag{D01n't_5pY_0nmE}`



### 抓住个黑客

好像有点超模了

不会

https://taomujian.github.io/2023/10/08/MSF_Meterpreter_Traffic_Parser/

