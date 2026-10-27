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
  let S = { d: '', w: '', daily: {}, weekly: {}, lvl: 45, il: 0 }, cfg = { on: true };
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
  #avB{position:fixed;right:16px;bottom:16px;z-index:9000;font:500 14px 'Barlow','Segoe UI',system-ui,sans-serif;color:#ebe7df}
  #avB button{font:inherit;color:inherit;cursor:pointer}
  #avF{position:relative;width:54px;height:54px;border-radius:50%;border:1.5px solid #3a4258;background:radial-gradient(circle at 35% 30%,#262b3b,#0c0e14 70%);box-shadow:0 6px 18px #000c,0 0 0 1px #000 inset;display:grid;place-items:center;padding:0;transition:transform .15s,border-color .15s,box-shadow .15s}
  #avF:hover{transform:scale(1.06);border-color:#a47cff}#avF:focus-visible{outline:2px solid #a47cff;outline-offset:2px}
  #avF svg{width:26px;height:26px;filter:drop-shadow(0 0 4px #a47cff88)}#avF img{width:36px;height:36px;border-radius:50%;object-fit:cover}
  #avF.ev{border-color:#e6b45c;box-shadow:0 6px 18px #000c,0 0 0 3px #e6b45c33;animation:avp 1.6s ease-in-out infinite}
  @keyframes avp{50%{box-shadow:0 6px 18px #000c,0 0 0 8px #e6b45c14}}@media(prefers-reduced-motion:reduce){#avF.ev{animation:none}}
  #avN{position:absolute;top:-5px;right:-5px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#a47cff;color:#120e1c;font:700 11px/20px 'Chakra Petch',sans-serif;text-align:center;border:2px solid #0c0e14}
  #avN[hidden]{display:none}
  #avP{position:absolute;right:0;bottom:66px;width:300px;max-width:calc(100vw - 32px);background:#11141c;border:1px solid #2f3648;border-radius:14px;padding:12px 12px 10px;box-shadow:0 14px 36px #000d}
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
  #avT{position:absolute;right:0;bottom:66px;width:270px;background:#11141c;border:1px solid #2f3648;border-left:4px solid #e6b45c;border-radius:12px;padding:10px 12px;box-shadow:0 10px 28px #000d;font-size:13px;animation:avi .25s ease-out}
  #avT[hidden]{display:none}#avT b{display:block;font:600 14px 'Chakra Petch',sans-serif;color:#fff}@keyframes avi{from{opacity:0;transform:translateY(8px)}}
  @media(max-width:560px){#avB{right:10px;bottom:10px}#avF{width:50px;height:50px}}`;
  document.head.append(css);

  const box = document.createElement('div'); box.id = 'avB';
  const SINO = '<svg viewBox="0 0 24 24" fill="none" stroke="#cdb8ff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17h12l-1.6-2.4V10a4.4 4.4 0 0 0-8.8 0v4.6z"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M12 4.2V5.6"/></svg>';
  box.innerHTML = '<div id="avT" hidden></div><div id="avP" hidden></div><button type="button" id="avF" aria-label="Avisos e tarefas do dia" aria-expanded="false">' + SINO + '<span id="avN" hidden></span></button>';
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
    if (sh <= 5 * 60e3 || m < 6) ev.push({ k: 'shugo', img: 'shugo.webp', t: 'Shugo Festival', d: m < 6 ? 'está acontecendo, entre agora' : 'começa em ' + mmss(sh) });
    if (di <= 5 * 60e3 || (m >= 30 && m < 35)) ev.push({ k: 'dimi', img: 'fenda.webp', t: 'Dimensional Invasion', d: (m >= 30 && m < 35) ? 'está acontecendo' : 'começa em ' + mmss(di) });
    if (rs <= 30 * 60e3 && faltam()) ev.push({ k: 'reset', t: 'Reset diário', d: 'em ' + mmss(rs) + '. Faltam ' + faltam() + ' tarefas' });
    return { sh, di, rs, ev };
  };

  let visto = {}, aberto = false;
  const toast = (e) => {
    if (!cfg.on || aberto) return; const k = e.k + ':' + new Date().toISOString().slice(0, 13) + (e.k === 'dimi' ? new Date().getMinutes() >= 25 : '');
    if (visto[k]) return; visto[k] = 1;
    const t = $('avT'); t.innerHTML = '<b>' + e.t + '</b>' + e.d + '<br><span style="color:#9298a8">Toque na bolinha para abrir a lista</span>'; t.hidden = false; setTimeout(() => { t.hidden = true; }, 9000);
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
    el.innerHTML = h;
    el.querySelectorAll('label[data-i]').forEach(l => {
      const i = ITENS.find(x => x.id === l.dataset.i), n = i.n || 1;
      l.onclick = ev => { ev.preventDefault(); const b = ev.target.closest('button'); let v = S.daily[i.id] || 0;
        if (n > 1) { if (b) v = Math.max(0, Math.min(n, v + +b.dataset.m)); else v = v >= n ? 0 : n; } else v = v ? 0 : 1;
        ler(); rolar(); S.daily[i.id] = v; gravar(); desenhaLista(); marca(); };
    });
    $('avCfg').onclick = () => { cfg.on = !cfg.on; try { localStorage.setItem(CFG, JSON.stringify(cfg)); } catch (e) {} desenhaLista(); };
  };
  const marca = () => { // número da bolinha e ícone do evento
    ler(); rolar(); const f = $('avF'), n = $('avN'), e = estado(), q = naTarefas ? 0 : faltam();
    n.hidden = !q; n.textContent = q;
    const atual = e.ev[0], k = atual ? atual.k : '';
    if (f.dataset.k !== k) { f.dataset.k = k; f.classList.toggle('ev', !!k); const nv = f.querySelector('svg,img'); nv.remove();
      if (atual && atual.img) { const im = new Image(); im.src = SRC + 'aviso/' + atual.img; im.alt = ''; f.prepend(im); } else f.insertAdjacentHTML('afterbegin', SINO); }
    if (atual) toast(atual);
    if (aberto) { const a = $('avP').querySelector('[data-t=sh]'), b = $('avP').querySelector('[data-t=di]'); if (a) a.textContent = mmss(e.sh); if (b) b.textContent = mmss(e.di); }   // só os relógios, para não refazer a lista a cada segundo
  };
  box.addEventListener('click', e => { if (e.target.closest('#avF')) { aberto = !aberto; $('avP').hidden = !aberto; $('avF').setAttribute('aria-expanded', aberto); $('avT').hidden = true; if (aberto) { ler(); rolar(); desenhaLista(); } } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && aberto) { aberto = false; $('avP').hidden = true; $('avF').focus(); } });
  window.addEventListener('storage', marca);
  setInterval(marca, 1000); marca();
})();
