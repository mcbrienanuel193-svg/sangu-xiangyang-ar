(() => {
  'use strict';
  const entryUrl = new URL('ar.html', document.baseURI).href;
  if (!/^https?:/.test(entryUrl)) return;
  try {
    const qr = qrcodegen.QrCode.encodeText(entryUrl, qrcodegen.QrCode.Ecc.MEDIUM);
    const border = 4;
    const side = qr.size + border * 2;
    const parts = [];
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.getModule(x, y)) parts.push(`M${x + border},${y + border}h1v1h-1z`);
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><path d="${parts.join(' ')}" fill="#173e35"/></svg>`;
    const imageUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    const refresh = () => {
      document.querySelectorAll('img[data-entry-qr]').forEach(img => {
        img.src = imageUrl;
        img.dataset.entryUrl = entryUrl;
      });
    };
    refresh();
    new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error('无法生成扫码入口', error);
  }
})();
