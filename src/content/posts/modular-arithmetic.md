---
title: '模运算手记：把逆元想清楚'
description: '从 Bézout 等式理解乘法逆元，以及为什么除法需要一个前提。'
date: 2026-11-02
categories: [Notes, Number Theory]
tags: [Cryptography, Notes, Python]
minutes: 3
demo: true
---

## 除法之前

在整数模 $n$ 的世界里，除法并不是总有定义的。我们希望找到一个数 $x$，满足 $ax\equiv1\pmod n$。这样的 $x$ 就是 $a$ 的乘法逆元。

## 存在的条件

Bézout 等式告诉我们，存在整数 $x,y$ 使：

$$ax+ny=\gcd(a,n).$$

因此，当且仅当 $\gcd(a,n)=1$ 时，$a$ 在模 $n$ 下存在逆元。

## 一个小实验

```python
a, n = 17, 3120
inverse = pow(a, -1, n)
assert a * inverse % n == 1
print(inverse)  # 2753
```

Python 在模逆不存在时会抛出 `ValueError`。这不是一个需要忽略的异常，而是在提醒我们检查题目的数学条件。

## 记住边界

模运算中的约分也需要条件。若 $ab\equiv ac\pmod n$ 且 $a$ 与 $n$ 互质，我们才能乘上 $a^{-1}$，得到 $b\equiv c\pmod n$。

把“何时成立”写在结论旁边，是让笔记在未来仍然有用的小习惯。
