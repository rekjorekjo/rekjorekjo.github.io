---
title: 3.4_解析函数与调和函数
description: 在上一节已经证明：在区域 D 内解析的函数有任意阶导数。 由 C.-R. 方程 begincases dfracpartial
  upartial x=dfracpartial vpartial y,6pt dfracpartial upartial y=-dfracpartial
date: 2026-09-24T03:56:02.000Z
categories:
  - - ComplexAnalysis
    - Chapter3
tags: []
minutes: 3
demo: false
draft: false
---


在上一节已经证明：在区域 $D$ 内解析的函数有任意阶导数。

由 C.-R. 方程

$$
\begin{cases}
\dfrac{\partial u}{\partial x}=\dfrac{\partial v}{\partial y},\\[6pt]
\dfrac{\partial u}{\partial y}=-\dfrac{\partial v}{\partial x},
\end{cases}
$$

可得

$$
\frac{\partial^2u}{\partial x^2}=-\frac{\partial^2u}{\partial y^2},
\qquad
\frac{\partial^2v}{\partial x^2}=-\frac{\partial^2v}{\partial y^2}.
$$

因此

$$
\boxed{\Delta u=0,\qquad \Delta v=0},
$$

其中 $\Delta=\dfrac{\partial^2}{\partial x^2}+\dfrac{\partial^2}{\partial y^2}$ 为 **Laplace 算子**。

**定义** 二元实变函数 $H(x,y)$ 在区域 $D$ 内有二阶连续偏导数，且满足 $\Delta H=0$，则称 $H(x,y)$ 为区域 $D$ 内的**调和函数**。

**定义** 在区域 $D$ 中，若两个调和函数 $u,v$ 满足 C.-R. 方程

$$
\frac{\partial u}{\partial x}=\frac{\partial v}{\partial y},
\qquad
\frac{\partial u}{\partial y}=-\frac{\partial v}{\partial x},
$$

则称 $v$ 为 $u$ 在区域 $D$ 内的**共轭调和函数**。

**定理** $f(z)$ 在区域 $D$ 内解析的必要条件是：实部 $u$ 与虚部 $v$ 都是在区域 $D$ 内的调和函数。

> **例 3.21** 验证 $u(x,y)=x^3-3xy^2$ 是 $z$ 平面上的调和函数，并求以 $u(x,y)$ 为实部的解析函数 $f(z)$，使 $f(0)=i$

**解**

$$
u_x=3x^2-3y^2,\qquad u_{xx}=6x,
$$

$$
u_y=-6xy,\qquad u_{yy}=-6x.
$$

因此

$$
u_{xx}+u_{yy}=0,
$$

所以 $u(x,y)$ 是复平面上的调和函数。

由 C.-R. 方程

$$
dv=-u_y\,dx+u_x\,dy
=6xy\,dx+(3x^2-3y^2)\,dy.
$$

积分得

$$
v(x,y)=3x^2y-y^3+C.
$$

于是

$$
f(z)=u+iv
=x^3-3xy^2+i(3x^2y-y^3+C).
$$

因为

$$
(x+iy)^3=x^3-3xy^2+i(3x^2y-y^3),
$$

所以

$$
f(z)=z^3+iC.
$$

代入 $f(0)=i$，得 $C=1$，故

$$
f(z)=z^3+i
$$

