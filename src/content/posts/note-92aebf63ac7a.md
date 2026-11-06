---
title: adworld_misc_3
description: ^附件:94bcfe60a3d3409bb77823c70a4c0245.zip
date: 2026-01-12T16:42:00.000Z
categories:
  - Practice
tags: []
minutes: 11
demo: false
draft: false
---


***


## Steganography

### Py-Py-Py

这题没啥意思

参考https://blog.csdn.net/2402_87950092/article/details/155359489



### 肥宅快乐题

同上



### 4-1

[ ^附件]:94bcfe60a3d3409bb77823c70a4c0245.zip

随波逐流一把梭，得到了画风不一样的喵_end.txt，复制字节保存为二进制文件即可（可以手动提取）

解压再解压，得到2张png。随波逐流双图盲水印，肉眼可见flag

`wdflag{My_c4t_Ho}`



### 5-1

[ ^附件]:badd3e0621ff43de8cf802545bbd3ed0

file无果，不是任何文件类型，经过了xor加密。

破解xor的方法是下载特定工具

```bash
pip install xortool
xortool -b badd3e0621ff43de8cf802545bbd3ed0
The most probable key lengths:
 2:  12.2%
 5:  11.9%
 9:   9.8%
13:  22.2%
20:   6.8%
22:   6.2%
26:  12.8%
30:   4.6%
39:   7.8%
52:   5.7%
Key-length can be 3*n
256 possible key(s) of length 13:
gOOD)UCKtOyOU
fNNE(TBJuNxNT
eMMF+WAIvM{MW
dLLG*V@HwLzLV
cKK@-QGOpK}KQ
...
Found 55 plaintexts with 95%+ valid characters
See files filename-key.csv, filename-char_used-perc_valid.csv
```

-b指的是brute force强制破解。根据提示打开filename-key.csv，试一下便知gOOD)UCKtOyOU虽然看着像但是还是不对，正确的密钥是Good\tuckToYou，\t很奇怪，猜测密钥是**GoodLuckToYou**

```python
import sys
import os

def xor_file(input_file, output_file, key):
    key_bytes = key.encode('utf-8')
    key_length = len(key_bytes)
    
    try:
        with open(input_file, 'rb') as f_in:
            with open(output_file, 'wb') as f_out:
                index = 0
                while True:
                    byte = f_in.read(1)
                    if not byte:
                        break
                    
                    # 逐字节异或
                    xor_byte = byte[0] ^ key_bytes[index % key_length]
                    f_out.write(bytes([xor_byte]))
                    
                    index += 1
                    
        print(f"操作成功完成！")
        print(f"密钥: {key}")
        
    except FileNotFoundError:
        print(f"错误: 文件 '{input_file}' 不存在")
    except Exception as e:
        print(f"错误: {e}")

def main():
    if len(sys.argv) != 3:
        print("用法: python xor_file.py <输入文件> <输出文件>")
        print("示例: python xor_file.py secret.bin decrypted.bin")
        return
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    key = "GoodLuckToYou"  # 指定的密钥
    
    print(f"使用密钥: {key}")
    xor_file(input_file, output_file, key)

if __name__ == "__main__":
    main()
```

解密后notepad打开可得flag`wdflag{You Are Very Smart}`



### latlong

参考https://blog.csdn.net/2402_87950092/article/details/155359489，很详细

真不会



### challenge_how_many_Vigenère

答辩



### Miscellaneous-300

难评，没什么价值



### warmup

同样是ARCHPR明文文件攻击，不清楚为什么ARCHPR报错

双图盲水印

详见https://blog.csdn.net/2402_87950092/article/details/155359489



### 传感器1

https://blog.csdn.net/2402_87950092/article/details/155359489



### 签到题

> SSCTF线上选举美男大赛开始了，泰迪拿着他的密码去解密了，提交花括号内内容（Z2dRQGdRMWZxaDBvaHRqcHRfc3d7Z2ZoZ3MjfQ==）

看着简单，做着未必噢

base64解码得到**ggQ@gQ1fqh0ohtjpt_sw{gfhgs#}**

直接栅栏密码无果，需要先凯撒解密

密钥14，**ssC@sC1rct0atfvbf_ei{srtse#}**。随波逐流一把梭得到**ssctf{ssCtf_seC10ver#@rabit}**



### pdf

> 菜猫给了菜狗一张图，说图下面什么都没有

[ ^附件]:ad00be3652ac4301a71dedd2708f78b8.pdf

直接打开，Ctrl+F。可得

`flag{security_through_obscurity}`



### 如来十三掌

> 菜狗为了打败菜猫，学了一套如来十三掌。

[ ^附件]:833e81c19b2b4726986bd6a606d64f3c.docx

莫名其妙给了个docx

```text
夜哆悉諳多苦奢陀奢諦冥神哆盧穆皤三侄三即諸諳即冥迦冥隸數顛耶迦奢若吉怯陀諳怖奢智侄諸若奢數菩奢集遠
俱老竟寫明奢若梵等盧皤豆蒙密離怯婆皤礙他哆提哆多缽以南哆心曰姪罰蒙呐神。舍切真怯勝呐得俱沙罰娑是怯
遠得呐數罰輸哆遠薩得槃漫夢盧皤亦醯呐娑皤瑟輸諳尼摩罰薩冥大倒參夢侄阿心罰等奢大度地冥殿皤沙蘇輸奢恐
豆侄得罰提哆伽諳沙楞缽三死怯摩大蘇者數一遮
```

感觉是与佛论禅之类的，随波逐流梭一下得到

```text
MzkuM3gvMUAwnzuvn3cgozMlMTuvqzAenJchMUAeqzWenzEmLJW9
```

继续梭，发现是ROT13（即如来十三掌）

```text
ZmxhZ3tiZHNjamhia3ptbmZyZGhidmNraWpuZHNrdmJramRzYWJ9
```

base64解码得到`flag{bdscjhbkzmnfrdhbvckijndskvbkjdsab}`



### 打开电动车

答辩



### miscmisc

答辩



### 奇怪的TTL字段

答辩



### 隐藏的信息

> 这是一个被混淆的文件，但是我忘记了这个文件的密码。你能够帮助我还原明文吗？

[ ^附件]:2eb44acfc89d4f0f9fa221d21ab96033.zip

```text
0126 062 0126 0163 0142 0103 0102 0153 0142 062 065 0154 0111 0121 0157 0113 0111 0105 0132 0163 0131 0127 0143 066 0111 0105 0154 0124 0121 060 0116 067 0124 0152 0102 0146 0115 0107 065 0154 0130 062 0116 0150 0142 0154 071 0172 0144 0104 0102 0167 0130 063 0153 0167 0144 0130 060 0113 
```

一眼八进制，随波逐流转16进制转ASCII，再一把梭得到`ISCC{N0_0ne_can_st0p_y0u}`



### Keyes_secret

没太大意义，可不做



### saleae

https://blog.csdn.net/2402_87950092/article/details/155359489

旧版软件已经弃用了，这题看看就行



### 信号不好先挂了

[ ^附件]:b90a71f6e04b427dba2f8d307de79145.zip

解压，zsteg/随波逐流发现有隐藏zip，提取

```bash
zsteg -E "b1,rgb,lsb,xy" apple.png > 112.zip
```

解压得到pen.png，随波逐流双图盲水印

`unctf{9d0649505b702643}`



### Misc文件类型

> 最重要的还是要知道这是什么文件

[ ^附件]:3ea702ca-85fd-49da-9997-4e513310851c.zip

不难发现提示是base64

```text
UEsDBBQAAAAIAAldCFXqOw7cKAAAACYAAAAIAAAAZmxhZy50eHRLy0lMrzZISk02SEwxTkk0MjQ0TjY3SDU1SEsxNTM0T7JINU+zrAUAUEsBAhQAFAAAAAgACV0IVeo7DtwoAAAAJgAAAAgAJAAAAAAAAAAgAAAAAAAAAGZsYWcudHh0CgAgAAAAAAABABgAGxEfk9iq2AEbER+T2KrYAQJF+4rYqtgBUEsFBgAAAAABAAEAWgAAAE4AAAAAAA
```

base64解码转hex，保存为zip解压即可。

`flag{0bec0ad3da2113c70e50fd5617b8e7f9}`



### [中等] QR1

> 一张空白的图片？

[ ^附件]:6e732dad-c6c5-4daa-8432-cd18b660da62.zip

一眼二维码，可以先调整大小，设为533*533

然后对比度拉到-100，再stegsolve打开，微信扫码

`flag{AHA_U_Kn0w_QR_c0d3_312468ed-ea59-4fe9-9cd2-b5e9d8b39498}`



### 不确定,再看看

感觉奇奇怪怪的

https://blog.csdn.net/2402_87950092/article/details/155359489



## 流量分析

### 3-1

[ ^附件]:e395d6e5b79b4cc49ee4e5c704f872ae

file一下发现是rar，解压得到文件

继续file发现是流量包，strings搜索到flag.txt

可以tcp contains "flag"过滤流量，追踪TCP，发现了rar，复制原始数据提取出来

rar需要密码，且ARCHPR不支持，考虑从流量包里面找密码

过滤key，password都没找到，但是找到了crypto

**19aaFYsQQKr+hVX6hl2smAUQ5a767TsULEUebWSajEo=**，base64解密错误

在下方找到了python脚本：

```python
from Crypto import Random
from Crypto.Cipher import AES
import sys
import base64
IV = 'QWERTYUIOPASDFGH'

def decrypt(encrypted):
  aes = AES.new(IV, AES.MODE_CBC, IV)
  return aes.decrypt(encrypted)
def encrypt(message):
  length = 16
  count = len(message)
  padding = length - (count % length)
  message = message + '\0' * padding
  aes = AES.new(IV, AES.MODE_CBC, IV)
  return aes.encrypt(message)
str = 'this is a test'
example = encrypt(str)
print(decrypt(example))
```

解密：

```python
from Crypto.Cipher import AES
import base64

IV = b'QWERTYUIOPASDFGH'

def decrypt_aes(enc_str):
    """自动检测Base64或Hex并解密"""
    try:
        # 尝试Base64解码
        try:
            data = base64.b64decode(enc_str)
            fmt = "Base64"
        except:
            # 尝试Hex解码
            data = bytes.fromhex(enc_str)
            fmt = "Hex"
        
        # 解密
        cipher = AES.new(IV, AES.MODE_CBC, IV)
        decrypted = cipher.decrypt(data).rstrip(b'\x00')
        
        print(f"[解码格式: {fmt}]")
        return decrypted.decode('utf-8')
        
    except Exception as e:
        return f"解密失败: {e}"

if __name__ == "__main__":
    while True:
        inp = input("\n输入加密字符串 (或q退出): ").strip()
        if inp.lower() == 'q':
            break
        print(f"结果: {decrypt_aes(inp)}")
```

得到**passwd={No_One_Can_Decrypt_Me}**，密码是**No_One_Can_Decrypt_Me**

解压得到flag：`WDCTF{Seclab_CTF_2017}`



### 互相伤害!!!

答辩


