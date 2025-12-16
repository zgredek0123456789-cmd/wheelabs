# Wheelabs MVP

Prosty prototyp SPA bez zależności buildowych ani frameworków. Aplikacja działa jako czyste HTML/CSS/JS – możesz otworzyć `index.html` bezpośrednio w przeglądarce albo uruchomić lokalny serwer Node, aby mieć stabilny adres URL i nawigację historii.

## Struktura
- `index.html` – kontener aplikacji i wczytanie stylów/skryptu.
- `styles.css` – stylizacja w estetyce ciemnego szklanego UI.
- `app.js` – logika ekranów, nawigacja, dane przykładowe (20 usług na kategorię, 20 aut w marketplace), obsługa ulubionych i rezerwacji.

## Uruchomienie
Najprostsza opcja to otworzyć `index.html` w przeglądarce (double-click). Jeśli chcesz serwer lokalny bez dodatkowych pakietów:

```bash
npm start
```

Serwer Node (port domyślnie 4173) obsługuje wszystkie statyczne pliki i nie wymaga instalacji zależności zewnętrznych. Dodatkowo,
nieznane ścieżki HTTP spadają do `index.html`, dzięki czemu bezpośrednie odnośniki do podstron SPA działają poprawnie.
