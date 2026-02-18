# Effetti sonori – WhistleBike Horizontal

Metti qui i seguenti file audio (MP3, ~44kHz stereo) per attivare l'audio nel video.
Tutti i file devono essere **royalty-free / CC0**.

| File              | Descrizione                          | Durata consigliata | Link download gratuito |
|-------------------|--------------------------------------|--------------------|------------------------|
| `bg-music.mp3`    | Musica ambient/cinematic di sfondo   | 20–60s (loop)      | https://pixabay.com/music/search/cinematic%20ambient/ |
| `impact.mp3`      | Impatto cinematografico grave (hero) | 0.5–1.5s           | https://pixabay.com/sound-effects/search/cinematic-impact/ |
| `whoosh-fast.mp3` | Whoosh rapido per transizioni        | 0.3–0.8s           | https://pixabay.com/sound-effects/search/whoosh/ |
| `whoosh-deep.mp3` | Whoosh profondo per transizioni      | 0.5–1s             | https://pixabay.com/sound-effects/search/whoosh%20deep/ |
| `impact-cta.mp3`  | Colpo finale per la scena CTA        | 0.5–1s             | https://pixabay.com/sound-effects/search/cinematic-hit/ |

## Struttura audio nel video

```
Frame 0       → impact.mp3          (apertura Hero, fade-out)
Frame 0–570   → bg-music.mp3        (loop, vol 0.35, fade-in 1s / fade-out 1.5s)
Frame ~98     → whoosh-fast.mp3     (transizione 1: fade S1→S2)
Frame ~186    → whoosh-deep.mp3     (transizione 2: slide S2→S3)
Frame ~274    → whoosh-fast.mp3     (transizione 3: wipe S3→S4)
Frame ~362    → whoosh-deep.mp3     (transizione 4: fade S4→S5)
Frame ~450    → whoosh-fast.mp3     (transizione 5: slide S5→S6)
Frame ~510    → impact-cta.mp3      (colpo CTA finale, fade-in/out)
```

> ⚠️ In assenza dei file, Remotion Studio mostra un warning ma continua a funzionare visivamente.
