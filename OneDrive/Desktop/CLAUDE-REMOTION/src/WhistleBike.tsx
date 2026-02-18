import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

// ─── Palette ───────────────────────────────────────────────────────────────
const BLACK = '#0a0a0a';
const DARK_GRAY = '#141414';
const MID_GRAY = '#1e1e1e';
const ACCENT = '#e8e8e8'; // silver/white for Whistle branding
const RED = '#cc2222';    // Enervit bottle red accent
const WHITE = '#ffffff';
const SILVER = '#c0c0c0';
const DIM = '#888888';

// ─── Durate (30fps) ────────────────────────────────────────────────────────
const T = 20; // transition frames
const S1 = 110; // Hero – bici intera + titolo
const S2 = 100; // Focus telaio – carbon frame details
const S3 = 100; // Componenti – Ultegra, dischi
const S4 = 100; // Specifiche tecniche
const S5 = 110; // CTA finale

// ─── Helpers ───────────────────────────────────────────────────────────────
function useFadeIn(start = 0, dur = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
}

function useSlideUp(start = 0, dur = 25) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - start, fps, config: { damping: 200 } });
  return interpolate(progress, [0, 1], [60, 0]);
}

// ─── SCENE 1 – Hero ────────────────────────────────────────────────────────
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity = useFadeIn(0, 25);
  const imgScale = spring({ frame, fps, config: { damping: 200 } });
  const imgScaleValue = interpolate(imgScale, [0, 1], [1.08, 1.0]);

  const titleOpacity = useFadeIn(20, 20);
  const titleY = useSlideUp(20, 25);
  const subOpacity = useFadeIn(38, 18);
  const tagOpacity = useFadeIn(50, 18);

  // ken-burns: slow pan
  const pan = interpolate(frame, [0, S1], [0, -18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>
      {/* Foto bici con ken-burns */}
      <AbsoluteFill
        style={{
          opacity: imgOpacity,
          transform: `scale(${imgScaleValue}) translateY(${pan}px)`,
        }}
      >
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      </AbsoluteFill>

      {/* Overlay scuro in basso per leggibilità testo */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.0) 75%)',
        }}
      />

      {/* Testo sovrapposto in basso */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          paddingBottom: 120,
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        {/* Brand tag */}
        <div
          style={{
            opacity: tagOpacity,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid rgba(255,255,255,0.2)`,
            borderRadius: 8,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 28,
            paddingRight: 28,
            marginBottom: 32,
            width: 'fit-content',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: WHITE,
            }}
          />
          <span
            style={{
              color: SILVER,
              fontFamily: 'Arial, sans-serif',
              fontSize: 28,
              letterSpacing: 6,
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            Road Carbon
          </span>
        </div>

        {/* Titolo */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              color: WHITE,
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: -2,
              textTransform: 'uppercase',
            }}
          >
            WHISTLE
          </div>
          <div
            style={{
              color: SILVER,
              fontFamily: 'Arial, sans-serif',
              fontSize: 52,
              fontWeight: 300,
              letterSpacing: 8,
              textTransform: 'uppercase',
              marginTop: 12,
            }}
          >
            Full Carbon
          </div>
        </div>

        {/* Sottotitolo */}
        <div
          style={{
            opacity: subOpacity,
            color: DIM,
            fontFamily: 'Arial, sans-serif',
            fontSize: 34,
            fontWeight: 300,
            marginTop: 24,
            lineHeight: 1.5,
            letterSpacing: 1,
          }}
        >
          Performance · Leggerezza · Stile
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 – Telaio Carbon ───────────────────────────────────────────────
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity = useFadeIn(0, 20);
  const titleOpacity = useFadeIn(5, 20);
  const titleY = useSlideUp(5, 25);
  const line1Opacity = useFadeIn(25, 18);
  const line2Opacity = useFadeIn(38, 18);
  const line3Opacity = useFadeIn(51, 18);

  // Zoom lento sul telaio
  const zoom = interpolate(frame, [0, S2], [1.0, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  const features = [
    { icon: '⚡', text: 'Telaio full carbon aerodinamico' },
    { icon: '🔩', text: 'Freni a disco idraulici' },
    { icon: '🚲', text: 'Ruote carbon 35mm' },
  ];

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>
      {/* Immagine zoomata */}
      <AbsoluteFill
        style={{
          opacity: imgOpacity,
          transform: `scale(${zoom})`,
          transformOrigin: '60% 50%',
        }}
      >
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Overlay laterale sinistra */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.0) 70%)',
        }}
      />

      {/* Contenuto a sinistra */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        {/* Linea decorativa */}
        <div
          style={{
            opacity: titleOpacity,
            width: 60,
            height: 3,
            background: WHITE,
            marginBottom: 24,
          }}
        />

        {/* Titolo */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              color: SILVER,
              fontFamily: 'Arial, sans-serif',
              fontSize: 30,
              letterSpacing: 8,
              textTransform: 'uppercase',
              fontWeight: 300,
              marginBottom: 10,
            }}
          >
            Il telaio
          </div>
          <div
            style={{
              color: WHITE,
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            CARBON
            <br />
            FRAME
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {features.map((f, i) => {
            const opacities = [line1Opacity, line2Opacity, line3Opacity];
            const slideIn = spring({
              frame: frame - (25 + i * 13),
              fps,
              config: { damping: 200 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: opacities[i],
                  transform: `translateX(${interpolate(slideIn, [0, 1], [-40, 0])}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <span style={{ fontSize: 36 }}>{f.icon}</span>
                <span
                  style={{
                    color: ACCENT,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 36,
                    fontWeight: 400,
                    lineHeight: 1.3,
                  }}
                >
                  {f.text}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 – Componenti Ultegra ──────────────────────────────────────────
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity = useFadeIn(0, 20);
  const titleOpacity = useFadeIn(8, 20);
  const titleY = useSlideUp(8, 22);

  // Zoom su posteriore / cambio
  const zoom = interpolate(frame, [0, S3], [1.1, 1.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const specs = [
    { label: 'Gruppo', value: 'Shimano Ultegra' },
    { label: 'Freni', value: 'Idraulici a disco' },
    { label: 'Pneumatici', value: 'Grand Prix 5000 SE' },
    { label: 'Ruote', value: 'Carbon Disc 35mm' },
  ];

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>
      {/* Immagine con zoom sul lato destro */}
      <AbsoluteFill
        style={{
          opacity: imgOpacity,
          transform: `scale(${zoom})`,
          transformOrigin: '80% 70%',
        }}
      >
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Overlay top + bottom */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Titolo in alto */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          paddingTop: 90,
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              color: SILVER,
              fontFamily: 'Arial, sans-serif',
              fontSize: 28,
              letterSpacing: 8,
              textTransform: 'uppercase',
              fontWeight: 300,
              marginBottom: 8,
            }}
          >
            Componenti
          </div>
          <div
            style={{
              color: WHITE,
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 80,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: -1,
              lineHeight: 0.95,
            }}
          >
            SHIMANO
            <br />
            <span style={{ color: SILVER, fontWeight: 300, fontSize: 68, letterSpacing: 2 }}>
              ULTEGRA
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Specs in basso */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          paddingBottom: 90,
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          {specs.map((s, i) => {
            const op = useFadeIn(20 + i * 12, 16);
            const slideIn = spring({ frame: frame - (20 + i * 12), fps, config: { damping: 200 } });
            return (
              <div
                key={i}
                style={{
                  opacity: op,
                  transform: `translateY(${interpolate(slideIn, [0, 1], [30, 0])}px)`,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    color: DIM,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 24,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    color: WHITE,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 – Specifiche tecniche ────────────────────────────────────────
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = useFadeIn(0, 15);
  const titleOpacity = useFadeIn(0, 18);

  const technicals = [
    { icon: '⚖️', label: 'Peso', value: '~7.2 kg' },
    { icon: '🔄', label: 'Velocità', value: '2×11 v.' },
    { icon: '🛞', label: 'Misura ruote', value: '700c' },
    { icon: '💨', label: 'Pneumatici', value: '700×28c' },
    { icon: '🏆', label: 'Uso', value: 'Gran Fondo / Race' },
    { icon: '🎨', label: 'Colore', value: 'Full Stealth Black' },
  ];

  return (
    <AbsoluteFill
      style={{
        background: DARK_GRAY,
        overflow: 'hidden',
      }}
    >
      {/* Sottile texture overlay con foto sfocata */}
      <AbsoluteFill style={{ opacity: 0.07 * bgOpacity }}>
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(8px)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        {/* Header */}
        <div style={{ opacity: titleOpacity, marginBottom: 52 }}>
          <div
            style={{
              color: SILVER,
              fontFamily: 'Arial, sans-serif',
              fontSize: 28,
              letterSpacing: 8,
              textTransform: 'uppercase',
              fontWeight: 300,
              marginBottom: 8,
            }}
          >
            Scheda tecnica
          </div>
          <div
            style={{
              color: WHITE,
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 72,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: -2,
              lineHeight: 0.9,
            }}
          >
            FULL
            <br />
            SPECS
          </div>
          {/* Linea decorativa */}
          <div
            style={{
              width: interpolate(
                spring({ frame: frame - 10, fps, config: { damping: 200 } }),
                [0, 1],
                [0, 200],
              ),
              height: 2,
              background: `linear-gradient(to right, ${WHITE}, transparent)`,
              marginTop: 20,
            }}
          />
        </div>

        {/* Grid specs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          {technicals.map((t, i) => {
            const op = useFadeIn(15 + i * 10, 14);
            const slideIn = spring({
              frame: frame - (15 + i * 10),
              fps,
              config: { damping: 200 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: op,
                  transform: `translateX(${interpolate(slideIn, [0, 1], [50, 0])}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  background: 'rgba(255,255,255,0.05)',
                  borderLeft: `3px solid rgba(255,255,255,0.3)`,
                  borderRadius: '0 12px 12px 0',
                  paddingTop: 18,
                  paddingBottom: 18,
                  paddingLeft: 24,
                  paddingRight: 24,
                }}
              >
                <span style={{ fontSize: 34 }}>{t.icon}</span>
                <div>
                  <div
                    style={{
                      color: DIM,
                      fontFamily: 'Arial, sans-serif',
                      fontSize: 22,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      color: WHITE,
                      fontFamily: 'Arial, sans-serif',
                      fontSize: 32,
                      fontWeight: 700,
                    }}
                  >
                    {t.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 – CTA finale ─────────────────────────────────────────────────
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity = useFadeIn(0, 30);
  const titleOpacity = useFadeIn(15, 22);
  const titleY = useSlideUp(15, 28);
  const subOpacity = useFadeIn(35, 20);
  const tagOpacity = useFadeIn(50, 18);
  const ctaOpacity = useFadeIn(62, 22);

  // Slow zoom out
  const zoom = interpolate(frame, [0, S5], [1.06, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Pulsazione CTA
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.4),
    [-1, 1],
    [0.97, 1.03],
  );

  return (
    <AbsoluteFill style={{ background: BLACK, overflow: 'hidden' }}>
      {/* Foto con zoom out */}
      <AbsoluteFill
        style={{
          opacity: imgOpacity,
          transform: `scale(${zoom})`,
        }}
      >
        <Img
          src={staticFile('whistle-bike.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Overlay pesante */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          paddingBottom: 100,
          paddingLeft: 70,
          paddingRight: 70,
        }}
      >
        {/* Tag superiore */}
        <div
          style={{
            opacity: tagOpacity,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
            width: 'fit-content',
          }}
        >
          <div style={{ width: 40, height: 1, background: SILVER }} />
          <span
            style={{
              color: SILVER,
              fontFamily: 'Arial, sans-serif',
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              fontWeight: 300,
            }}
          >
            2024 / Stealth Edition
          </span>
          <div style={{ width: 40, height: 1, background: SILVER }} />
        </div>

        {/* Titolo */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: WHITE,
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 0.88,
              textTransform: 'uppercase',
              letterSpacing: -2,
            }}
          >
            RIDE
            <br />
            <span style={{ color: SILVER, fontWeight: 300, letterSpacing: 4, fontSize: 74 }}>
              THE ROAD
            </span>
          </div>
        </div>

        {/* Claim */}
        <div
          style={{
            opacity: subOpacity,
            color: DIM,
            fontFamily: 'Arial, sans-serif',
            fontSize: 32,
            fontWeight: 300,
            lineHeight: 1.6,
            marginBottom: 44,
          }}
        >
          Whistle Full Carbon · Shimano Ultegra Di2
          <br />
          Freni idraulici · Full Stealth Black
        </div>

        {/* CTA Badge */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${pulse})`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 20,
            background: WHITE,
            borderRadius: 12,
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 48,
            paddingRight: 48,
            width: 'fit-content',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: BLACK,
            }}
          />
          <span
            style={{
              color: BLACK,
              fontFamily: 'Arial Black, Arial, sans-serif',
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Whistle Road Bike
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Composizione principale ───────────────────────────────────────────────
export const WhistleBike: React.FC = () => {
  return (
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
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S4} premountFor={T}>
        <Scene4 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-left' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={S5} premountFor={T}>
        <Scene5 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
