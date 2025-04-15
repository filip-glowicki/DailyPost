# API Endpoint Implementation Plan: GET /categories

## 1. Przegląd punktu końcowego

Punkt końcowy służy do pobrania listy wszystkich dostępnych kategorii w systemie. Dane kategorii są pobierane z bazy danych przy użyciu akcji serwerowej w Next.js we współpracy z klientem Supabase.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET (implementowana jako akcja serwerowa)
- **URL:** "/categories"
- **Parametry zapytania:** Brak
- **Body żądania:** Brak

## 3. Wykorzystywane typy

- `CategoriesResponseDTO` zdefiniowany w `src/types.ts`, reprezentujący strukturę odpowiedzi zawierającą tablicę kategorii.

## 4. Szczegóły odpowiedzi

- **Odpowiedź sukcesu (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string"
      }
    ]
  }
  ```
- **Odpowiedzi błędów:**
  - 401 Unauthorized – Jeżeli użytkownik nie jest uwierzytelniony.
  - 500 Internal Server Error – W przypadku nieoczekiwanych błędów serwera.

## 5. Przepływ danych

1. Akcja serwerowa odbiera żądanie GET na "/categories".
2. Klient Supabase wykonuje zapytanie do tabeli `categories` w celu pobrania wszystkich wpisów.
3. Pobrane rekordy kategorii są zwracane w odpowiedzi zgodnie z formatem `CategoriesResponseDTO`.
4. Implementowana jest odpowiednia obsługa błędów dla nieoczekiwanych sytuacji.

## 6. Rozważania bezpieczeństwa

- **Uwierzytelnianie:** Zapewnienie, że użytkownik jest uwierzytelniony przy użyciu Supabase Auth.
- **Logowanie błędów:** Opcjonalne logowanie błędów dla celów diagnostycznych.

## 7. Etapy wdrożenia

1. Utworzenie akcji serwerowej w Next.js w lokalizacji `src/actions/categories/getAll.ts`.
2. Wykonanie zapytania do tabeli `categories` przy użyciu klienta Supabase.
3. Zwrot listy kategorii w formacie JSON zgodnym z `CategoriesResponseDTO`.
4. Dodanie mechanizmu obsługi błędów oraz rejestracji błędów w tabeli `error_logs` w przypadku wystąpienia nieoczekiwanych problemów.
