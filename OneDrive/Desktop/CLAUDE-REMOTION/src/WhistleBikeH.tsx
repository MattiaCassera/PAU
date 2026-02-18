import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';


// ─── Palette ────────────────────────────────────────────────────────────────
const BLACK      = '#08090a';
const DARK_GRAY  = '#111214';
const WHITE      = '#ffffff';
const SILVER     = '#c8c8c8';
const DIM        = '#777777';
const ACCENT_RED = '#e02020';  // accento sportivo
const GOLD       = '#c9a84c';  // premium/luxury feel

// ─── Durate (30fps) – formato 16:9 1920×1080 ───────────────────────────────
const T  = 22;  // transition frames
const S1 = 120; // Hero cinematic – bici su strada di montagna
const S2 = 110; // Ambiente urbano – bici in città
const S3 = 110; // Carbon frame detail – telaio e leggerezza
const S4 = 110; // Componenti & specifiche
const S5 = 110; // Esperienza di guida – claim di lifestyle
const S6 = 120; // CTA finale – dealer / prezzo

// Durata totale = S1+S2+S3+S4+S5+S6 - 5*T = 680 - 110 = 570

// ─── Offset globali di ogni transizione nel timeline (frame) ────────────────
// Ogni whoosh deve partire quando la transizione inizia nel timeline globale.
// TransitionSeries accorcia la durata: ogni scena i parte a sum(Sk - T) per k<i
const TR1 = S1 - T;                                   // ~98  → fade S1→S2
const TR2 = S1 - T + S2 - T;                          // ~186 → slide S2→S3
const TR3 = S1 - T + S2 - T + S3 - T;                 // ~274 → wipe S3→S4
const TR4 = S1 - T + S2 - T + S3 - T + S4 - T;        // ~362 → fade S4→S5
const TR5 = S1 - T + S2 - T + S3 - T + S4 - T + S5 - T; // ~450 → slide S5→S6

// ─── Helpers ────────────────────────────────────────────────────────────────
function useFadeIn(start = 0, dur = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
}

function useSpring(startFrame = 0, config = { damping: 200 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - startFrame, fps, config });
}

function useSlideUp(startFrame = 0) {
  const s = useSpring(startFrame, { damping: 180 });
  return interpolate(s, [0, 1], [50, 0]);
}

function useSlideRight(startFrame = 0) {
  const s = useSpring(startFrame, { damping: 200 });
  return interpolate(s, [0, 1], [-70, 0]);
}

// ─── Componente: Logo Whistle ────────────────────────────────────────────────
const WhistleLogo: React.FC<{ opacity: number; size?: number; color?: string }> = ({
  opacity,
  size = 32,
  color = WHITE,
}) => (
  <div
    style={{
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div
      style={{
        width: size * 0.35,
        height: size * 0.35,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        background: 'transparent',
      }}
    />
    <span
      style={{
        color,
        fontFamily: 'Arial Black, Arial, sans-serif',
        fontSize: size,
        fontWeight: 900,
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}
    >
      WHISTLE
    </span>
  </div>
);

// ─── Componente: Tag etichetta ───────────────────────────────────────────────
const Tag: React.FC<{ label: string; opacity: number; accentColor?: string }> = ({
  label,
  opacity,
  accentColor = SILVER,
}) => (
  <div
    style={{
      opacity,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
    }}
  >
    <div style={{ width: 32, height: 1, background: accentColor }} />
    <span
      style={{
        color: accentColor,
        fontFamily: 'Arial, sans-serif',
        fontSize: 22,
        letterSpacing: 5,
        textTransform: 'uppercase',
        fontWeight: 400,
      }}
    >
      {label}
    </span>
    <div style={{ width: 32, height: 1, background: accentColor }} />
  </div>
);

// ─── SCENE 1 – Hero cinematic ────────────────────────────────────────────────
// Layout: immagine fullscreen, testo centrato in basso-sinistra, logo in alto destra
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity   = useFadeIn(0, 30);
  const logoOpacity  = useFadeIn(20, 20);
  const tagOpacity   = useFadeIn(35, 18);
  const titleOpacity = useFadeIn(45, 22);
  const titleY       = useSlideUp(45);
  const subOpacity   = useFadeIn(65, 20);
  const lineWidth    = interpolate(
    spring({ frame: frame - 50, fps, config: { damping: 200 } }),
    [0, 1], [0, 420],
  );

  // Ken-Burns: leggero zoom-in + pan verso sinistra
  const zoom = interpolate(frame, [0, S1], [1.0, 1.07], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const panX = interpolate(frame, [0, S1], [0, -25], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>

      {/* Foto bici – ken-burns */}
      <AbsoluteFill style={{ opacity: imgOpacity, transform: `scale(${zoom}) translateX(${panX}px)` }}>
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
        />
      </AbsoluteFill>

      {/* Overlay cinematografico: barre nere orizzontali (letterbox 2.35:1) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 68, background: 'rgba(0,0,0,0.88)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 68, background: 'rgba(0,0,0,0.88)',
      }} />

      {/* Vignette laterali */}
      <AbsoluteFill style={{
        background:
          'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)',
      }} />
      <AbsoluteFill style={{
        background:
          'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 45%)',
      }} />

      {/* Logo in alto a destra */}
      <div style={{
        position: 'absolute', top: 80, right: 80,
      }}>
        <WhistleLogo opacity={logoOpacity} size={28} />
      </div>

      {/* Anno modello in alto a sinistra */}
      <div style={{ position: 'absolute', top: 88, left: 80 }}>
        <Tag label="Road Carbon · 2024" opacity={logoOpacity} accentColor={SILVER} />
      </div>

      {/* Contenuto in basso a sinistra */}
      <AbsoluteFill style={{
        justifyContent: 'flex-end', paddingBottom: 110, paddingLeft: 90,
      }}>

        <Tag label="Performance Road Bike" opacity={tagOpacity} accentColor={GOLD} />

        <div style={{ marginTop: 24, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
          <div style={{
            color: WHITE,
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: -3,
            textTransform: 'uppercase',
          }}>
            FULL CARBON
          </div>
          <div style={{
            color: SILVER,
            fontFamily: 'Arial, sans-serif',
            fontSize: 44,
            fontWeight: 200,
            letterSpacing: 10,
            textTransform: 'uppercase',
            marginTop: 14,
          }}>
            Road Performance
          </div>
        </div>

        {/* Linea orizzontale animata */}
        <div style={{
          width: lineWidth, height: 1.5,
          background: `linear-gradient(to right, ${GOLD}, transparent)`,
          marginTop: 28,
        }} />

        <div style={{
          opacity: subOpacity, marginTop: 20,
          color: DIM, fontFamily: 'Arial, sans-serif',
          fontSize: 26, fontWeight: 300, letterSpacing: 1, lineHeight: 1.7,
        }}>
          Shimano Ultegra Di2 · Freni idraulici a disco · Telaio Full Carbon
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 – Ambiente urbano / reale ───────────────────────────────────────
// Split screen: sinistra foto, destra testo su sfondo scuro
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dividerX  = interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1], [1920, 960],
  );

  const titleOpacity = useFadeIn(18, 20);
  const titleY       = useSlideUp(18);
  const line1Op      = useFadeIn(35, 16);
  const line2Op      = useFadeIn(48, 16);
  const line3Op      = useFadeIn(61, 16);
  const ctaOp        = useFadeIn(75, 18);

  const zoom = interpolate(frame, [0, S2], [1.08, 1.0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const points = [
    { icon: '🏙️', title: 'Domina la città',     sub: 'Agilità e scorrevolezza in ogni condizione' },
    { icon: '🏔️', title: 'Sfida la montagna',   sub: 'Leggerezza carbon per ascese impegnative' },
    { icon: '🌊', title: 'Taglia il vento',      sub: 'Geometria aerodinamica race-proven' },
  ];

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>

      {/* Foto bici – lato sinistro, clippata */}
      <AbsoluteFill style={{ clipPath: `inset(0 ${1920 - dividerX}px 0 0)` }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 40%' }}>
          <Img
            src={staticFile('whistle-bike.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </AbsoluteFill>
        {/* Overlay gradiente verso destra */}
        <AbsoluteFill style={{
          background: 'linear-gradient(to right, transparent 55%, rgba(8,9,10,0.98) 95%)',
        }} />
      </AbsoluteFill>

      {/* Linea verticale divisoria */}
      <div style={{
        position: 'absolute',
        left: dividerX - 1,
        top: 0, bottom: 0,
        width: 1,
        background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
        opacity: 0.5,
      }} />

      {/* Contenuto destra */}
      <AbsoluteFill style={{
        justifyContent: 'center',
        paddingLeft: dividerX + 60,
        paddingRight: 80,
      }}>

        <WhistleLogo opacity={useFadeIn(5, 16)} size={22} color={SILVER} />

        <div style={{
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
          marginTop: 32, marginBottom: 44,
        }}>
          <div style={{
            color: WHITE,
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 72, fontWeight: 900,
            lineHeight: 0.9, letterSpacing: -2,
            textTransform: 'uppercase',
          }}>
            OGNI
            <br />
            <span style={{ color: GOLD }}>STRADA</span>
            <br />
            È TUA
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {points.map((p, i) => {
            const ops = [line1Op, line2Op, line3Op];
            const slideX = useSlideRight(35 + i * 13);
            return (
              <div key={i} style={{
                opacity: ops[i],
                transform: `translateX(${slideX}px)`,
                display: 'flex', alignItems: 'flex-start', gap: 18,
              }}>
                <span style={{ fontSize: 30, marginTop: 2 }}>{p.icon}</span>
                <div>
                  <div style={{
                    color: WHITE, fontFamily: 'Arial, sans-serif',
                    fontSize: 28, fontWeight: 700, letterSpacing: 0.5,
                  }}>{p.title}</div>
                  <div style={{
                    color: DIM, fontFamily: 'Arial, sans-serif',
                    fontSize: 22, fontWeight: 300, marginTop: 4, lineHeight: 1.5,
                  }}>{p.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge accento */}
        <div style={{
          opacity: ctaOp, marginTop: 44,
          display: 'inline-flex', alignItems: 'center', gap: 16,
          borderTop: `1px solid rgba(255,255,255,0.12)`,
          paddingTop: 28, width: '100%',
        }}>
          <div style={{
            background: ACCENT_RED, borderRadius: 6,
            paddingTop: 8, paddingBottom: 8, paddingLeft: 18, paddingRight: 18,
          }}>
            <span style={{
              color: WHITE, fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 20, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase',
            }}>RACE READY</span>
          </div>
          <span style={{
            color: SILVER, fontFamily: 'Arial, sans-serif',
            fontSize: 22, fontWeight: 300, letterSpacing: 1,
          }}>
            Pronta per gareggiare dal primo giorno
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 – Carbon Frame Detail ──────────────────────────────────────────
// Layout: fullscreen foto con zoom sul telaio, testo sovrapposto a destra
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity   = useFadeIn(0, 20);
  const titleOpacity = useFadeIn(10, 20);
  const titleY       = useSlideUp(10);

  const zoom = interpolate(frame, [0, S3], [1.0, 1.18], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const statCards = [
    { value: '~7.2', unit: 'kg', label: 'Peso totale' },
    { value: 'T800', unit: '', label: 'Carbon grade' },
    { value: 'Full', unit: '', label: 'Disc brake' },
  ];

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>

      {/* Foto con zoom sul telaio */}
      <AbsoluteFill style={{
        opacity: imgOpacity,
        transform: `scale(${zoom})`,
        transformOrigin: '40% 55%',
      }}>
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* Overlay scuro a destra */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to left, rgba(0,0,0,0.93) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)',
      }} />
      <AbsoluteFill style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
      }} />

      {/* Contenuto a destra */}
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 90,
      }}>
        <div style={{ width: 780 }}>

          <Tag label="Telaio" opacity={useFadeIn(8, 15)} accentColor={GOLD} />

          <div style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginTop: 20, marginBottom: 44,
          }}>
            <div style={{
              color: WHITE, fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 82, fontWeight: 900, lineHeight: 0.88,
              letterSpacing: -2, textTransform: 'uppercase',
            }}>
              CARBON
              <br />
              <span style={{ color: SILVER, fontWeight: 200, letterSpacing: 6, fontSize: 58 }}>
                FRAME
              </span>
            </div>
          </div>

          {/* Stat cards orizzontali */}
          <div style={{ display: 'flex', gap: 16 }}>
            {statCards.map((s, i) => {
              const op  = useFadeIn(30 + i * 14, 16);
              const sc  = spring({ frame: frame - (30 + i * 14), fps, config: { damping: 14, stiffness: 120 } });
              return (
                <div key={i} style={{
                  opacity: op,
                  transform: `scale(${sc}) translateY(${interpolate(sc, [0,1],[20,0])}px)`,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid rgba(255,255,255,0.12)`,
                  borderTop: `2px solid ${GOLD}`,
                  borderRadius: 12,
                  paddingTop: 22, paddingBottom: 22,
                  paddingLeft: 28, paddingRight: 28,
                  flex: 1, textAlign: 'center',
                }}>
                  <div style={{
                    color: WHITE, fontFamily: 'Arial Black, Arial, sans-serif',
                    fontSize: 46, fontWeight: 900, lineHeight: 1,
                  }}>
                    {s.value}<span style={{ color: GOLD, fontSize: 30 }}>{s.unit}</span>
                  </div>
                  <div style={{
                    color: DIM, fontFamily: 'Arial, sans-serif',
                    fontSize: 20, letterSpacing: 2, textTransform: 'uppercase',
                    marginTop: 8,
                  }}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div style={{
            opacity: useFadeIn(70, 18),
            marginTop: 30,
            color: DIM, fontFamily: 'Arial, sans-serif',
            fontSize: 24, fontWeight: 300, lineHeight: 2, letterSpacing: 0.5,
            borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24,
          }}>
            Filettatura BB386 · Geometria Race Endurance
            <br />
            Passacavi interno integrato · Dropout forgiato
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 – Componenti & Specifiche ──────────────────────────────────────
// Layout: sfondo scuro con fotografia sfumata, griglia specifiche centrata
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp     = useFadeIn(0, 20);
  const headerOp = useFadeIn(0, 18);

  const specs = [
    { icon: '⚙️',  label: 'Gruppo',       value: 'Shimano Ultegra Di2' },
    { icon: '🛑',  label: 'Freni',         value: 'Idraulici a disco' },
    { icon: '🛞',  label: 'Ruote',         value: 'Carbon Disc 35mm' },
    { icon: '🔄',  label: 'Velocità',      value: '2×11 velocità' },
    { icon: '💨',  label: 'Pneumatici',    value: 'GP5000 SE 28c' },
    { icon: '🎨',  label: 'Finitura',      value: 'Full Stealth Black' },
    { icon: '📐',  label: 'Misure',        value: '50 / 52 / 54 / 56' },
    { icon: '🏆',  label: 'Utilizzo',      value: 'Gran Fondo · Race' },
  ];

  return (
    <AbsoluteFill style={{ background: DARK_GRAY, overflow: 'hidden' }}>

      {/* Foto sfumata come texture */}
      <AbsoluteFill style={{ opacity: 0.06 * bgOp }}>
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px)' }}
        />
      </AbsoluteFill>

      {/* Linea verticale sinistra decorativa */}
      <div style={{
        position: 'absolute', left: 80, top: 0, bottom: 0,
        width: 2,
        background: `linear-gradient(to bottom, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)`,
        opacity: 0.4,
      }} />

      <AbsoluteFill style={{
        justifyContent: 'center',
        paddingLeft: 110, paddingRight: 90,
      }}>

        {/* Header */}
        <div style={{ opacity: headerOp, marginBottom: 44 }}>
          <Tag label="Specifiche tecniche" opacity={1} accentColor={GOLD} />
          <div style={{
            color: WHITE, fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: 72, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: -2, lineHeight: 0.9, marginTop: 18,
          }}>
            FULL
            <br />
            <span style={{ color: SILVER, fontWeight: 200, letterSpacing: 6, fontSize: 54 }}>SPECS</span>
          </div>
          <div style={{
            width: interpolate(
              spring({ frame: frame - 12, fps, config: { damping: 200 } }),
              [0, 1], [0, 320],
            ),
            height: 1.5,
            background: `linear-gradient(to right, ${GOLD}, transparent)`,
            marginTop: 18,
          }} />
        </div>

        {/* Griglia 2 colonne */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px 32px',
        }}>
          {specs.map((s, i) => {
            const op      = useFadeIn(12 + i * 9, 14);
            const slideIn = spring({ frame: frame - (12 + i * 9), fps, config: { damping: 200 } });
            return (
              <div key={i} style={{
                opacity: op,
                transform: `translateX(${interpolate(slideIn, [0,1],[(i % 2 === 0 ? -40 : 40),0])}px)`,
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'rgba(255,255,255,0.04)',
                borderLeft: `3px solid ${i < 2 ? GOLD : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '0 10px 10px 0',
                paddingTop: 14, paddingBottom: 14, paddingLeft: 20, paddingRight: 20,
              }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div style={{
                    color: DIM, fontFamily: 'Arial, sans-serif',
                    fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4,
                  }}>{s.label}</div>
                  <div style={{
                    color: WHITE, fontFamily: 'Arial, sans-serif',
                    fontSize: 28, fontWeight: 700,
                  }}>{s.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 – Esperienza di guida / Lifestyle ──────────────────────────────
// Layout: fullscreen foto con quote centrale + claim
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity    = useFadeIn(0, 30);
  const quoteOpacity  = useFadeIn(18, 25);
  const quoteY        = useSlideUp(18);
  const authorOpacity = useFadeIn(45, 18);
  const chipOpacity   = useFadeIn(62, 18);

  const zoom = interpolate(frame, [0, S5], [1.05, 1.0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Pan verso destra
  const panX = interpolate(frame, [0, S5], [-20, 20], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>

      {/* Foto – slow parallax */}
      <AbsoluteFill style={{
        opacity: imgOpacity,
        transform: `scale(${zoom}) translateX(${panX}px)`,
      }}>
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
        />
      </AbsoluteFill>

      {/* Overlay forte al centro per leggibilità quote */}
      <AbsoluteFill style={{
        background: 'rgba(0,0,0,0.58)',
      }} />
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.0) 20%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Barre letterbox */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, background: 'rgba(0,0,0,0.9)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: 'rgba(0,0,0,0.9)' }} />

      {/* Logo in alto sinistra */}
      <div style={{ position: 'absolute', top: 70, left: 80 }}>
        <WhistleLogo opacity={useFadeIn(10, 16)} size={24} color={SILVER} />
      </div>

      {/* Quote centrata */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', paddingLeft: 160, paddingRight: 160 }}>

          {/* Virgolette decorative */}
          <div style={{
            opacity: quoteOpacity * 0.3,
            color: GOLD, fontFamily: 'Georgia, serif',
            fontSize: 160, lineHeight: 0.6, marginBottom: 8,
          }}>
            "
          </div>

          <div style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            color: WHITE, fontFamily: 'Arial, sans-serif',
            fontSize: 52, fontWeight: 200,
            lineHeight: 1.4, letterSpacing: 1,
            fontStyle: 'italic',
          }}>
            Non è solo una bicicletta.
            <br />
            <span style={{ fontWeight: 700, fontStyle: 'normal', color: SILVER }}>
              È la tua libertà su due ruote.
            </span>
          </div>

          {/* Autore */}
          <div style={{
            opacity: authorOpacity,
            marginTop: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <div style={{ width: 40, height: 1, background: GOLD }} />
            <span style={{
              color: GOLD, fontFamily: 'Arial, sans-serif',
              fontSize: 20, letterSpacing: 4, textTransform: 'uppercase',
            }}>
              Whistle Road Team
            </span>
            <div style={{ width: 40, height: 1, background: GOLD }} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Chip in basso */}
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 76 }}>
        <div style={{
          opacity: chipOpacity,
          display: 'flex', gap: 20,
        }}>
          {['Carbon', 'Ultegra Di2', 'Full Disc', 'Race Ready'].map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 6,
              paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20,
            }}>
              <span style={{
                color: SILVER, fontFamily: 'Arial, sans-serif',
                fontSize: 20, letterSpacing: 2, textTransform: 'uppercase',
              }}>{c}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 6 – CTA Finale (Dealer / Prezzo) ─────────────────────────────────
// Layout: sfondo quasi nero, bici a destra sfumata, pricing e CTA a sinistra
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity    = useFadeIn(0, 28);
  const logoOpacity   = useFadeIn(10, 18);
  const tagOpacity    = useFadeIn(20, 16);
  const titleOpacity  = useFadeIn(28, 22);
  const titleY        = useSlideUp(28);
  const priceOpacity  = useFadeIn(48, 20);
  const priceScale    = spring({ frame: frame - 48, fps, config: { damping: 12, stiffness: 130 } });
  const ctaOpacity    = useFadeIn(70, 20);

  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.6),
    [-1, 1], [0.97, 1.03],
  );

  // Zoom lento
  const zoom = interpolate(frame, [0, S6], [1.0, 1.06], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>

      {/* Bici – destra */}
      <AbsoluteFill style={{
        opacity: imgOpacity,
        transform: `scale(${zoom})`,
        transformOrigin: '75% 50%',
        clipPath: 'inset(0 0 0 35%)',
      }}>
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </AbsoluteFill>

      {/* Overlay gradiente da sinistra */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to right, rgba(8,9,10,1.0) 40%, rgba(8,9,10,0.6) 65%, rgba(8,9,10,0.0) 100%)',
      }} />

      {/* Linea verticale decorativa */}
      <div style={{
        position: 'absolute', left: 560, top: 60, bottom: 60,
        width: 1,
        background: `linear-gradient(to bottom, transparent, ${GOLD} 20%, ${GOLD} 80%, transparent)`,
        opacity: 0.25,
      }} />

      {/* Contenuto a sinistra */}
      <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 90 }}>
        <div style={{ maxWidth: 580 }}>

          {/* Logo */}
          <WhistleLogo opacity={logoOpacity} size={30} color={SILVER} />

          {/* Tag */}
          <div style={{ opacity: tagOpacity, marginTop: 28 }}>
            <Tag label="Stealth Edition · 2024" opacity={1} accentColor={GOLD} />
          </div>

          {/* Headline */}
          <div style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginTop: 28, marginBottom: 36,
          }}>
            <div style={{
              color: WHITE, fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 78, fontWeight: 900, lineHeight: 0.88,
              letterSpacing: -2, textTransform: 'uppercase',
            }}>
              LA TUA
              <br />
              PROSSIMA
              <br />
              <span style={{ color: GOLD }}>BICI</span>
            </div>
          </div>

          {/* Prezzo */}
          <div style={{
            opacity: priceOpacity,
            transform: `scale(${priceScale})`,
            marginBottom: 36,
          }}>
            <div style={{
              color: DIM, fontFamily: 'Arial, sans-serif',
              fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8,
            }}>
              Prezzo consigliato
            </div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
            }}>
              <span style={{
                color: WHITE, fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: 86, fontWeight: 900, letterSpacing: -2, lineHeight: 1,
              }}>€3.499</span>
              <span style={{
                color: DIM, fontFamily: 'Arial, sans-serif',
                fontSize: 26, fontWeight: 300,
              }}>,00</span>
            </div>
            <div style={{
              color: DIM, fontFamily: 'Arial, sans-serif',
              fontSize: 20, marginTop: 6,
            }}>
              IVA inclusa · Finanziamento disponibile
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{
            opacity: ctaOpacity,
            transform: `scale(${pulse})`,
            display: 'flex', gap: 18,
          }}>
            <div style={{
              background: WHITE,
              borderRadius: 10,
              paddingTop: 20, paddingBottom: 20,
              paddingLeft: 36, paddingRight: 36,
            }}>
              <span style={{
                color: BLACK, fontFamily: 'Arial Black, Arial, sans-serif',
                fontSize: 26, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Richiedi info
              </span>
            </div>
            <div style={{
              border: `1px solid rgba(255,255,255,0.3)`,
              borderRadius: 10,
              paddingTop: 20, paddingBottom: 20,
              paddingLeft: 36, paddingRight: 36,
              display: 'flex', alignItems: 'center',
            }}>
              <span style={{
                color: SILVER, fontFamily: 'Arial, sans-serif',
                fontSize: 26, fontWeight: 300, letterSpacing: 1,
              }}>
                whistlebike.it
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Footer strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 48, background: 'rgba(0,0,0,0.9)',
        display: 'flex', alignItems: 'center',
        paddingLeft: 90, paddingRight: 90,
        justifyContent: 'space-between',
      }}>
        <span style={{
          color: DIM, fontFamily: 'Arial, sans-serif',
          fontSize: 18, letterSpacing: 2, textTransform: 'uppercase',
        }}>
          Whistle Road Carbon · Full Carbon Frame · Shimano Ultegra Di2
        </span>
        <span style={{
          color: GOLD, fontFamily: 'Arial, sans-serif',
          fontSize: 18, letterSpacing: 3, textTransform: 'uppercase',
        }}>
          2024
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Layer audio ─────────────────────────────────────────────────────────────
// File necessari in public/sfx/ :
//   bg-music.mp3    → musica ambient/cinematic di sottofondo (~30s, loop)
//   impact.mp3      → impatto cinematografico grave (0.5–1s)
//   whoosh-fast.mp3 → whoosh rapido per transizioni veloci (0.3–0.6s)
//   whoosh-deep.mp3 → whoosh profondo per transizioni lente (0.5–1s)
//   impact-cta.mp3  → colpo finale per CTA (0.5s)
//
// Download gratuiti consigliati (CC0 / Royalty-free):
//   https://pixabay.com/sound-effects/search/cinematic-impact/
//   https://pixabay.com/sound-effects/search/whoosh/
const AudioLayer: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      {/* ── Musica di sottofondo: fade-in 1s, loop, fade-out 1.5s ── */}
      <Audio
        src={staticFile('sfx/bg-music.mp3')}
        loop
        volume={(f) => {
          const fadeInEnd   = 1 * fps;
          const fadeOutStart = durationInFrames - 1.5 * fps;
          if (f < fadeInEnd)        return interpolate(f, [0, fadeInEnd], [0, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          if (f > fadeOutStart)     return interpolate(f, [fadeOutStart, durationInFrames], [0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return 0.35;
        }}
      />

      {/* ── Impact all'apertura Hero (frame 0, breve) ── */}
      <Sequence from={0} durationInFrames={Math.round(1.2 * fps)} premountFor={5}>
        <Audio
          src={staticFile('sfx/impact.mp3')}
          volume={(f) => interpolate(f, [0, Math.round(1.2 * fps)], [0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>

      {/* ── Whoosh transizione 1: fade S1→S2 ── */}
      <Sequence from={TR1} durationInFrames={T + 5} premountFor={5}>
        <Audio
          src={staticFile('sfx/whoosh-fast.mp3')}
          volume={(f) => interpolate(f, [0, T], [0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>

      {/* ── Whoosh transizione 2: slide S2→S3 ── */}
      <Sequence from={TR2} durationInFrames={T + 5} premountFor={5}>
        <Audio
          src={staticFile('sfx/whoosh-deep.mp3')}
          volume={(f) => interpolate(f, [0, T], [0.65, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>

      {/* ── Whoosh transizione 3: wipe S3→S4 ── */}
      <Sequence from={TR3} durationInFrames={T + 5} premountFor={5}>
        <Audio
          src={staticFile('sfx/whoosh-fast.mp3')}
          volume={(f) => interpolate(f, [0, T], [0.55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>

      {/* ── Whoosh transizione 4: fade S4→S5 ── */}
      <Sequence from={TR4} durationInFrames={T + 5} premountFor={5}>
        <Audio
          src={staticFile('sfx/whoosh-deep.mp3')}
          volume={(f) => interpolate(f, [0, T], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>

      {/* ── Whoosh transizione 5: slide S5→S6 ── */}
      <Sequence from={TR5} durationInFrames={T + 5} premountFor={5}>
        <Audio
          src={staticFile('sfx/whoosh-fast.mp3')}
          volume={(f) => interpolate(f, [0, T], [0.6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>

      {/* ── Impact CTA finale (scena 6, ~20 frame dopo l'inizio) ── */}
      <Sequence from={TR5 + S6 - T - Math.round(2 * fps)} durationInFrames={Math.round(1.5 * fps)} premountFor={5}>
        <Audio
          src={staticFile('sfx/impact-cta.mp3')}
          volume={(f) => interpolate(f, [0, Math.round(0.5 * fps), Math.round(1.5 * fps)], [0, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      </Sequence>
    </>
  );
};

// ─── Composizione principale ─────────────────────────────────────────────────
// Durata effettiva: S1+S2+S3+S4+S5+S6 - 5*T = 680 - 110 = 570 frame
export const WhistleBikeH: React.FC = () => {
  return (
    <>
    {/* Layer audio sovrapposto all'intera timeline */}
    <AudioLayer />

    <TransitionSeries>

      <TransitionSeries.Sequence durationInFrames={S1} premountFor={T}>
        <Scene1 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S2} premountFor={T}>
        <Scene2 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S3} premountFor={T}>
        <Scene3 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S4} premountFor={T}>
        <Scene4 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S5} premountFor={T}>
        <Scene5 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S6} premountFor={T}>
        <Scene6 />
      </TransitionSeries.Sequence>

    </TransitionSeries>
    </>
  );
};
