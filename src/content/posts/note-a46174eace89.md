---
title: 3.1_复积分的引入
description: 今后提到的曲线，一般是光滑曲线或逐段光滑曲线，因而是可求长的。
date: 2026-08-20T02:31:57.000Z
categories:
  - - ComplexAnalysis
    - Chapter3
tags: []
minutes: 8
demo: false
draft: false
---



今后提到的曲线，一般是**光滑曲线**或**逐段光滑曲线**，因而是可求长的。

> 逐段光滑的简单闭曲线称作**周线**。

> **定义** 设有向曲线 $C$：$z=z(t)$（$\alpha\le t\le\beta$），以$a=z(\alpha)$为起点，$b=z(\beta)$为终点，$f(z)$ 沿 $C$ 有定义。顺着 $C$ 从 $a$ 到 $b$ 的方向取分点
> $$
> \begin{align}
> 
> a=z_0,z_1,\ldots,z_{n-1},z_n=b
> 
> \end{align}
> $$
> 把曲线 $C$ 分成若干弧段。从 $z_{k-1}$ 到 $z_k$（$k=1,2,\ldots,n$）的每一小弧段上取一点 $\zeta_k$，记
> $$
> S_n=\sum_{k=1}^n f(\zeta_k)\,\Delta z_k,\qquad \Delta z_k=z_k-z_{k-1}.
> $$
>
> 当分点无限增多、这些弧段长度的最大值趋于 $0$ 时，若和式 $S_n$ 的极限存在且等于 $J$，则称 $f(z)$ 沿 $C$（从 $a$ 到 $b$）**可积**，称 $J$ 为 $f(z)$ 沿 $C$（从 $a$ 到 $b$）的**积分**，记为
>
> $$
> J=\int_C f(z)\,dz.
> $$
>
> $C$ 称为**积分路径**。

特别地，$\int_C f(z)\,dz$ 表示 $f(z)$ 沿 $C$ 的正方向的积分，$\int_{-C} f(z)\,dz$ 表示 $f(z)$ 沿 $C$ 的反方向的积分。

显然，$f(z)$ 沿曲线 $C$ 可积的必要条件是 $f(z)$ 沿 $C$ 有界。

> **定理** 若 $f(z)=u(x,y)+iv(x,y)$ 沿曲线 $C$ 连续，则 $f(z)$ 沿 $C$ 可积，且
>
> $$
> \int_C f(z)\,dz=\int_C (u\,dx-v\,dy)+i\int_C (v\,dx+u\,dy).
> $$



> **例 3.1** 令 $C$ 表示连接点 $a,b$ 的任一曲线，证明
>
> (1) $\int_C dz=b-a$
>
> (2) $\int_C z\,dz=\dfrac12(b^2-a^2)$

**证明**

(1) 取 $f(z)\equiv 1$，则

$$
S_n=\sum_{k=1}^n 1\cdot \Delta z_k=b-a,
$$

取极限，得

$$
\int_C dz=b-a.
$$

(2) 取 $\zeta_k=\dfrac{z_k+z_{k-1}}{2}$，则

$$
S_n=\sum_{k=1}^n \frac{z_k+z_{k-1}}{2}(z_k-z_{k-1})
=\frac12\sum_{k=1}^n (z_k^2-z_{k-1}^2)
=\frac12(b^2-a^2).
$$

取极限，得

$$
\int_C z\,dz=\frac12(b^2-a^2).
$$

## 复积分的变量代换公式

考虑积分$\int_C f(z)\,dz$.

设$f(z)=u(x,y)+iv(x,y)$，则有
$$
\begin{aligned}
\int_Cf(z)\,dz&=\int_Cudx-vdy+i\,\int_Cvdx+udy \\
&=\int_C[u(t)x'(t)-v(t)y'(t)]dt+i\,\int_C[v(t)x'(t)+u(y)y'(t)]dt \\
&=\int_Cu(t)[x'(t)+iy'(t)]dt+[iv(t)x'(t)-v(t)y'(t)]dt \\
&=\int_Cu(t)z'(t)+iv(t)[x'(t)+iy'(t)]dt \\
&=\int_C[u(t)+iv(t)]z'(t)dt \\
&=\int_Cf[z(t)]z'(t)dt
\end{aligned}
$$
所以
$$
\begin{aligned}
\int_Cf(z)\,dz&=\int_Cf[z(t)]z'(t)dt \\
&=\int_\alpha^\beta Re[f[z(t)]z'(t)]dt+i\,\int_\alpha^\beta Im[f[z(t)]z'(t)]dt

\end{aligned}
$$


> 设 $C$ 的参数方程为 $z=z(t)=x(t)+iy(t)$（$\alpha\le t\le\beta$），则
> $$
> \int_C f(z)\,dz
> =\int_\alpha^\beta f(z(t))z'(t)\,dt.
> $$
>
> 若写成实部与虚部，则有
>
> $$
> \int_C f(z)\,dz
> =\int_\alpha^\beta \operatorname{Re}\bigl[f(z(t))z'(t)\bigr]dt
> +i\int_\alpha^\beta \operatorname{Im}\bigl[f(z(t))z'(t)\bigr]dt.
> $$



> **例 3.2** 试证
> $$
> \int_C \frac{dz}{(z-a)^n}=
> \begin{cases}
> 2\pi i, & n=1,\\
> 0, & n\ne 1\text{ 且 }n\in\mathbb Z,
> \end{cases}
> $$
> 其中 $C$ 为圆周 $|z-a|=\rho$.

**证明** 令 $z-a=\rho e^{it}$，$t\in[0,2\pi]$，则 $dz=i\rho e^{it}dt$，从而

$$
\int_C \frac{dz}{(z-a)^n}
=\int_0^{2\pi}\frac{i\rho e^{it}}{\rho^n e^{int}}dt
=i\rho^{1-n}\int_0^{2\pi} e^{i(1-n)t}\,dt.
$$

当 $n=1$ 时，原式 $=i\int_0^{2\pi}dt=2\pi i$；

当 $n\ne 1$ 时，
$$
Re[e^{i(1-n)t}]=\cos(1-n)t,Im[e^{i(i-n)t}]=\sin(1-n)t \\
$$
则
$$
\begin{aligned}
\int_C \frac{dz}{(z-a)^n}&=i\rho^{1-n}(\int_0^{2\pi}\cos(1-n)t\,dt+i\,\int_0^{2\pi}\sin(1-n)t\,dt) \\
&=i\rho^{1-n}(0+0) \\
&=0
\end{aligned}
$$
证毕.

## 复积分的基本性质

> 1. **线性**：$\int_C (af(z)+bg(z))\,dz=a\int_C f(z)\,dz+b\int_C g(z)\,dz$
> 2. **分段可加**：$\int_{C_1+C_2}f(z)\,dz=\int_{C_1}f(z)\,dz+\int_{C_2}f(z)\,dz$
> 3. **反向变号**：$\int_{C^-}f(z)\,dz=-\int_C f(z)\,dz$
> 4. **模不等式**：
>
> $$
> \left|\int_C f(z)\,dz\right|\le \int_C |f(z)|\,|dz|=\int_C |f(z)|\,ds.
> $$

证明一下模不等式：

由三角不等式，
$$
\left|\sum_{k=1}^n f(\zeta_k)\Delta z_k\right|
\le \sum_{k=1}^n |f(\zeta_k)\Delta z_k|
\le \sum_{k=1}^n |f(\zeta_k)|\,|\Delta z_k|.
$$

取极限即得结论。

> **积分估值定理** 若$f(z)$ 沿曲线 $C$ 连续，且存在正数 $M$ 使 $|f(z)|\le M$，设 $C$ 长为 $L$，则
> $$
> \left|\int_C f(z)\,dz\right|\le ML.
> $$

**证明** 由模不等式，
$$
\left|\int_C f(z)\,dz\right|\le \int_C |f(z)|\,ds\le \int_C M\,ds=ML.
$$

> **例 3.3** 证明 $\left|\int_C \dfrac{dz}{z^2}\right|\le 2$，其中积分路径 $C$ 是连接 $i$ 和 $2+i$ 的直线段

**证明** 取 $f(z)=\dfrac1{z^2}$。沿路径 $C$ 有 $y=1$，故$|f(z)|=\dfrac1{x^2+y^2}=\dfrac1{x^2+1}\le 1$，取 $M=1$。
又 $L=|2+i-i|=2$，于是由积分估值定理，
$$
\left|\int_C \frac{dz}{z^2}\right|\le 2.
$$

> **例 3.4** 证明
> $$
> \left|\int_{|z|=r}\frac{dz}{(z-a)(z+a)}\right|<\frac{2\pi r}{\bigl|r^2-|a|^2\bigr|},
> $$
> 其中 $r>0$，且 $|a|\ne r$.

**证明** 由 $L=2\pi r$，且当 $|z|=r$ 时，
$$
\left|\frac1{(z-a)(z+a)}\right|=\frac1{|z^2-a^2|}
\le \frac1{\bigl||z|^2-|a|^2\bigr|}
=\frac1{\bigl|r^2-|a|^2\bigr|}=M.
$$

故由积分估值定理得

$$
\left|\oint_{|z|=r}\frac{dz}{(z-a)(z+a)}\right|
\le ML
=\frac{2\pi r}{\bigl|r^2-|a|^2\bigr|}.
$$

另解：

$$
\left|\oint_{|z|=r}\frac{dz}{(z-a)(z+a)}\right|
\le \oint_{|z|=r}\frac{|dz|}{|z^2-a^2|}
\le \oint_{|z|=r}\frac{|dz|}{\bigl|r^2-|a|^2\bigr|}
=\frac{2\pi r}{\bigl|r^2-|a|^2\bigr|}.
$$

**注** 实变函数的积分中值定理不能直接推广到复积分。

**反例**

$$
\int_0^{2\pi}e^{i\theta}\,d\theta
=\int_0^{2\pi}\cos\theta\,d\theta+i\int_0^{2\pi}\sin\theta\,d\theta=0,
$$

但 $e^{i\zeta}(2\pi-0)\ne 0$。

