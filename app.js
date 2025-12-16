const state = {
  view: 'login',
  history: [],
  user: null,
  favorites: [],
  selectedCategory: 'Car detailing',
  search: '',
  selectedService: null,
  params: {}
};

const categories = [
  'Car detailing',
  'Warsztat samochodowy',
  'Wymiana opon',
  'Rent a car'
];

const services = categories.flatMap((cat, idx) => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${cat}-${i + 1}`,
    category: cat,
    name: `${cat} #${i + 1}`,
    location: ['Kraków', 'Warszawa', 'Gdańsk', 'Poznań'][i % 4],
    price: 200 + (i * 8) + idx * 20,
    rating: (4.3 + (i % 3) * 0.2).toFixed(1),
    desc: 'Usługa dopasowana do Twojego auta, zgodnie z makietą.',
    short: ['Czyszczenie', 'Diagnostyka', 'Pakiet premium', 'Express'][i % 4]
  }));
});

const cars = Array.from({ length: 20 }).map((_, i) => ({
  id: `car-${i + 1}`,
  model: ['BMW M3 Competition xDrive sport', 'Porsche 911 Turbo', 'Audi RS6', 'Mercedes-AMG GT', 'Cupra Formentor'][i % 5],
  year: 2019 + (i % 6),
  mileage: 12000 + i * 3200,
  price: 180000 + i * 15000,
  city: ['Kraków', 'Warszawa', 'Gdynia', 'Wrocław'][i % 4],
  contact: `7${i}2 33 4${i}6`,
  badge: ['Sprzedaj samochód', 'Wartość pojazdu', 'Okazja'][i % 3]
}));

const visits = [
  { date: '11 stycznia', company: 'Kuro Detailing', type: 'Czyszczenie wnętrza' },
  { date: '3 marca', company: 'KaizenRent', type: 'Wynajem samochodu' },
  { date: '23 kwietnia', company: 'Porsche Centrum', type: 'Diagnostyka' }
];

function $(selector) { return document.querySelector(selector); }

function navigate(view, params = {}) {
  if (state.view !== view) {
    state.history.push(state.view);
  }
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

function renderLogin() {
  return `
    <div class="app-shell login-bg">
      <div class="logo-floating">WS</div>
      <div class="login-card">
        <input class="input" placeholder="email lub login" id="login-email" />
        <input class="input" placeholder="hasło" type="password" id="login-pass" />
        <p class="small-note" id="forgot">Nie pamiętam hasła</p>
        <button class="button" id="btn-login">Zaloguj się</button>
        <button class="button ghost" id="btn-register">Zarejestruj się</button>
        <div class="divider"></div>
        <button class="button ghost" id="btn-apple"> Dołącz przez Apple</button>
        <button class="button ghost" id="btn-google">Dołącz przez Google</button>
        <button class="button ghost" id="btn-company">WS · Stwórz profil dla twojej firmy</button>
      </div>
    </div>`;
}

function renderHome() {
  return `
    <div class="app-shell">
      <div class="hero-top">
        <div class="brand-row">
          <div class="logo">WS</div>
          <div class="crest">Porsche</div>
        </div>
        <div class="owner">KACPER WIĘZEK</div>
        <div class="owner-sub">PORSCHE 911</div>
      </div>
      <div class="menu-circle-grid">
        ${[
          { nav: 'panel', icon: '🧭', label: 'Panel' },
          { nav: 'opinie', icon: '💬', label: 'Opinie' },
          { nav: 'visits', icon: '📅', label: 'Wizyty' },
          { nav: 'rate', icon: '⭐', label: 'Oceń nas' },
          { nav: 'privacy', icon: '🛡️', label: 'Ustawienia prywatności' },
          { nav: 'settings', icon: '⚙️', label: 'Ustawienia' }
        ].map(item => `
          <div class="circle-btn" data-nav="${item.nav}">
            <div class="menu-icon">${item.icon}</div>
            <span>${item.label}</span>
          </div>`).join('')}
      </div>
      <button class="button ghost" id="logout" style="margin:20px;">Wyloguj się</button>
      ${renderBottomNav('home')}
    </div>`;
}

function renderPanel() {
  return `
    <div class="app-shell">
      <div class="hero-profile">
        <div class="logo">WS</div>
        <div class="tagline">HISTORIA NAPRAW · ULUBIONE MIEJSCA</div>
        <div class="car-hero">PORSCHE 911 TURBO</div>
        <div class="badge-row"><span class="badge">22'</span><span class="badge">Ocena 3.7</span></div>
      </div>
      <div class="section scrollable" style="padding:20px;">
        <div class="profile-card">
          <div class="profile-row"><span>Twoje dane</span><span>Kacper Więżek</span></div>
          <div class="profile-row"><span>Nr. kontaktowy</span><span>797-232-312</span></div>
          <div class="profile-row"><span>E-mail</span><span>kacper.wiezek@gmail.com</span></div>
          <div class="button-group">
            <button class="button mini" data-nav="visits">Twoje wizyty</button>
            <button class="button mini ghost" data-nav="opinie">Opinie</button>
            <button class="button mini ghost" data-nav="services">Karty podarunkowe</button>
            <button class="button mini ghost" data-nav="market">Dodaj nowy pojazd</button>
            <button class="button mini ghost" data-nav="help">Pomoc</button>
          </div>
        </div>
      </div>
      ${renderBottomNav('panel')}
    </div>`;
}

function renderOpinie() {
  return `
    <div class="app-shell">
      <div class="header-bar"><div class="logo">WS</div><div class="pill">Feedback</div></div>
      <div class="section scrollable">
        <div class="empty-state glass-card">
          <div class="title-xl">W rozwoju</div>
          <p class="tagline">Pozdrawiamy! Zespół pracuje nad modułem opinii.</p>
        </div>
      </div>
      ${renderBottomNav('opinie')}
    </div>`;
}

function renderVisits() {
  return `
    <div class="app-shell">
      <div class="hero-top alt">
        <div class="logo">WS</div>
        <div class="history-title">TWOJA HISTORIA</div>
        <div class="history-years">2025 · 2024 · 2023 · 2022 · 2021 · 2020 · 2019</div>
        <div class="title-xl" style="margin-top:10px;">Kalendarz</div>
      </div>
      <div class="section scrollable" style="padding:20px;">
        <div class="timeline">
          ${visits.map(v => `
            <div class="timeline-card">
              <div class="timeline-date">${v.date} 2025</div>
              <div class="timeline-body">
                <div class="timeline-logo">WS</div>
                <div>
                  <div class="timeline-company">${v.company}</div>
                  <div class="muted">Rodzaj usługi: ${v.type}</div>
                </div>
              </div>
            </div>
          `).join('')}
          <div class="chip" style="margin-top:10px;">Więcej</div>
        </div>
      </div>
      ${renderBottomNav('visits')}
    </div>`;
}

function renderRate() {
  const rating = state.params?.rating || 0;
  return `
    <div class="app-shell">
      <div class="header-bar"><div class="logo">WS</div><div class="pill">Oceń nas</div></div>
      <div class="section scrollable">
        <div class="glass-card" style="background:rgba(255,255,255,0.04);">
          <div class="title-xl">Oceń nas</div>
          <p class="tagline">Wyślij swoją opinię</p>
          <div class="star-row" id="stars">
            ${[1,2,3,4,5].map(i => `<span data-star="${i}" style="color:${i<=rating? '#f5d67b':'#555'}">★</span>`).join('')}
          </div>
          <textarea class="input" style="height:120px;" placeholder="Dodaj opis..." id="rate-msg"></textarea>
          <button class="button" id="btn-send-rate">Wyślij</button>
        </div>
      </div>
      ${renderBottomNav('rate')}
    </div>`;
}

function renderSettings() {
  return `
    <div class="app-shell">
      <div class="hero-settings">
        <div class="header-bar"><div class="logo">WS</div><div class="pill">Ustawienia</div></div>
        <div class="settings-actions">
          <button class="button ghost mini">Pomoc</button>
          <button class="button ghost mini">Włącz powiadomienia</button>
          <button class="button ghost mini">Tryb automatyczny (polski)</button>
          <button class="button ghost mini">Zmień hasło</button>
          <button class="button mini" data-nav="market">Dodaj nowy pojazd</button>
        </div>
        <div class="muted" style="margin-top:8px;">Połącz swoje konto</div>
        <div class="settings-links">
          <span>Połącz z Facebookiem</span>
          <span>Połącz z kontem Apple</span>
          <span>Połącz z kontem Google</span>
        </div>
      </div>
      ${renderBottomNav('settings')}
    </div>`;
}

function renderServicesMain() {
  const filtered = filteredServices().slice(0, 4);
  return `
    <div class="app-shell">
      <div class="hero-service">
        <div class="logo">WS</div>
        <div class="hero-meta">
          <div>Rocznik 22'</div>
          <div>Historia napraw</div>
          <div>Ocena 3.7</div>
        </div>
        <div class="hero-car-label">PORSCHE 911 TURBO</div>
      </div>
      <div class="section scrollable" style="padding:18px;">
        <div class="search-row">
          <div class="search-field" data-nav="search">🔍 Wyszukaj usługę</div>
          <div class="search-field" data-nav="visits">🗓️ Kiedy?</div>
          <div class="search-field" data-nav="filters">⚙️ Filtry</div>
        </div>
        <div class="category-grid">
          ${['Kup-Sprzedaj','Serwis','CarDetailing','Wynajem','Wulkanizacja'].map((c,i)=>`
            <div class="category-card" data-nav="${i===0?'market':'services'}">
              <span>${c}</span>
            </div>`).join('')}
        </div>
        <div class="section-title">Polecane oferty</div>
        <div class="promo-grid">
          <div class="promo-card">WS · Złap okazję i najniższe ceny</div>
          <div class="promo-card dark">Serwis potrzebny od zaraz</div>
        </div>
        <div class="card-list" style="margin-top:12px;">
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
          <div class="price">${service.name}</div>
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
  const cat = state.params?.category || categories[0];
  const list = services.filter(s => s.category === cat);
  return `
    <div class="app-shell">
      <div class="header-bar"><div class="logo">WS</div><div class="pill">${cat}</div></div>
      <div class="section scrollable" style="padding:18px;">
        <div class="card-list">${list.map(s => serviceCard(s)).join('')}</div>
      </div>
      ${renderBottomNav('category')}
    </div>`;
}

function renderBooking() {
  const service = services.find(s => s.id === state.params?.serviceId) || state.selectedService;
  state.selectedService = service;
  const selectedDay = state.params?.day || 12;
  const selectedTime = state.params?.time || '14:00';
  const days = Array.from({ length: 30 }).map((_, i) => i + 1);
  return `
    <div class="app-shell">
      <div class="booking-hero">
        <div class="logo">WS</div>
        <div class="contact-card">
          <div class="contact-row">Kontakt tel/mail</div>
          <div class="contact-row strong">730 903 907</div>
          <div class="contact-row">kurodetailing@gmail.com</div>
        </div>
      </div>
      <div class="section scrollable" style="padding:18px;">
        <div class="booking-grid">
          <div class="booking-left">
            <div class="company-title">Kuro Detailing</div>
            <p class="muted">Usługa detailingowa: od śr i serwis KURO DETAILING zlokalizowany pod adresem Daniela Chodowieckiego 37-6, 30-069 Kraków.</p>
            <div class="price-box"><span>ZA</span><strong>200 zł</strong></div>
            <div class="input ghost">Wybierz datę i godzinę</div>
            <div class="input ghost">Wybierz samochód</div>
            <div class="chip">Umów wizytę</div>
          </div>
          <div class="booking-right">
            <div class="calendar-head">STYCZEŃ 2025</div>
            <div class="calendar">
              ${days.slice(0,14).map(d => `<div class="day ${d===selectedDay?'selected':''}" data-day="${d}">${d}</div>`).join('')}
            </div>
            <div class="calendar-head" style="margin-top:6px;">Wybierz godzinę</div>
            <div class="time-grid">
              ${['09:00','12:00','14:00','15:00','17:00','19:00'].map(t => `<div class="time-slot ${t===selectedTime?'selected':''}" data-time="${t}">${t}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
      ${renderBottomNav('booking')}
    </div>`;
}

function renderMarketplace() {
  return `
    <div class="app-shell">
      <div class="market-hero">
        <div class="logo">WS</div>
        <div class="market-actions">
          <div class="pill">Sprzedaj samochód</div>
          <div class="pill">Sprawdź status</div>
          <div class="pill">Twoje ogłoszenia</div>
          <div class="pill">Ulubione miejsca</div>
        </div>
      </div>
      <div class="section scrollable" style="padding:16px;">
        <div class="search-row">
          <div class="search-field">Wyszukaj samochód</div>
          <div class="search-field">Dodaj samochód z poza</div>
          <div class="search-field">Zaawansowane wyszukiwanie</div>
        </div>
        <div class="chip-strip">${['Osobowe','SUV','Dostawcze','Motocykle','Zabytkowe'].map(c => `<span class="chip">${c}</span>`).join('')}</div>
        <div class="filters car-filters">
          ${['Marka','Model','Przebieg','Rok produkcji','Rodzaj paliwa'].map(f => `<div class="chip">${f}</div>`).join('')}
        </div>
        <div class="card-list">
          ${cars.slice(0,4).map(car => `
            <div class="car-card">
              <div class="car-header">
                <div class="thumb">${car.model.slice(0,2)}</div>
                <div style="flex:1;">
                  <div class="price">${car.model}</div>
                  <div class="muted">Rok ${car.year} · ${car.mileage} km · ${car.city}</div>
                </div>
                <div class="pill">${car.badge}</div>
              </div>
              <div class="muted">Cena: ${car.price.toLocaleString('pl-PL')} zł</div>
              <div class="muted">Kontakt: ${car.contact}</div>
            </div>`).join('')}
        </div>
      </div>
      ${renderBottomNav('market')}
    </div>`;
}

function renderFavorites() {
  const favServices = services.filter(s => state.favorites.includes(s.id));
  return `
    <div class="app-shell">
      <div class="header-bar"><div class="logo">WS</div><div class="pill">Ulubione</div></div>
      <div class="section scrollable" style="padding:18px;">
        ${favServices.length ? favServices.map(serviceCard).join('') : '<div class="empty-state">Brak ulubionych usług.</div>'}
      </div>
      ${renderBottomNav('favorites')}
    </div>`;
}

function renderSearch() {
  const list = filteredServices().slice(0, 8);
  return `
    <div class="app-shell">
      <div class="hero-search">
        <div class="logo">WS</div>
        <div class="hero-car-label">wyszukaj usługę</div>
      </div>
      <div class="section scrollable" style="padding:18px;">
        <input class="input" placeholder="Szukaj usługi" id="search-input" value="${state.search}">
        <div class="filters" style="margin-top:8px;">
          ${categories.map(cat => `<div class="chip ${cat===state.selectedCategory?'active':''}" data-cat="${cat}">${cat}</div>`).join('')}
        </div>
        <div class="card-list" style="margin-top:10px;">
          ${list.map(s => serviceCard(s)).join('')}
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
  return `
    <div class="bottom-nav">
      <div class="nav-btn" id="btn-back"><span class="nav-icon">↩</span><span>Wstecz</span></div>
      <div class="nav-btn ${active==='services'?'active':''}" data-nav="services"><span class="nav-icon">🚗</span><span>Usługi</span></div>
      <div class="nav-btn ${active==='search'?'active':''}" data-nav="search"><span class="nav-icon">🔍</span><span>Lupa</span></div>
      <div class="nav-btn ${active==='visits'?'active':''}" data-nav="visits"><span class="nav-icon">🗓️</span><span>Wizyty</span></div>
      <div class="nav-btn ${active==='favorites'?'active':''}" data-nav="favorites"><span class="nav-icon">❤</span><span>Ulubione</span></div>
      <div class="nav-btn ${active==='settings'?'active':''}" data-nav="settings"><span class="nav-icon">⚙️</span><span>Ustaw.</span></div>
    </div>`;
}

function bindEvents() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.onclick = () => {
      const nav = el.getAttribute('data-nav');
      if (nav === 'services-search') return navigate('search');
      if (nav === 'filters') return navigate('services');
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

  ['#btn-apple', '#btn-google', '#btn-company'].forEach(sel => {
    const btn = document.querySelector(sel);
    if (btn) btn.onclick = () => alert('Funkcja dostępna w pełnej wersji.');
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

  const searchInput = document.querySelector('#search-input');
  if (searchInput) searchInput.oninput = (e) => {
    state.search = e.target.value;
    render();
  };

  document.querySelectorAll('[data-cat]').forEach(el => {
    el.onclick = () => {
      state.selectedCategory = el.getAttribute('data-cat');
      render();
    };
  });

  document.querySelectorAll('[data-service]').forEach(el => {
    el.onclick = (e) => {
      if (e.target.getAttribute('data-fav')) return;
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

  document.querySelectorAll('[data-day]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      navigate('booking', { ...state.params, day: Number(el.getAttribute('data-day')) });
    };
  });

  document.querySelectorAll('[data-time]').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      navigate('booking', { ...state.params, time: el.getAttribute('data-time') });
    };
  });

  const stars = document.querySelectorAll('#stars span');
  stars.forEach(star => {
    star.onclick = () => {
      const val = Number(star.getAttribute('data-star'));
      navigate('rate', { rating: val });
    };
  });
}

window.addEventListener('DOMContentLoaded', () => {
  render();
});
