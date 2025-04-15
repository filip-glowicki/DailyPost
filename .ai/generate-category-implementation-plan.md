# API Endpoint Implementation Plan: POST /categories

## 1. Przegląd punktu końcowego

Punkt końcowy służy do utworzenia nowej kategorii na podstawie przesłanych danych. Odbiera on nazwę kategorii oraz opis i zapisuje nową kategorię w bazie danych przy użyciu akcji serwerowej w Next.js. Implementacja wykorzystuje Supabase do interakcji z bazą danych oraz mechanizmy uwierzytelniania Supabase Auth.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST (implementowana jako akcja serwerowa)
- **URL:** "/categories"
- **Body żądania:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Pola wymagane:**
  - `name` (string)
  - `description` (string) o maksymalnej długości 250 znaków.

## 3. Wykorzystywane typy

- `CreateCategoryCommand` zdefiniowany w `src/types.ts`, odpowiadający modelowi tworzenia kategorii.
- `CategoryDTO` jako typ zwracany reprezentujący kategorię.

## 4. Szczegóły odpowiedzi

- **Odpowiedź sukcesu (201 Created):** Zwraca utworzony obiekt kategorii wraz z wygenerowanym unikalnym identyfikatorem.
- **Odpowiedzi błędów:**
  - 400 Bad Request – W przypadku nieprawidłowych danych wejściowych, np. przekroczenia limitu długości opisu.
  - 401 Unauthorized – Jeżeli użytkownik nie jest uwierzytelniony.

## 5. Przepływ danych

1. Akcja serwerowa odbiera żądanie POST z danymi kategorii.
2. Dane wejściowe są walidowane przy użyciu Zod lub innej biblioteki walidacyjnej.
3. Jeżeli dane są poprawne, nowa kategoria jest wstawiana do tabeli `categories` w bazie danych za pomocą klienta Supabase.
4. Po pomyślnym utworzeniu, rekord utworzonej kategorii jest zwracany w odpowiedzi.
5. W przypadku wystąpienia błędów zwracane są odpowiednie kody statusu HTTP wraz z komunikatami.

## 6. Rozważania bezpieczeństwa

- **Uwierzytelnianie:** Zapewnienie, że użytkownik jest uwierzytelniony przy pomocy Supabase Auth.
- **Walidacja danych:** Dane są walidowane, aby `description` nie przekraczał 250 znaków, a `name` nie był pusty.
- **Logowanie błędów:** Opcjonalne logowanie krytycznych błędów w celu dalszej diagnostyki.

## 7. Obsługa błędów

- **400 Bad Request:** Kiedy dane wejściowe nie przechodzą walidacji.
- **401 Unauthorized:** Gdy brak jest sesji użytkownika lub jest ona nieprawidłowa.

## 8. Etapy wdrożenia

1. Utworzenie akcji serwerowej w Next.js w lokalizacji `src/actions/categories/generate.ts`.
2. Walidacja przychodzących danych żądania przy użyciu Zod.
3. Wstawienie kategorii do tabeli `categories` przy użyciu klienta Supabase.
4. Zwrot utworzonego rekordu kategorii.
5. Dodanie mechanizmu obsługi błędów oraz rejestracji błędów w tabeli `error_logs` w przypadku wystąpienia nieoczekiwanych problemów.
