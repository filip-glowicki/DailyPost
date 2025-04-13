# Dokument wymagań produktu (PRD) - DailyPost

## 1. Przegląd produktu

DailyPost to nowoczesna aplikacja umożliwiająca tworzenie, edycję i zarządzanie postami z wykorzystaniem technologii AI. Frontend opiera się na Next.js 15, React 19, TypeScript 5, Tailwind CSS 4 oraz bibliotece Shadcn/ui, co gwarantuje szybki, responsywny i estetyczny interfejs. Backend realizowany jest przy użyciu Supabase, który oferuje bazę danych PostgreSQL, mechanizmy autoryzacji oraz funkcjonalności Backend-as-a-Service. Integracja z openrouter.ai umożliwia komunikację z wieloma modelami AI, co pozwala na generowanie treści, a proces CI/CD wspierany jest przez Github Actions oraz wdrażanie przy użyciu Coolify.

## 2. Problem użytkownika

Użytkownicy poszukują narzędzia, które umożliwi:

- Automatyczne generowanie wysokiej jakości treści, co znacząco skróci czas tworzenia postów.
- Możliwość łatwej edycji generowanych treści, by dostosować je do indywidualnych potrzeb.
- Intuicyjne zarządzanie postami, w tym ich sortowanie, filtrowanie oraz kategoryzację.
- Szybkie i bezpieczne logowanie oraz dostęp do historii postów wraz z kluczowymi informacjami (tytuł, daty, kategorie).
- Efektywne udostępnianie postów na platformach społecznościowych za pomocą specjalnie skonstruowanych URL.

## 3. Wymagania funkcjonalne

- Automatyczne generowanie postów przy użyciu modelu GPT-4o mini z możliwością dalszej edycji.
- Obsługa trybu automatycznego (domyślnie po zalogowaniu) oraz ręcznego tworzenia postów poprzez wyraźny switcher.
- Funkcjonalność edycji i usuwania postów z pełną swobodą modyfikacji treści (bez przechowywania poprzednich wersji).
- Dodawanie tytułu, kategorii (z predefiniowanej listy lub poprzez dodanie nowej) przy tworzeniu postu.
- Przechowywanie historii postów wraz z metadanymi: datą utworzenia, datą aktualizacji, tytułem oraz kategorią, z możliwością sortowania i filtrowania.
- Integracja z mechanizmami udostępniania postów na platformach takich jak X i Facebook przez generowanie URL z odpowiednimi parametrami.
- Możliwość łatwego kopiowania wygenerowanego posta za pomocą dedykowanego przycisku – dostępnego zarówno tuż po wygenerowaniu, jak i w historii postów.
- System powiadomień informujący o przekroczeniu limitów znaków (500 znaków dla promptu, 1000 znaków dla treści postu) oraz innych ważnych komunikatach.
- Bezpieczny system logowania oparty na mechanizmach autentykacji oferowanych przez Supabase.

## 4. Granice produktu

- MVP nie uwzględnia wersjonowania postów – zapisywany jest tylko jeden, aktualny stan treści.
- Brak funkcji oceniania postów oraz ustawiania ich widoczności (prywatny/publiczny).
- Szczegółowa definicja metryk modyfikacji treści (np. liczba zmodyfikowanych słów) wymaga dalszych ustaleń technicznych.
- Ustawienia limitów API i ich zarządzanie (w tym limity finansowe) będą przedmiotem kolejnych faz projektu.
- Brak integracji z systemami analityki.

## 5. Historyjki użytkowników

- ID: US-001
  Tytuł: Bezpieczne logowanie i autoryzacja
  Opis: Użytkownik musi mieć możliwość rejestracji oraz logowania do systemu, aby bezpiecznie zarządzać swoimi postami i danymi osobowymi.
  Kryteria akceptacji:

  - Użytkownik może zarejestrować się i zalogować, korzystając z mechanizmu autentykacji (np. Supabase Auth).
  - Dostęp do aplikacji jest ograniczony do autoryzowanych użytkowników.

- ID: US-002
  Tytuł: Automatyczne generowanie postów
  Opis: Jako użytkownik chcę, aby system automatycznie generował posty przy użyciu GPT-4o mini, co pozwoli mi szybko otrzymać bazowy tekst do dalszej edycji.
  Kryteria akceptacji:

  - Po zalogowaniu użytkownik wybiera kategorię, wpisuje krótki opis posta (np. z datą i kontekstem), ustawia długość posta za pomocą suwaka (krótki / średni / długi), a następnie po kliknięciu „Generuj” system – wykorzystując integrację z OpenRouter (GPT-4o mini) – generuje finalną wersję posta
  - Wygenerowany post jest wyświetlany z możliwością dalszej, swobodnej edycji.

- ID: US-003
  Tytuł: Przełączanie między trybem automatycznym a ręcznym
  Opis: Jako użytkownik chcę mieć możliwość łatwej zmiany trybu generowania postów, aby dostosować proces tworzenia do moich preferencji.
  Kryteria akceptacji:

  - Aplikacja udostępnia wyraźny switcher umożliwiający przełączanie między trybem automatycznym a ręcznym.
  - Tryb ręczny umożliwia całkowicie manualne sporządzanie treści.

- ID: US-004
  Tytuł: Edycja postów
  Opis: Jako użytkownik chcę móc edytować treść postów (zarówno wygenerowanych automatycznie, jak i stworzonych ręcznie), aby dostosować je do moich potrzeb.
  Kryteria akceptacji:

  - Użytkownik ma możliwość zmiany treści postu bez ograniczeń.
  - Zmodyfikowany post zostaje zapisany, a poprzednia wersja nie jest archiwizowana.

- ID: US-005
  Tytuł: Usuwanie postów
  Opis: Jako użytkownik chcę mieć możliwość usuwania postów, aby usuwać te, które są nieaktualne lub niechciane.
  Kryteria akceptacji:

  - Użytkownik może usunąć post za pomocą dedykowanego przycisku lub opcji.
  - Usunięcie postu jest potwierdzane, a post znika z historii.

- ID: US-006
  Tytuł: Dodawanie tytułu do postów
  Opis: Jako użytkownik chcę móc przypisywać tytuły oraz kategorie do postów, aby ułatwić ich organizację i późniejsze wyszukiwanie.
  Kryteria akceptacji:

  - Formularz tworzenia posta zawiera pola na tytuł, kategorię oraz prompt użytkownika (krótki opis posta z datą i kontekstem). Dodatkowo zawiera suwak do wyboru długości posta (krótki / średni / długi) oraz przycisk „Generuj”, który uruchamia generowanie finalnej wersji posta przy użyciu OpenRouter (GPT-4o mini).
  - Dodane tytuły, kategorie oraz finalna treść wygenerowanego posta są zapisywane i widoczne w historii postów użytkownika.

- ID: US-007
  Tytuł: Zarządzanie kategoriami
  Opis: Jako użytkownik chcę wybierać kategorię z predefiniowanej listy lub dodawać własną, aby właściwie kategoryzować posty.
  Kryteria akceptacji:

  - Użytkownik ma dostęp do listy predefiniowanych kategorii podczas tworzenia postu.
  - Użytkownik może dodać nową kategorię, która natychmiast pojawia się w dostępnej liście.

- ID: US-008
  Tytuł: Udostępnianie postów przez URL
  Opis: Jako użytkownik chcę, aby system generował unikalne URL-e z odpowiednimi parametrami, umożliwiając mi łatwe udostępnianie postów na platformach społecznościowych.
  Kryteria akceptacji:

  - Dla każdego postu generowany jest unikalny URL zawierający parametry umożliwiające udostępnienie na platformach X i Facebook.
  - Proces udostępniania jest intuicyjny i nie wymaga dodatkowych kroków.

- ID: US-009
  Tytuł: Przeglądanie historii postów
  Opis: Jako użytkownik chcę mieć dostęp do historii moich postów, aby móc je przeglądać, sortować i filtrować według daty, tytułu oraz kategorii.
  Kryteria akceptacji:

  - Historia postów wyświetla datę utworzenia, datę ostatniej modyfikacji, tytuł, kategorię oraz finalną treść posta.
  - Użytkownik ma możliwość sortowania i filtrowania postów według wybranych kryteriów.

- ID: US-010
  Tytuł: System powiadomień i notyfikacji
  Opis: Jako użytkownik chcę otrzymywać jasne powiadomienia o przekroczeniach limitów znaków i innych krytycznych komunikatach, aby być na bieżąco z ograniczeniami systemu.
  Kryteria akceptacji:
  - System wyświetla popupy informujące o przekroczeniu 500 znaków w polu prompt oraz 1000 znaków w treści postu.
  - Notyfikacje są czytelne i pojawiają się w odpowiednich momentach użytkowania aplikacji.

## 6. Metryki sukcesu

- Co najmniej 50% automatycznie generowanych postów spełnia oczekiwania użytkowników, co można mierzyć wskaźnikami modyfikacji treści.
- Znaczące skrócenie czasu tworzenia postów dzięki automatyzacji, co minimalizuje potrzebę ręcznych modyfikacji.
- Wysoka responsywność i intuicyjność interfejsu, potwierdzona poprzez testy użyteczności oraz feedback UX.
