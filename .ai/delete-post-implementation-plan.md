# API Endpoint Implementation Plan: DELETE /posts/{id}

## 1. Przegląd punktu końcowego

Endpoint DELETE /posts/{id} służy do usuwania posta. Umożliwia użytkownikowi, który jest właścicielem posta, jego usunięcie. Endpoint jest wdrażany jako server action w Next.js, korzystający z Supabase do interakcji z bazą danych. Gwarantuje, że tylko uwierzytelniony użytkownik będący właścicielem danego posta będzie mógł dokonać operacji usunięcia.

## 2. Szczegóły żądania

- Metoda HTTP: DELETE
- Struktura URL: /posts/{id}
- Parametry:
  - Wymagane:
    - id (UUID) – identyfikator posta przesyłany jako część ścieżki URL
  - Opcjonalne: brak
- Request Body: brak

## 3. Wykorzystywane typy

- DTO i Command Modele:
  - `DeletePostCommand` zdefiniowany w `src/types.ts`:
    ```typescript
    export type DeletePostCommand = { id: string };
    ```
  - Dodatkowo, w razie potrzeby, można wykorzystać typ `PostDTO` dla weryfikacji własności posta.

## 4. Szczegóły odpowiedzi

- Sukces:
  - Kod 200 OK z komunikatem potwierdzającym usunięcie, np.:
    ```json
    { "message": "Post deleted successfully." }
    ```
- Błędy:
  - 401 Unauthorized – użytkownik nie jest uwierzytelniony
  - 403 Forbidden – użytkownik nie jest właścicielem posta
  - 404 Not Found – post o podanym id nie istnieje
  - 500 Internal Server Error – błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie DELETE /posts/{id}.
2. Serwer pobiera identyfikator `id` z URL.
3. Walidacja danych:
   - Użycie Zod do sprawdzenia, czy `id` jest prawidłowym UUID.
   - Weryfikacja, czy użytkownik jest zalogowany (Supabase Auth).
4. Logika biznesowa:
   - Pobranie posta z bazy danych za pomocą Supabase.
   - Sprawdzenie, czy post istnieje.
   - Weryfikacja, że `user_id` posta odpowiada identyfikatorowi bieżącego użytkownika.
5. Operacja usunięcia:
   - Jeśli wszystkie warunki są spełnione, wykonanie operacji DELETE na rekordzie w tabeli `posts`.
   - Polityki RLS w bazie gwarantują, że operacja DELETE może być przeprowadzona wyłącznie przez właściciela posta.
6. Zwrócenie odpowiedzi 200 OK z komunikatem o sukcesie.

## 6. Względy bezpieczeństwa

- Uwierzytelnienie: Wykorzystanie Supabase Auth do weryfikacji sesji użytkownika.
- Autoryzacja: Sprawdzenie własności posta przed wykonaniem operacji usunięcia.
- RLS (Row-Level Security): Polityki w bazie danych gwarantujące, że operacja DELETE może być wykonana tylko przez właściciela posta.
- Sanityzacja danych: Walidacja, że parametr `id` jest poprawnym UUID, co zapobiega atakom typu injection.

## 7. Obsługa błędów

- 401 Unauthorized: Jeśli użytkownik nie jest zalogowany.
- 403 Forbidden: Jeśli zalogowany użytkownik nie jest właścicielem posta.
- 404 Not Found: Jeśli post o podanym `id` nie istnieje.
- 500 Internal Server Error: W przypadku nieoczekiwanych błędów przy operacjach na bazie danych.
- Rejestrowanie błędów: Krytyczne błędy mogą być logowane w tabeli `error_logs` dla dalszej analizy.

## 8. Rozważania dotyczące wydajności

- Szybkie wyszukiwanie rekordu dzięki indeksowi na kolumnie `id` w tabeli `posts`.
- Operacja DELETE wykonana na pojedynczym rekordzie jest operacją niskokosztową.
- Minimalne obciążenie aplikacji dzięki bezpośredniemu wykonaniu operacji przez Supabase.

## 9. Etapy wdrożenia

1. Utworzenie nowego server action dla operacji DELETE w lokalizacji `src/actions/posts/delete.ts`.
2. Implementacja walidacji parametru `id` przy użyciu Zod.
3. Integracja z Supabase:
   - Weryfikacja sesji użytkownika (uwierzytelnianie).
   - Pobranie posta z bazy i weryfikacja własności (porównanie `user_id`).
4. Wykonanie operacji DELETE na rekordzie w tabeli `posts` przy użyciu klienta Supabase skonfigurowanego w `src/utils/supabase/server.ts`.
5. Zwrócenie odpowiedzi:
   - W przypadku sukcesu: 200 OK z komunikatem o powodzeniu usunięcia.
   - W przypadku błędów: zwrócenie odpowiednich kodów 401, 403, 404 lub 500 w zależności od scenariusza.
6. Logowanie krytycznych błędów do tabeli `error_logs` w celu dalszej analizy.
7. Przeprowadzenie testów jednostkowych oraz integracyjnych w celu weryfikacji działania endpointu pod różnymi scenariuszami.
8. Aktualizacja dokumentacji oraz testów integracyjnych w systemie CI/CD.
