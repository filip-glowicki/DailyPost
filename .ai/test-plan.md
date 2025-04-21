# Plan Testów dla Aplikacji DailyPost

## 1. Wprowadzenie i Cele Testowania

Niniejszy plan testów definiuje strategię testowania aplikacji DailyPost - platformy do tworzenia, edycji i zarządzania postami z wykorzystaniem technologii AI. Główne cele testowania:

- Zapewnienie niezawodności wszystkich kluczowych funkcjonalności
- Weryfikacja poprawności integracji z Supabase i usługami AI (Openrouter.ai)
- Testowanie responsywności i dostępności interfejsu użytkownika
- Weryfikacja bezpieczeństwa, szczególnie w obszarze autoryzacji i uwierzytelniania
- Sprawdzenie wydajności aplikacji pod różnym obciążeniem

## 2. Zakres Testów

### Obiekty Testowe:

- Aplikacja frontendowa (Next.js 15, React 19)
- Integracja z backendem Supabase
- Integracja z usługami AI poprzez Openrouter.ai
- Wszystkie ścieżki użytkownika od rejestracji/logowania do tworzenia/edycji postów

### Funkcjonalności Objęte Testami:

- Proces uwierzytelniania użytkowników (rejestracja, logowanie, reset hasła)
- Zarządzanie postami (tworzenie, edycja, usuwanie, przeglądanie)
- Zarządzanie kategoriami (tworzenie, edycja, usuwanie, przeglądanie)
- Generowanie treści za pomocą AI
- Wyszukiwanie i filtrowanie postów
- Responsywność interfejsu na różnych urządzeniach

## 3. Typy Testów

### 3.1. Testy Jednostkowe

- **Narzędzia**: Vitest
- **Zakres**:
  - Komponenty React (src/components/)
  - Funkcje utility (src/utils/)
  - Hooki (src/hooks/)
  - Validacja danych (schematy Zod)

### 3.2. Testy Integracyjne

- **Narzędzia**: Vitest + React Testing Library
- **Zakres**:
  - Integracja komponentów w większe moduły
  - Przepływ danych między komponentami
  - Integracja z globalnymi stanami

### 3.3. Testy E2E

- **Narzędzia**: Playwright
- **Zakres**:
  - Pełne ścieżki użytkownika
  - Przepływ autoryzacji
  - Proces tworzenia i edycji postów
  - Wyszukiwanie i filtrowanie

### 3.4. Testy API

- **Narzędzia**: Supertest lub Postman
- **Zakres**:
  - Wszystkie endpointy serwera Next.js (server actions)
  - Poprawność odpowiedzi API
  - Obsługa błędów i walidacja

### 3.5. Testy Bezpieczeństwa

- **Narzędzia**: OWASP ZAP, ręczne testowanie
- **Zakres**:
  - Zabezpieczenia uwierzytelniania
  - Autoryzacja dostępu do zasobów
  - Ochrona przed typowymi zagrożeniami (XSS, CSRF, itp.)

### 3.6. Testy Wydajnościowe

- **Narzędzia**: Lighthouse, WebPageTest
- **Zakres**:
  - Czas ładowania stron
  - Metryki Core Web Vitals
  - Wydajność generowania treści z AI

### 3.7. Testy Dostępności

- **Narzędzia**: Axe, Lighthouse
- **Zakres**:
  - Zgodność z WCAG 2.1
  - Obsługa czytników ekranu
  - Nawigacja klawiaturą

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

### 4.1. Autoryzacja i Uwierzytelnianie

#### TC-AUTH-001: Rejestracja nowego użytkownika

1. Wejść na stronę rejestracji
2. Wprowadzić poprawne dane rejestracyjne
3. Zatwierdzić formularz
4. Sprawdzić, czy użytkownik został utworzony w Supabase
5. Sprawdzić, czy użytkownik został zalogowany

#### TC-AUTH-002: Logowanie użytkownika

1. Wejść na stronę logowania
2. Wprowadzić poprawne dane logowania
3. Zatwierdzić formularz
4. Sprawdzić, czy użytkownik został zalogowany i przekierowany na stronę główną

#### TC-AUTH-003: Reset hasła

1. Wejść na stronę resetowania hasła
2. Wprowadzić adres email
3. Zatwierdzić formularz
4. Sprawdzić, czy email z linkiem do resetowania hasła został wysłany

### 4.2. Zarządzanie Postami

#### TC-POST-001: Tworzenie nowego posta

1. Zalogować się jako zweryfikowany użytkownik
2. Przejść do formularza tworzenia posta
3. Wypełnić wszystkie wymagane pola
4. Zatwierdzić formularz
5. Sprawdzić, czy post został utworzony i wyświetlony na liście

#### TC-POST-002: Edycja istniejącego posta

1. Zalogować się jako właściciel posta
2. Przejść do widoku edycji posta
3. Zmodyfikować treść/tytuł
4. Zapisać zmiany
5. Sprawdzić, czy zmiany zostały zapisane w bazie danych

#### TC-POST-003: Usuwanie posta

1. Zalogować się jako właściciel posta
2. Wybrać opcję usunięcia posta
3. Potwierdzić usunięcie
4. Sprawdzić, czy post został usunięty z bazy danych

#### TC-POST-004: Filtrowanie i wyszukiwanie postów

1. Przejść do strony z listą postów
2. Zastosować filtry (kategoria, data, etc.)
3. Wprowadzić frazę wyszukiwania
4. Sprawdzić, czy wyświetlone posty odpowiadają kryteriom

### 4.3. Generowanie Treści za pomocą AI

#### TC-AI-001: Generowanie treści posta

1. Zalogować się jako użytkownik
2. Przejść do formularza tworzenia posta
3. Wprowadzić prompt dla AI
4. Uruchomić generowanie
5. Sprawdzić, czy treść została wygenerowana poprawnie

#### TC-AI-002: Edycja wygenerowanej treści

1. Zalogować się jako użytkownik
2. Wygenerować treść za pomocą AI
3. Ręcznie zmodyfikować wygenerowaną treść
4. Zapisać post
5. Sprawdzić, czy zmodyfikowana treść została zapisana

### 4.4. Zarządzanie Kategoriami

#### TC-CAT-001: Tworzenie nowej kategorii

1. Zalogować się jako administrator
2. Przejść do zarządzania kategoriami
3. Wybrać opcję dodania nowej kategorii
4. Wprowadzić nazwę i opis
5. Sprawdzić, czy kategoria została utworzona

#### TC-CAT-002: Przypisywanie posta do kategorii

1. Podczas tworzenia/edycji posta wybrać kategorię
2. Zapisać post
3. Sprawdzić, czy post jest prawidłowo przypisany do kategorii

## 5. Środowisko Testowe

### 5.1. Środowiska Testowe

- **Lokalne**: Do testów jednostkowych i integracyjnych
- **Lokalne**: Do testów E2E i wdrożeniowych

### 5.2. Konfiguracja Środowisk

- Lokalna instancja Supabase lub połączenie ze staging Supabase
- Klucze API dla Openrouter.ai z limitami testowymi
- Konfiguracja CI/CD poprzez Github Actions

## 6. Narzędzia do Testowania

### 6.1. Narzędzia do Testów Automatycznych

- **Vitest**: Testy jednostkowe i integracyjne
- **React Testing Library**: Testowanie komponentów React
- **Playwright**: Testy E2E i automatyzacja przeglądarki
- **Lighthouse/WebPageTest**: Testy wydajnościowe
- **Axe**: Testy dostępności

## 7. Harmonogram Testów

### 7.1. Testy Ciągłe (CI/CD)

- Testy jednostkowe i integracyjne przy każdym pull request
- Podstawowe testy E2E przy każdym merge do głównego brancha
- Testy bezpieczeństwa i dostępności raz w tygodniu

### 7.2. Testy Manualne

- Testy eksploracyjne po każdym większym wdrożeniu
- Testy użyteczności przy znaczących zmianach UI
- Pełny test regresji przed ważnymi wydaniami

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia

- Kod przeszedł code review
- Wszystkie automatyczne testy jednostkowe i integracyjne przechodzą
- Dokumentacja testowa jest aktualna

### 8.2. Kryteria Wyjścia

- Wszystkie testy priorytetowe zostały wykonane
- Wszystkie krytyczne i wysokie błędy zostały naprawione
- Pokrycie testami osiągnęło minimum 80%
- Wydajność i dostępność spełniają wymagane normy

## 9. Role i Odpowiedzialności w Procesie Testowania

### 9.1. QA Engineer

- Tworzenie i utrzymanie planu testów
- Projektowanie przypadków testowych
- Wykonywanie testów manualnych
- Analiza wyników testów automatycznych

### 9.2. Developer

- Pisanie i utrzymanie testów jednostkowych
- Naprawianie błędów znalezionych podczas testowania
- Współpraca przy testach integracyjnych

### 9.3. DevOps

- Konfiguracja i utrzymanie środowisk testowych
- Konfiguracja CI/CD dla testów automatycznych
- Monitorowanie wydajności aplikacji

## 10. Procedury Raportowania Błędów

### 10.1. Format Raportu Błędu

- Tytuł: Zwięzły opis problemu
- Środowisko: Gdzie wystąpił problem
- Kroki reprodukcji: Jak odtworzyć problem
- Oczekiwane zachowanie: Co powinno się zdarzyć
- Faktyczne zachowanie: Co się faktycznie dzieje
- Priorytet/Ważność: Jak pilny/ważny jest problem
- Załączniki: Zrzuty ekranu, logi, nagrania

## 11. Automatyzacja Testów

### 11.1. Strategia Automatyzacji

- Priorytetyzacja przypadków testowych do automatyzacji
- Podejście piramidy testów (najwięcej jednostkowych, najmniej E2E)
- Reużywalne komponenty testowe dla powtarzających się funkcjonalności

### 11.2. Framework Automatyzacji

- Organizacja kodu testowego zgodna ze strukturą projektu
- Wspólne utilities i helpery testowe
- Centralne zarządzanie danymi testowymi

## 12. Zarządzanie Ryzykiem

### 12.1. Zidentyfikowane Ryzyka

- Problemy z integracją Supabase przy aktualizacjach
- Niespójność w generowaniu treści przez różne modele AI
- Problemy wydajnościowe przy dużej liczbie użytkowników
- Opóźnienia w odpowiedziach API dla złożonych zapytań

### 12.2. Strategie Mitygacji Ryzyka

- Regularne testy integracyjne z Supabase
- Testy porównawcze dla różnych modeli AI
- Testy obciążeniowe i optymalizacja wydajności
- Monitoring czasu odpowiedzi API i optymalizacja zapytań

## 13. Zarządzanie Danymi Testowymi

### 13.1. Podejście do Danych Testowych

- Izolowane środowisko testowe z własnymi danymi
- Zautomatyzowane seedowanie bazy danych testowych
- Czyszczenie danych po zakończeniu testów

### 13.2. Ochrona Danych Testowych

- Nie używanie danych produkcyjnych w testach
- Anonimizacja danych testowych
- Regularne czyszczenie środowiska testowego
