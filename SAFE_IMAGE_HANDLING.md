# SAFE IMAGE HANDLING & FALLBACK SYSTEM

**Component:** `SafeImage.tsx`  
**Location:** `src/components/common/SafeImage.tsx`  
**Asset Location:** `public/placeholder-photo.svg`

---

## 1. Overview

The `SafeImage` component provides a unified, resilient image wrapper across the Vanika platform. It eliminates broken image browser icons, manages layout skeleton loading states, respects accessibility (reduced motion & high contrast), and gracefully handles image loading failures.

---

## 2. Interface

```tsx
interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string; // Defaults to '/placeholder-photo.svg'
  className?: string;
}
```

---

## 3. Usage Examples

```tsx
import { SafeImage } from '../common/SafeImage';

// Basic Usage
<SafeImage
  src={photo.imageUrl}
  alt={photo.title}
  className="w-full h-64 sm:h-80 rounded-xl"
/>

// Custom Fallback Source
<SafeImage
  src={caregiverUploadUrl}
  alt="Caregiver memory upload"
  fallbackSrc="/assets/custom-fallback.jpg"
  className="w-14 h-14 rounded-lg"
/>
```

---

## 4. Lifecycle States

1. **`loading`**:
   - Displays a layout-preserving skeleton element (`animate-pulse`).
   - Uses `motion-reduce:animate-none` to honor reduced-motion user accessibility preferences.
2. **`loaded`**:
   - Fades in the successfully loaded image with `loading="lazy"` and `referrerPolicy="no-referrer"`.
3. **`fallback`**:
   - Triggered on initial load error. Switches `src` to `fallbackSrc` (`/placeholder-photo.svg`).
4. **`error`**:
   - Triggered if the fallback asset itself fails or cannot be loaded.
   - Renders a styled, accessible container with a photo icon and alt text to prevent broken browser image graphics.

---

## 5. Accessibility Considerations

- **Alt Text:** Preserved across loading, fallback, and terminal error states.
- **Screen Readers:** Terminal error container includes `role="img"` and `aria-label`.
- **Reduced Motion:** Skeleton pulses are disabled when reduced-motion preferences are active.
- **High Contrast:** Uses semantic, high-contrast borders and text colors compatible with light and dark mode themes.
