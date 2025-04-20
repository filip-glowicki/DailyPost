# Plan wdrożenia usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter to moduł integrujący interfejs API OpenRouter z naszą aplikacją, który umożliwia uzupełnienie czatów opartych na modelach językowych (LLM). Moduł odpowiada za wysyłanie zapytań, przetwarzanie otrzymanych odpowiedzi oraz zapewnienie ustrukturyzowanej komunikacji między użytkownikiem a modelem AI.

## 2. Opis konstruktora

Konstruktor modułu inicjuje konfigurację niezbędną do komunikacji z API OpenRouter. Przyjmuje parametry takie jak API token, domyślne ustawienia modelu, komunikat systemowy oraz konfigurację klienta HTTP. Jego zadaniem jest walidacja przekazanych danych oraz przygotowanie środowiska do wysyłania zapytań.

## 3. Publiczne metody i pola

1. **initialize(config: OpenRouterConfig)** – Inicjalizuje moduł, ustawia konfigurację API oraz weryfikuje poprawność przekazanego tokena.
2. **sendRequest(prompt: string, size: string, options?: RequestOptions)** – Wysyła zapytanie do API, łącząc komunikat systemowy, komunikat użytkownika, nazwy modelu i parametry modelu, a następnie zwraca ustrukturyzowaną odpowiedź.
3. **setModelParameters(params: ModelParameters)** – Umożliwia dynamiczną zmianę parametrów modelu (np. temperature, max_tokens, top_p).
4. **getLastResponse()** – Zwraca ostatnią otrzymaną odpowiedź z API, ułatwiając debugowanie i monitorowanie odpowiedzi.

## 4. Prywatne metody i pola

1. **#createRequestPayload(prompt: string, options: RequestOptions)**
   - Buduje ładunek żądania, integrując:
     1. Komunikat systemowy – stały lub konfigurowalny, np. "System: Inicjuj proces generowania treści."
     2. Komunikat użytkownika – dynamiczny input od użytkownika.
     3. Nazwę modelu – np. "openrouter-llm-v1".
     4. Parametry modelu – np. { temperature: 1, max_tokens: 800, top_p: 0.95 }.
     5. Ustrukturyzowane odpowiedzi – zgodnie z wzorem:
        `{ type: 'json_schema', json_schema: { name: 'OpenRouterResponse', strict: true, schema: { text: 'string', additionalInfo: 'object' } } }`
2. **#validateResponse(response: any)**
   - Waliduje strukturę otrzymanej odpowiedzi z użyciem zdefiniowanego schematu JSON.
3. **#handleError(error: Error)**
   - Centralny mechanizm obsługi błędów, loguje problem, inicjuje ewentualny retry oraz zwraca ustrukturyzowany komunikat błędu.
4. Pola prywatne:
   - `#apiToken` – Przechowuje klucz API.
   - `#defaultModelParameters` – Domyślne ustawienia parametrów modelu.
   - `#httpClient` – Klient HTTP do komunikacji z API OpenRouter.
   - `#lastResponse` – Przechowuje ostatnią odpowiedź do celów debugowania.

## 5. Obsługa błędów

Potencjalne scenariusze błędów oraz sposoby ich rozwiązania:

1. **Błąd połączenia (network timeout, niedostępność API)**
   - Rozwiązanie: Implementacja mechanizmu ponawiania żądań (retry) z eksponencjalnym backoff, logowanie szczegółów błędu.
2. **Błąd autoryzacji (nieprawidłowy API token)**
   - Rozwiązanie: Walidacja tokena podczas inicjalizacji, zwracanie specyficznego komunikatu błędu oraz możliwość odświeżenia tokena.
3. **Nieprawidłowy format odpowiedzi (błąd walidacji JSON)**
   - Rozwiązanie: Użycie walidatora (np. ajv) do sprawdzenia zgodności odpowiedzi z ustalonym schematem. W przypadku niezgodności, zwrócenie ustrukturyzowanego komunikatu błędu.
4. **Błąd wewnętrzny serwisu (wyjątki, nieprzewidziane stany)**
   - Rozwiązanie: Centralny mechanizm obsługi błędów, który wychwytuje wszystkie wyjątki, loguje je oraz komunikuje użytkownikowi przyjazny komunikat o problemie.

## 6. Kwestie bezpieczeństwa

1. **Bezpieczeństwo tokena API** – Przechowywanie tokena jako zmiennej środowiskowej lub w bezpiecznym magazynie, nigdy w kodzie źródłowym.
2. **Walidacja danych wejściowych** – Sanityzacja i walidacja promptów wejściowych w celu ograniczenia ryzyka ataków injection.
3. **Szyfrowana komunikacja** – Użycie protokołu HTTPS do komunikacji z API OpenRouter.
4. **Rate Limiting i Monitoring** – Implementacja ograniczeń liczby żądań oraz monitorowanie nietypowej aktywności.
5. **Logowanie i audyt** – Szczegółowe logowanie błędów oraz podejrzanych operacji w celu szybkiej identyfikacji i reakcji na incydenty.

## 7. Plan wdrożenia krok po kroku

1. **Analiza wymagań**
   - Zapoznanie się z dokumentacją API OpenRouter oraz wewnętrznymi wymaganiami aplikacji.
2. **Konfiguracja środowiska**
   - Ustawienie zmiennych środowiskowych (API token, baza URL) i konfiguracja klienta HTTP.
3. **Implementacja konstruktora i publicznych metod**
   - Stworzenie konstruktora inicjującego konfigurację.
   - Implementacja metody `sendRequest`, która scalam komunikaty (systemowy i użytkownika), nazwę modelu i parametry modelu.
4. **Integracja kluczowych elementów zapytania**
   - Komunikat systemowy: Definicja stałego komunikatu w konfiguracji (np. "System: Inicjuj generowanie treści według ustalonych reguł.").
   - Komunikat użytkownika: Pobierany dynamicznie z interakcji użytkownika.
   - Ustrukturyzowane odpowiedzi: Wdrożenie wzoru:
     `{ type: 'json_schema', json_schema: { name: 'OpenRouterResponse', strict: true, schema: { text: "string", additionalInfo: "object" } } }`
   - Nazwa modelu: Przykładowo "openrouter-llm-v1".
   - Parametry modelu: Ustawienie parametrów takich jak `temperature: 0.7`, `max_tokens: 1024`, `top_p: 0.95`.
5. **Implementacja metod prywatnych**
   - Opracowanie metody budowy payloadu żądania (#createRequestPayload).
   - Dodanie walidacji odpowiedzi (#validateResponse) przy użyciu schematu JSON.
   - Implementacja centralnej obsługi błędów (#handleError).
6. **Testowanie integracyjne**
   - Przeprowadzenie testów z użyciem rzeczywistego środowiska API OpenRouter, symulacja różnych scenariuszy oraz walidacja odpowiedzi i obsługi błędów.
7. **Przegląd bezpieczeństwa i optymalizacja**
   - Weryfikacja bezpieczeństwa przetwarzania danych, testy penetracyjne i walidacja konfiguracji HTTPS.
8. **Dokumentacja i deployment**
   - Sporządzenie dokumentacji technicznej modułu oraz wdrożenie usługi na środowiskach staging i produkcyjnym z zachowaniem CI/CD.
