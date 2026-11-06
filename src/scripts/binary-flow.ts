export function initBinaryFlow(root: HTMLElement) {
  const cells = [...root.querySelectorAll<HTMLElement>('.binary-bit')];
  const grouped = new Map<number, HTMLElement[]>();
  for (const cell of cells) {
    const key = Number(cell.dataset.binaryKey);
    const copies = grouped.get(key) ?? [];
    copies.push(cell);
    grouped.set(key, copies);
  }
  const bits = [...grouped.values()];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const phases = bits.map(() => ({ next: Math.random() * 2600 }));
  let visible = true;
  let timer: ReturnType<typeof setInterval> | undefined;

  function sync() {
    // Only viewport intersection pauses motion. Some embedded/preview browsers
    // report document.hidden even while their page is displayed; CSS must not
    // become permanently stuck in that state. Background tabs are throttled
    // natively by browsers.
    const paused = !visible;
    root.toggleAttribute('data-paused', paused);
    root.toggleAttribute('data-reduced', reduced.matches);
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    // A single low-frequency scheduler updates only glyphs whose transition ended.
    // Motion is independent CSS animation: brightness never affects its velocity.
    cells.forEach(bit => { bit.style.transition = paused || reduced.matches ? 'none' : ''; });
    if (paused || reduced.matches) return;
    phases.forEach(phase => { phase.next = performance.now() + Math.random() * 2600; });
    timer = setInterval(() => {
      const now = performance.now();
      bits.forEach((copies, index) => {
        if (mobile.matches && index >= 96) return;
        if (now < phases[index].next) return;
        const duration = 1500 + Math.random() * 1500;
        const peak = Math.random() < 0.06;
        const opacity = peak ? 0.42 + Math.random() * 0.10 : 0.23 + Math.random() * 0.16;
        copies.forEach(bit => {
          bit.style.transition = `opacity ${duration}ms ease-in-out`;
          bit.style.opacity = String(opacity);
        });
        phases[index].next = now + duration;
      });
    }, 200);
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  });
  observer.observe(root);
  reduced.addEventListener('change', sync);
  mobile.addEventListener('change', sync);
  sync();
}
