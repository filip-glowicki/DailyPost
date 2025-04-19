# Plan implementacji widoku: Widok Historii Postów

## 1. Przegląd

- Widok Historii Postów umożliwia użytkownikowi przeglądanie, filtrowanie, sortowanie i paginację listy opublikowanych postów.
- Kluczowe elementy: prezentacja tytułu, daty utworzenia, daty modyfikacji, kategorii oraz finalnej treści posta.
- Cel: zapewnienie intuicyjnej nawigacji oraz łatwego zarządzania postami, z możliwością ich edycji i usuwania.

## 2. Routing widoku

- Ścieżka: `/posts/history`
- Widok dostępny jako strona w aplikacji Next.js, np. w `src/app/posts/history/page.tsx`.

## 3. Struktura komponentów

- **HistoryView** (komponent nadrzędny): Kontener widoku, odpowiedzialny za pobieranie danych oraz zarządzanie stanem filtrów i paginacji.
  - Dzieci: `FilterBar`, `PostsList` (zawierający `PostCard`), `Pagination`, `ToastNotifications`.

## 4. Szczegóły komponentów

### 4.1. HistoryView

- **Opis:** Główny komponent strony historii postów.
- **Elementy:** Includuje `FilterBar`, `PostsList`, `Pagination` oraz `ToastNotifications`.
- **Obsługiwane zdarzenia:** Inicjalizacja pobierania danych przy zmianie filtrów i paginacji; obsługa akcji edycji oraz usunięcia posta.
- **Warunki walidacji:** Sprawdzenie poprawności parametrów (np. `page`, `limit`, `search`) przed wywołaniem API.
- **Typy:** `PaginatedPostsDTO`, `PostDTO`, `GetPostsQuery`.
- **Propsy:** Brak, logika wewnętrzna komponentu.

### 4.2. FilterBar

- **Opis:** Pasek filtrów umożliwiający wyszukiwanie i sortowanie postów.
- **Elementy:** Pole tekstowe do wyszukiwania, dropdown do wyboru kategorii, selektor sortowania, przycisk reset.
- **Obsługiwane zdarzenia:** `onChange` dla każdego pola, `onSubmit` przekazujący zaktualizowane kryteria do `HistoryView`.
- **Warunki walidacji:** Minimalna liczba znaków w wyszukiwaniu; poprawny format UUID dla kategorii.
- **Typy:** Może wykorzystywać `GetPostsQuery` lub dedykowany ViewModel filtrów.
- **Propsy:** Callback do przesyłania aktualnych ustawień filtra.

### 4.3. PostsList / PostCard

- **Opis:** Komponenty odpowiedzialne za wyświetlanie listy postów jako karty lub wiersze tabeli.
- **Elementy:** Wyświetlanie tytułu, daty utworzenia, daty modyfikacji, kategorii oraz fragmentu treści.
- **Obsługiwane zdarzenia:** Kliknięcie przycisku edycji (przekierowanie lub otwarcie modala) i usunięcia (modal potwierdzający akcję).
- **Warunki walidacji:** Weryfikacja dostępności danych; sprawdzenie uprawnień do edycji/usunięcia.
- **Typy:** `PostDTO`.
- **Propsy:** Dane posta, callbacki na akcje edycji i usunięcia.

### 4.4. Pagination

- **Opis:** Komponent nawigacyjny umożliwiający przechodzenie między stronami wyników.
- **Elementy:** Przycisk "poprzednia", "następna", numery stron.
- **Obsługiwane zdarzenia:** Kliknięcie w numer strony lub przycisk, wywołujące nową pobraną partię danych.
- **Warunki walidacji:** Aktualizacja stanu paginacji przy każdej zmianie; numer strony musi być dodatni.
- **Typy:** `PaginationDTO`.
- **Propsy:** Aktualna strona, limit wpisów oraz callback do zmiany strony.

## 5. Typy

- **PostDTO:** Zdefiniowany w `src/types.ts`; zawiera: `id`, `title`, `prompt`, `size`, `content`, `category_id`, `created_at`, `updated_at`.
- **PaginatedPostsDTO:** Również w `src/types.ts`; składa się z tablicy `PostDTO` oraz obiektu `pagination` (pola: `page`, `limit`, `total`).
- **GetPostsQuery:** Parametry zapytania do API, w tym stronnicowanie, filtrowanie i sortowanie.
- **ViewModel filtrów (opcjonalnie):** { search: string, categoryId: string, sortBy: string, order: 'asc'|'desc' }.

## 6. Zarządzanie stanem

- Wykorzystanie hooka `useState` do przechowywania stanu filtrów, paginacji i listy postów.
- Custom hook `usePostsHistory` do logiki pobierania danych i synchronizacji stanu z API.
- Użycie `useEffect` do odświeżania danych przy zmianie filtrów lub paginacji.

## 7. Integracja API

- Wywołanie endpointu GET /posts (implementacja w `src/actions/posts/getAll.ts`).
- Użycie narzędzia do fetchowania danych, np. `fetch`, `useSWR` lub `react-query`.
- Typy żądania: `GetPostsQuery`; odpowiedź: `PaginatedPostsDTO`.
- Obsługa błędów: walidacja kodów statusu (200, 400, 401, 500) oraz wyświetlanie powiadomień (Toast) w przypadku niepowodzenia.

## 8. Interakcje użytkownika

- Wprowadzanie frazy wyszukiwania i wybór kategorii w `FilterBar` powodują aktualizację stanu i wywołanie API w celu pobrania odpowiednich danych.
- Kliknięcie przycisku edycji otwiera modal lub przekierowuje do widoku edycji posta.
- Kliknięcie przycisku usunięcia wywołuje modal potwierdzający, a następnie API do usunięcia posta oraz odświeżenie listy.
- Nawigacja między stronami wyników za pomocą `Pagination`.
- Powiadomienia (Toast) informują użytkownika o sukcesie lub błędzie operacji.

## 9. Warunki i walidacja

- **Filtry:** Minimalna długość dla wyszukiwania; poprawny format UUID dla wyboru kategorii.
- **Paginacja:** Ograniczenie limitu (maks. 100) oraz dodatnia wartość numeru strony.
- **API:** Sprawdzenie odpowiedzi pod kątem kodów 200, 400, 401, 500; odpowiednia walidacja danych wejściowych.

## 10. Obsługa błędów

- Wyświetlanie powiadomień (Toast) w przypadku błędów przy pobieraniu danych lub operacjach edycji/usunięcia.
- Fallback UI w przypadku braku danych (np. komunikat "Brak postów do wyświetlenia").
- Logowanie błędów (np. w konsoli) dla celów debugowania.

## 11. Kroki implementacji

1. Utworzenie strony widoku historii postów w ścieżce `/posts/history` (np. `src/app/posts/history/page.tsx`).
2. Implementacja komponentu `HistoryView` jako głównego kontenera dla widoku.
3. Stworzenie komponentu `FilterBar` służącego do obsługi filtrów i sortowania.
4. Stworzenie komponentu `PostsList` oraz wewnętrznego `PostCard` do prezentacji postów.
5. Stworzenie komponentu `Pagination` do zarządzania stronnicowaniem.
6. Implementacja logiki pobierania danych z API poprzez `usePostsHistory` lub inną bibliotekę (np. `react-query`).
7. Integracja akcji edycji i usunięcia posta wraz z modalem potwierdzającym.
8. Dodanie powiadomień (Toast) dla operacji sukcesu/błędu.
9. Przeprowadzenie testów widoku pod kątem UX, dostępności oraz zgodności z wymaganiami.
