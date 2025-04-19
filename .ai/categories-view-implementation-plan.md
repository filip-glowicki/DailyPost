# Plan implementacji widoku Zarządzania Kategoriami

## 1. Przegląd

Widok umożliwia użytkownikowi zarządzanie kategoriami poprzez przeglądanie istniejących kategorii, dodawanie nowych oraz edycję i usuwanie wybranych kategorii. Interfejs oferuje natychmiastową walidację danych (np. ograniczenie 250 znaków dla opisu) oraz informowanie użytkownika o powodzeniu lub niepowodzeniu operacji za pomocą toast notifications.

## 2. Routing widoku

Widok będzie dostępny pod ścieżką `/categories`. Zostanie zaimplementowany jako strona w Next.js (np. w pliku `src/app/categories/page.tsx`).

## 3. Struktura komponentów

- **CategoriesView** – główny komponent widoku zarządzania kategoriami, odpowiedzialny za pobieranie danych, zarządzanie stanami oraz integrację z formularzem i listą.
- **CategoryForm** – formularz umożliwiający dodanie nowej kategorii lub edycję istniejącej, zawiera pola na nazwę i opis oraz przycisk do zatwierdzania zmian.
- **CategoryList** – komponent wyświetlający listę wszystkich kategorii pobranych z API.
- **CategoryItem** – pojedynczy element listy, prezentujący dane jednej kategorii wraz z przyciskami do edycji i usuwania.
- **ToastNotifications** – komponent do wyświetlania komunikatów informacyjnych (sukces, błąd) związanych z operacjami na kategoriach.

## 4. Szczegóły komponentów

### CategoriesView

- **Opis**: Komponent nadrzędny, zarządza stanem listy kategorii, pobieraniem danych oraz komunikacją między komponentami podrzędnymi.
- **Główne elementy**: Kontener zawierający `CategoryForm` i `CategoryList`.
- **Obsługiwane interakcje**: Pobranie danych przy inicjalizacji, przeładowanie listy po operacjach dodawania, edycji lub usuwania.
- **Warunki walidacji**: Przekazywane w formularzu, weryfikacja poprawności danych wejściowych.
- **Typy**: Używa `CategoryDTO` (zdefiniowany w `types.ts`) oraz lokalnego modelu stanu.
- **Propsy**: Brak – zarządza wewnętrznym stanem.

### CategoryForm

- **Opis**: Formularz do dodawania lub edycji kategorii. W trybie edycji pola są wstępnie wypełniane danymi istniejącej kategorii.
- **Główne elementy**: Pole tekstowe dla nazwy, pole textarea dla opisu, przycisk zatwierdzający.
- **Obsługiwane interakcje**: Walidacja danych w czasie rzeczywistym (np. ograniczenie 250 znaków dla opisu), obsługa zdarzenia submit, tryb edycji.
- **Warunki walidacji**:
  - Nazwa: pole obowiązkowe, niepuste.
  - Opis: maksymalnie 250 znaków.
- **Typy**:
  - `CreateCategoryCommand` dla dodawania,
  - `UpdateCategoryCommand` dla edycji (z dodatkowym polem `id`).
  - Dodatkowo lokalny typ ViewModel: `CategoryFormData` (pola: `name: string`, `description: string`, opcjonalnie `id?: string`).
- **Propsy**:
  - Opcjonalne dane początkowe (dla trybu edycji).
  - Callback do odświeżenia listy kategorii po zakończeniu operacji.

### CategoryList

- **Opis**: Wyświetla listę kategorii pobranych z API.
- **Główne elementy**: Lista komponentów `CategoryItem`.
- **Obsługiwane interakcje**: Aktualizacja listy po operacjach CRUD, wywołania callbacków edycji i usuwania.
- **Warunki walidacji**: Brak – dane wyświetlane są zgodnie z odpowiedzią API.
- **Typy**: Używa tablicy `CategoryDTO`.
- **Propsy**: Lista kategorii, funkcje callback dla operacji edycji i usuwania.

### CategoryItem

- **Opis**: Reprezentuje pojedynczą kategorię w liście.
- **Główne elementy**: Wyświetlenie nazwy i opisu kategorii, przyciski "Edytuj" i "Usuń".
- **Obsługiwane interakcje**: Kliknięcie przycisku edycji (przełączenie trybu edycji w `CategoryForm`), kliknięcie przycisku usunięcia (potwierdzenie przed usunięciem, wywołanie API DELETE).
- **Warunki walidacji**: Potwierdzenie usunięcia przed wykonaniem operacji.
- **Typy**: `CategoryDTO`.
- **Propsy**: Dane kategorii, callbacki dla operacji edycji i usunięcia.

### ToastNotifications

- **Opis**: Komponent do wyświetlania krótkotrwałych komunikatów (sukces, błąd) w odpowiedzi na operacje na kategoriach.
- **Główne elementy**: Wizualne alerty, automatyczne ukrywanie po kilku sekundach.
- **Obsługiwane interakcje**: Wyświetlanie/ukrywanie komunikatów w zależności od akcji użytkownika.
- **Warunki walidacji**: Brak.
- **Typy**: Standardowy model komunikatu (np. { type: 'success' | 'error', message: string }).
- **Propsy**: Dane komunikatu, funkcja resetująca/ukrywająca komunikat.

## 5. Typy

- **CategoryDTO**: Zdefiniowany w `types.ts`, reprezentuje kategorię (pola: `id`, `name`, `description`, itd.).
- **CreateCategoryCommand**: Model dla dodawania kategorii (pola: `name`, `description`).
- **UpdateCategoryCommand**: Model dla edycji kategorii (pole `id` oraz opcjonalne `name` i `description`).
- **CategoryFormData**: Lokalny typ widoku (pola: `name: string`, `description: string`, opcjonalnie `id?: string`).

## 6. Zarządzanie stanem

- Użycie hooka `useState` do przechowywania listy kategorii oraz stanu formularza.
- Custom hook `useCategories` do:
  - Pobierania listy kategorii z GET /categories.
  - Aktualizowania stanu po operacjach dodawania, edycji i usuwania.
- Lokalny stan w `CategoryForm` do kontroli pól formularza oraz walidacji danych wejściowych.

## 7. Integracja API

- **GET /categories**: Pobiera listę kategorii. Odpowiedź: obiekt zawierający `data` z tablicą `CategoryDTO`.
- **POST /categories**: Tworzy nową kategorię. Wysyłany obiekt: `CreateCategoryCommand`. Odpowiedź: obiekt nowej kategorii.
- **PUT /categories/{id}**: Aktualizuje istniejącą kategorię. Wysyłany obiekt: `UpdateCategoryCommand`. Odpowiedź: zaktualizowany obiekt kategorii.
- **DELETE /categories/{id}**: Usuwa kategorię. Odpowiedź: komunikat potwierdzający sukces operacji.
- Komunikacja z API przy użyciu fetch lub axios. Aktualizacja stanu na podstawie odpowiedzi i wyświetlanie toast notifications w przypadku sukcesu lub błędów.

## 8. Interakcje użytkownika

- Po wejściu na stronę widoku użytkownik zobaczy listę istniejących kategorii.
- Użytkownik wypełnia formularz, aby dodać nową kategorię:
  - Formularz weryfikuje, czy pole nazwy nie jest puste oraz czy opis nie przekracza 250 znaków.
  - Po zatwierdzeniu formularza wywoływany jest endpoint POST, a nowa kategoria pojawia się na liście.
  - Wyświetlany jest komunikat sukcesu.
- Kliknięcie przycisku "Edytuj" przy danej kategorii przełącza formularz w tryb edycji z wypełnionymi danymi.
  - Po modyfikacji danych i zatwierdzeniu wywoływany jest endpoint PUT, a lista jest aktualizowana.
- Kliknięcie przycisku "Usuń" inicjuje potwierdzenie, po czym wywoływany jest endpoint DELETE. Po usunięciu kategoria zostaje usunięta z listy oraz pojawia się toast z informacją o sukcesie.

## 9. Warunki i walidacja

- **Nazwa kategorii**: pole obowiązkowe, nie może być puste.
- **Opis**: maksymalnie 250 znaków; walidacja w czasie rzeczywistym przed wysłaniem formularza.
- **Unikalność nazwy**: Błąd zwracany przez API, wyświetlany użytkownikowi, jeśli kategoria o podanej nazwie już istnieje.
- **Potwierdzenie usunięcia**: Przed usunięciem wyświetlane jest okno dialogowe z prośbą o potwierdzenie.
- **Autoryzacja i inne błędy API**: Walidacja statusu odpowiedzi API (np. 401, 400, 404) oraz odpowiednie wyświetlanie komunikatów.

## 10. Obsługa błędów

- Wyświetlanie toast notifications w przypadku błędów podczas operacji (np. nieprawidłowe dane wejściowe, błąd serwera).
- Lokalna walidacja formularza zapobiegająca wysyłaniu niepoprawnych danych.
- Obsługa błędów zwracanych przez API i informowanie użytkownika o przyczynie niepowodzenia operacji.

## 11. Kroki implementacji

1. Utworzenie pliku widoku: `src/app/categories/page.tsx` i podstawowego layoutu widoku.
2. Implementacja komponentu `CategoriesView` wraz z hookiem `useCategories` do pobierania i aktualizacji listy kategorii.
3. Implementacja komponentu `CategoryForm` z obsługą dodawania i edycji kategorii, w tym walidacji pól (nazwa, opis).
4. Implementacja komponentu `CategoryList` oraz `CategoryItem` z przyciskami do edycji i usuwania.
5. Integracja z API (wywołania GET, POST, PUT, DELETE) przy użyciu fetch lub axios. Aktualizacja stanu na podstawie odpowiedzi z API.
6. Dodanie mechanizmu toast notifications (np. z wykorzystaniem Shadcn/ui) do informowania użytkownika o sukcesie lub błędach.
7. Testy funkcjonalne widoku – sprawdzenie poprawności działania operacji dodawania, edycji, usuwania oraz walidacji.
8. Refaktoryzacja i optymalizacja kodu, upewnienie się, że interfejs jest responsywny i zgodny z wytycznymi UX oraz bezpieczeństwa.
