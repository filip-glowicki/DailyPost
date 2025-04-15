# API Endpoint Implementation Plan: GET /posts

## 1. Przegląd punktu końcowego

Punkt końcowy służy do pobierania listy postów. Umożliwia paginację, filtrowanie według kategorii, wyszukiwanie słów kluczowych w tytule lub treści, a także sortowanie wg wybranych pól. Endpoint został zaprojektowany, by korzystać z serwerowych akcji (server actions) Next.js oraz Supabase jako backendu, co zapewnia spójność i zgodność z architekturą projektu.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** /posts (obsługiwane przez server action)
- **Parametry zapytania:**
  - _Opcjonalne:_
    - `page` (number): Numer strony (np. 1).
    - `limit` (number): Liczba wpisów na stronę (np. 10).
    - `category_id` (UUID): Identyfikator kategorii, by filtrować posty.
    - `search` (string): Słowo kluczowe do wyszukiwania w tytule lub treści postu.
    - `sortBy` (string): Pole do sortowania (np. `created_at`, `title`).
    - `order` (string): Kolejność sortowania (`asc` lub `desc`).
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **DTO dla posta:** `PostDTO` (zdefiniowany w `src/types.ts`)
- **DTO dla paginacji:** `PaginationDTO` oraz `PaginatedPostsDTO`
- **Model zapytania:** `GetPostsQuery` (do walidacji parametrów wejściowych)

## 4. Szczegóły odpowiedzi

- **Struktura odpowiedzi (JSON):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "string",
        "prompt": "string",
        "size": "string",
        "content": "string",
        "category_id": "uuid",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 100 }
  }
  ```
- **Kody statusu:**
  - 200 OK – Pomyślne pobranie danych
  - 400 Bad Request – Błędne dane wejściowe
  - 401 Unauthorized – Brak autoryzacji
  - 500 Internal Server Error – Błąd po stronie serwera

## 5. Przepływ danych

1. Klient wysyła żądanie GET /posts z opcjonalnymi parametrami.
2. Serwerowa akcja (server action) odbiera zapytanie i waliduje przekazane parametry za pomocą Zod.
3. Za pomocą instancji Supabase (konfigurowanej w `src/utils/supabase/server.ts`) wykonywane jest zapytanie do tabeli `posts` z zastosowaniem:
   - Filtrowania (wg `category_id` i wyszukiwania tekstowego w `title` lub `content`)
   - Sortowania wg parametrów `sortBy` i `order`
   - Paginacji przy użyciu `limit` i obliczonego offsetu na podstawie `page`
4. Wyniki zapytania są formatowane zgodnie ze strukturą `PaginatedPostsDTO` i zwracane w odpowiedzi.

## 6. Względy bezpieczeństwa

- **Autoryzacja:** Sprawdzenie, czy użytkownik jest poprawnie uwierzytelniony przy użyciu Supabase Auth.
- **Polityki RLS:** Tabela `posts` korzysta z polityk Row-Level Security, co ogranicza dostęp do odpowiednich rekordów.
- **Walidacja danych:** Użycie Zod do walidacji parametrów wejściowych, co zapobiega przekazywaniu błędnych danych.
- **Sanityzacja:** Parametry wejściowe powinny być odpowiednio sanetyzowane, aby uniknąć potencjalnych ataków, mimo że Supabase zabezpiecza zapytania.

## 7. Obsługa błędów

- **Błędy walidacji:** Przy niepoprawnych danych wejściowych zwracany jest kod 400 Bad Request wraz z komunikatem błędu.
- **Brak autoryzacji:** W przypadku braku ważnej sesji użytkownika zwracany jest kod 401 Unauthorized.
- **Błędy serwera:** W razie nieoczekiwanych błędów operacyjnych zwracany jest kod 500 Internal Server Error, a szczegóły błędu rejestrowane są w tabeli `error_logs`.

## 8. Rozważania dotyczące wydajności

- **Paginacja:** Użycie paginacji zmniejsza obciążenie bazy poprzez pobieranie ograniczonej liczby rekordów.
- **Indeksy:** Skorzystanie z indeksów na kolumnach `user_id` oraz `category_id` w tabeli `posts` przyspiesza operacje filtrowania.
- **Optymalizacja zapytań:** Zastosowanie sortowania i limitów w zapytaniach pozwala zoptymalizować wydajność.
- **Możliwość cachingu:** W przyszłości można rozważyć zastosowanie mechanizmu cachingu wyników zapytań dla dużych obciążeń.

## 9. Etapy wdrożenia

1. Utworzenie serwerowej akcji (server action) w Next.js, np. w `src/actions/posts/getAll.ts`, do obsługi żądania GET /posts.
2. Definicja schematu walidacji parametrów wejściowych za pomocą Zod.
3. Implementacja logiki zapytań do Supabase w oparciu o parametry filtrowania, sortowania i paginacji.
4. Formatowanie wyniku zapytania zgodnie z typem `PaginatedPostsDTO` i zwrócenie go w odpowiedzi.
5. Dodanie mechanizmu obsługi błędów oraz rejestracji błędów w tabeli `error_logs` w przypadku wystąpienia nieoczekiwanych problemów.
