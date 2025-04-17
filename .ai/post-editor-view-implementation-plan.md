# Plan implementacji widoku Edytora Postów

## 1. Przegląd

Widok Edytora Postów (`/post/editor`) jest centralnym miejscem aplikacji DailyPost, umożliwiającym użytkownikom tworzenie nowych postów (zarówno ręcznie, jak i z pomocą AI) oraz edycję istniejącego. Widok integruje formularz do wprowadzania danych, mechanizmy interakcji z API do generowania i zapisywania treści, oraz komponenty UI z biblioteki Shadcn dla spójnego wyglądu i funkcjonalności.

## 2. Routing widoku

Widok Edytora Postów będzie dostępny pod ścieżką `/post/editor`. Routing zostanie skonfigurowany w systemie routingu Next.js (App Router).

## 3. Struktura komponentów

```
PostEditorView (Page Component @ /post/editor)
├── PostForm
│   ├── Input (dla tytułu)
│   ├── Textarea (dla promptu, z licznikiem znaków)
│   ├── CategorySelect (Select z opcją dodawania nowej kategorii)
│   ├── LengthSlider (Slider dla długości posta)
│   ├── ModeSwitcher (Switch dla trybu Auto/Manual)
│   ├── Textarea (dla treści posta, z licznikiem znaków, widoczne w trybie Manual/Edycja)
│   └── Button (Generuj/Zapisz)
├── PostDisplay
│   ├── Typography (wyświetlanie tytułu)
│   ├── Typography (wyświetlanie treści)
│   ├── Button (Kopiuj treść)
│   └── Button (Edytuj post - ikona długopisu)
└── ToastNotifier (dla powiadomień)
```

## 4. Szczegóły komponentów

### `PostEditorView` (Komponent Strony)

- **Opis komponentu**: Główny kontener widoku, zarządzający stanem edytora, trybem pracy (generowanie/edycja/manual), ładowaniem danych posta (jeśli ID jest w URL) i interakcją z API.
- **Główne elementy**: Renderuje `PostForm` lub `PostDisplay` w zależności od stanu (czy post został wygenerowany/załadowany). Zarządza logiką przełączania trybów.
- **Obsługiwane interakcje**: Inicjalizacja widoku (ładowanie posta do edycji, jeśli `postId` jest obecny w parametrach URL), obsługa przełączania trybów (Auto/Manual), obsługa przejścia do trybu edycji.
- **Obsługiwana walidacja**: Brak bezpośredniej walidacji, deleguje do `PostForm`.
- **Typy**: `PostDTO` (opcjonalnie, do edycji), `CategoryDTO[]` (lista kategorii).
- **Propsy**: Brak (jest to komponent strony).

### `PostForm`

- **Opis komponentu**: Formularz do wprowadzania danych dla nowego posta (tytuł, prompt, kategoria, długość) lub edycji istniejącego (wszystkie pola). Zawiera logikę walidacji i obsługę wysyłania danych.
- **Główne elementy**: `Input` (tytuł), `Textarea` (prompt), `CategorySelect`, `LengthSlider`, `ModeSwitcher`, `Textarea` (treść - warunkowo), `Button` (submit). Wykorzystuje komponenty Shadcn/ui (`Input`, `Textarea`, `Select`, `Slider`, `Switch`, `Button`, `Label`, `Form`).
- **Obsługiwane interakcje**: Wprowadzanie danych w pola formularza, wybór kategorii, zmiana długości posta, przełączanie trybu Auto/Manual, wysłanie formularza (generowanie/zapis).
- **Obsługiwana walidacja**:
  - Tytuł: wymagany, min. 1 znak, max. 200 znaków.
  - Prompt: wymagany (w trybie Auto), min. 1 znak, max. 500 znaków (wyświetlanie licznika).
  - Kategoria: wymagana.
  - Treść: wymagana (w trybie Manual/Edycja), min. 1 znak, max. 1000 znaków (wyświetlanie licznika).
  - Długość posta (size): wymagana (w trybie Auto).
- **Typy**: `CreatePostCommand`, `UpdatePostCommand`, `CategoryDTO[]`. Wewnętrzny stan formularza (ViewModel).
- **Propsy**:
  - `initialData?: PostDTO` (dane posta do edycji)
  - `categories: CategoryDTO[]` (lista dostępnych kategorii)
  - `onSubmit: (data: CreatePostCommand | UpdatePostCommand) => Promise<void>` (funkcja do obsługi wysłania)
  - `isLoading: boolean` (status ładowania)
  - `mode: 'auto' | 'manual' | 'edit'` (aktualny tryb pracy)
  - `onModeChange: (mode: 'auto' | 'manual') => void` (funkcja do zmiany trybu)

### `CategorySelect`

- **Opis komponentu**: Komponent `Select` (Shadcn/ui) pozwalający wybrać kategorię z listy. Powinien umożliwiać dodanie nowej kategorii (np. przez dedykowany przycisk otwierający modal lub nawigujący do widoku zarządzania kategoriami).
- **Główne elementy**: `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `Button` (opcjonalnie, "Dodaj nową").
- **Obsługiwane interakcje**: Wybór kategorii z listy, inicjacja dodawania nowej kategorii.
- **Obsługiwana walidacja**: Wymagany wybór.
- **Typy**: `CategoryDTO[]`.
- **Propsy**:
  - `categories: CategoryDTO[]`
  - `value: string | undefined`
  - `onChange: (value: string) => void`
  - `onAddNewCategory?: () => void`

### `LengthSlider`

- **Opis komponentu**: Komponent `Slider` (Shadcn/ui) do wyboru długości generowanego posta (np. mapowanie wartości 1, 2, 3 na "krótki", "średni", "długi").
- **Główne elementy**: `Slider`, `Label`.
- **Obsługiwane interakcje**: Przesuwanie suwaka.
- **Obsługiwana walidacja**: Wymagana wartość (w trybie Auto).
- **Typy**: Brak specyficznych.
- **Propsy**:
  - `value: string` (np. "krótki", "średni", "długi")
  - `onChange: (value: string) => void`

### `ModeSwitcher`

- **Opis komponentu**: Komponent `Switch` (Shadcn/ui) do przełączania między trybem automatycznym (AI) a ręcznym tworzeniem posta.
- **Główne elementy**: `Switch`, `Label`.
- **Obsługiwane interakcje**: Kliknięcie przełącznika.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych.
- **Propsy**:
  - `mode: 'auto' | 'manual'`
  - `onChange: (mode: 'auto' | 'manual') => void`

### `PostDisplay`

- **Opis komponentu**: Wyświetla sformatowaną treść wygenerowanego lub załadowanego posta. Umożliwia skopiowanie treści i przejście do trybu edycji.
- **Główne elementy**: Komponenty `Typography` (Shadcn/ui lub standardowe `h1`, `p`), `Button` (Kopiuj), `Button` (Edytuj - ikona długopisu).
- **Obsługiwane interakcje**: Kliknięcie przycisku "Kopiuj", kliknięcie przycisku "Edytuj".
- **Obsługiwana walidacja**: Brak.
- **Typy**: `PostDTO`.
- **Propsy**:
  - `post: PostDTO`
  - `onEdit: () => void`
  - `onCopy: (content: string) => void`

### `ToastNotifier`

- **Opis komponentu**: Wykorzystuje system `Toast` z Shadcn/ui do wyświetlania powiadomień o sukcesie (np. post zapisany), błędzie (np. błąd walidacji, błąd API) lub informacji (np. przekroczenie limitu znaków podczas wpisywania - opcjonalnie, walidacja może być tylko przy wysyłce).
- **Główne elementy**: Wykorzystuje hook `useToast` z Shadcn/ui.
- **Obsługiwane interakcje**: Wyświetlanie powiadomień na podstawie zdarzeń w aplikacji.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych.
- **Propsy**: Brak (logika wywoływana przez inne komponenty).

## 5. Typy

- **`PostDTO`**: Zdefiniowany w `@/types.ts`. Używany do wyświetlania istniejącego posta i jako typ odpowiedzi z API.
  ```typescript
  export type PostDTO = {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    title: string;
    prompt: string | null; // Może być null dla ręcznie stworzonych
    size: string | null; // Może być null dla ręcznie stworzonych
    content: string;
    category_id: string;
  };
  ```
- **`CategoryDTO`**: Zdefiniowany w `@/types.ts`. Używany do pobierania i wyświetlania listy kategorii.
  ```typescript
  export type CategoryDTO = {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    user_id: string;
  };
  ```
- **`CreatePostCommand`**: Zdefiniowany w `@/types.ts`. Używany jako ciało żądania POST `/posts` (generowanie AI).
  ```typescript
  export type CreatePostCommand = {
    title: string;
    prompt: string;
    size: string; // "krótki", "średni", "długi"
    category_id: string;
  };
  ```
- **`UpdatePostCommand`**: Zdefiniowany w `@/types.ts`. Używany jako ciało żądania PUT `/posts/{id}` (edycja/zapis manualny).
  ```typescript
  export type UpdatePostCommand = {
    id: string;
    title?: string;
    prompt?: string | null; // Przy edycji może być null lub zmieniony
    size?: string | null; // Przy edycji może być null lub zmieniony
    content?: string;
    category_id?: string;
  };
  ```
- **`PostEditorViewModel` (Niestandardowy typ)**: Wewnętrzny typ dla stanu formularza w `PostForm`.
  ```typescript
  type PostEditorViewModel = {
    id?: string; // Obecne tylko w trybie edycji
    title: string;
    prompt: string;
    size: string; // np. "średni"
    categoryId: string;
    content: string;
    mode: "auto" | "manual" | "edit"; // Tryb pracy formularza
    isGenerated: boolean; // Czy post został już wygenerowany/załadowany
  };
  ```

## 6. Zarządzanie stanem

- Główny stan widoku (dane posta, tryb pracy, status ładowania, lista kategorii) będzie zarządzany w komponencie `PostEditorView` przy użyciu hooków `useState` i `useEffect` (do ładowania danych).
- Stan formularza (`PostForm`) będzie zarządzany lokalnie w tym komponencie, potencjalnie z użyciem biblioteki do zarządzania formularzami jak `react-hook-form` dla uproszczenia walidacji i obsługi stanu pól.
- Można rozważyć stworzenie customowego hooka `usePostEditor(postId?: string)` encapsulującego logikę ładowania danych posta (jeśli `postId` jest podany), pobierania kategorii, obsługi trybów (Auto/Manual/Edit) oraz interakcji z API (generowanie, zapis). Hook zwracałby stan (dane posta, kategorie, status ładowania, błędy) oraz funkcje do manipulacji (np. `generatePost`, `savePost`, `setMode`).

```typescript
// Przykład sygnatury customowego hooka
function usePostEditor(postId?: string) {
  const [post, setPost] = useState<PostDTO | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [mode, setMode] = useState<"auto" | "manual" | "edit">("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Shadcn UI Toast

  // useEffect do ładowania danych posta (jeśli postId istnieje) i kategorii

  const handleGeneratePost = async (command: CreatePostCommand) => {
    /* ... logika API ... */
  };
  const handleUpdatePost = async (command: UpdatePostCommand) => {
    /* ... logika API ... */
  };
  const handleSaveManualPost = async (
    command: Omit<UpdatePostCommand, "id"> & { id?: string }
  ) => {
    /* ... logika API (create lub update) ... */
  };

  return {
    post,
    categories,
    mode,
    setMode,
    isLoading,
    error,
    actions: {
      generate: handleGeneratePost,
      save: mode === "edit" ? handleUpdatePost : handleSaveManualPost,
      // inne akcje?
    },
  };
}
```

## 7. Integracja API

- **Pobieranie kategorii**: Wywołanie akcji serwerowej (np. `getCategories`) przy montowaniu komponentu `PostEditorView` lub w hooku `usePostEditor`. Typ odpowiedzi: `ApiResponse<CategoryDTO[]>`.
- **Generowanie posta (Tryb Auto)**:
  - Wywołanie akcji serwerowej `generatePost` (z `src/actions/posts/generate.ts`) po wysłaniu formularza `PostForm` w trybie 'auto'.
  - **Typ żądania**: `CreatePostCommand` (`{ title, prompt, size, category_id }`).
  - **Typ odpowiedzi**: `ApiResponse<PostDTO>`. Po sukcesie, odpowiedź zawiera nowo utworzony `PostDTO`. Widok powinien przejść do wyświetlania `PostDisplay` z danymi zwróconego posta.
- **Zapisywanie posta (Tryb Manual lub Edycja)**:
  - Wywołanie akcji serwerowej `updatePost` (z `src/actions/posts/update.ts`) po wysłaniu formularza `PostForm` w trybie 'manual' lub 'edit'.
  - Jeśli tworzymy nowy post manualnie (brak `postId`), może być potrzebna dedykowana akcja `createManualPost` lub modyfikacja `updatePost` aby obsługiwała tworzenie jeśli ID nie istnieje (mniej prawdopodobne, lepiej mieć osobną akcję lub logikę w hooku, która najpierw tworzy pusty post a potem go aktualizuje, albo akcja `updatePost` tworzy wpis jeśli ID nie podano - ale aktualna implementacja wymaga ID). **Założenie**: Tryb 'manual' używa `updatePost` na istniejącym ID (jeśli edytujemy) lub wymaga innej logiki do stworzenia posta. **Rekomendacja**: Dodać akcję `createManualPost` lub rozszerzyć logikę `updatePost` (mniej czyste). Alternatywnie, przy pierwszym zapisie manualnym wywołać `generatePost` z pustym promptem/specjalnym flagowaniem lub dedykowaną akcją tworzącą. _Aktualizacja_: `generatePost` wymaga promptu. `updatePost` wymaga ID. Najprościej będzie dodać akcję `createPost` która przyjmuje `content` zamiast `prompt` i `size`. Na potrzeby tego planu, zakładamy, że `updatePost` będzie używane do zapisu zmian w trybie 'edit', a tryb 'manual' wymaga rozważenia jak zainicjować post (np. przy przełączeniu na manual od razu tworzymy draft?). Dla uproszczenia: załóżmy, że tryb manualny działa tylko na _istniejącym_ poście (czyli po wygenerowaniu lub załadowaniu do edycji).
  - **Typ żądania**: `UpdatePostCommand` (`{ id, title?, content?, category_id? }`). `prompt` i `size` nie są edytowalne/relevantne w trybie manualnym/edycji treści.
  - **Typ odpowiedzi**: `ApiResponse<PostDTO>`. Po sukcesie, odpowiedź zawiera zaktualizowany `PostDTO`. Widok powinien wyświetlić powiadomienie o sukcesie.
- **Pobieranie posta do edycji**: Jeśli URL zawiera `postId`, wywołać akcję serwerową (np. `getPostById(postId)`) przy inicjalizacji widoku. Typ odpowiedzi: `ApiResponse<PostDTO>`.

## 8. Interakcje użytkownika

- **Wpisywanie w pola formularza**: Aktualizacja stanu lokalnego formularza. Liczniki znaków dla `prompt` i `content` aktualizują się na bieżąco.
- **Wybór kategorii**: Aktualizacja stanu formularza.
- **Zmiana długości (Slider)**: Aktualizacja stanu formularza.
- **Przełączanie trybu (Switch)**: Zmiana stanu `mode` w `PostEditorView` (lub hooku). Powoduje warunkowe renderowanie pól formularza (np. ukrycie/pokazanie pola `content`, zmiana etykiety przycisku submit).
- **Kliknięcie "Generuj"**:
  - Walidacja formularza (tytuł, prompt, kategoria, długość).
  - Jeśli walidacja poprawna: Wywołanie `handleGeneratePost`. Wyświetlenie stanu ładowania. Po otrzymaniu odpowiedzi:
    - Sukces: Ukrycie formularza, wyświetlenie `PostDisplay` z nowym postem, pokazanie `Toast` o sukcesie.
    - Błąd: Wyświetlenie `Toast` z błędem. Formularz pozostaje widoczny.
- **Kliknięcie "Zapisz" (w trybie Manual/Edycja)**:
  - Walidacja formularza (tytuł, treść, kategoria).
  - Jeśli walidacja poprawna: Wywołanie `handleUpdatePost`. Wyświetlenie stanu ładowania. Po otrzymaniu odpowiedzi:
    - Sukces: Aktualizacja danych posta w stanie (jeśli potrzebne), pokazanie `Toast` o sukcesie. Formularz pozostaje widoczny (tryb edycji).
    - Błąd: Wyświetlenie `Toast` z błędem.
- **Kliknięcie "Edytuj" (ikona długopisu na `PostDisplay`)**: Zmiana stanu widoku na tryb edycji (`mode = 'edit'`). Ukrycie `PostDisplay`, pokazanie `PostForm` wypełnionego danymi edytowanego posta.
- **Kliknięcie "Kopiuj" (na `PostDisplay`)**: Skopiowanie treści posta do schowka. Wyświetlenie `Toast` potwierdzającego.

## 9. Warunki i walidacja

- **Limit znaków Prompt**: 500 znaków. Weryfikacja w `PostForm` przy wysyłce (i opcjonalnie na bieżąco z wizualnym licznikiem). Blokuje wysłanie, jeśli przekroczone. Wyświetla `Toast` błędu walidacji.
- **Limit znaków Treść**: 1000 znaków. Weryfikacja w `PostForm` przy wysyłce (i opcjonalnie na bieżąco z licznikiem). Blokuje wysłanie, jeśli przekroczone. Wyświetla `Toast` błędu walidacji.
- **Pola wymagane**: Tytuł, Kategoria są zawsze wymagane. Prompt jest wymagany w trybie Auto. Treść jest wymagana w trybie Manual/Edycja. Długość jest wymagana w trybie Auto. Weryfikacja w `PostForm` przy wysyłce. Blokuje wysłanie, wyświetla błędy walidacji przy odpowiednich polach i/lub `Toast`.
- **Stan przycisków**: Przycisk "Generuj"/"Zapisz" powinien być wyłączony (`disabled`) podczas trwania operacji API (`isLoading === true`).
- **Warunkowe renderowanie pól**: Pole `Textarea` dla treści jest widoczne tylko w trybie `manual` lub `edit`. Pola `prompt` i `size` są widoczne głównie w trybie `auto` (w trybie `edit` mogą być widoczne jako read-only lub ukryte). `ModeSwitcher` jest widoczny tylko przy tworzeniu nowego posta, nie w trybie edycji.

## 10. Obsługa błędów

- **Błędy walidacji po stronie klienta**: Obsługiwane przez `PostForm` (np. z `react-hook-form`). Komunikaty o błędach wyświetlane przy polach formularza i/lub zbiorczo przez `Toast`.
- **Błędy API (4xx, 5xx)**:
  - Akcje serwerowe (`generatePost`, `updatePost`) zwracają `ApiResponse` z informacją o błędzie.
  - W komponencie `PostEditorView` (lub hooku `usePostEditor`), błędy te są przechwytywane w bloku `catch` wywołania akcji.
  - Odpowiedni komunikat błędu jest wyciągany z odpowiedzi API i wyświetlany użytkownikowi za pomocą `ToastNotifier`. Np. "Nie udało się wygenerować posta: [komunikat z API]", "Błąd zapisu: Nie masz uprawnień", "Post nie znaleziony".
  - Stan `isLoading` jest ustawiany na `false`.
- **Błędy sieciowe**: Obsługiwane podobnie jak błędy API, z generycznym komunikatem "Błąd połączenia sieciowego".
- **Błąd ładowania kategorii/posta**: Wyświetlenie komunikatu o błędzie w głównym widoku lub przez `Toast`.

## 11. Kroki implementacji

1.  **Konfiguracja routingu**: Utworzenie strony `/post/editor` w strukturze `src/app/`.
2.  **Struktura komponentu strony (`PostEditorView`)**: Utworzenie pliku komponentu strony (`page.tsx`). Zaimplementowanie podstawowej logiki zarządzania stanem (tryb, ładowanie) i pobierania kategorii przy montowaniu.
3.  **Implementacja `PostForm`**:
    - Utworzenie komponentu `PostForm`.
    - Dodanie pól formularza przy użyciu komponentów Shadcn/ui (`Input`, `Textarea`, `Select`, `Slider`, `Switch`, `Button`, `Form`).
    - Implementacja logiki walidacji (np. z `react-hook-form` i `zod`).
    - Podłączenie obsługi wysyłania (`onSubmit`) i zmiany trybu (`onModeChange`).
    - Implementacja warunkowego renderowania pól w zależności od trybu.
    - Dodanie liczników znaków.
4.  **Implementacja `CategorySelect`**: Utworzenie/dostosowanie komponentu `Select` do wyświetlania kategorii i obsługi wyboru/dodawania.
5.  **Implementacja `LengthSlider`**: Utworzenie komponentu `Slider` do wyboru długości.
6.  **Implementacja `ModeSwitcher`**: Utworzenie komponentu `Switch` do zmiany trybu.
7.  **Implementacja `PostDisplay`**: Utworzenie komponentu do wyświetlania gotowego posta z przyciskami akcji (Kopiuj, Edytuj).
8.  **Integracja API**:
    - Implementacja wywołań akcji serwerowych (`generatePost`, `updatePost`, `getCategories`, `getPostById`) w `PostEditorView` lub hooku `usePostEditor`.
    - Obsługa stanów ładowania (`isLoading`).
    - Obsługa odpowiedzi (sukces/błąd) i aktualizacja stanu widoku.
9.  **Obsługa błędów i powiadomień**: Integracja `ToastNotifier` (hook `useToast`) do wyświetlania komunikatów o sukcesie, błędach walidacji i błędach API.
10. **Logika edycji**: Implementacja ładowania danych posta na podstawie `postId` z URL. Przekazanie `initialData` do `PostForm` i ustawienie trybu `edit`.
11. **Styling i responsywność**: Dopracowanie wyglądu przy użyciu Tailwind CSS, zapewnienie responsywności widoku.
12. **Testowanie**: Przetestowanie wszystkich ścieżek użytkownika (generowanie, edycja, tryb manualny - jeśli zaimplementowany, walidacja, obsługa błędów).
