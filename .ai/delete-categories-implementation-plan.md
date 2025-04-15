# API Endpoint Implementation Plan: DELETE /categories/{id}

## 1. Przegląd punktu końcowego

Punkt końcowy służy do usunięcia istniejącej kategorii, zidentyfikowanej po unikalnym identyfikatorze. Implementowany jest jako akcja serwerowa w Next.js i korzysta z Supabase do interakcji z bazą danych. Operacja usunięcia zapewnia, że jedynie uwierzytelnieni użytkownicy (oraz ewentualnie posiadający odpowiednie uprawnienia) mogą usunąć kategorię.

## 2. Szczegóły żądania

- **Metoda HTTP:** DELETE (implementowana jako akcja serwerowa)
- **URL:** "/categories/{id}"
- **Parametr ścieżki:**
  - `id` (UUID): Unikalny identyfikator kategorii do usunięcia.
- **Body żądania:** Brak

## 3. Wykorzystywane typy

- `DeleteCategoryCommand` zdefiniowany w `src/types.ts`, zawierający pole `id` używane przy operacji usuwania kategorii.

## 4. Szczegóły odpowiedzi

- **Odpowiedź sukcesu (200 OK):** Zwraca komunikat JSON potwierdzający pomyślne usunięcie kategorii, np.
  ```json
  { "message": "Kategoria została pomyślnie usunięta." }
  ```
- **Odpowiedzi błędów:**
  - 401 Unauthorized – Jeśli użytkownik nie jest uwierzytelniony.
  - 404 Not Found – Jeśli kategoria o podanym `id` nie istnieje.

## 5. Przepływ danych

1. Akcja serwerowa odbiera żądanie DELETE z `id` kategorii jako parametr ścieżki.
2. `id` jest walidowane (np. przy użyciu Zod) w celu upewnienia się, że jest poprawnym UUID.
3. Klient Supabase wyszukuje kategorię w tabeli `categories`.
4. Jeśli kategoria istnieje, przeprowadzane jest jej usunięcie.
5. W odpowiedzi zwracany jest komunikat potwierdzający pomyślne usunięcie.
6. Jeśli kategoria nie istnieje lub walidacja się nie powiedzie, zwracana jest odpowiednia odpowiedź błędu.

## 6. Rozważania bezpieczeństwa

- **Uwierzytelnianie:** Zapewnienie, że użytkownik jest uwierzytelniony przy użyciu Supabase Auth.
- **Autoryzacja:** Opcjonalne sprawdzenie, czy użytkownik posiada odpowiednie prawa do usunięcia kategorii (np. uprawnienia administratora).
- **Logowanie błędów:** Krytyczne błędy mogą być logowane dla dalszej diagnostyki.

## 7. Etapy wdrożenia

1. Utworzenie akcji serwerowej w Next.js w lokalizacji `src/actions/categories/delete.ts`.
2. Pobranie i walidacja parametru `id` z URL przy użyciu Zod.
3. Wykonanie zapytania do tabeli `categories` przy użyciu klienta Supabase w celu potwierdzenia istnienia kategorii.
4. Przeprowadzenie operacji usunięcia rekordu kategorii.
5. Zwrot komunikatu potwierdzającego pomyślne usunięcie w formacie JSON.
6. Dodanie mechanizmu obsługi błędów oraz rejestracji błędów w tabeli `error_logs` w przypadku wystąpienia nieoczekiwanych problemów.
