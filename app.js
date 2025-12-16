const state = {
  view: 'login',
  history: [],
  user: null,
  favorites: [],
  selectedCategory: 'Car detailing',
  search: '',
  selectedService: null,
};

const categories = [
  'Car detailing',
  'Warsztat samochodowy',
  'Wymiana opon',
  'Rent a car'
];

const services = categories.flatMap((cat, idx) => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${cat}-${i+1}`,
    category: cat,
    name: `${cat} #${i + 1}`,
    location: ['Kraków', 'Warszawa', 'Gdańsk', 'Poznań'][i % 4],
    price: 150 + (i * 10) + idx * 20,
    rating: (4 + (i % 2) * 0.3).toFixed(1),
    desc: 'Profesjonalna usługa dopasowana do Twojego auta.',
    short: ['Czyszczenie', 'Diagnostyka', 'Pakiet premium', 'Express'][i % 4]
  }));
});

const cars = Array.from({ length: 20 }).map((_, i) => ({
  id: `car-${i+1}`,
  model: ['BMW M3', 'Porsche 911 Turbo', 'Audi RS6', 'Mercedes-AMG GT', 'Corvette C8'][i % 5],
  year: 2015 + (i % 9),
  mileage: 20000 + i * 4500,
  price: 100000 + i * 15000,
  city: ['Kraków', 'Warszawa', 'Gdynia', 'Wrocław'][i % 4],
  contact: `+48 7${i}2 33 4${i}6`,
  badge: ['Super okazja', 'Nowość', 'Top stan'][i % 3]
}));

const visits = [
  { date: '11 stycznia 2025', company: 'Kuro Detailing', type: 'Czyszczenie wnętrza' },
  { date: '3 marca 2025', company: 'KaizenRent', type: 'Wynajem samochodu' },
  { date: '23 kwietnia 2025', company: 'Porsche Centrum', type: 'Diagnostyka' }
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
    <div class="app-shell">
      <div class="section" style="padding-top:60px;">
        <div class="hero-car" style="gap:10px; position:relative;">
          <img class="floating-car" src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60" alt="911" />
          <div class="logo">WS</div>
          <div class="title-xl" style="margin-top:6px;">Nie pamiętam hasła</div>
          <p class="muted">Zaloguj się, aby kontynuować</p>
          <div class="progress-dots"><span class="active"></span><span></span><span></span></div>
        </div>
        <div class="glass-card" style="margin-top:24px;">
          <input class="input" placeholder="email lub login" id="login-email" />
          <input class="input" placeholder="hasło" type="password" id="login-pass" />
          <p class="small-note" id="forgot">Nie pamiętam hasła</p>
          <button class="button" id="btn-login">Zaloguj się</button>
          <button class="button secondary" id="btn-apple"> Dołącz przez Apple</button>
          <button class="button secondary" id="btn-google">Dołącz przez Google</button>
          <button class="button secondary" id="btn-register">Stwórz konto</button>
        </div>
      </div>
    </div>`;
}

function renderHome() {
  return `
    <div class="app-shell">
      <div class="header">
        <div class="logo">WS</div>
        <div class="pill-info">
          <div>
            <div style="font-size:12px;color:var(--muted);">Kacper Więzek</div>
            <div style="font-weight:700;">Porsche 911</div>
          </div>
          <span class="badge">Rocznik 22'</span>
        </div>
      </div>
      <div class="hero-car" style="position:relative;">
        <img alt="Porsche" src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60" />
        <div class="progress-dots"><span class="active"></span><span></span><span></span></div>
      </div>
      <div class="section scrollable">
        <div class="menu-grid">
          <div class="menu-item" data-nav="panel"><div class="menu-icon">🧭</div>Panel</div>
          <div class="menu-item" data-nav="opinie"><div class="menu-icon">💬</div>Opinie</div>
          <div class="menu-item" data-nav="visits"><div class="menu-icon">📅</div>Wizyty</div>
          <div class="menu-item" data-nav="rate"><div class="menu-icon">⭐</div>Oceń nas</div>
          <div class="menu-item" data-nav="privacy"><div class="menu-icon">🛡️</div>Ustawienia prywatności</div>
          <div class="menu-item" data-nav="settings"><div class="menu-icon">⚙️</div>Ustawienia</div>
        </div>
        <button class="button secondary" id="logout">Wyloguj się</button>
      </div>
      ${renderBottomNav('home')}
    </div>`;
}

function renderPanel() {
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">Ulubione miejsca</div></div>
    <div class="hero-car">
      <img alt="Porsche" src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60" />
      <div style="margin-top:8px;">
        <div style="font-size:20px;font-weight:700;">Porsche 911 Turbo</div>
        <div class="tagline">Historia napraw · Ocena 3.7</div>
      </div>
    </div>
    <div class="section scrollable">
      <div class="glass-card" style="display:grid;gap:12px;">
        <div class="menu-item" data-nav="settings"><div class="menu-icon">👤</div>Twoje dane</div>
        <div class="menu-item" data-nav="visits"><div class="menu-icon">📌</div>Twoje wizyty</div>
        <div class="menu-item" data-nav="opinie"><div class="menu-icon">💬</div>Opinie</div>
        <div class="menu-item" data-nav="services"><div class="menu-icon">🎁</div>Karty podarunkowe</div>
        <div class="menu-item" data-nav="market"><div class="menu-icon">➕</div>Dodaj nowy pojazd</div>
        <div class="menu-item" data-nav="help"><div class="menu-icon">❔</div>Pomoc</div>
      </div>
    </div>
    ${renderBottomNav('panel')}
  </div>`;
}

function renderOpinie() {
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">Feedback</div></div>
    <div class="section scrollable">
      <div class="empty-state glass-card">
        <div class="title-xl">W rozwoju</div>
        <p class="tagline">Pozdrawiamy! Zespół Wheelabs pracuje nad tym modułem.</p>
      </div>
    </div>
    ${renderBottomNav('opinie')}
  </div>`;
}

function renderVisits() {
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">Twoja historia</div></div>
    <div class="section scrollable">
      <div class="section-title">
        <div>
          <div class="muted">2025</div>
          <div class="title-xl">Kalendarz</div>
        </div>
        <div class="chip">Więcej</div>
      </div>
      <div class="card-list">
        ${visits.map(v => `
          <div class="timeline-item">
            <div class="badge">${v.date}</div>
            <div style="font-weight:700;margin-top:6px;">${v.company}</div>
            <div class="muted">Rodzaj usługi: ${v.type}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ${renderBottomNav('visits')}
  </div>`;
}

function renderRate() {
  const rating = state.params?.rating || 0;
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">Oceń nas</div></div>
    <div class="section scrollable">
      <div class="glass-card" style="background:linear-gradient(170deg, rgba(255,255,255,0.06), rgba(10,10,10,0.75));">
        <div class="title-xl">Oceń nas</div>
        <p class="tagline">Wyślij swoją opinię</p>
        <div class="star-row" id="stars">
          ${[1,2,3,4,5].map(i => `<span data-star="${i}" style="color:${i<=rating? '#f5d67b':'#777'}">★</span>`).join('')}
        </div>
        <textarea class="input" style="height:120px;" placeholder="Napisz swoją opinię" id="rate-msg"></textarea>
        <button class="button" id="btn-send-rate">Wyślij</button>
      </div>
    </div>
    ${renderBottomNav('rate')}
  </div>`;
}

function renderSettings() {
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">Ustawienia konta</div></div>
    <div class="section scrollable">
      <div class="glass-card" style="display:grid;gap:12px;">
        <div class="menu-item" data-nav="settings"><div class="menu-icon">🧑</div>Twoje dane</div>
        <div class="menu-item" data-nav="visits"><div class="menu-icon">📅</div>Twoje wizyty</div>
        <div class="menu-item" data-nav="opinie"><div class="menu-icon">💬</div>Opinie</div>
        <div class="menu-item" data-nav="services"><div class="menu-icon">🎁</div>Karty podarunkowe</div>
        <div class="menu-item" data-nav="market"><div class="menu-icon">🛒</div>Kup / sprzedaj</div>
        <div class="menu-item" data-nav="help"><div class="menu-icon">❔</div>Pomoc</div>
      </div>
    </div>
    ${renderBottomNav('settings')}
  </div>`;
}

function renderServicesMain() {
  const filtered = filteredServices().slice(0, 6);
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">Zadbaj o samochód</div></div>
    <div class="hero-car" style="position:relative; align-items:flex-start;">
      <img class="floating-car" alt="Porsche" src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60" />
      <div class="title-xl" style="text-align:left; width:100%;">911 TURBO</div>
      <div class="tagline" style="width:100%; text-align:left;">Wybierz usługę i umów wizytę</div>
    </div>
    <div class="section scrollable">
      <div class="filters">
        <input class="input" style="flex:1;" placeholder="Wyszukaj usługę" id="search-input" value="${state.search}">
        <div class="chip" data-nav="services-search">🔍 Lupa</div>
        <div class="chip" data-nav="visits">🗓️ Wizyty</div>
        <div class="chip" data-nav="filters">⚙️ Filtry</div>
      </div>
      <div class="filters">
        ${categories.map(cat => `<div class="chip ${cat===state.selectedCategory?'active':''}" data-cat="${cat}">${cat}</div>`).join('')}
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
      <div>
        <div class="muted">Cena</div>
        <div class="price">${service.price} zł</div>
      </div>
      <div>
        <div class="muted">Ocena</div>
        <div class="price">${service.rating}</div>
      </div>
      <div>
        <div class="muted">Pakiet</div>
        <div class="price">${service.short}</div>
      </div>
    </div>
    <button class="button secondary" data-book="${service.id}">Umów wizytę</button>
  </div>`;
}

function renderCategoryListing() {
  const cat = state.params?.category || categories[0];
  const list = services.filter(s => s.category === cat);
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">${cat}</div></div>
    <div class="section scrollable">
      <div class="card-list">
        ${list.map(s => serviceCard(s)).join('')}
      </div>
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
    <div class="header"><div class="logo">WS</div><div class="badge">Umów wizytę</div></div>
    <div class="section scrollable">
      <div class="glass-card" style="display:grid;gap:14px;">
        <div class="title-xl">${service?.name || 'Usługa'}</div>
        <div class="muted">${service?.location || ''} · ${service?.category || ''}</div>
        <div class="grid-3">
          <div><div class="muted">Cena</div><div class="price">${service?.price || 200} zł</div></div>
          <div><div class="muted">Czas</div><div class="price">1h 40 min</div></div>
          <div><div class="muted">Ocena</div><div class="price">${service?.rating || '4.8'}</div></div>
        </div>
        <div>
          <div class="section-title"><div>Styczeń 2025</div><div class="muted">Luty</div></div>
          <div class="calendar">
            ${days.map(d => `<div class="day ${d===selectedDay?'selected':''}" data-day="${d}">${d}</div>`).join('')}
          </div>
        </div>
        <div>
          <div class="muted">Wybierz datę i godzinę</div>
          <div class="time-grid">
            ${['10:00','12:00','14:00','16:00','18:00','20:00'].map(t => `<div class="time-slot ${t===selectedTime?'selected':''}" data-time="${t}">${t}</div>`).join('')}
          </div>
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
    <div class="header"><div class="logo">WS</div><div class="badge">Twoje ogłoszenia</div></div>
    <div class="section scrollable">
      <div class="filters">
        <div class="chip active">Osobowe</div>
        <div class="chip">Dostawcze</div>
        <div class="chip">SUV</div>
        <div class="chip">Sport</div>
      </div>
      <div class="card-list">
        ${cars.map(c => `
          <div class="car-card">
            <div class="car-header">
              <div class="thumb">${c.model.slice(0,2)}</div>
              <div style="flex:1;">
                <div style="font-weight:700;">${c.model}</div>
                <div class="muted">Rocznik ${c.year} · ${c.city}</div>
              </div>
              <div class="badge">${c.badge}</div>
            </div>
            <div class="grid-3">
              <div><div class="muted">Przebieg</div><div class="price">${c.mileage.toLocaleString('pl-PL')} km</div></div>
              <div><div class="muted">Cena</div><div class="price">${c.price.toLocaleString('pl-PL')} zł</div></div>
              <div><div class="muted">Kontakt</div><div class="price">${c.contact}</div></div>
            </div>
            <button class="button secondary" data-contact="${c.contact}">Zobacz opis</button>
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
    <div class="header"><div class="logo">WS</div><div class="badge">Ulubione</div></div>
    <div class="section scrollable">
      ${favs.length ? `<div class="card-list">${favs.map(s => serviceCard(s)).join('')}</div>` : `<div class="empty-state glass-card">Brak ulubionych usług.</div>`}
    </div>
    ${renderBottomNav('favorites')}
  </div>`;
}

function renderSearch() {
  const list = filteredServices();
  return `
  <div class="app-shell">
    <div class="header"><div class="logo">WS</div><div class="badge">USŁUGI</div></div>
    <div class="section scrollable">
      <div class="hero-car" style="position:relative; align-items:flex-start;">
        <img class="floating-car" alt="Porsche" src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60" />
        <div class="title-xl" style="text-align:left; width:100%;">911 TURBO</div>
        <div class="tagline" style="width:100%; text-align:left;">wyszukaj usługę</div>
      </div>
      <input class="input" placeholder="Szukaj usługi" id="search-input" value="${state.search}">
      <div class="filters" style="margin-top:6px;">
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

  ['#btn-apple', '#btn-google'].forEach(sel => {
    const btn = document.querySelector(sel);
    if (btn) btn.onclick = () => alert('Logowanie społecznościowe będzie dostępne w pełnej wersji.');
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

  document.querySelectorAll('[data-contact]').forEach(el => {
    el.onclick = () => alert(`Kontakt do właściciela: ${el.getAttribute('data-contact')}`);
  });

  const searchInput = document.querySelector('#search-input');
  if (searchInput) searchInput.oninput = (e) => { state.search = e.target.value; render(); };

  document.querySelectorAll('.day').forEach(el => {
    el.onclick = () => navigate('booking', { serviceId: state.selectedService?.id, day: Number(el.getAttribute('data-day')) });
  });

  document.querySelectorAll('.time-slot').forEach(el => {
    el.onclick = () => navigate('booking', { serviceId: state.selectedService?.id, day: state.params?.day || 12, time: el.getAttribute('data-time') });
  });

  const book = document.querySelector('#btn-book');
  if (book) book.onclick = () => {
    alert('Rezerwacja zapisana!');
    navigate('visits');
  };

  document.querySelectorAll('[data-star]').forEach(el => {
    el.onclick = () => navigate('rate', { rating: Number(el.getAttribute('data-star')) });
  });

  const sendRate = document.querySelector('#btn-send-rate');
  if (sendRate) sendRate.onclick = () => { alert('Dziękujemy za opinię!'); navigate('home'); };
}

render();
