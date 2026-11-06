// Site identity and optional presentation settings.
export const site = {
  name: 'Rekjo', title: 'Rekjo / field notes',
  description: '关于密码学、安全研究与构建事物的个人笔记。',
};

// The description remains available for SEO, but is not shown in post cards or headers.
export const postDisplay = {
  showDescriptions: false,
};

// About page: the identity card is always shown; all optional sections are opt-in.
// Fill these fields when ready. Blank fields do not render placeholder text.
export const author = {
  name: site.name,
  id: 'rekjorekjo', // Displayed as @rekjorekjo; set '' to hide.
  avatar: '/images/headimage.jpg', // Set '' for a letter avatar; image must exist in public/.
  signature: '',
  bio: '',
  tags: [] as string[], // e.g. ['CTF', 'Cryptography']
  showContacts: false,
  email: '',
  github: '', // Complete URL, e.g. 'https://github.com/rekjorekjo'
  x: '', // Complete URL, e.g. 'https://x.com/yourname'
  showBlogInfo: false,
  blogParagraphs: [] as string[], // Free-form introduction, opt-in through showBlogInfo.
};
