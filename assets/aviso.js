/* Bolinha de avisos: aparece em todas as páginas. Lê e grava as tarefas do dia no mesmo lugar da página Tarefas (localStorage 'tarefas:v1'). */
(() => {
  if (window.__aviso) return; window.__aviso = 1;
  const KEY = 'tarefas:v1', CFG = 'aviso:cfg', RESET_H = 7, SRC = (document.currentScript && document.currentScript.src || '').replace(/aviso\.js.*$/, '');
  const naTarefas = /tarefas\.html$/.test(location.pathname);
  // tarefas rápidas do dia (mesmos ids da página Tarefas)
  const ITENS = [
    { id: 'odyle', t: 'Gastar a Odyle Energy', lvl: 22 }, { id: 'duty', t: 'Duty Missions', n: 5, lvl: 45 },
    { id: 'night', t: 'Nightmare', n: 2 }, { id: 'dd', t: 'Daily Dungeon', n: 2 }, { id: 'conq', t: 'Conquest' },
    { id: 'shugo', t: 'Shugo Festival', n: 3 }, { id: 'dimi', t: 'Dimensional Invasion' }
  ];
  let S = { d: '', w: '', daily: {}, weekly: {}, lvl: 45, il: 0 }, cfg = { on: true, nat: false, sempre: false };
  const ler = () => { try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {} try { Object.assign(cfg, JSON.parse(localStorage.getItem(CFG) || '{}')); } catch (e) {} };
  const gday = (d = new Date()) => new Date(d.getTime() - RESET_H * 3600e3);
  const dayKey = () => gday().toISOString().slice(0, 10);
  const rolar = () => { if (S.d !== dayKey()) { S.d = dayKey(); S.daily = {}; } };
  const gravar = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const itens = () => ITENS.filter(i => !(i.lvl && S.lvl < i.lvl));
  const feito = i => (S.daily[i.id] || 0) >= (i.n || 1);
  const faltam = () => itens().filter(i => !feito(i)).length;

  const css = document.createElement('style');
  css.textContent = `
  #avB{position:fixed;left:0;top:0;z-index:9000;touch-action:none;font:500 14px 'Barlow','Segoe UI',system-ui,sans-serif;color:#ebe7df}
  #avB button{font:inherit;color:inherit;cursor:pointer}
  #avF{position:relative;width:54px;height:54px;border-radius:50%;border:1.5px solid #3a4258;background:radial-gradient(circle at 35% 30%,#262b3b,#0c0e14 70%);box-shadow:0 6px 18px #000c,0 0 0 1px #000 inset;display:grid;place-items:center;padding:0;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;transition:transform .15s,border-color .15s,box-shadow .15s}
  #avB.snap{transition:left .28s cubic-bezier(.2,.9,.3,1.1),top .28s cubic-bezier(.2,.9,.3,1.1)}#avB.drag #avF{cursor:grabbing;transform:scale(1.1)}#avB.drag{z-index:9100}
  #avF:hover{transform:scale(1.06);border-color:#a47cff}#avF:focus-visible{outline:2px solid #a47cff;outline-offset:2px}
  #avF svg{width:26px;height:26px;filter:drop-shadow(0 0 4px #a47cff88)}#avF img{width:36px;height:36px;border-radius:50%;object-fit:cover}
  #avF{--c:#e6b45c}
  #avF.ev{border-color:var(--c);box-shadow:0 6px 18px #000c,0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent),0 0 16px 2px color-mix(in srgb,var(--c) 55%,transparent)}
  #avF.ev::before{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--c);opacity:0;pointer-events:none;animation:avr 1.8s ease-out infinite}
  #avF.ev svg,#avF.ev img{animation:avw 5s ease-in-out infinite;transform-origin:50% 12%}
  #avF.k-shugo{--c:#f2c14e}#avF.k-dimi{--c:#8f7dff}#avF.k-reset{--c:#ff6a3d}
  @keyframes avr{0%{opacity:.85;transform:scale(.96)}100%{opacity:0;transform:scale(1.55)}}
  @keyframes avw{0%,64%,100%{transform:rotate(0)}68%{transform:rotate(-16deg)}72%{transform:rotate(14deg)}76%{transform:rotate(-10deg)}80%{transform:rotate(7deg)}84%{transform:rotate(-3deg)}88%{transform:rotate(0)}}
  @media(prefers-reduced-motion:reduce){#avF.ev::before,#avF.ev svg,#avF.ev img{animation:none}#avF.ev::before{opacity:.7;transform:scale(1.18)}#avB.snap{transition:none}}
  #avM{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);padding:0 6px;height:18px;border-radius:9px;background:var(--c);color:#14110a;font:700 10.5px/18px 'Chakra Petch',sans-serif;border:2px solid #0c0e14;white-space:nowrap;box-sizing:content-box;pointer-events:none}
  #avM[hidden]{display:none}
  #avN{position:absolute;top:-5px;right:-5px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#a47cff;color:#120e1c;font:700 11px/20px 'Chakra Petch',sans-serif;text-align:center;border:2px solid #0c0e14}
  #avN[hidden]{display:none}
  #avP{position:fixed;left:8px;top:8px;width:300px;max-width:calc(100vw - 16px);background:#11141c;border:1px solid #2f3648;border-radius:14px;padding:12px 12px 10px;box-shadow:0 14px 36px #000d}
  #avP[hidden]{display:none}#avP h4{margin:0;font:700 14px 'Chakra Petch',sans-serif;letter-spacing:.04em;display:flex;justify-content:space-between;align-items:baseline;color:#fff}
  #avP h4 small{font:400 12px 'Barlow',sans-serif;color:#9298a8}
  .avE{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0}.avE div{background:#171b26;border:1px solid #2a3040;border-radius:9px;padding:6px 8px;font-size:12px;color:#9298a8;display:flex;align-items:center;gap:6px}
  .avE b{display:block;color:#ebe7df;font:600 14px 'Chakra Petch',sans-serif}.avE img{width:26px;height:26px;border-radius:6px}
  .avE .go{border-color:#e6b45c;color:#e6b45c}
  .avL{display:grid}.avL label{display:flex;align-items:center;gap:8px;padding:6px 2px;border-top:1px solid #222838;cursor:pointer;font-size:13.5px}
  .avL input{accent-color:#a47cff;width:15px;height:15px;margin:0}.avL .c{margin-left:auto;display:flex;align-items:center;gap:4px;color:#9298a8;font-size:12px}
  .avL .c button{width:20px;height:20px;border-radius:6px;border:1px solid #2f3648;background:#171b26;line-height:1;padding:0}
  .avL .ok{color:#6c7388;text-decoration:line-through}
  .avF2{display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:12px}.avF2 a{color:#cdb8ff;text-decoration:none}.avF2 button{background:none;border:0;color:#9298a8;padding:0}
  #avT{position:fixed;left:8px;top:8px;max-width:calc(100vw - 16px);width:270px;background:#11141c;border:1px solid #2f3648;border-left:4px solid #e6b45c;border-radius:12px;padding:10px 12px;box-shadow:0 10px 28px #000d;font-size:13px;animation:avi .25s ease-out}
  #avT[hidden]{display:none}#avT b{display:block;font:600 14px 'Chakra Petch',sans-serif;color:#fff}@keyframes avi{from{opacity:0;transform:translateY(8px)}}
  @media(max-width:560px){#avF{width:50px;height:50px}}`;
  document.head.append(css);

  const box = document.createElement('div'); box.id = 'avB';
  const SINO = '<svg viewBox="0 0 24 24" fill="none" stroke="#cdb8ff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17h12l-1.6-2.4V10a4.4 4.4 0 0 0-8.8 0v4.6z"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M12 4.2V5.6"/></svg>';
  box.innerHTML = '<div id="avT" hidden></div><div id="avP" hidden></div><button type="button" id="avF" aria-label="Avisos e tarefas do dia" aria-expanded="false">' + SINO + '<span id="avN" hidden></span><span id="avM" hidden></span></button>';
  document.addEventListener('DOMContentLoaded', () => document.body.append(box)); if (document.body) document.body.append(box);
  const $ = id => box.querySelector('#' + id);

  const dois = n => String(n).padStart(2, '0');
  const mmss = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return dois(Math.floor(s / 60)) + ':' + dois(s % 60); };
  const proximo = (min) => { const n = new Date(), a = new Date(n); a.setMinutes(min, 0, 0); if (a <= n) a.setHours(a.getHours() + 1); return a - n; };
  const proxReset = () => { const n = new Date(), r = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), RESET_H)); if (r <= n) r.setUTCDate(r.getUTCDate() + 1); return r - n; };
  // janela de cada evento: de quanto tempo antes começa o aviso e quanto dura
  const estado = () => {
    const sh = proximo(0), di = proximo(30), rs = proxReset(), m = new Date().getMinutes();
    const ev = [];
    if (sh <= 5 * 60e3 || m < 6) ev.push({ k: 'shugo', img: 'shugo.webp', t: 'Shugo Festival', b: m < 6 ? 'AGORA' : Math.ceil(sh / 60e3) + ' min', d: m < 6 ? 'está acontecendo, entre agora' : 'começa em ' + mmss(sh) });
    if (di <= 5 * 60e3 || (m >= 30 && m < 35)) ev.push({ k: 'dimi', img: 'fenda.webp', t: 'Dimensional Invasion', b: (m >= 30 && m < 35) ? 'AGORA' : Math.ceil(di / 60e3) + ' min', d: (m >= 30 && m < 35) ? 'está acontecendo' : 'começa em ' + mmss(di) });
    if (rs <= 30 * 60e3 && faltam()) ev.push({ k: 'reset', t: 'Reset diário', b: Math.ceil(rs / 60e3) + ' min', d: 'em ' + mmss(rs) + '. Faltam ' + faltam() + ' tarefas' });
    return { sh, di, rs, ev };
  };

  let visto = {}, aberto = false;
  // aviso do sistema (Windows) + som: só com a aba em segundo plano, a menos que 'sempre' esteja ligado
  let ac = null;
  const bipe = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); [660, 880, 1100].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * .16; o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .15); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .16); }); } catch (x) {} };
  const sistema = (e, k) => { if (!cfg.nat || !('Notification' in window) || Notification.permission !== 'granted') return; if (!cfg.sempre && !document.hidden && document.hasFocus()) return;
    try { const n = new Notification(e.t, { body: e.d, tag: k, icon: e.img ? SRC + 'aviso/' + e.img : undefined, silent: true }); n.onclick = () => { window.focus(); n.close(); }; setTimeout(() => n.close(), 15000); } catch (x) {} bipe(); };
  const toast = (e) => {
    if (!cfg.on) return; const k = e.k + ':' + new Date().toISOString().slice(0, 13) + (e.k === 'dimi' ? new Date().getMinutes() >= 25 : '');
    if (visto[k]) return; visto[k] = 1; sistema(e, k);
    if (aberto) return;
    const t = $('avT'); t.innerHTML = '<b>' + e.t + '</b>' + e.d + '<br><span style="color:#9298a8">Toque na bolinha para abrir a lista</span>'; t.hidden = false; posiciona(); setTimeout(() => { t.hidden = true; }, 9000);
  };
  const desenhaLista = () => {
    const el = $('avP');
    const e = estado();
    let h = '<h4>Hoje no jogo <small>reseta em ' + mmss(e.rs).replace(/^(\d+):(\d+)$/, '$1 min') + '</small></h4>';
    const hr = ms => { const m = Math.floor(ms / 60e3); return m >= 60 ? Math.floor(m / 60) + ' h ' + dois(m % 60) + ' min' : m + ' min'; };
    h = h.replace(/reseta em .*?<\/small>/, 'reseta em ' + hr(e.rs) + '</small>');
    h += '<div class="avE"><div class="' + (e.ev.some(x => x.k === 'shugo') ? 'go' : '') + '"><img src="' + SRC + 'aviso/shugo.webp" alt=""><span>Shugo Festival<b data-t="sh">' + mmss(e.sh) + '</b></span></div><div class="' + (e.ev.some(x => x.k === 'dimi') ? 'go' : '') + '"><img src="' + SRC + 'aviso/fenda.webp" alt=""><span>Dimensional Inv.<b data-t="di">' + mmss(e.di) + '</b></span></div></div>';
    if (naTarefas) h += '<div style="font-size:13px;color:#9298a8;padding:4px 2px">Marque as tarefas na própria página.</div>';
    else { h += '<div class="avL">'; itens().forEach(i => { const n = i.n || 1, v = S.daily[i.id] || 0, ok = v >= n;
      h += '<label data-i="' + i.id + '"><input type="checkbox"' + (ok ? ' checked' : '') + '><span class="' + (ok ? 'ok' : '') + '">' + i.t + '</span>' + (n > 1 ? '<span class="c"><button type="button" data-m="-1" aria-label="Menos">−</button>' + v + '/' + n + '<button type="button" data-m="1" aria-label="Mais">+</button></span>' : '') + '</label>'; });
      h += '</div>'; }
    h += '<div class="avF2"><a href="' + SRC.replace(/assets\/$/, '') + 'tarefas.html">Abrir todas as tarefas →</a><button type="button" id="avCfg">Avisos: ' + (cfg.on ? 'ligados' : 'desligados') + '</button></div>';
    const np = !('Notification' in window) ? 'sem suporte' : Notification.permission === 'denied' ? 'bloqueado no navegador' : cfg.nat && Notification.permission === 'granted' ? 'ligado' : 'desligado';
    h += '<div class="avF2"><button type="button" id="avNat">Avisos do Windows + som: ' + np + '</button>' + (cfg.nat ? '<button type="button" id="avSem">' + (cfg.sempre ? 'sempre' : 'só em 2º plano') + '</button>' : '') + '</div>';
    el.innerHTML = h;
    el.querySelectorAll('label[data-i]').forEach(l => {
      const i = ITENS.find(x => x.id === l.dataset.i), n = i.n || 1;
      l.onclick = ev => { ev.preventDefault(); const b = ev.target.closest('button'); let v = S.daily[i.id] || 0;
        if (n > 1) { if (b) v = Math.max(0, Math.min(n, v + +b.dataset.m)); else v = v >= n ? 0 : n; } else v = v ? 0 : 1;
        ler(); rolar(); S.daily[i.id] = v; gravar(); desenhaLista(); marca(); };
    });
    const sv = () => { try { localStorage.setItem(CFG, JSON.stringify(cfg)); } catch (e) {} };
    $('avNat').onclick = async () => { if (!('Notification' in window)) return; if (cfg.nat) { cfg.nat = false; sv(); return desenhaLista(); }
      let p = Notification.permission; if (p === 'default') p = await Notification.requestPermission();
      if (p === 'granted') { cfg.nat = true; sv(); bipe(); try { new Notification('Avisos ligados', { body: 'Você será avisado dos eventos e do reset com a aba em segundo plano.', silent: true }); } catch (x) {} } desenhaLista(); };
    if ($('avSem')) $('avSem').onclick = () => { cfg.sempre = !cfg.sempre; sv(); desenhaLista(); };
    $('avCfg').onclick = () => { cfg.on = !cfg.on; try { localStorage.setItem(CFG, JSON.stringify(cfg)); } catch (e) {} desenhaLista(); };
  };
  const marca = () => { // número da bolinha e ícone do evento
    ler(); rolar(); const f = $('avF'), n = $('avN'), e = estado(), q = naTarefas ? 0 : faltam();
    n.hidden = !q; n.textContent = q;
    const atual = e.ev[0], k = atual ? atual.k : '';
    const mb = $('avM'); mb.hidden = !atual; if (atual) mb.textContent = atual.b;
    if (f.dataset.k !== k) { f.dataset.k = k; f.className = k ? 'ev k-' + k : ''; const nv = f.querySelector('svg,img'); nv.remove();
      if (atual && atual.img) { const im = new Image(); im.src = SRC + 'aviso/' + atual.img; im.alt = ''; f.prepend(im); } else f.insertAdjacentHTML('afterbegin', SINO); }
    if (atual) toast(atual);
    if (aberto) { const a = $('avP').querySelector('[data-t=sh]'), b = $('avP').querySelector('[data-t=di]'); if (a) a.textContent = mmss(e.sh); if (b) b.textContent = mmss(e.di); }   // só os relógios, para não refazer a lista a cada segundo
  };
  box.addEventListener('click', e => { if (semClique) { semClique = false; return; } if (e.target.closest('#avF')) { aberto = !aberto; $('avP').hidden = !aberto; $('avF').setAttribute('aria-expanded', aberto); $('avT').hidden = true; if (aberto) { ler(); rolar(); desenhaLista(); } posiciona(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && aberto) { aberto = false; $('avP').hidden = true; $('avF').focus(); } });
  // posição: gruda na borda mais próxima; guarda {s: lado (l|r|t|b), f: fração ao longo da borda}
  const POS = 'aviso:pos', MG = 12, GAP = 10;
  let pos = { s: 'r', f: 1 }, semClique = false;
  try { const p = JSON.parse(localStorage.getItem(POS)); if (p && 'lrtb'.includes(p.s) && isFinite(p.f)) pos = { s: p.s, f: Math.max(0, Math.min(1, +p.f)) }; } catch (e) {}
  const sonda = document.createElement('div'); sonda.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  const area = () => { document.body.contains(sonda) || document.body.append(sonda); const c = getComputedStyle(sonda), W = document.documentElement.clientWidth, H = window.innerHeight, b = $('avF').offsetWidth || 54;
    const a = { l: (parseFloat(c.paddingLeft) || 0) + MG, t: (parseFloat(c.paddingTop) || 0) + MG, r: W - (parseFloat(c.paddingRight) || 0) - MG - b, b: H - (parseFloat(c.paddingBottom) || 0) - MG - b };
    a.r = Math.max(a.l, a.r); a.b = Math.max(a.t, a.b); return a; };
  const coord = () => { const a = area(), f = pos.f; // x,y do canto superior esquerdo do botão
    if (pos.s === 'l') return [a.l, a.t + f * (a.b - a.t)]; if (pos.s === 'r') return [a.r, a.t + f * (a.b - a.t)];
    if (pos.s === 't') return [a.l + f * (a.r - a.l), a.t]; return [a.l + f * (a.r - a.l), a.b]; };
  const mover = (x, y) => { box.style.left = Math.round(x) + 'px'; box.style.top = Math.round(y) + 'px'; };
  const posiciona = () => { // popup e aviso do lado onde há espaço, sempre dentro da tela
    const r = $('avF').getBoundingClientRect(), W = document.documentElement.clientWidth, H = window.innerHeight;
    [$('avP'), $('avT')].forEach(el => { if (el.hidden) return; const w = el.offsetWidth, h = el.offsetHeight;
      const acima = r.top - GAP - 8 >= h || (r.top > H - r.bottom && H - r.bottom - GAP - 8 < h);
      let top = acima ? r.top - GAP - h : r.bottom + GAP; top = Math.max(8, Math.min(H - h - 8, top));
      let left = (r.left + r.width / 2 > W / 2) ? r.right - w : r.left; left = Math.max(8, Math.min(W - w - 8, left));
      el.style.left = Math.round(left) + 'px'; el.style.top = Math.round(top) + 'px'; }); };
  const aplica = (anima) => { box.classList.toggle('snap', !!anima); const [x, y] = coord(); mover(x, y); posiciona(); if (anima) setTimeout(() => { box.classList.remove('snap'); posiciona(); }, 320); };
  const encaixa = () => { const a = area(), x = parseFloat(box.style.left) || 0, y = parseFloat(box.style.top) || 0;
    const d = { l: x - a.l, r: a.r - x, t: y - a.t, b: a.b - y }, s = Object.keys(d).sort((p, q) => d[p] - d[q])[0];
    const cl = v => Math.max(0, Math.min(1, v)); pos = { s, f: (s === 'l' || s === 'r') ? cl((y - a.t) / ((a.b - a.t) || 1)) : cl((x - a.l) / ((a.r - a.l) || 1)) };
    try { localStorage.setItem(POS, JSON.stringify({ s: pos.s, f: +pos.f.toFixed(4) })); } catch (e) {}
    aplica(true); };
  let dr = null;
  const bt = $('avF');
  bt.addEventListener('pointerdown', e => { if (e.button > 0) return; const r = box.getBoundingClientRect(); dr = { id: e.pointerId, x0: e.clientX, y0: e.clientY, bx: r.left, by: r.top, mov: false }; try { bt.setPointerCapture(e.pointerId); } catch (x) {} });
  bt.addEventListener('pointermove', e => { if (!dr || e.pointerId !== dr.id) return; const dx = e.clientX - dr.x0, dy = e.clientY - dr.y0;
    if (!dr.mov) { if (Math.hypot(dx, dy) <= 6) return; dr.mov = true; box.classList.remove('snap'); box.classList.add('drag'); $('avT').hidden = true; }
    const W = document.documentElement.clientWidth, H = window.innerHeight, b = bt.offsetWidth;
    mover(Math.max(0, Math.min(W - b, dr.bx + dx)), Math.max(0, Math.min(H - b, dr.by + dy))); posiciona(); e.preventDefault(); });
  const solta = e => { if (!dr || e.pointerId !== dr.id) return; const m = dr.mov; dr = null; try { bt.releasePointerCapture(e.pointerId); } catch (x) {}
    if (m) { box.classList.remove('drag'); semClique = true; setTimeout(() => { semClique = false; }, 400); encaixa(); } };
  bt.addEventListener('pointerup', solta); bt.addEventListener('pointercancel', solta);
  bt.addEventListener('dragstart', e => e.preventDefault());
  window.addEventListener('resize', () => aplica(false)); window.addEventListener('orientationchange', () => setTimeout(() => aplica(false), 200));
  const iniciaPos = () => aplica(false); document.body ? iniciaPos() : document.addEventListener('DOMContentLoaded', iniciaPos);
  window.addEventListener('storage', marca);
  setInterval(marca, 1000); marca();
})();
