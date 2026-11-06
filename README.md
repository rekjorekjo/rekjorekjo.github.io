# Rekjo / Field Notes

主站：https://rekjorekjo.github.io/
仓库：rekjorekjo/rekjorekjo.github.io

以验收过的 Astro Notebook 为界面基线，迁入原 Hexo 的全部 46 篇正式文章、303 个图片文件及附件、字体，移除三篇演示文章。头像沿用 /images/headimage.jpg。个人资料与联系方式均为可选，未填写的项目不显示占位文字。

## 可选资料与摘要

src/config.ts 中 postDisplay.showDescriptions 默认 false，列表及文章标题区隐藏摘要，已有摘要继续用于 SEO。文章 description 可以省略，此时 SEO 回退到站点说明。

About 默认仅显示头像、姓名与 ID。签名、简介、标签、邮箱与社交链接默认为空。填写联系方式后需设置 author.showContacts=true；填写 blogParagraphs 后需设置 author.showBlogInfo=true 才显示博客介绍。详见 OPTIONAL-PROFILE-CHANGES.md。

## 构建与发布

Node 24，使用锁文件安装。环境变量 SITE_URL=https://rekjorekjo.github.io，BASE_PATH=/。环境变量由进程读取，不自动读取 .env。

依次运行 npm ci、npm run check、npm test、npm run build、node scripts/audit-preview.mjs。
浏览器测试需要 Chrome；GitHub Actions 会安装浏览器并在全部检查通过后发布。工作流仅允许在主站仓库执行。副站 astro-preview 保持独立。

migration-manifest.json 记录原文件、原文件哈希、旧网址和新文章 ID；legacy-redirects.json 保留 46 篇文章及旧归档分页的访问入口。正式文章的 1605 个代码块经过逐块内容比对，没有执行文中的代码。

迁移修复仅涉及 Markdown/LaTeX 分隔符、代码围栏语言名、可确定的六处旧图片链接和空标题目录项。原 Hexo 文件未改写，完整备份与线上仓库镜像存放于 F:/blog-backups/before-astro-main-20261106。备份归档 SHA-256 为 794d47081dcaa721c8f058c639be2ebc2920cb2875fd6a2d447dd8f9fc9ba371。

## 更新文章

手机文章页使用右侧目录抽屉；桌面保持侧栏目录。右上角 EN / 中 切换界面标签并保存偏好，文章标题、正文及分类名称保留原语言。程序代码明确标记语言，日志、输出与密文使用 text / output / log，SageMath 沿用 Python 语法高亮。详见 MOBILE-TOC-I18N-HIGHLIGHT.md。

编辑 src/content/posts 下的 Markdown 及 public/images 中的资源。新文章可使用有意义的文件名；已有迁移文章 ID 应保持稳定。写作支持分类路径、扁平标签、KaTeX、代码复制、图片放大与 TOC。草稿设置 draft: true，生产环境不会发布。

主站旧发布版本已保存，回滚指引见 F 盘备份中的 RESTORE.txt。不要使用原 Hexo 的部署命令更新 Astro 站点。
