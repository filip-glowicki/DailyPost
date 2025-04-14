# API Endpoint Implementation Plan: POST /posts - AI Generated Post

## 1. Przegląd punktu końcowego

Punkt końcowy służy do automatycznego generowania posta na podstawie przekazanego prompta przy użyciu zewnętrznego serwisu AI (np. GPT-4o mini). Implementacja wykorzysta server action Next.js, co pozwoli zredukować ilość kodu po stronie klienta oraz zapewni spójność aplikacji.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST (implementowane jako server action)
- **Struktura URL:** "/posts" (konceptualnie, jako endpoint serwera)
- **Parametry:**
  - _Wymagane:_
    - `title`: string
    - `prompt`: string
    - `size`: string
    - `category_id`: uuid
  - _Opcjonalne:_ Brak
- **Request Body:**

```json
{
  "title": "string",
  "prompt": "string",
  "size": "string",
  "category_id": "uuid"
}
```

## 3. Wykorzystywane typy

- `CreatePostCommand` (zdefiniowany w `src/types.ts`) – model przyjmujący dane wejściowe (bez pól generowanych automatycznie: id, content, created_at, updated_at, user_id).
- `PostDTO` (zdefiniowany w `src/types.ts`) – reprezentacja rekordu w tabeli Posts.

## 4. Szczegóły odpowiedzi

- **Statusy HTTP:**
  - 201 Created – Post został pomyślnie wygenerowany i zapisany.
  - 400 Bad Request – Błędne dane wejściowe (np. niewłaściwa długość prompta lub brak wymaganego pola).
  - 401 Unauthorized – Użytkownik nieautoryzowany.
  - 500 Internal Server Error – Błąd integracji z serwisem AI lub problem wewnętrzny serwera.
- **Struktura odpowiedzi (przykładowa):**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "prompt": "string",
  "size": "string",
  "content": "string",
  "category_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 5. Przepływ danych

1. Otrzymanie żądania przez server action z danymi wejściowymi.
2. Walidacja danych wejściowych przy użyciu narzędzia (np. Zod) – weryfikacja długości prompta (<=500 znaków) i innych ograniczeń zgodnych z definicją bazy danych.
3. Wywołanie zewnętrznego serwisu AI do wygenerowania zawartości posta na podstawie `prompt`.
4. Wstawienie nowego rekordu do tabeli `Posts` w bazie danych Supabase, uwzględniając wygenerowaną treść oraz identyfikator kategorii.
5. Zwrot odpowiedzi z utworzonym postem do klienta.
6. W przypadku błędu (np. problem z AI lub zapisem do bazy), opcjonalne logowanie błędu w tabeli `Error_logs`.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie:** Weryfikacja, czy użytkownik jest zalogowany poprzez mechanizmy Supabase Auth.
- **Autoryzacja:** Sprawdzenie, czy użytkownik ma prawo dodawać post w określonej kategorii (`category_id`).
- **Walidacja danych:** Wykorzystanie Zod lub podobnej biblioteki do walidacji wejściowych danych, aby zapobiec wstrzyknięciom oraz innym atakom.
- **Polityki RLS:** Uzależnienie operacji wstawiania rekordu od odpowiednich polityk RLS zdefiniowanych w tabeli `Posts`.

## 7. Obsługa błędów

- **400 Bad Request:** Błędy walidacji danych wejściowych (np. brak wymaganych pól lub niepoprawne wartości).
- **401 Unauthorized:** Brak poprawnej autoryzacji użytkownika.
- **500 Internal Server Error:** Błędy podczas wywoływania serwisu AI lub problemy przy komunikacji z bazą danych. W takich przypadkach logowanie szczegółów błędu (opcjonalnie do tabeli `Error_logs`).

## 8. Rozważania dotyczące wydajności

- **Server Action:** Minimalizacja kodu klienta, zwiększenie wydajności dzięki wykonywaniu operacji po stronie serwera.
- **Asynchroniczność:** Wywołanie serwisu AI wykonywane asynchronicznie, możliwość wdrożenia mechanizmu timeout oraz retry dla niezawodności.
- **Optymalizacja zapytań:** Wykorzystanie indeksów w bazie (np. na polach `user_id` i `category_id` w tabeli Posts) dla szybkiego wyszukiwania i wstawiania danych.

## 9. Etapy wdrożenia

1. **Implementacja function server action:**
   - Utworzenie endpointu w `src/actions.ts` odpowiadającego za obsługę POST /posts.
   - Odbieranie i walidacja danych wejściowych zgodnie z modelem `CreatePostCommand`.
2. **Integracja z serwisem AI:**
   - Utworzenie adaptera klienta do komunikacji z serwisem AI (np. GPT-4o mini).
   - Implementacja mechanizmu obsługi błędów oraz retry w przypadku niepowodzeń.
3. **Operacja na bazie danych:**
   - Wstawienie nowego rekordu do tabeli `Posts` używając Supabase.
4. **Logowanie błędów:**
   - Wdrożenie mechanizmu zapisu błędów do tabeli `Error_logs` przy krytycznych awariach.
5. **Testy:**
   - Opracowanie testów jednostkowych i integracyjnych dla całego przepływu, w tym walidacji, integracji z AI oraz operacji na bazie danych.
6. **Dokumentacja:**
   - Aktualizacja dokumentacji API i przekazanie wskazówek zespołowi programistów.
7. **Deployment:**
   - Wdrożenie na środowiskach testowych, monitorowanie wydajności oraz analiza logów w celu dalszej optymalizacji.
