(function () {
  if (window.__BD_STICKY_SAFE) return;
  window.__BD_STICKY_SAFE = true;

  var root = (window.Shopify && Shopify.routes && Shopify.routes.root) ? Shopify.routes.root : '/';
  var FALLBACK = 47716981604436;

  function variantId() {
    var form = document.querySelector('form[action*="/cart/add"]');
    var field = form && form.querySelector('[name="id"]');
    if (field && Number(field.value)) return Number(field.value);
    var m = (location.search || '').match(/variant=(\d+)/);
    return m ? Number(m[1]) : FALLBACK;
  }

  function inFixedBar(el) {
    var cur = el;
    while (cur && cur !== document.body) {
      var pos = window.getComputedStyle(cur).position;
      if (pos === 'fixed' || pos === 'sticky') {
        var r = cur.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 140) return true;
      }
      cur = cur.parentElement;
    }
    return false;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button, a');
    if (!btn) return;
    if (btn.closest('form[action*="/cart/add"]')) return;
    if (btn.closest('.hc-cc, .bd-cc, [id="hc-cc-root"]')) return;
    var t = (btn.textContent || '').replace(/\s+/g, ' ').trim();
    if (!/^agregar al carrito$/i.test(t)) return;
    if (!inFixedBar(btn)) return;

    e.preventDefault();
    var id = variantId();
    var x = new XMLHttpRequest();
    x.open('POST', root + 'cart/add.js');
    x.setRequestHeader('Content-Type', 'application/json');
    x.onload = function () {
      var icon = document.querySelector('a[href="/cart"], a[href$="/cart"]');
      if (icon) icon.click();
    };
    x.send(JSON.stringify({ id: id, quantity: 1 }));
  });
})();