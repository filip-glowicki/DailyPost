# Architektura UI dla DailyPost

## 1. Przegląd struktury UI

Interfejs użytkownika DailyPost został zaprojektowany jako zbiór oddzielnych, modularnych stron Next.js, które realizują kluczowe funkcjonalności aplikacji. System opiera się na współdzielonych, responsywnych komponentach biblioteki Shadcn, zapewniających spójność wizualną, dostępność (WCAG 2.1 A) oraz intuicyjne doświadczenie użytkownika. Główne akcje, takie jak logowanie, rejestracja, generowanie i edycja postów, przegląd historii oraz zarządzanie kategoriami, są realizowane w dedykowanych widokach. Integracja z API oraz mechanizmy walidacji (np. liczniki znaków dla promptu i treści) są wspierane przez toast notifications dla szybkiego feedbacku użytkownika.

## 2. Lista widoków

- **Widok Logowania**

  - Ścieżka: `/login`
  - Główny cel: Umożliwić użytkownikom bezpieczne logowanie się do aplikacji.
  - Kluczowe informacje: Formularz logowania zawierający pola e-mail i hasło, komunikat informujący użytkownika o konieczności logowania (dla niezalogowanych użytkowników).
  - Kluczowe komponenty: Formularz logowania, pola tekstowe, przyciski, nagłówek z informacją oraz toast notifications.
  - UX, dostępność i bezpieczeństwo:
    - Zgodność z WCAG 2.1,
    - Natychmiastowa walidacja formularza,
    - Szybki feedback i zabezpieczenia przed nieautoryzowanym dostępem.

- **Widok Rejestracji**

  - Ścieżka: `/register`
  - Główny cel: Umożliwić użytkownikom tworzenie nowego konta.
  - Kluczowe informacje: Formularz rejestracji z polami niezbędnymi do utworzenia konta, wykorzystujący wspólne komponenty z widokiem logowania.
  - Kluczowe komponenty: Formularz rejestracji, pola tekstowe, przyciski.
  - UX, dostępność i bezpieczeństwo:
    - Spójność z widokiem logowania,
    - Walidacja danych w czasie rzeczywistym,
    - Ochrona przed duplikatami i błędami podczas rejestracji.

- **Widok Generowania/Edycji Postu**

  - Ścieżka: `/post/editor`
  - Główny cel: Umożliwić generowanie nowych postów przy pomocy AI oraz edycję wygenerowanych treści.
  - Kluczowe informacje: Formularz z polami: tytuł, prompt (z limitem 500 znaków), wybór kategorii, suwak do wyboru długości postu oraz treść (z limitem 1000 znaków). Opcja inicjacji trybu edycji przez kliknięcie przycisku z ikoną długopisu.
  - Kluczowe komponenty: Formularz generowania postu, licznik znaków, ikona długopisu, przyciski (Generuj, Edytuj, Zapisz), toast notifications.
  - UX, dostępność i bezpieczeństwo:
    - Wyraźne oddzielenie trybu generowania od edycji,
    - Walidacja limitów znaków,
    - Szybki feedback operacji,
    - Bezpieczne przechowywanie treści.

- **Widok Historii Postów**

  - Ścieżka: `/posts/history`
  - Główny cel: Prezentacja listy postów użytkownika z możliwością filtrowania, sortowania i paginacji.
  - Kluczowe informacje: Lista postów ze szczegółami (tytuł, data utworzenia, kategoria, status), filtry oraz opcje edycji/usuwania.
  - Kluczowe komponenty: Lista postów, komponenty paginacji, filtry, przyciski akcji (edycja, usunięcie), toast notifications.
  - UX, dostępność i bezpieczeństwo:
    - Intuicyjna prezentacja danych,
    - Łatwa nawigacja po liście postów,
    - Potwierdzenie operacji usunięcia/edycji.

- **Widok Zarządzania Kategoriami**
  - Ścieżka: `/categories`
  - Główny cel: Umożliwić użytkownikowi zarządzanie kategoriami (dodawanie, edytowanie, usuwanie).
  - Kluczowe informacje: Formularz do dodawania/edycji kategorii, lista istniejących kategorii z metadanymi (nazwa, opis do 250 znaków).
  - Kluczowe komponenty: Formularz zarządzania kategoriami, lista kategorii, przyciski operacyjne, toast notifications.
  - UX, dostępność i bezpieczeństwo:
    - Prosty i przejrzysty interfejs,
    - Natychmiastowa walidacja ograniczeń znakowych,
    - Bezpieczne operacje modyfikacji danych.

## 3. Mapa podróży użytkownika

1. Użytkownik uruchamia aplikację i widzi stronę główną z komunikatem na śrokdu strony zachęcającego go do zalogowania się do systemu (dla niezalogowanych użytkowników).
2. Przejście do widoku logowania lub rejestracji, gdzie użytkownik uwierzytelnia się lub rejestruje.
3. Po zalogowaniu użytkownik zostaje przekierowany do widoku Generowania/Edycji Postu (/post/editor), gdzie może rozpocząć tworzenie nowego posta.
4. Użytkownik może przejść do widoku Historii Postów, gdzie przegląda, filtruje i sortuje swoje posty oraz podejmuje dalsze akcje (edycja lub usunięcie).
5. W sekcji Zarządzania Kategoriami, użytkownik dodaje, modyfikuje lub usuwa swoją kategorie, co jest natychmiast potwierdzane przez odpowiednie powiadomienia.

## 4. Układ i struktura nawigacji

- Główna nawigacja będzie umieszczona w nagłówku, umożliwiając przełączanie między kluczowymi widokami: Logowanie/Rejestracja, Generowanie/Edycji Postu, Historia Postów i Zarządzanie Kategoriami.
- Dla użytkowników niezalogowanych, nagłówek wyświetla komunikat (np. "Zaloguj się, aby zacząć generowanie") wraz z odpowiednią ikonką.
- Nawigacja będzie responsywna, umożliwiając łatwy dostęp zarówno na urządzeniach mobilnych, jak i desktopowych.
- Kluczowe akcje, takie jak generowanie lub edycja postu, będą wyróżnione przyciskami z ikonami, poprawiającymi intuicyjność interakcji.

## 5. Kluczowe komponenty

- Komponenty formularzy autoryzacyjnych (logowanie, rejestracja) z natychmiastową walidacją i toast notifications.
- Edytor postu z licznikiem znaków, trybem edycji inicjowanym przez przycisk z ikoną długopisu oraz walidacją limitów (500 znaków dla promptu, 1000 dla treści).
- Lista postów wraz z komponentami paginacji, filtrowania i sortowania, wykorzystująca predefiniowane komponenty z biblioteki Shadcn.
- Formularze do zarządzania kategoriami z walidacją ograniczeń (opis do 250 znaków) oraz mechanizmem obsługi toast notifications po operacjach.
- Wspólny nagłówek i pasek boczny zawierające nawigację między widokami, komunikaty o autoryzacji oraz alerty.
- Toast notifications informujące użytkownika o efekcie operacji (sukces, błąd) oraz przekroczeniach limitów.
- Komponenty responsywne, zapewniające pełną dostępność (WCAG 2.1) i bezpieczeństwo operacji na danych.
