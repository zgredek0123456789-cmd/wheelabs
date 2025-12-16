const state = {
  view: 'login',
  history: [],
  user: null,
  search: '',
  selectedCategory: 'CarDetailing',
  favorites: [],
  selectedService: null,
  rating: 0,
};

const categories = [
  { key: 'market', label: 'Kup-Sprzedaj', icon: '🛒' },
  { key: 'Serwis', label: 'Serwis', icon: '🛠️' },
  { key: 'CarDetailing', label: 'CarDetailing', icon: '✨' },
  { key: 'Wynajem', label: 'Wynajem', icon: '🚙' },
  { key: 'Wulkanizacja', label: 'Wulkanizacja', icon: '🛞' },
];

const services = [
  { id: 'kuro', name: 'Kuro Detailing', location: 'Kraków', category: 'CarDetailing', price: 200, rating: '4.9', short: 'Polerowanie', contact: '730 903 907' },
  { id: 'kaizen', name: 'KaizenRent', location: 'Kraków', category: 'Wynajem', price: 320, rating: '4.7', short: 'Wynajem', contact: '797 532 312' },
  { id: 'porsche', name: 'Porsche Centrum', location: 'Warszawa', category: 'Serwis', price: 480, rating: '4.8', short: 'Diagnostyka', contact: '22 450 901' },
  { id: 'renocar', name: 'Reno Car', location: 'Łódź', category: 'Wulkanizacja', price: 190, rating: '4.6', short: 'Opony', contact: '507 011 009' },
];

while (services.length < 40) {
  const idx = services.length + 1;
  const cat = categories[(idx % categories.length)].key;
  services.push({
    id: `svc-${idx}`,
    name: `${cat} Usługa #${idx}`,
    location: ['Kraków', 'Warszawa', 'Gdańsk', 'Poznań'][idx % 4],
    category: cat,
    price: 200 + (idx * 7) % 150,
    rating: (4 + (idx % 10) * 0.05).toFixed(1),
    short: ['Pakiet', 'Premium', 'Express', 'Detail'][idx % 4],
    contact: `7${idx}0 90${idx % 10} ${900 + idx}`,
  });
}

const cars = Array.from({ length: 20 }).map((_, i) => ({
  id: `car-${i+1}`,
  model: ['BMW M3 Competition xDrive', 'Porsche 911 Turbo', 'Cupra Formentor', 'Audi RS6', 'Mercedes-AMG GT'][i % 5],
  year: 2020 + (i % 4),
  mileage: 12000 + i * 4000,
  price: 180000 + i * 20000,
  city: ['Kraków', 'Warszawa', 'Gdynia', 'Wrocław'][i % 4],
  contact: `+48 79${i} 312 0${i}${i}`,
  badge: ['Super okazja', 'Top stan', 'Okazja!'][i % 3],
  trim: ['3.0', '4.0', '2.0 TSI', '4.0 V8'][i % 4],
  image: `https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=${800 + i * 5}&q=70`
}));

const visits = [
  { date: '11 stycznia 2025', company: 'Kuro Detailing', type: 'Czyszczenie wnętrza' },
  { date: '3 marca 2025', company: 'KaizenRent', type: 'Wynajem samochodu' },
  { date: '23 kwietnia 2025', company: 'Porsche Centrum', type: 'Diagnostyka' },
  { date: '30 czerwca 2025', company: 'WS Service', type: 'Przegląd' }
];

function $(selector) { return document.querySelector(selector); }

function navigate(view, params = {}) {
  if (state.view !== view) state.history.push(state.view);
  state.view = view;
  state.params = params;
  render();
}

function goBack() {
  const prev = state.history.pop();
  if (prev) {
    state.view = prev;
    render();
  }
}

function toggleFavorite(id) {
  const exists = state.favorites.includes(id);
  state.favorites = exists ? state.favorites.filter(x => x !== id) : [...state.favorites, id];
  render();
}

function filteredServices() {
  return services.filter(s =>
    (!state.search || s.name.toLowerCase().includes(state.search.toLowerCase())) &&
    (!state.selectedCategory || s.category === state.selectedCategory)
  );
}

function wsLogo() {
  return `<div class="logo-text">WS</div>`;
}

function header(title, badge = '') {
  return `
    <div class="header">
      ${wsLogo()}
      ${badge ? `<div class="badge">${badge}</div>` : ''}
    </div>`;
}

function renderLogin() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      <div class="hero-centered">
        <div class="splash-logo">WS</div>
      </div>
      <div class="section" style="padding-top:12px;">
        <div class="glass-card">
          <input class="input" placeholder="email lub login" id="login-email" />
          <input class="input" placeholder="hasło" type="password" id="login-pass" />
          <p class="small-note" id="forgot">Nie pamiętam hasła</p>
          <button class="button" id="btn-login">Zaloguj się</button>
          <button class="button secondary" id="btn-register">Zarejestruj się</button>
          <div class="small-note" style="margin-top:10px;">lub</div>
          <button class="button secondary" id="btn-firm">WS · Stwórz profil dla twojej firmy</button>
          <button class="button ghost" id="btn-apple"> Dołącz przez Apple</button>
          <button class="button ghost" id="btn-google">Dołącz przez Google</button>
        </div>
      </div>
    </div>`;
}

function renderHome() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('', '')}
      <div class="section">
        <div class="profile-header">
          <div>
            <div class="logo-text">WS</div>
            <div class="muted" style="margin-top:6px;">KACPER WIĘZEK</div>
            <div class="title-xl">Porsche 911</div>
          </div>
          <div class="badge">Historia napraw · 3.7</div>
        </div>
        <div class="hero-car" style="margin:14px 0 6px;">
          <img src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1100&q=70" alt="Porsche" />
          <div class="progress-dots"><span class="active"></span><span></span><span></span></div>
        </div>
        <div class="menu-grid">
          <div class="menu-item" data-nav="panel"><div class="menu-icon">🧭</div>Panel</div>
          <div class="menu-item" data-nav="opinie"><div class="menu-icon">💬</div>Opinie</div>
          <div class="menu-item" data-nav="visits"><div class="menu-icon">📅</div>Wizyty</div>
          <div class="menu-item" data-nav="rate"><div class="menu-icon">⭐⭐⭐</div>Oceń nas</div>
          <div class="menu-item" data-nav="privacy"><div class="menu-icon">🛡️</div>Ustawienia prywatności</div>
          <div class="menu-item" data-nav="settings"><div class="menu-icon">⚙️</div>Ustawienia</div>
        </div>
        <button class="button secondary" id="logout" style="margin-top:20px;">Wyloguj się</button>
      </div>
      ${renderBottomNav('home')}
    </div>`;
}

function renderPanel() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Panel', 'Ulubione miejsca')}
      <div class="section">
        <div class="glass-card">
          <div class="profile-header">
            <div>
              <div class="muted">Rocznik 22' · Silnik 3.7</div>
              <div class="profile-title">PORSCHE 911 TURBO</div>
              <div class="muted">Historia napraw</div>
            </div>
            <div class="tag-strong">Ulubione miejsca</div>
          </div>
          <div class="divider"></div>
          <div class="settings-card">
            <div class="menu-item" data-nav="settings"><div class="menu-icon">👤</div>Twoje dane</div>
            <div class="menu-item" data-nav="visits"><div class="menu-icon">📅</div>Twoje wizyty</div>
            <div class="menu-item" data-nav="opinie"><div class="menu-icon">💬</div>Opinie</div>
            <div class="menu-item" data-nav="services"><div class="menu-icon">🎁</div>Karty podarunkowe</div>
            <div class="menu-item" data-nav="market"><div class="menu-icon">➕</div>Dodaj nowy pojazd</div>
            <div class="menu-item" data-nav="help"><div class="menu-icon">❔</div>Pomoc</div>
          </div>
        </div>
      </div>
      ${renderBottomNav('panel')}
    </div>`;
}

function renderOpinie() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Opinie', 'W rozwoju')}
      <div class="section">
        <div class="empty-state glass-card">
          <div class="title-xl">W rozwoju</div>
          <p class="muted">Pozdrawiamy! Zespół Wheelabs pracuje nad tym modułem.</p>
        </div>
      </div>
      ${renderBottomNav('opinie')}
    </div>`;
}

function renderVisits() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Twoja historia', '')}
      <div class="section">
        <div class="list-inline" style="justify-content: center; margin-bottom: 8px;">
          ${['2025','2024','2023','2022','2021','2020','2019'].map(y => `<div class="chip ${y==='2025'?'active':''}">${y}</div>`).join('')}
        </div>
        <div class="card-list">
          ${visits.map(v => `
            <div class="timeline-item">
              <div class="timeline-badge">${v.date}</div>
              <div style="font-weight:800; margin-top:8px;">${v.company}</div>
              <div class="muted">Rodzaj usługi: ${v.type}</div>
            </div>
          `).join('')}
          <button class="button secondary" data-nav="visits">Więcej</button>
        </div>
      </div>
      ${renderBottomNav('visits')}
    </div>`;
}

function renderRate() {
  const rating = state.rating || state.params?.rating || 0;
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Oceń nas', '')}
      <div class="section">
        <div class="glass-card" style="background: linear-gradient(170deg, rgba(255,255,255,0.08), rgba(0,0,0,0.75));">
          <div class="title-xl">Oceń nas</div>
          <p class="tagline muted">Wyślij swoją opinię</p>
          <div class="star-row" id="stars">
            ${[1,2,3,4,5].map(i => `<span data-star="${i}" style="font-size:28px; color:${i<=rating? '#f5d67b':'#777'}">★</span>`).join('')}
          </div>
          <textarea class="input" style="height:140px;" placeholder="Dodaj opis..." id="rate-msg"></textarea>
          <button class="button" id="btn-send-rate">Wyślij</button>
        </div>
      </div>
      ${renderBottomNav('rate')}
    </div>`;
}

function renderSettings() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Ustawienia konta', '')}
      <div class="section">
        <div class="settings-card glass-card">
          <button class="button secondary">Pomoc</button>
          <button class="button secondary">Włącz powiadomienia</button>
          <button class="button secondary">Język: Automatycznie (polski)</button>
          <button class="button secondary">Zmień hasło</button>
          <button class="button secondary">Dodaj nowy pojazd</button>
          <div class="phone-preview">
            <div class="muted">Połącz swoje konto</div>
            <div class="list-inline">
              <div class="chip">Facebook</div>
              <div class="chip">Apple</div>
              <div class="chip">Google</div>
            </div>
            <div class="divider"></div>
            <div class="title-xl">Włącz weryfikację dwuetapową</div>
            <div class="muted">Zwiększ bezpieczeństwo i bądź zawsze na bieżąco z planowanymi wizytami.</div>
            <button class="button secondary">Rozpocznij</button>
          </div>
        </div>
      </div>
      ${renderBottomNav('settings')}
    </div>`;
}

function renderServicesMain() {
  const filtered = filteredServices().slice(0, 8);
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Zadbaj o samochód', 'Historia napraw · Ulubione miejsca')}
      <div class="section">
        <div class="hero-car" style="align-items:flex-start;">
          <div class="badge-ghost">Rocznik 22' · Silnik 3.7</div>
          <div class="title-xl">PORSCHE 911 TURBO</div>
          <div class="muted">Zadbaj o swój samochód</div>
        </div>
        <div class="filters">
          <input class="input" style="flex:1;" placeholder="Wyszukaj usługę" id="search-input" value="${state.search}">
          <div class="chip" data-nav="search">🔍 Lupa</div>
          <div class="chip" data-nav="visits">Kiedy?</div>
          <div class="chip" data-nav="filters">Filtry</div>
        </div>
        <div class="filters" style="margin-top:8px;">
          ${categories.map(cat => `<div class="chip ${cat.key===state.selectedCategory?'active':''}" data-cat="${cat.key}">${cat.label}</div>`).join('')}
        </div>
        <div class="banner-grid">
          <div class="banner">Złap okazję! Zniżki na CarDetailing</div>
          <div class="banner">Serwis potrzebny od zaraz</div>
        </div>
        <div class="card-list">
          ${filtered.map(s => serviceCard(s)).join('')}
        </div>
      </div>
      ${renderBottomNav('services')}
    </div>`;
}

function serviceCard(service) {
  const fav = state.favorites.includes(service.id);
  return `
    <div class="service-card" data-service="${service.id}">
      <div class="service-header">
        <div class="thumb">${service.name.slice(0,2).toUpperCase()}</div>
        <div style="flex:1;">
          <div style="font-weight:700;">${service.name}</div>
          <div class="muted">${service.location} · ${service.category}</div>
        </div>
        <div class="chip" data-fav="${service.id}">${fav ? '❤' : '♡'}</div>
      </div>
      <div class="grid-3">
        <div><div class="muted">Cena</div><div class="price">${service.price} zł</div></div>
        <div><div class="muted">Ocena</div><div class="price">${service.rating}</div></div>
        <div><div class="muted">Pakiet</div><div class="price">${service.short}</div></div>
      </div>
      <button class="button secondary" data-book="${service.id}">Umów wizytę</button>
    </div>`;
}

function renderCategoryListing() {
  const cat = state.params?.category || state.selectedCategory;
  const list = services.filter(s => s.category === cat).slice(0, 20);
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header(cat, 'Usługi')}
      <div class="section">
        <div class="card-list">${list.map(serviceCard).join('')}</div>
      </div>
      ${renderBottomNav('category')}
    </div>`;
}

function renderBooking() {
  const service = services.find(s => s.id === state.params?.serviceId) || state.selectedService || services[0];
  state.selectedService = service;
  const selectedDay = state.params?.day || 14;
  const selectedTime = state.params?.time || '14:00';
  const days = Array.from({ length: 30 }).map((_, i) => i + 1);
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header(service.name, service.category)}
      <div class="section">
        <div class="glass-card">
          <div class="title-xl" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Usługa</span><span class="chip">Za ${service.price} zł</span>
          </div>
          <div class="muted">${service.location} · ${service.category}</div>
          <div class="divider"></div>
          <div class="contact-grid">
            <div>Kontakt tel/mail</div><div>${service.contact}</div>
            <div>E-mail</div><div>${service.name.toLowerCase().replace(/\s/g,'.')}@mail.com</div>
          </div>
          <div class="divider"></div>
          <div class="list-inline">
            <div class="chip">Styczeń 2025</div>
            <div class="chip">Luty</div>
          </div>
          <div class="calendar">
            ${days.map(d => `<div class="day ${d===selectedDay?'selected':''}" data-day="${d}">${d}</div>`).join('')}
          </div>
          <div class="divider"></div>
          <div class="muted">Wybierz datę i godzinę</div>
          <div class="time-grid">
            ${['10:00','12:00','14:00','16:00','18:00','20:00'].map(t => `<div class="time-slot ${t===selectedTime?'selected':''}" data-time="${t}">${t}</div>`).join('')}
          </div>
          <div class="divider"></div>
          <div class="card-list">
            ${services.slice(0,3).map(s => `<div class="service-header" style="padding:8px 0;">
              <div class="thumb">${s.name.slice(0,2)}</div>
              <div style="flex:1;">
                <div style="font-weight:700;">${s.name}</div>
                <div class="muted">${s.location}</div>
              </div>
              <div class="chip">${s.price} zł</div>
            </div>`).join('')}
          </div>
          <button class="button" id="btn-book">Umów wizytę</button>
          <div class="small-note">To Twoja pierwsza rezerwacja w tym miejscu</div>
        </div>
      </div>
      ${renderBottomNav('booking')}
    </div>`;
}

function renderMarketplace() {
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Twoje ogłoszenia', '')}
      <div class="section">
        <div class="filters">
          <div class="chip active">Osobowe</div>
          <div class="chip">Dostawcze</div>
          <div class="chip">SUV</div>
          <div class="chip">Sport</div>
        </div>
        <div class="market-filters">
          <div class="chip">Marka</div>
          <div class="chip">Model</div>
          <div class="chip">Przebieg</div>
          <div class="chip">Rok produkcji</div>
        </div>
        <div class="card-list">
          ${cars.map(c => `
            <div class="car-card">
              <div class="car-header">
                <div class="thumb">${c.model.slice(0,2)}</div>
                <div style="flex:1;">
                  <div style="font-weight:700;">${c.model}</div>
                  <div class="muted">${c.city} · ${c.year}</div>
                </div>
                <div class="chip">${c.badge}</div>
              </div>
              <div class="divider"></div>
              <div class="car-meta">
                <span>Przebieg: ${c.mileage.toLocaleString('pl-PL')} km</span>
                <span>Silnik: ${c.trim}</span>
                <span>Cena: ${c.price.toLocaleString('pl-PL')} zł</span>
              </div>
              <div class="divider"></div>
              <button class="button secondary" data-contact="${c.contact}">Kontakt: ${c.contact}</button>
            </div>
          `).join('')}
        </div>
      </div>
      ${renderBottomNav('market')}
    </div>`;
}

function renderFavorites() {
  const favs = services.filter(s => state.favorites.includes(s.id));
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Ulubione', '')}
      <div class="section">
        ${favs.length ? `<div class="card-list">${favs.map(serviceCard).join('')}</div>` : `<div class="empty-state glass-card">Brak ulubionych usług.</div>`}
      </div>
      ${renderBottomNav('favorites')}
    </div>`;
}

function renderSearch() {
  const list = filteredServices();
  return `
    <div class="app-shell">
      <div class="overlay-dark"></div>
      ${header('Usługi', '911 TURBO')}
      <div class="section">
        <div class="hero-car" style="align-items:flex-start;">
          <div class="badge-ghost">Ulubione miejsca</div>
          <div class="title-xl">Wyszukaj usługę</div>
        </div>
        <input class="input" placeholder="Szukaj usługi" id="search-input" value="${state.search}">
        <div class="filters" style="margin-top:8px;">
          ${categories.map(cat => `<div class="chip ${cat.key===state.selectedCategory?'active':''}" data-cat="${cat.key}">${cat.label}</div>`).join('')}
        </div>
        <div class="card-list" style="margin-top:12px;">
          ${list.map(serviceCard).join('')}
        </div>
      </div>
      ${renderBottomNav('search')}
    </div>`;
}

function render(view = state.view) {
  let html = '';
  switch(view) {
    case 'login': html = renderLogin(); break;
    case 'home': html = renderHome(); break;
    case 'panel': html = renderPanel(); break;
    case 'opinie': html = renderOpinie(); break;
    case 'visits': html = renderVisits(); break;
    case 'rate': html = renderRate(); break;
    case 'settings': html = renderSettings(); break;
    case 'services': html = renderServicesMain(); break;
    case 'category': html = renderCategoryListing(); break;
    case 'booking': html = renderBooking(); break;
    case 'market': html = renderMarketplace(); break;
    case 'favorites': html = renderFavorites(); break;
    case 'search': html = renderSearch(); break;
    default: html = renderHome();
  }
  document.querySelector('#app').innerHTML = html;
  bindEvents();
}

function renderBottomNav(active) {
  const navs = [
    { key: 'back', label: 'Wstecz', icon: '↩', action: 'back' },
    { key: 'services', label: 'Usługi', icon: '🚗' },
    { key: 'search', label: 'Lupa', icon: '🔍' },
    { key: 'visits', label: 'Wizyty', icon: '🗓️' },
    { key: 'favorites', label: 'Ulubione', icon: '❤' },
    { key: 'settings', label: 'Ustaw.', icon: '⚙️' },
  ];
  return `
    <div class="bottom-nav">
      ${navs.map(n => `
        <div class="nav-btn ${active===n.key?'active':''}" ${n.action==='back' ? 'id="btn-back"' : `data-nav="${n.key}"`}>
          <span class="nav-icon">${n.icon}</span>
          <span>${n.label}</span>
        </div>`).join('')}
    </div>`;
}

function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.onclick = () => {
      const nav = el.getAttribute('data-nav');
      if (nav === 'services-search') return navigate('search');
      if (nav === 'filters') return navigate('services');
      if (nav === 'privacy') return alert('Moduł prywatności w przygotowaniu.');
      navigate(nav);
    };
  });

  const back = document.querySelector('#btn-back');
  if (back) back.onclick = () => goBack();

  const login = document.querySelector('#btn-login');
  if (login) login.onclick = () => {
    const email = document.querySelector('#login-email').value;
    const pass = document.querySelector('#login-pass').value;
    if (email && pass) {
      state.user = { email };
      state.history = [];
      navigate('home');
    }
  };

  const forgot = document.querySelector('#forgot');
  if (forgot) forgot.onclick = () => alert('Opcja resetu hasła w przygotowaniu.');

  ['#btn-apple', '#btn-google', '#btn-firm'].forEach(sel => {
    const btn = document.querySelector(sel);
    if (btn) btn.onclick = () => alert('Dostępne w pełnej wersji.');
  });

  const register = document.querySelector('#btn-register');
  if (register) register.onclick = () => {
    const email = document.querySelector('#login-email').value || 'nowy@user.com';
    state.user = { email };
    state.history = [];
    navigate('home');
  };

  const logout = document.querySelector('#logout');
  if (logout) logout.onclick = () => {
    state.user = null;
    state.history = [];
    navigate('login');
  };

  document.querySelectorAll('[data-cat]').forEach(el => {
    el.onclick = () => {
      state.selectedCategory = el.getAttribute('data-cat');
      render();
    };
  });

  document.querySelectorAll('[data-service]').forEach(el => {
    el.onclick = (e) => {
      if (e.target.getAttribute('data-fav') || e.target.getAttribute('data-book')) return;
      navigate('booking', { serviceId: el.getAttribute('data-service') });
    };
  });

  document.querySelectorAll('[data-fav]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(el.getAttribute('data-fav'));
    };
  });

  document.querySelectorAll('[data-book]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      navigate('booking', { serviceId: el.getAttribute('data-book') });
    };
  });

  document.querySelectorAll('[data-contact]').forEach(el => {
    el.onclick = () => alert(`Kontakt do właściciela: ${el.getAttribute('data-contact')}`);
  });

  const searchInput = document.querySelector('#search-input');
  if (searchInput) searchInput.oninput = (e) => { state.search = e.target.value; render(); };

  document.querySelectorAll('.day').forEach(el => {
    el.onclick = () => navigate('booking', { serviceId: state.selectedService?.id, day: Number(el.getAttribute('data-day')), time: state.params?.time || '14:00' });
  });

  document.querySelectorAll('.time-slot').forEach(el => {
    el.onclick = () => navigate('booking', { serviceId: state.selectedService?.id, day: state.params?.day || 14, time: el.getAttribute('data-time') });
  });

  const book = document.querySelector('#btn-book');
  if (book) book.onclick = () => { alert('Rezerwacja zapisana!'); navigate('visits'); };

  document.querySelectorAll('[data-star]').forEach(el => {
    el.onclick = () => { state.rating = Number(el.getAttribute('data-star')); navigate('rate', { rating: state.rating }); };
  });

  const sendRate = document.querySelector('#btn-send-rate');
  if (sendRate) sendRate.onclick = () => { alert('Dziękujemy za opinię!'); navigate('home'); };
}

render();
