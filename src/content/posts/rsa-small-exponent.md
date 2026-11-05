---
title: 'RSA 小指数攻击：从模运算到整数根'
description: '从一个没有填充的 RSA 例子出发，用 Python 与 SageMath 验证小公钥指数背后的边界条件。'
date: 2026-11-04
categories: [CTF, Crypto]
tags: [Cryptography, RSA, Python, SageMath]
minutes: 8
demo: true
---

## 从一个问题开始

如果 RSA 的公钥指数很小，密文是否就一定不安全？直觉容易给出过于宽泛的答案。我们先把条件写下来，再讨论这个结论成立的范围。

> 这是一篇可运行的教学与排版示例，用于检查公式、长文、目录与代码高亮。它不对应真实比赛题目，也不使用线上博客的内容。

RSA 加密可表示为 $c \equiv m^e \pmod{n}$。当指数 $e=3$ 时，真正关键的条件是：

$$
0 \leq m^3 < n.
$$

在这个条件下，模约减没有发生，所以 $c=m^3$。问题从模运算变成了求一个整数的精确立方根。

## 用 Python 验证边界

### 避开浮点数

直接计算 `round(c ** (1 / 3))` 对大整数并不可靠。浮点数无法保留任意精度整数，因此我们使用二分查找，并返回一个是否为精确立方的标记。

```python
def integer_cube_root(value: int) -> tuple[int, bool]:
    if value < 0:
        raise ValueError("expected a nonnegative integer")
    lo, hi = 0, 1 << ((value.bit_length() + 2) // 3)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid ** 3 <= value:
            lo = mid
        else:
            hi = mid - 1
    return lo, lo ** 3 == value

m = int.from_bytes(b"notes", "big")
c = m ** 3  # assume n > m**3; no reduction occurs
root, exact = integer_cube_root(c)
assert exact and root == m
print(root.to_bytes((root.bit_length() + 7) // 8, "big"))
# b'notes'
```

二分过程保持一个简单的不变量：答案始终位于当前区间中。它使用整数乘法与比较，避免了精度丢失。对密码学实验来说，准确的整数运算通常比简短的一行表达式更有价值。

### 再检查一次假设

如果 $m^3 \geq n$，我们只有 $m^3=c+kn$，而不知道整数 $k$。这时不能直接对 $c$ 开根并把结果当作明文。

| 条件 | 实际关系 | 直接开根 |
| --- | --- | --- |
| $m^3<n$ | $c=m^3$ | 可恢复明文 |
| $m^3\geq n$ | $m^3=c+kn$ | 一般不可直接恢复 |
| 使用规范的随机填充 | 原始明文已被编码 | 不适用这个朴素推导 |

## 在 SageMath 中复现

SageMath 让数论实验更接近纸面推导。下面的代码应在 SageMath 环境中执行；普通 Python 解释器并不提供 `Integer`。

```sage
# Run in SageMath (not plain Python)
m = Integer(int.from_bytes(b"notes", "big"))
c = m**3
recovered = c.nth_root(3)
assert recovered**3 == c
assert recovered == m
print(bytes.fromhex(format(int(recovered), "x")))
# b'notes'
```

这里使用 `**` 作为幂运算符，以便代码在 SageMath 的 Python 语义下也容易阅读。语法高亮沿用 Python 语法规则，为 `sage` 和 `sagemath` 围栏提供一致的视觉效果。

## 从直接开根到广播攻击

如果相同的明文在三个两两互质的模数下，使用相同的小指数加密：

$$
\begin{aligned}
c_1 &\equiv m^3 \pmod{n_1},\\
c_2 &\equiv m^3 \pmod{n_2},\\
c_3 &\equiv m^3 \pmod{n_3},
\end{aligned}
$$

中国剩余定理给出模 $N=n_1n_2n_3$ 意义下的唯一剩余类 $C$。若 $0\leq m^3<N$，则在 $[0,N)$ 中选取的代表元就是 $m^3$，于是可以再次精确开根。

这段推导依赖**相同的明文、互质的模数，以及足够大的模数乘积**。把这些条件和结论写在一起，能够防止把特定场景的技巧误认为普遍规律。

## 留下可复查的笔记

一篇可复查的 Writeup 至少应记录：

1. 已知量、未知量与输入格式。
2. 每一步变形使用的前提条件。
3. 可以独立运行的最小代码。
4. 验证恢复结果的方式，而非只打印一个字符串。

公式解释了为什么，代码验证了是否成立。把它们放在同一篇笔记里，下次阅读时就不需要重新猜测当时的思路。

---

**阅读提示：** 可以使用右侧目录跳转、调整正文字号，或复制代码。窄屏下目录会移动到正文前，代码和宽公式可以水平滚动。
