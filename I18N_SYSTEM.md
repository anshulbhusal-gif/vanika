# Vanika Cognitive Care — Multilingual & i18n System Architecture

## 1. i18n Solution & Library Selection
- **Chosen Solution**: Built-in zero-dependency `I18nManager` (`src/i18n/index.ts`) with custom React hook `useTranslation()` (`src/i18n/useTranslation.ts`).
- **Rationale**: Provides fast, zero-bundle-overhead internationalization, native variable interpolation (`{{var}}`), safe fallback chaining, and native `Intl` API formatting without adding heavy third-party dependencies.

---

## 2. Directory & Translation File Architecture

```
src/
└── i18n/
    ├── index.ts               # Core I18nManager, event bus, & formatting
    ├── config.ts              # Supported language configs & metadata
    ├── useTranslation.ts      # Responsive React hook
    ├── i18n.test.ts           # 14 unit test scenarios
    └── locales/
        ├── en/
        │   └── common.json    # English dictionaries
        ├── hi/
        │   └── common.json    # Hindi dictionaries
        └── as/
            └── common.json    # Assamese dictionaries
```

---

## 3. Supported Languages Matrix

| Language | Code | Native Name | Flag | Status | Fallback Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **English** | `en` | English | 🇬🇧 | Default | — |
| **Hindi** | `hi` | हिंदी | 🇮🇳 | Supported | `en` |
| **Assamese** | `as` | অসমীয়া | 🌺 | Supported | `en` |
| **Bengali** | `bn` | বাংলা | 🇧🇩 | Supported | `en` |
| **Nepali** | `ne` | নেপালী | 🇳🇵 | Supported | `en` |
| **Manipuri** | `mn` | মৈতৈলোন্ | 🏞️ | Supported | `en` |
| **Bodo** | `brx` | बर’ | 🏹 | Regional | `en` |
| **Khasi** | `kha` | Khasi | 🌲 | Regional | `en` |
| **Mizo** | `lus` | Mizo | ⛰️ | Regional | `en` |
| **Nagamese** | `nag` | Nagamese | 🌄 | Regional | `en` |

---

## 4. Language Selection & Persistence
- **Storage**: Persisted in `localStorage` under `vanika_language_preference`.
- **Selector Component**: `<LanguageSelector />` (`src/components/common/LanguageSelector.tsx`) provides both dropdown and pill variant options.
- **Sync**: Integrated into `Navbar.tsx` and accessibility preferences.

---

## 5. Fallback Behavior & Missing-Key Safety
- **Missing Key Handling**: If a key path does not exist in the active language dictionary, the engine automatically checks the English (`en`) dictionary.
- **Unresolved Key**: If a key is missing in English as well, `t("key.path")` returns `"key.path"` safely without throwing runtime errors or causing UI crashes.
- **Development Warnings**: Logs warning in `development` mode for missing keys.

---

## 6. Interpolation & Data Formatting
- **Interpolation**: Replaces `{{variableName}}` placeholders dynamically at runtime:
  ```ts
  t("dashboard.welcome", { name: "Bhaben" }) // -> "Good morning, Bhaben"
  ```
- **Locale-Aware Formatting**:
  - `formatDate(date)`: Uses `Intl.DateTimeFormat(locale)`.
  - `formatTime(date)`: Uses `Intl.DateTimeFormat(locale, { timeStyle: 'short' })`.
  - `formatNumber(value)`: Uses `Intl.NumberFormat(locale)`.
  - `formatPercent(value)`: Uses `Intl.NumberFormat(locale, { style: 'percent' })`.

---

## 7. Future Localized Game Content Strategy
- **Static UI Strings**: Managed via `src/i18n/locales/`.
- **Dynamic Database Content**: `GameContentItem` schema currently stores structured `questionText`, `options`, and `correctAnswer`. Future content localization can utilize JSON-B or localized content relations without breaking existing Prisma models.
