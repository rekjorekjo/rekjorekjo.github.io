# Astro Notebook 可选资料与摘要显示

适用基线：用户上传的 `astro-main-code-only(1).zip`，源码版本 `c8bd29d4657ac6dc74eae7e65108200b9e24bddd`。

## 修改

- `src/config.ts`: 添加 `author.id`、`author.tags`，签名、简介和个人标签默认为空；`showContacts` / `showBlogInfo` 默认关闭；邮箱/GitHub/X 字段默认留空。保留用户已设置的头像路径，需要 `public/images/headimage.jpg` 实际存在。
- `src/pages/about.astro`: 仅显示非空个人资料，不再输出“暂未公开”占位；联系方式和博客说明完全由显式开关控制。
- `postDisplay.showDescriptions=false`: 首页、归档、分类、标签的 PostList 和文章标题区默认不展示摘要。若需要恢复，改为 `true`。
- `description` Frontmatter 改为可选，已有摘要仍可作为文章页 meta description。未提供时 Base.astro 回退到站点 description。
- 未更改首页 Binary Flow、文章目录、语法高亮、文章内容、GitHub Pages 设置及主站仓库。

## 自己填写

打开 `src/config.ts`：

```ts
export const author = {
  name: site.name,
  id: 'rekjorekjo',
  avatar: '/images/headimage.jpg',
  signature: '',
  bio: '',
  tags: [] as string[],
  showContacts: false,
  email: '',
  github: '',
  x: '',
  showBlogInfo: false,
  blogParagraphs: [] as string[],
};
```

要显示联系方式，填写相应字段并设 `showContacts: true`；只显示已经填写的联系方式。要显示博客介绍，设置 `blogParagraphs` 内容并把 `showBlogInfo` 设为 `true`。

## 验收

此 code-only 包不包含真实文章或头像，无法独立完成文章与图片的真实构建验收。请在完整源码仓库的独立分支上应用补丁并运行 `npm ci`、`npm run check`、`npm run build`、`npm test`。在首页、归档、分类、标签和文章页检查摘要消失及 SEO meta；在关于页检查空字段和隐藏区块。

主站 `https://rekjorekjo.github.io/` 已迁移为 Astro，独立预览站位于 `/astro-preview/`。本次修改在包含 46 篇正式文章和头像的完整主站源码上验收，再通过主站现有 GitHub Actions 发布；纯源码包继续排除文章及图片。
