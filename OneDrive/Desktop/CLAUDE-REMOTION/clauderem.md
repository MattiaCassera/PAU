# Claude + Remotion - Istruzioni e Log

## Regola principale

Ogni volta che l'utente dice **"creiamo un video"** o **"modifichiamo un video"** (o varianti simili), Claude deve:

1. Attivare la skill **`remotion-best-practices`** prima di scrivere qualsiasi codice
2. Seguire le best practices di Remotion per ogni componente, composizione e configurazione
3. Aggiornare il log in fondo a questo file con una riga che descrive cosa e' stato creato/modificato

---

## Log delle creazioni/modifiche Remotion

<!-- Ogni nuova voce va aggiunta in cima alla lista, con data e descrizione -->

### 2026-02-18 – WhistleBikeH – Aggiunta audio layer
- **File modificato:** `src/WhistleBikeH.tsx`
- **File aggiunto:** `public/sfx/README.md`
- **Audio aggiunto:**
  - `bg-music.mp3` – musica ambient in loop (vol 0.35, fade-in/out)
  - `impact.mp3` – impatto cinematografico apertura Hero
  - `whoosh-fast.mp3` – whoosh sulle transizioni 1, 3, 5
  - `whoosh-deep.mp3` – whoosh profondo sulle transizioni 2, 4
  - `impact-cta.mp3` – colpo finale CTA scena 6
- **Tecnica:** `<Audio>` con volume callback frame-by-frame, `<Sequence from={...}>` sincronizzati agli offset di transizione

### 2026-02-18 – Whistle Bike – Versione orizzontale commerciale 16:9
- **File:** `src/WhistleBikeH.tsx`, `src/Root.tsx` (aggiornato con Folder e nuova composizione)
- **Formato:** 1920×1080 (16:9 Full HD), 30fps, 570 frame (~19s)
- **Scene:** 6 scene con transizioni fade, slide, wipe
  1. Hero cinematic – bici fullscreen con Ken-Burns, letterbox, titolo in basso-sinistra
  2. Ambiente reale – split screen foto/testo, sezione "ogni strada è tua"
  3. Carbon Frame Detail – zoom telaio, stat cards (peso, carbon grade, disc brake)
  4. Componenti & Specifiche – griglia 8 specifiche su sfondo scuro
  5. Esperienza di guida – quote lifestyle centrata su foto, chip badge
  6. CTA Dealer – layout pricing (€3.499), call-to-action, footer strip
- **Composizioni nel progetto:** organizzate in Folder `Agrigal` e `WhistleBike`

### 2026-02-18 – Presentazione Gallette Mais Antichi Agrigal
- **File:** `src/GallettaMais.tsx`, `src/Root.tsx`, `src/index.ts`
- **Formato:** 1080x1920 (9:16 vertical, social), 30fps, 390 frame (~13s)
- **Scene:** 5 scene con transizioni fade e slide
  1. Hero – nome prodotto + badge biologico + varietà mais
  2. Ingredienti – barre animate (99% mais antico, 1% sale)
  3. Certificazioni – Biologico, Senza Glutine, Val Seriana
  4. Valori nutrizionali – lista animata per 100g
  5. CTA finale – prezzo €2,99, stelle recensioni, link sito
- **Fonte dati:** agrigal.com/negozio-bio-online/gallette/gallette-mais-antichi.html

