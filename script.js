(() => {
  'use strict';

  /* ============ ДАНІ: підбір документів ============ */
  const SERVICES = [
    {
      group: 'Нерухомість',
      items: [
        {
          id: 'flat-buy', title: 'Купівля нерухомості', time: '40–60 хв',
          docs: [
            'Паспорти (ID-картки, якщо немає паспортів) та РНОКПП покупця і продавця',
            'Правовстановлювальні документи на нерухомість (договір, свідоцтво, витяг)',
            'Технічний паспорт',
            'Нотаріальна згода дружини/чоловіка (якщо у шлюбі)',
            'Довідка про зареєстрованих осіб (за потреби)'
          ],
          note: ''
        },
        {
          id: 'flat-gift', title: 'Дарування нерухомості', time: '30–45 хв',
          docs: [
            'Паспорти (ID-картки, якщо немає паспортів) та РНОКПП дарувальника і обдарованого',
            'Документи, що підтверджують право власності',
            'Технічний паспорт на об\'єкт',
            'Згода другого з подружжя (якщо майно спільне)',
            'Документи, що підтверджують родинні зв\'язки (для пільгового оподаткування)'
          ],
          note: 'Дарування між близькими родичами оподатковується за нульовою ставкою — перевіримо ваш випадок.'
        }
      ]
    },
    {
      group: 'Довіреності',
      items: [
        {
          id: 'poa-car', title: 'Довіреність на автомобіль', time: '20–30 хв',
          docs: [
            'Паспорт (ID-картка, якщо немає паспорта) та РНОКПП довірителя',
            'Дані особи, якій видається довіреність: ПІБ, дата народження, місце реєстрації, РНОКПП (за наявності)',
            'Свідоцтво про реєстрацію транспортного засобу'
          ],
          note: 'Вкажіть, які саме дії довіреній особі дозволено: керування, продаж, реєстрація, страхування.'
        }
      ]
    },
    {
      group: 'Дозволи на виїзд дитини',
      items: [
        {
          id: 'child-travel', title: 'Виїзд дитини за кордон', time: '20–30 хв',
          docs: [
            'Паспорти (ID-картки, якщо немає паспортів) обох батьків',
            'Дані супроводжуючої особи: ПІБ, дата народження',
            'Дата виїзду',
            'Країна перебування'
          ],
          note: 'Правила перетину кордону змінюються — актуальні вимоги уточнюю під час запису.'
        }
      ]
    },
    {
      group: 'Спадщина',
      items: [
        {
          id: 'inherit', title: 'Прийняття спадщини', time: '30–40 хв',
          docs: [
            'Паспорт (ID-картка, якщо немає паспорта) та РНОКПП спадкоємця',
            'Свідоцтво про смерть спадкодавця',
            'Документи, що підтверджують родинні зв\'язки',
            'Заповіт (за наявності)',
            'Документи на майно (за наявності)'
          ],
          note: 'Заяву про прийняття спадщини подають протягом 6 місяців з дня смерті — не відкладайте візит.'
        },
        {
          id: 'will', title: 'Складання заповіту', time: '30–40 хв',
          docs: [
            'Паспорт (ID-картка, якщо немає паспорта) та РНОКПП заповідача',
            'Документи на майно, яке заповідається',
            'Дані осіб, на користь яких складається заповіт (ПІБ, дата народження)'
          ],
          note: 'Заповіт складають особисто. Його зміст — конфіденційний, і я не розголошую його до відкриття спадщини.'
        }
      ]
    },
    {
      group: 'Бізнес',
      items: [
        {
          id: 'biz-share', title: 'Продаж частки в ТОВ', time: '40–60 хв',
          docs: [
            'Паспорти (ID-картки, якщо немає паспортів) та РНОКПП продавця і покупця',
            'Установчі документи ТОВ та виписка з ЄДР',
            'Свідоцтво або інший документ, що підтверджує внесення частки до статутного капіталу',
            'Згода другого з подружжя (якщо частка — спільне майно)'
          ],
          note: 'Перевіряю переважне право інших учасників на придбання частки та умови, передбачені статутом.'
        },
        {
          id: 'sign', title: 'Засвідчення справжності підпису', time: '10–15 хв',
          docs: [
            'Паспорт (ID-картка, якщо немає паспорта) особи, що підписує',
            'РНОКПП',
            'Документ, який потрібно підписати — не підписуйте його заздалегідь'
          ],
          note: 'Підписуєте безпосередньо при мені. Для юридичних осіб додатково потрібні документи, що підтверджують повноваження.'
        }
      ]
    }
  ];

  const flat = SERVICES.flatMap(g => g.items.map(i => ({ ...i, group: g.group })));
  const byId = id => flat.find(s => s.id === id);

  /* ============ Хелпери ============ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ============ Хедер ============ */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#burger');
  const nav = $('#nav');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Статус «зараз відчинено»
  function updateHours() {
    const badge = $('#hoursBadge');
    const text = $('#hoursText');
    const now = new Date();
    const d = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const open = d >= 1 && d <= 5 && mins >= 600 && mins < 1050;
    badge.classList.toggle('is-open', open);
    text.textContent = open ? 'Відчинено до 17:30' : 'Пн–Пт 10:00–17:30';
  }
  updateHours();
  setInterval(updateHours, 60000);

  $('#year').textContent = new Date().getFullYear();

  /* ============ Підсвічування карток (spotlight) ============ */
  $$('[data-spot]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ============ Підбір документів ============ */
  const choices = $('#pickerChoices');
  const result = $('#pickerResult');
  let current = null;

  choices.innerHTML = SERVICES.map(g => `
    <div class="pk-group">${g.group}</div>
    ${g.items.map(i => `<button type="button" class="pk-btn" role="tab" data-id="${i.id}" aria-selected="false">${i.title}</button>`).join('')}
  `).join('');

  function renderPicker(id, animate = true) {
    const s = byId(id);
    if (!s) return;
    current = s;
    $$('.pk-btn', choices).forEach(b => {
      const on = b.dataset.id === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    $('#pkCategory').textContent = s.group;
    $('#pkTitle').textContent = s.title;
    $('#pkTime').textContent = s.time;
    $('#pkNote').textContent = s.note;
    $('#pkNote').hidden = !s.note;
    $('#pkDocs').innerHTML = s.docs.map(d => `<li>${d}</li>`).join('');
    if (animate) {
      result.classList.remove('is-swap');
      void result.offsetWidth; // перезапуск анімації
      result.classList.add('is-swap');
    }
  }

  choices.addEventListener('click', e => {
    const b = e.target.closest('.pk-btn');
    if (b) renderPicker(b.dataset.id);
  });
  renderPicker('flat-buy', false);

  // Кнопки на картках послуг
  $$('[data-pick]').forEach(btn => btn.addEventListener('click', () => {
    renderPicker(btn.dataset.pick);
    $('#picker').scrollIntoView({ behavior: 'smooth' });
  }));

  /* ============ FAQ-акордеон ============ */
  $$('.acc').forEach(acc => {
    const btn = $('.acc__btn', acc);
    btn.addEventListener('click', () => {
      const open = !acc.classList.contains('is-open');
      $$('.acc.is-open').forEach(o => {
        if (o !== acc) { o.classList.remove('is-open'); $('.acc__btn', o).setAttribute('aria-expanded', 'false'); }
      });
      acc.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ============ Кнопка «Зателефонувати» ============ */
  const closeCalls = except => $$('.call').forEach(c => {
    if (c === except) return;
    c.classList.remove('is-open');
    $('.call__btn', c).setAttribute('aria-expanded', 'false');
  });
  $$('.call').forEach(c => {
    const b = $('.call__btn', c);
    b.addEventListener('click', e => {
      e.stopPropagation();
      const open = !c.classList.contains('is-open');
      closeCalls(c);
      c.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', () => closeCalls());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCalls(); });

  /* ============ Анімація появи + лічильники ============ */
  document.documentElement.classList.remove('no-js');
  const fmt = n => n.toLocaleString('uk-UA');

  function countUp(el) {
    const target = Number(el.dataset.count);
    const dur = 1400;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(target * eased);
      el.textContent = el.hasAttribute('data-plain') ? String(v) : fmt(v);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = $$('.reveal');

  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
    $$('[data-count]').forEach(el => { el.textContent = el.hasAttribute('data-plain') ? el.dataset.count : fmt(Number(el.dataset.count)); });
  }
})();
