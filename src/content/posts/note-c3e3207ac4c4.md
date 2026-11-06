---
title: adworld_misc_2
description: Steganography low ^附件:15a04eedcabe43978bb692c21a0f1b52.rar
  low，很明显是LSB隐写，但是是bmp，这题很有意思 解答一：https://georgeom.net/StegOnline/upload 梭哈
  解答二：ste
date: 2026-01-12T09:06:48.000Z
categories:
  - Practice
tags: []
minutes: 30
demo: false
draft: false
---


***


## Steganography

### low

[ ^附件]:15a04eedcabe43978bb692c21a0f1b52.rar

low，很明显是LSB隐写，但是是bmp，这题很有意思

解答一：https://georgeom.net/StegOnline/upload 梭哈

解答二：stegsolve是看不到二维码的，但是可以画图打开保存为png格式，此时可以看到了

扫码可得`flag{139711e8e9ed545e}`

至于为什么？bmp格式是极其细腻的，可能使得两种颜色之间极其接近，从而人眼难以识别出二维码，反而是经过压缩后的png，黑白明显，可以看到清晰的二维码



### misc1

> d4e8e1f4a0f7e1f3a0e6e1f3f4a1a0d4e8e5a0e6ece1e7a0e9f3baa0c4c4c3d4c6fbb9e1e6b3e3b9e4b3b7b7e2b6b1e4b2b6b9e2b1b1b3b3b7e6b3b3b0e3b9b3b5e6fd

明显是hex值，但是不可打印

ai分析，字符都在0x80~0xFF，所以考虑减去0x80，映射到 0x00~0x7F

```python
hex_str = "d4e8e1f4a0f7e1f3a0e6e1f3f4a1a0d4e8e5a0e6ece1e7a0e9f3baa0c4c4c3d4c6fbb9e1e6b3e3b9e4b3b7b7e2b6b1e4b2b6b9e2b1b1b3b3b7e6b3b3b0e3b9b3b5e6fd"
data = bytes.fromhex(hex_str)

# 减 0x80
transformed = bytes((b - 0x80) & 0xFF for b in data)
print("减 0x80 后 hex:", transformed.hex()[:40])
print("UTF-8 解码尝试:", end="")
try:
    txt = transformed.decode('utf-8')
    print(txt)
except:
    print("解码失败")
```

The flag is: DDCTF{9af3c9d377b61d269b11337f330c935f}

`DDCTF{9af3c9d377b61d269b11337f330c935f}`



### 小小的PDF

[ ^附件]:a4f37ec070974eadab9b96abd5ddffed.pdf

打开pdf并不能看到什么，但是strings搜索发现了**JFIF**，联想到foremost

分离出jpg，其中有一张找到flag`SYC{so_so_so_easy}`



### Excaliflag

> 只有一个真正的黑客可以从这个地方得到flag。

[ ^附件]:f3f30930116f4b168e132db45907d0ee.png

https://georgeom.net/StegOnline/image

其实相当于stegsolve啦。可以读出

`3DS{Gr4b_Only_th1s_B1ts}`



### 4-2

> 格式为flag{xxxxxxxx}

[ ^附件]:1ddbc89c20c845928498c22cd3faf1c4.txt

这题吧，有点难评，积累一下吧

```text
Eg qnlyjtcnzydl z umaujejmjetg qeydsn eu z bsjdtx tw sgqtxegc al kdeqd mgeju tw yrzegjsoj zns nsyrzqsx kejd qeydsnjsoj
Ew ltm fgtk jds kzl tw sgqtxegc m kerr csj jds wrzc kdeqd eu qrzuueqzr-qeydsn_eu_gtj_usqmnejl_du
```

用的是词频加密（和词频分析应该不一样），https://quipqiup.com/

可得

```text
In cryptography a substitution cipher is a method of encoding by which units of plaintext are replaced with ciphertext If you know the way of encoding u will get the flag which is classical-cipher_is_not_security_hs
```

`flag{classical-cipher_is_not_security_hs}`



### stage1

这题有点搞笑了，和难度1的一个题目几乎一样，解法一样。flag变了一下而已

`AlphaLab`（整个字符串都是flag)



### Miscellaneous-200

[ ^附件]:62f4ea780ecf4e6bbef5f40d674ec073.txt

随波逐流一把梭，使用RGB数据转图片功能即可。bmp图片可得flag

`flag{ youc@n'tseeme }`(注意空格)



### Hear-with-your-Eyes

> 用眼睛听这段音频

[ ^附件]:bf87ed29ac5a46d0aa433880dac5e6d8

经典老题了，提示这么明显

Audacity看频谱即可

flag是`e5353bb7b57578bd4da1c898a8e2d767`



### What-is-this

> 找到FLAG

[ ^附件]:e66ea8344f034964ba0b3cb9879996ff.gz

双图，随波逐流异或

flag是`AZADI TOWER`



### 很普通的数独

感觉答辩题目，没什么意思

参考https://blog.csdn.net/2402_87950092/article/details/155197734



### 很普通的Disco

不知道是不是答辩，感觉看不懂

参考https://blog.csdn.net/2402_87950092/article/details/155197734



### 再见李华

答辩题目



### 2-1

[ ^附件]:256cb07f5dbd493f81ad5b199f2b248a.zip

png，打不开，发现文件头错误

修复之后还是报错，随波逐流一把梭修复（直接把文件拖进去）

`wdflag{Png_C2c_u_kn0W}`



### 3-11

[ ^附件]:d0430db27b8c4d3694292d9ac5a55634.png

```bash
 zsteg d0430db27b8c4d3694292d9ac5a55634.png
imagedata           .. text: "\t\t\t\n\n\n\n\n\n"
b1,rgb,lsb,xy       .. file: Zip archive data, at least v2.0 to extract, compression method=deflate
b2,g,lsb,xy         .. file: old Microsoft 8086 x.out relocatable
b2,rgb,msb,xy       .. text: "U@E@A|yh"
b3,r,lsb,xy         .. text: "eM*I&'*z-6`"
b3,g,msb,xy         .. text: "ChvVe!'c~"
b3,rgb,msb,xy       .. text: "2mI$AA&`"
b3,bgr,lsb,xy       .. file: OpenPGP Secret Key
b4,r,lsb,xy         .. text: "eWvwuwfgTn"
b4,r,msb,xy         .. text: "fUU3U5U]eb"
b4,g,lsb,xy         .. text: "gggwfvwf"
b4,b,lsb,xy         .. text: "&t235SV^"
b4,rgb,msb,xy       .. text: "375SS5375SS=U35m"
b4,bgr,msb,xy       .. text: "373US3573US5=S="
```

zsteg/随波逐流均可发现隐藏zip

```bash
zsteg -E "b1,rgb,lsb,xy" d0430db27b8c4d3694292d9ac5a55634.png > hidden.zip
```

直接解压竟然报错，又得请7z大神，得到flag.txt

```text
iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAVqSURBVHhe7d1bTuRGAEDRIftfK1tIxgNRJNINbpff9xzJmvlpP6q5KpeB5u3v334Bt/bX57/AjQkdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocLe39///zf9/xSCwSY0SFA6BAgdAgQOgQIHQKEDgGLv7329vb2+b/1PDqVZ8dZ67uCe13HV1sc95GRcRo9x7XeI8aZ0SFA6BAgdAgQOgR4GLdw/99d/5xz2/q61jD6Hp/pWuo2CX3NN3jrIJbuf/T6t76uNVzhHJnHrTsECB0ChM6fW/RHG/chdAgQOgQIHQJO8330Z6fx7DhrfYtni7XonHPb+rpe8eoYHHGOjDGjX9AU5twNJkLnzwz9aOM+hA4BQocAoUOA0CHAb68N7P+o1z7zaJ9r72+y1tizHzM6BAgdAoQOAZddo8/107mMrEO3eO3aRt6Lrcee/ZjRIUDoECB0CBA6BAgdAhY/dQeuw4wOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwAfJcVDI3+cgvMZCv3RF8PaXwhb/7WQO/81kpFY5772u/E789jUuHWHAKFDgNAhQOgQcMmHcWseY/Sh09rXexaj4zK569hckRmdIVPMzzbOQ+gQIHQIEPqNTevnRxs9t/7JuDnnssUX/lnWp8+ubY9xOcsY8MGMDgFChwChQ4DQIeD0D+PmWnouIw+sJmcag69Gr22uM48BH8zoECB0CBA6BKy+Rp/rLOvEkWt45izr09E1+lbv75L9nmVMr+rUoY9GuMcxHnllSJcef+Ta5p7fVu/vkv2+Mqb8n1t3CBA6BAgdAoTO7qb19qsbY4YexgHXYEaHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgT4NdWTOeoz7I46Lvswo0OA0CFA6BBw6jX62uvGK6wZrdHZwmF/wGHy06GFvo451/3suCPv0RXGu0LoJ3NUOEK/N2t0CBA6BAgdAlZfo6+5LhvZ/9bntpWj1rzPjvvTMY86X15jRocAoUOAW/eT+e5WeImR8Rp1hfGuMKNDwOqhTzPDnA3YjxkdAoQOAUKHAKFDwC6/j/7o4ducwy593WTktUf67kHlluf/7LhL36fJFca7wowOAUKHAKFDwOVCn9aDczbgP4sfxo3GNPKQZ6mfjrnW8UYeQu19zf96dtyR92lkHFiXW3cIEDoECB0ChA4Bu/xk3FJHPZiCuzl16MA63LpDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ8DQJ8yMftTTWT7c5tF1rH1uI2PlQ4AYdckZfYrm6wY859YdAoQOAUKHgNUfxu3x4Gjt4+5xHSPPEfYYU+5N6L8ddR2PnOlcuA+37hcwxf91g1cIHQKEDgGH/WTcmdbUa+9vxNwxPer8uKbbhL42oXMnbt0hQOgXMM3eXzd4hdAhYGiNPtfaD7tqa3QzOKMuGfpcV4xG6GzBrTsECB0ChA4Bi9foow/ESmv0K4wV92ZGhwChQ4DQIUDoELDLD8wcxcM4+HDr0IEPbt0hQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChQ4DQIUDoECB0CBA6BAgdAoQOAUKHAKFDgNAhQOgQIHQIEDoECB0ChA4BQocAoUOA0CFA6BAgdAgQOgQIHQKEDgFChwChw+39+vUPmuaZZgm+XxcAAAAASUVORK5CYII=
```

base64解码，开头是PNG，原来是一张base64图片。cyberchef->base64 decode->to hex，复制到HxD即可

`FLAG{LSB_i5_SO_EASY}`



### 我们的秘密是绿色的

[ ^附件]:bb9a4b47c82b4a659ce492cd903df03b.zip

注意到jpg里面有数字是绿色的，疑似密码。**0405111218192526**

超绝工具OurSecret.exe，解密可得try.zip，解压提示加密

winrar可见zip注释**你知道coffee的生日是多少么~~~**

ARCHPR八位数字暴力破解，口令是**19950822**

解压得到flag.zip，仍然需要密码

据说ARCHPR可以明文攻击，但是复现失败了https://blog.csdn.net/2402_87950092/article/details/155197734

得到flag.zip，随波逐流梭出来是伪加密，修改后得到**qddpqwnpcplen%prqwn_{_zz*d@gq}**

看到{}全部出现，感觉是栅栏密码。随波逐流一把梭得到**qwlr{ddneq_@dpnwzgpc%nzqqpp_*}**

凯撒密码，解得`flag{ssctf_@seclover%coffee_*}`



### intoU

[ ^附件]:d7351710703a49cda273d3284e7a3df1.zip

频谱隐写，藏在末尾，放大才能发现

`RCTF{bmp_file_in_wav}`



### Just-No-One

答辩



### this_is_flag

> Most flags are in the form flag{xxx}, for example:flag{th1s_!s_a_d4m0_4la9}

不知道哪位大佬抽了放在这里，看笑了

`flag{th1s_!s_a_d4m0_4la9}`



### red_green

[ ^附件]:2ec5da20345342909d2336aa7418afed.png

随波逐流梭，RG0发现了JFIF，stegsolve打开保存为二进制文件即可

`flag{134699ac9d6ac98b}`



### funny_video

[ ^附件]:d9cef34d84b14d72b99e3b1b3f1f0b97.mkv

不太会处理视频，参考https://blog.csdn.net/2402_87950092/article/details/155197734



### base64÷4

[ ^附件]:c8cb2b557b57475d8ec1ed36e819ac4d.txt

```text
666C61677B45333342374644384133423834314341393639394544444241323442363041417D
```

题干说了啊base16，解得`flag{E33B7FD8A3B841CA9699EDDBA24B60AA}`



### 打野

zsteg会报错，感觉题目目前无解。可能以前的老版本zsteg能做。



### halo

题目有问题



### 倒立屋

答辩



### Become_a_Rockstar

[ ^附件]:7a7a705cb5874292a47461c7ed0cc0c1.zip

有点意思，rockstar是一种编程语言

```bash
pip install rockstar-py
rockstar-py -i Become_a_Rockstar.rock
```

打开output.py，这只是伪代码无法运行。但是可以看出flag

`NCTF{youarnicerockstar}`



### BotW-

> MASTER USING IT AND YOU CAN HAVE THIS.
>
> 全小写，格式为flag{[a-z]*}

[ ^附件]:0c02b165-acb1-41c8-ad90-84db67ff7a4f.rar

pngcheck发现报错（真是没想到这么小的图片也藏东西）

foremost分离出另一张图片，是**塞尔达文字**，对照一下即可

https://games.sina.cn/gn/vi/2018-06-24/detail-iheirxyf1001209.d.html

`flag{canzeldagetduplexbow}`



### Simple-Math

> Simple! Simple! Simple! 中国人不骗中国人！

[ ^附件]:450b37cb-10ae-43a3-9c23-8a091765dc7c.zip

谜之主办方，为什么题目要用pdf给出，不懂

```python
import numpy as np

# 模 2 下的高斯消元
def gauss_elim_mod2(A, b):
    n = len(A)
    # 构造增广矩阵
    aug = [A[i] + [b[i]] for i in range(n)]
    for col in range(n):
        # 找到主元为 1 的行
        pivot = -1
        for row in range(col, n):
            if aug[row][col] == 1:
                pivot = row
                break
        if pivot == -1:
            continue
        # 交换到当前行
        aug[col], aug[pivot] = aug[pivot], aug[col]
        # 消除该列其他行
        for row in range(n):
            if row != col and aug[row][col] == 1:
                aug[row] = [(aug[row][j] ^ aug[col][j]) for j in range(n + 1)]
    # 提取解
    x = [0] * n
    for i in range(n):
        # 如果该行全零且常数项不为 0，则无解
        if sum(aug[i][0:n]) == 0 and aug[i][n] == 1:
            return None
        if aug[i][i] == 1:
            x[i] = aug[i][n]
    return x

# 系数矩阵 A
A = [
    [1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 1, 0, 1]
]

b = [1, 0, 1, 1, 0, 0, 0, 1, 0, 1]

# 解方程
solution = gauss_elim_mod2(A, b)

if solution is None:
    print("No solution")
else:
    print("Solution x0..x9:", solution)
    # 按顺序拼接成字符串
    bit_str = ''.join(str(bit) for bit in solution)
    print("Bit string:", bit_str)

    # 计算 SHA1
    import hashlib
    sha1_hash = hashlib.sha1(bit_str.encode()).hexdigest()
    print("SHA1:", sha1_hash)
```



### 真是阳间题

> 听说里面的某些编码在密码题也经常会用上？

[ ^附件]:383d5e3b-7cb4-492c-a359-1633d7c655c5.zip

还好，并不阴间

```text
艾尔登法环正式发售在即，迫不及待的mjj身上好像有蚂蚁在爬，写下了一句谜语：
3207357975641587136122466514425152961654613410728337142271750273124995105747053991640817066352343657398947248938255086358418100814441196784643527787764297
谜底就是flag，也是他给所有新生的祝福，希望大家享受解码的过程。
```

**3207357975641587136122466514425152961654613410728337142271750273124995105747053991640817066352343657398947248938255086358418100814441196784643527787764297**

仔细观察可以猜测这是十进制字符串，改16进制转ASCII

**====Q6BGST3OHYFM7CZATPBODT4CH2MN7CN6VZAOZ3XGHY4K7K5ADGNPESUCUIZI**

cyberchef先reverse再base32解码可得

**FQARD{L0u_W0s_yp3_4_k4qrcp_0d_apwnr0}**

随波逐流，凯撒密码。

`HSCTF{N0w_Y0u_ar3_4_m4ster_0f_crypt0}`



### Peekaboo

答辩



### MeowMeowMeow

> flag格式为CatCTF{}

[ ^附件]:31b4cd90-27d8-4e84-9478-2739b0c2d888.zip

不能太信任随波逐流了，这个png直接判断失误了，png是有问题的

HxD可以看见IEND结束后有base64字符串**RG8geW91IGtub3cgd2hhdCBBc2NpaSBhcnQgaXM/IEhpbnQ6SSBwdXQgdGhlIHNlcmVjdCBpbiBhIDAxIEFzY2lpIGFydC4=**

解码可得**Do you know what Ascii art is? Hint:I put the serect in a 01 Ascii art.**

010editor，把右边的字符形式转换为二进制形式即可看到ASCII艺术。

`CatCTF{CAT_GOES_MEOW}`



## 流量分析

### 神奇的Modbus

> 寻找flag,提交格式为sctf{xxx}

[ ^附件]:22fc3d84e8434aed89cbc0bbd95a07b4.pcapng

NetA一把梭可得到**sctf{Easy_Mdbus}**

但是提交错误，补个o：`sctf{Easy_Modbus}`

### Cephalopod

> 我们发现一些奇怪的网络流量，我们怀疑它包含一个flag。

[ ^附件]:434c8c0ba659476caa9635b97f95600c.pcap

有点小激动，感觉流量分析有点思路了

NetA一把梭，只发现了明文关键词flag.png

本以为binwalk和foremost可以秒，但是诡异的是这俩一个都没提取出来，

wireshark过滤，tcp contains "PNG"。注意显示的两条流量，每条的数据不完整。应该选择追踪tcp stream，并显示为“原始数据”，保存为文件

HxD打开，去掉前面的多余字节，确保从89 50 4e 47开始，改后缀为.png即可

`HITB{95700d8aefdc1648b90a92f3a8460a2c}`

```text
user:
但是我困惑的是，为什么binwalk，foremost都没提取出来这个文件？
deepseek:
这是因为 PNG 数据被封装在了 Ceph 协议或其他自定义协议的负载中，而不是作为裸 PNG 文件直接传输。

原因分析：
1. 协议封装
从你最初的数据看：

text
ceph v027......$m....
... (其他协议头) ...
89 50 4e 47 ... (PNG 数据)
PNG 数据前面有明显的 ceph v027 协议头部，可能是 Ceph 存储系统的协议封装。binwalk 和 foremost 默认扫描文件时会寻找文件特征（如 PNG 头 89 50 4e 47），但如果这些特征前面有其他数据，并且没有明显的文件系统结构，它们可能会失败或只提取碎片。

2. 传输编码/分片
在一些协议中，二进制数据可能被：

分片传输（多个 TCP 包）

编码（如 base64、ASCII85）后再传输

添加了额外的协议头部和尾部

你的情况属于第一种：PNG 被封装在 Ceph 协议负载中，而且可能传输时被分割成多个报文。

3. binwalk/foremost 的限制
binwalk：主要用于识别文件中嵌入的其他文件，但要求文件结构相对完整或符合常见格式。如果数据被封装在未知协议中，并且没有明显的分离点（如文件头正好在某个偏移），它可能无法正确识别。

foremost：基于文件头/尾扫描，如果文件头前面有可变长度的协议数据，它可能找不到完整的文件。
```



### easycap

> 你能从截取的数据包中得到flag吗？

[ ^附件]:d5ba8f87969145059170a222f01e7883.pcap

流量包很小，strings无果

wireshark追踪下面一条灰色流量

```text
46
4c
41
47
3a
33
38
35
62
38
37
61
66
63
38
36
37
31
64
65
65
30
37
35
35
30
32
39
30
64
31
36
61
38
30
37
31
0a
```

`FLAG:385b87afc8671dee07550290d16a8071`(整个字符串都是flag)



### Hidden-Message

> 藏的什么信息？

[ ^附件]:8868f595665740159650d6e654aadc93.pcap

有点狗

直接追踪流并没什么卵用

```text
l physics modern physic just quantum physics oinclude relativity
A physical system on the cle laws of classical phye no restrictions on thcal principles but practically the scale of cllevel of isolated atomscopic and astronomical nd among atoms in a molecule the laws of classical physics break downption
Moreover the classical theory of electroomewhat limited in its ability to provide corrervable in more everydaantum effects of matter classical physics is generally characterized plete determinism although the Manyworlds interpretation of quantum mcally classical physics equations are ones in e principle and Ehrenfe massive action  Plancks constant the classicas such as superfluidityally ignore quantum mech everyday objects instead the classical description will suffice Howf research in physics if research is concerned with the discovery of lassical physics in the limit of the large scales of the classical le
```

流量包就这么点大，其实信息藏在info栏340x数字的变化里面

```bash
tshark -r 8868f595665740159650d6e654aadc93.pcap -Tfields -e udp.srcport | cut -c 4
```

可以提取最后一个数字

**10110111100110101001011010001100100110101001000110011101100110101000110110011000**

需要取反

**01001000011001010110100101110011011001010110111001100010011001010111001001100111**

转ASCII

flag是`Heisenberg`



### 就在其中

> 格式为flag{xxxx}

[ ^附件]:7cd17d910acf4ac8b563aa5caad18717

题目还行，但是不知道塞这么多没用的文件干什么

foremost提取，只有zip是有用的，key.txt，notepad打开是乱码

wireshark试着过滤tcp contains "key"，发现有个文件叫key.pub，想到**openssl**

分别在tcp.stream eq 14和20发现：

```text
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD0UN0A+70iM0VCJ1ni0n/U1BRj
0u8yMWH4Qi+xTbjHgbE7wOukOaO+2PyQXiqIzZnf5jCkJuVDYjALGcKrZM4OCQBB
d85B/LTc36XZ7JVfX5kGy5tIR3tquuPIVKNdAsHlSqh9S7YSS39RdnSa5rOUyGhr
LzxwzzM9IO4e+QQ+CQIDAQAB
-----END PUBLIC KEY-----
```

```text
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQD0UN0A+70iM0VCJ1ni0n/U1BRj0u8yMWH4Qi+xTbjHgbE7wOuk
OaO+2PyQXiqIzZnf5jCkJuVDYjALGcKrZM4OCQBBd85B/LTc36XZ7JVfX5kGy5tI
R3tquuPIVKNdAsHlSqh9S7YSS39RdnSa5rOUyGhrLzxwzzM9IO4e+QQ+CQIDAQAB
AoGADiaw5mGubtCxbkeBOVYf+V/fXnjVSf76QbrzsD1kOooUjfV6sKR2C5Pd7S7H
H+1owENBBgEKvoBtb/cqA2tvU9vQ4l5TMBJcHv6LEcb9WPpnMxPV2GNjO+DTPGPy
Xnu1UZlZjwx+NaF5rESoSSVS2ZaaIixBs4RWRXk+lHEbTFECQQD6Rp6jMweRgPHO
pR3mgIK83zL+kzqYM5isIPv3DIC5JQN2kXqK73IDQCFVlfXnr9lAAVRzLDsAXLqv
le/o6yQLAkEA+edY+GERlLuD1t2k9Js0Dc7EwnLcxoFUE60ivj8Gf9jzLskGHxsv
0IV6J5OHwPh54kAxAnqCjSqNRAWGNzr+uwJBALYEjDUm1LdGrxXZ0jAkgHC6Z0zs
aK3uwHdXGcinqCp+t9EQpq3KzQF+L4AeKxRQONEq5m9I2LQ/vGocwrmD4dcCQQDb
rTyOinWz8upAFPKOe2hUwvA/pkzgyosoCMhDyI9kD0gmVlvlODbd7Jem9o8dWM97
zcXHUf41LbSkmN6U6m1FAkEAqmZbr35bPfkeoiikwNl6OVQytg12TZjw2vIbvfub
f9Rvti8Lh/tbrmhZroiz8/l3aAZmugI1NBcbeZR0gz8ggg==
-----END RSA PRIVATE KEY-----
```

notepad写入，将私钥保存为pri.key，

```bash
openssl rsautl -decrypt -in key.txt -inkey pri.key -out flag.txt
```

可得**{haPPy_Use_0penSsI}**

`flag{haPPy_Use_0penSsI}`



### embarrass

[ ^附件]:54dcee33c07745f39f43a094a1b61dcf.zip

压根不用管加密的文件，pcapng直接NetA一把梭提取到明文了

无语

`flag{Good_b0y_W3ll_Done}`



### flag_universe

> please find the flag in our universe!

[ ^附件]:d2ced53c4a2e476995845c72bc39939d.zip

这题感觉出的很好

首先strings搜索一下，

```text
-rwxrwxrwx    1 ftp      ftp           881 Sep 19 07:56 flag.txt
-rwxrwxrwx    1 ftp      ftp       1178630 Sep 19 07:55 new_universe.png
-rwxrwxrwx    1 ftp      ftp       1133535 Sep 19 07:51 universe.png
```

发现了若干文件。

NetA一把梭，**ZmxhZ3tUaGlzIGlzIGZha2UgZmxhZyBoYWhhaGF9**即`flag{This is fake flag hahaha}`，这大概就是flag.txt。所以universe.png大概率没用，要找new_universe.png。

tcp过滤，手动翻找（暂时没发现更好的办法），找到含有new_universe.png的流量追踪TCP流，复制原始数据到HxD，然后保存为图片

zsteg或者随波逐流一把梭得到`flag{Plate_err_klaus_Mail_Life}`



##  Forensics

### Recover-Deleted-File

> 恢复磁盘并且找到FLAG.

[ ^附件]:c297795634cb4f6e8e1d88be044ec0c4.gz

直接解压得到空，原因不详

7z直接把disk-image提取出来即可

根据题目名字，恢复已删除的文件

```bash
fls disk-image
```

```bash
sudo apt install extundelete
extundelete --restore-all disk-image
```

```bash
./flag
```

可得flag为`de6838252f95d3b9e803b28df33b4baa`



### MISCall

[ ^附件]:d02f31b893164d56b7a8e5edb47d9be5

file一下发现是bz2，改后缀解压，看到了flag.txt和.git

这是**Git取证**，不会

姑且先奉上ai的过程

```bash
#查看git状态
git status
#查看提交历史
git log --oneline
#查看所有分支
git branch -a
#查看所有引用和对象
git show-ref
#查看未暂存的改动
git diff
```

**有一个 refs/stash，这意味着有隐藏的 stash**

```bash
cd ..
#查看 stash 内容
git stash list
#应用 stash 并查看变化
git stash pop
```

工作区的 `flag.txt` 已经被修改（可能之前解压时文件状态变了），所以 stash pop 会冲突。

```bash
git stash show -p
```

发现了`s.py`文件

```python
flag = "NCN" + sha1(邮件原文内容).hexdigest()
```

```bash
# 将邮件内容保存到文件
cat > /tmp/mail.txt << 'EOF'
From: mailto: torvalds@klaava.Helsinki.Fi (Linus Benedict Torvalds)
To: Newsgroups: comp.os.inix
Subject: What would you like to see most in minix?
Summary: small poll for my new operating system
Message-ID: <mailto: 1991Aug25.205708.9541@klaava.Helsinki.Fi

Hello everybody out there using minix — I’m doing a (free) operating
system (just a hobby, won’t be big and professional like gnu) for 386
(486) AT clones. This has been brewing since april, and is starting to
get ready. I’d like any feedback on things people like/dislike in
minix, as my OS resembles it somewhat (same physical layout of the
file-system (due to practical reasons) among other things).

I’ve currently ported bash (1.08) and gcc (1.40), and things seem to
work. This implies that I’ll get something practical within a few
months, and I’d like to know what features most people would want. Any
suggestions are welcome, but I won’t promise I’ll implement them :-).

Linus (mailto: torvalds@klaava.helsinki.fi)

PS. Yes — it’s free of any minix code, and it has a multi-threaded fs.
It is NOT protable (uses 386 task switching etc), and it probably
never will support anything other than AT-harddisks, as that’s all I
have :-(.
EOF

# 计算 SHA1 并加前缀
python3 -c "import hashlib; h=hashlib.sha1(); h.update(open('/tmp/mail.txt','rb').read()); print('NCN'+h.hexdigest())"
```

flag即`NCN4dd992213ae6b76f27d7340f0dde1222888df4d3`



### Get-the-key.txt

[ ^附件]:256cb07f5dbd493f81ad5b199f2b248a.zip

```bash
file forensic100
forensic100: Linux rev 1.0 ext2 filesystem data, UUID=0b92a753-7ec9-4b20-8c0b-79c1fa140869
```

`file`一下，发现是内存镜像

直接7z打开，点击1，即可读取key.txt

`SECCON{@]NL7n+-s75FrET]vU=7Z}`



### something_in_image

[ ^附件]:b2c46758ac3b41eaa457ff8e64d5d17c.zip

file一下

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e]
└─$ file badimages
badimages: Linux rev 1.0 ext3 filesystem data, UUID=ca014691-c6ea-4a5a-8da4-74a1aa1c9a80
```

7z打开，在[SYS]目录下发现Journal，打开看到Flag.txt的文件名，于是想到直接过滤

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e]
└─$ strings badimages | grep "flag"

(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e]
└─$ strings badimages | grep "Flag"
.Flag.txt.swpe
Flag.txtt.swx
.Flag.txt.swpe
.Flag.txt.swx
.Flag.txt.swpe
Flag.txtt.swx
.Flag.txt.swpe
Flag.txtt.swx
.Flag.txt.swpe
Flag.txtt.swx
.Flag.txt.swpe
.Flag.txt.swx
.Flag.txt.swpe
Flag.txtt.swx
Flag.txt
Flag.txt
Flag.txt
Flag.txt
/mnt/test/Flag.txt
Flag{}
Flag{yc4pl0fvjs2k1t7T}
/mnt/test/Flag.txt
Flag{}
Flag{yc4pl0fvjs2k1t7T}
```

`Flag{yc4pl0fvjs2k1t7T}`

预期解：

直接找是找不到的，需要修复

```bash
extundelete --restore-all badimages
```

在恢复的文件夹RECOVERED_FILES中即可看到flag

还有隐藏彩蛋哈哈哈哈**- 家里的熊孩子总是乱删我电脑里的文件，愁死了。**


