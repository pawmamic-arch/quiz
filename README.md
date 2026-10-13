# 👑 Kto jest najlepszym władcą w historii Polski?

Królewski quiz o polskich władcach jako aplikacja webowa (PWA). Ma 12 losowych pytań z puli 16, ciekawostki po każdej odpowiedzi i werdykt na końcu: „Najlepszym władcą jesteś… TY! A dokładnie, jesteś jak…”.
Działa na telefonie, da się ją dodać do ekranu głównego i działa offline.

Projekt to czysty HTML, CSS i JavaScript. Nie ma frameworków ani budowania. Wystarczy wrzucić pliki na serwer.

## Pliki

| Plik | Co to jest |
|---|---|
| `index.html` | strona aplikacji (trzy ekrany: start, pytania, wynik) |
| `style.css` | cała oprawa wizualna (kolory w zmiennych CSS na górze pliku) |
| `app.js` | logika gry, rekord, udostępnianie, konfetti |
| `questions.js` | **pytania i ciekawostki**: tu edytujesz treść quizu |
| `manifest.webmanifest` | opis aplikacji do instalacji (nazwa, ikony, kolory) |
| `sw.js` | service worker, który zapisuje pliki w pamięci telefonu (tryb offline) |
| `icons/` | ikony: `icon.svg` (źródło) i wygenerowane PNG 192/512, maskable i apple-touch |
| `CNAME` | nazwa Twojej (sub)domeny dla GitHub Pages, **na razie placeholder** |
| `.nojekyll` | mówi GitHub Pages, żeby nie przetwarzał plików Jekyllem |

## Uruchomienie lokalne

Wystarczy dwukrotnie kliknąć `index.html`. Quiz zadziała, ale bez trybu offline i instalacji, bo te funkcje wymagają serwera.

Pełna wersja z service workerem: w folderze projektu uruchom **jedno** z poleceń:

```bash
python -m http.server 8000
# albo
npx serve .
```

Potem otwórz <http://localhost:8000> (dla `npx serve` adres pojawi się w terminalu).
Widok telefonu w Chrome włączysz tak: F12 → ikona telefonu (Toggle device toolbar).

---

## Publikacja na GitHub Pages (za darmo)

> ⚠️ **Najpierw zajmij się plikiem `CNAME`.** Zawiera teraz przykładową nazwę `quiz.mojadomena.pl`.
> GitHub Pages traktuje ten plik jako ustawienie własnej domeny. Gdy wrzucisz go z przykładową nazwą, link `…github.io/…` zacznie przekierowywać na nieistniejący adres.
> - Masz już swoją subdomenę? Wpisz ją do `CNAME`, to jedyna linijka w pliku (szczegóły niżej).
> - Jeszcze nie masz? **Nie wrzucaj pliku `CNAME`** albo go usuń. Dodasz go później.

### 1. Załóż repozytorium

1. Zaloguj się na <https://github.com> (albo załóż darmowe konto).
2. Prawy górny róg → **+** → **New repository**.
3. Nazwa, np. `krolewski-quiz`. Zaznacz **Public**, bo na darmowym koncie Pages działa tylko dla publicznych repozytoriów.
4. **Create repository**.

### 2. Wgraj pliki

**Opcja A: przez przeglądarkę (najprościej)**

1. W nowym repozytorium kliknij **uploading an existing file**.
2. Przeciągnij **zawartość** folderu projektu: wszystkie pliki **razem z folderem `icons`**. Chrome zachowa strukturę folderów.
3. Na dole kliknij **Commit changes**.

**Opcja B: przez git**

```bash
git init
git add .
git commit -m "Królewski quiz"
git branch -M main
git remote add origin https://github.com/<moj-login>/krolewski-quiz.git
git push -u origin main
```

### 3. Włącz GitHub Pages

1. W repozytorium: **Settings** → w lewym menu **Pages**.
2. **Build and deployment → Source**: wybierz **Deploy from a branch**.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Po 1–2 minutach na górze tej strony pojawi się link w rodzaju:
   `https://<moj-login>.github.io/krolewski-quiz/`

Ten link wysyłasz znajomym. Każdy kolejny push albo upload aktualizuje stronę automatycznie po około minucie.

---

## Dodanie do ekranu głównego

**Android (Chrome):**
1. Otwórz link w Chrome.
2. Menu **⋮** → **Zainstaluj aplikację** (albo **Dodaj do ekranu głównego**). Chrome czasem sam wyświetla taką propozycję na dole ekranu.
3. Ikona z koroną pojawi się na pulpicie. Aplikacja otwiera się na pełnym ekranie i działa offline.

**iPhone / iPad (Safari):**
1. Otwórz link w **Safari** (inne przeglądarki na iOS mogą nie mieć tej opcji).
2. Stuknij **Udostępnij** (kwadrat ze strzałką w górę).
3. Przewiń w dół → **Do ekranu początkowego** → **Dodaj**.

Offline działa dopiero **po pierwszym otwarciu z internetem**. Wtedy aplikacja zapisuje się w pamięci telefonu.

---

## Własna domena: subdomena, np. `quiz.mojadomena.pl`

Wszystkie ścieżki w kodzie, manifeście i service workerze są względne. Ta sama wersja działa więc pod `…github.io/krolewski-quiz/` i pod własną domeną. **Jedyne miejsce do podmiany to plik `CNAME`.**

W poniższych krokach podmień:
- `quiz.mojadomena.pl` na swoją subdomenę,
- `<moj-login>` na swój login GitHuba.

### Krok 1: plik `CNAME`

Otwórz `CNAME` i wpisz w jedynej linijce swoją subdomenę, bez `https://` i bez ukośnika:

```
quiz.mojadomena.pl
```

Wrzuć zmieniony plik do repozytorium.

### Krok 2: rekord DNS u rejestratora domeny

Zaloguj się do panelu firmy, w której masz domenę (np. OVH, home.pl, nazwa.pl, Cloudflare). Znajdź **Strefę DNS / Zarządzanie DNS** i dodaj rekord:

| Typ | Nazwa / Host | Wartość / Wskazuje na | TTL |
|---|---|---|---|
| `CNAME` | `quiz` | `<moj-login>.github.io.` | domyślny (np. 3600) albo „Auto” |

Uwagi:
- W polu **Nazwa** wpisz samą część subdomeny (`quiz`). Niektóre panele chcą pełnej nazwy `quiz.mojadomena.pl.`
- W **Wartości** jest **tylko** `<moj-login>.github.io`, **bez** nazwy repozytorium. Kropkę na końcu niektóre panele dodają same, inne jej wymagają.
- Jeśli dla `quiz` istnieje już inny rekord (A, AAAA, CNAME), usuń go.
- **Cloudflare:** ustaw rekord jako **DNS only** (szara chmurka), przynajmniej do czasu wystawienia certyfikatu HTTPS.

Sprawdzenie, czy rekord już działa (Windows, terminal):

```bash
nslookup -type=CNAME quiz.mojadomena.pl
```

W odpowiedzi powinno być `<moj-login>.github.io`.

### Krok 3: „Custom domain” w ustawieniach GitHub Pages

1. Repozytorium → **Settings → Pages**.
2. W polu **Custom domain** wpisz `quiz.mojadomena.pl` → **Save**.
   Jeśli plik `CNAME` jest już w repozytorium, to pole może być wypełnione.
3. GitHub sprawdzi DNS. Gdy pojawi się zielone **„DNS check successful”**, wszystko gra.
   Jeśli nie, poczekaj na propagację DNS (krok niżej) i odśwież stronę ustawień.

### Krok 4: „Enforce HTTPS” (konieczne dla PWA)

Telefon pozwoli zainstalować aplikację i uruchomi tryb offline **tylko przez HTTPS**.

1. Na tej samej stronie (**Settings → Pages**) zaznacz **Enforce HTTPS**.
2. Jeśli opcja jest wyszarzona z komunikatem, że certyfikat jest jeszcze w przygotowaniu, poczekaj. GitHub wystawia darmowy certyfikat (Let's Encrypt) zwykle w kilkanaście minut do godziny od poprawnego DNS.
3. Gdy po kilku godzinach nadal nie działa: usuń domenę z pola **Custom domain**, zapisz, wpisz ją ponownie i zapisz. To wymusza ponowne wystawienie certyfikatu.

### Ile to trwa?

- **Propagacja DNS:** dla nowego rekordu zwykle od kilku minut do 1–2 godzin. W skrajnych przypadkach do **24–48 godzin**, zależnie od rejestratora i TTL.
- **Certyfikat HTTPS:** zwykle do godziny po tym, jak DNS zacznie działać.
- Gdy domena działa, stary link `…github.io/krolewski-quiz/` sam przekierowuje na `https://quiz.mojadomena.pl`.

### (Zalecane) Weryfikacja domeny w GitHubie

Chroni przed przejęciem subdomeny przez kogoś innego, gdyby Pages było kiedyś wyłączone.
Kliknij swój awatar → **Settings → Pages → Add a domain**, wpisz `mojadomena.pl` i dodaj u rejestratora rekord **TXT**, który pokaże GitHub (nazwa w stylu `_github-pages-challenge-<moj-login>`). Potem kliknij **Verify**.

---

## Wariant: domena główna (np. `mojadomena.pl`, bez subdomeny)

1. W pliku `CNAME` wpisz `mojadomena.pl`.
2. U rejestratora usuń istniejące rekordy **A/AAAA** dla domeny głównej (`@`), np. stronę „parkingową”. Potem dodaj:

| Typ | Nazwa | Wartość |
|---|---|---|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `AAAA` (opcjonalnie, IPv6) | `@` | `2606:50c0:8000::153` |
| `AAAA` (opcjonalnie) | `@` | `2606:50c0:8001::153` |
| `AAAA` (opcjonalnie) | `@` | `2606:50c0:8002::153` |
| `AAAA` (opcjonalnie) | `@` | `2606:50c0:8003::153` |
| `CNAME` | `www` | `<moj-login>.github.io.` |

3. Dalej jak w krokach 3–4: **Custom domain** → `mojadomena.pl` → **Save** → **Enforce HTTPS**.
   Rekord `www` sprawi, że `www.mojadomena.pl` przekieruje na `mojadomena.pl`.

---

## Zmiany w quizie

- **Pytania i ciekawostki:** edytuj `questions.js`. Każde pytanie ma `q` (treść), `answers` (4 odpowiedzi), `correct` (numer poprawnej, licząc od 0) i `fact` (ciekawostkę). Kolejność odpowiedzi i tak jest losowana.
- **Progi i opisy władców w podsumowaniu:** tablica `RANKS` na początku `app.js`.
- **Kolory:** zmienne CSS na górze `style.css`.
- **Po każdej zmianie** podbij numer wersji w `sw.js` (`var VERSION = 'v1'` → `'v2'`). Wtedy telefony usuną starą kopię offline i pobiorą nową. Aplikacja i tak najpierw próbuje pobrać świeże pliki z sieci, więc zmiany zwykle widać od razu.
- **Ikony:** źródłem jest `icons/icon.svg` (plus `icon-maskable.svg` i `icon-apple.svg`). Po zmianie SVG wyeksportuj z nich PNG w tych samych rozmiarach (192, 512, maskable 512, apple-touch 180), np. w darmowym Inkscape (Plik → Eksportuj).
