# Schemat bazy danych – DailyPost

## 1. Tabele

### Users

- **id**: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()

  _Uwaga_: Tabela Users jest zarządzana przez Supabase Auth i zawiera jedynie identyfikator użytkownika.

### Categories

- **id**: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()
- **name**: TEXT, NOT NULL, UNIQUE
- **description**: TEXT, NOT NULL, CHECK (char_length(description) <= 250)

### Posts

- **id**: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()
- **user_id**: UUID, NOT NULL, FOREIGN KEY REFERENCES Users(id)
- **title**: TEXT, NOT NULL
- **prompt**: TEXT, NOT NULL, CHECK (char_length(prompt) <= 500)
- **size**: TEXT, NOT NULL
- **content**: TEXT, NOT NULL, CHECK (char_length(content) <= 1000)
- **category_id**: UUID, NOT NULL, FOREIGN KEY REFERENCES Categories(id)
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()

  _Dodatkowe mechanizmy_:

  - Wyzwalacz (trigger) do automatycznej aktualizacji kolumny `updated_at` przy każdej modyfikacji rekordu w tabeli Posts.

### Error_logs

- **id**: UUID, PRIMARY KEY, DEFAULT gen_random_uuid()
- **user_id**: UUID, NULL, FOREIGN KEY REFERENCES Users(id)
- **error_message**: TEXT, NOT NULL
- **error_context**: TEXT, NULL
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT now()

  _Uwagi dotyczące Error_logs_:

  - Dostęp do tej tabeli jest zablokowany dla zwykłych użytkowników; zapewniony dostęp wyłącznie dla operacji systemowych.

## 2. Relacje między tabelami

- **Posts – Users**: Relacja jeden-do-wielu; `Posts.user_id` referencjonuje `Users.id`.
- **Posts – Categories**: Relacja jeden-do-wielu; `Posts.category_id` referencjonuje `Categories.id`.
- **Error_logs – Users**: Opcjonalna relacja; `Error_logs.user_id` referencjonuje `Users.id`.

## 3. Indeksy

Na tabeli `Posts` utworzono indeksy w celu optymalizacji zapytań:

- Indeks na `user_id`:
- Indeks na `category_id`:

## 4. Zasady PostgreSQL (RLS)

### Tabela Posts

- Wdrożone polityki RLS zapewniające, że tylko właściciel posta może odczytywać, edytować lub usuwać swój post.

### Tabela Error_logs

- Dostęp do tabeli Error_logs jest ograniczony wyłącznie do operacji systemowych, z wykluczeniem dostępu dla zwykłych użytkowników.

## 5. Dodatkowe uwagi

- Wszystkie tabele wykorzystują UUID jako klucz główny, co zapewnia spójność z mechanizmem Supabase Auth.
- Ograniczenia CHECK zostały zastosowane dla pól `prompt`, `content` oraz `description` w celu egzekwowania limitów znaków.
- Mechanizm automatycznej aktualizacji pola `updated_at` w tabeli Posts będzie implementowany za pomocą wyzwalacza w PostgreSQL (np. funkcja trigger update_modified_column).
