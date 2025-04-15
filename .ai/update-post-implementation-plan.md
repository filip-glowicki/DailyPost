# API Endpoint Implementation Plan: PUT /posts/{id}

## 1. Przegląd punktu końcowego

Endpoint służy do aktualizacji istniejącego posta. Pozwala na modyfikację pól takich jak `title`, `prompt`, `size`, `content` oraz `category_id`. Aktualizacja jest możliwa wyłącznie przez właściciela posta, a dane wejściowe są walidowane, aby zapobiec przekroczeniom limitów znaków. Mechanizm wykorzystuje serwerowe akcje (server actions) Next.js oraz Supabase jako backend, spełniając zasady architektury projektu.

## 2. Szczegóły żądania

- **Metoda HTTP:** PUT
- **Struktura URL:** /posts/{id}
- **Parametry:**
  - **Wymagane:**
    - `{id}` – identyfikator posta (UUID) pobierany z URL
  - **Opcjonalne (w ciele żądania):**
    - `title` (string)
    - `prompt` (string) – maksymalnie 500 znaków
    - `size` (string)
    - `content` (string) – maksymalnie 1000 znaków
    - `category_id` (UUID)
- **Request Body:** Obiekt zawierający pola do aktualizacji. Dane są weryfikowane przy użyciu Zod.

## 3. Wykorzystywane typy

- **DTO dla posta:** `PostDTO` (zdefiniowany w `src/types.ts`)
- **Command dla aktualizacji:** `UpdatePostCommand` – model poleceń umożliwiający aktualizację pól `title`, `prompt`, `size`, `content` oraz `category_id` (pole `id` jest wymagane).

## 4. Szczegóły odpowiedzi

- **Status 200 OK:** Pomyślna aktualizacja posta
- **Odpowiedź:** Zwracany jest obiekt zaktualizowanego posta zgodny z `PostDTO`
- **Możliwe kody błędów:**
  - 400 Bad Request – niepoprawne dane wejściowe
  - 401 Unauthorized – użytkownik nie jest uwierzytelniony
  - 403 Forbidden – próba modyfikacji posta, który nie należy do zalogowanego użytkownika
  - 404 Not Found – post o podanym `id` nie został znaleziony
  - 500 Internal Server Error – błąd operacyjny

## 5. Przepływ danych

1. Otrzymanie żądania PUT z parametrem `id` oraz danymi do aktualizacji w ciele żądania.
2. Uwierzytelnienie użytkownika przy użyciu Supabase Auth.
3. Walidacja danych wejściowych przy użyciu schematu Zod (UpdatePostCommand).
4. Weryfikacja, czy post o danym `id` istnieje oraz należy do aktualnie zalogowanego użytkownika.
5. Wykonanie operacji aktualizacji rekordu w tabeli `posts` z automatyczną aktualizacją pola `updated_at`.
6. Zwrócenie odpowiedzi z zaktualizowanym obiektem posta lub błędu, jeśli którakolwiek z weryfikacji zawiedzie.

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Endpoint dostępny wyłącznie dla uwierzytelnionych użytkowników.
- **Autoryzacja:** Sprawdzenie, czy post należy do zalogowanego użytkownika przy użyciu polityk RLS w Supabase.
- **Walidacja:** Dane wejściowe są weryfikowane za pomocą Zod, co zapewnia ograniczenia długości tekstu dla pól `prompt` (max 500) i `content` (max 1000).
- **Logowanie błędów:** W przypadku błędów operacyjnych, odpowiednie informacje powinny być zapisywane w tabeli `error_logs`.

## 7. Obsługa błędów

- **400 Bad Request:** Błędne lub niekompletne dane wejściowe
- **401 Unauthorized:** Brak autoryzacji (użytkownik nie jest zalogowany)
- **403 Forbidden:** Użytkownik próbuje zmodyfikować posta, który nie należy do niego
- **404 Not Found:** Nie znaleziono posta o podanym `id`
- **500 Internal Server Error:** Błąd serwera; szczegóły błędu mogą być logowane w `error_logs`

## 8. Rozważania dotyczące wydajności

- Aktualizacja powinna dotyczyć tylko zmienionych pól, aby zminimalizować obciążenie bazy.
- Wykorzystanie indeksów na `user_id` oraz `category_id` w tabeli `posts` może przyspieszyć operację wyszukiwania rekordu.
- Zapytania do Supabase powinny być zoptymalizowane, aby minimalizować obciążenie bazy przy większej liczbie użytkowników.

## 9. Etapy wdrożenia

1. Utworzenie schematu walidacji dla danych wejściowych (UpdatePostCommand) przy użyciu Zod, z uwzględnieniem limitów znaków.
2. Implementacja serwerowej akcji (server action) w Next.js, np. w `src/actions/posts/update.ts`, która:
   - Pobiera `id` z parametrów URL.
   - Waliduje dane ciała żądania przy użyciu UpdatePostCommand.
   - Weryfikuje, czy post istnieje i należy do użytkownika.
   - Wykonuje operację aktualizacji w Supabase, zapewniając automatyczną aktualizację pola `updated_at`.
3. Konfiguracja polityk RLS w Supabase, aby upewnić się, że tylko właściciel posta może go modyfikować.
4. Implementacja mechanizmu logowania błędów, który zapisuje nieoczekiwane błędy do tabeli `error_logs`.
