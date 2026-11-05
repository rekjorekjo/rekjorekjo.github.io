> 本文记录收到压缩包时的改造；后续路径安全修复、实际验证和限制见 ARCHIVE-CATEGORIES-FIX-REPORT.txt。标签路由现使用统一安全标识。

# 归档与分类改造说明

本轮基于 `astro-notebook-ui-polish.zip` 修改；保留首页 Binary Flow、文章阅读内容与代码块外框修订，不涉及旧 Hexo 项目，也不部署。

## 本轮设计

- 删除顶部搜索图标、搜索框、`/` 搜索快捷键，以及已经无用的客户端筛选脚本与 CSS。
- `/archive/` 改为按年份、月份倒序列出的静态文章目录。
- `/categories/` 展示有层级的分类目录及扁平标签集合，点击任意分类进入独立静态页面。
- `/categories/CTF/Crypto/` 等分类页展示当前分类及其后代分类的全部文章。
- `/tags/Python/` 等标签页在构建时生成；文章上的标签链接不再指向已删除的筛选器。
- 顶部导航为 首页 / 归档 / 分类 / 关于。

## Frontmatter 兼容 Hexo 的分类写法

现有 `category: CTF` 等单分类仍然有效，无须批量改动。新文章推荐：

```yaml
categories: [CTF, Crypto]
tags: [RSA, Python]
```

父子顺序为 CTF → Crypto。多条分类路径可写：

```yaml
categories:
  - [CTF, Crypto]
  - [Notes, Security]
```

`category` 和 `categories` 同时存在时优先使用 `categories`；如均未填写，归入「未分类」。路径深度不限于两层。注意分类名称不要包含 `/`（路径分隔符），最好避免重名或随意改名造成 URL 变化。

两篇既有演示文章的 Frontmatter 被更新为二级分类，以便本地预览确认效果：
- rsa-small-exponent: CTF → Crypto
- modular-arithmetic: Notes → Number Theory

## 本地验证

在 Node >=22.23.4 的环境执行：

```bash
npm ci
npm run check
npm run build
npm run verify
```

`npm run verify` 需要先运行开发预览及安装 Chrome。

本工作容器 Node 为 22.16.0，低于项目要求，且 `npm ci` 无法在当前网络条件下完整安装依赖。因此这里只进行了源代码与脚本语法检查；未声称 Astro 构建或浏览器测试通过。请以本机实际构建结果为准。
