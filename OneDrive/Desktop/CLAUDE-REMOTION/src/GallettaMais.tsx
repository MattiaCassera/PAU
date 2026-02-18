import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

// ─── palette colori ────────────────────────────────────────────────────────
const GREEN_DARK = '#1a4a1a';
const GREEN_MID = '#2d7a2d';
const GREEN_LIGHT = '#4caf50';
const GOLD = '#d4a017';
const CREAM = '#fdf6e3';
const WHITE = '#ffffff';

// ─── durate scene (frame a 30fps) ─────────────────────────────────────────
const TRANSITION_FRAMES = 20;
const SCENE1 = 100; // Hero – logo + nome prodotto
const SCENE2 = 90;  // Ingredienti – 99% mais antico, 1% sale
const SCENE3 = 90;  // Certificazione bio + gluten free
const SCENE4 = 90;  // Valori nutrizionali
const SCENE5 = 100; // CTA finale

// ─── helpers ──────────────────────────────────────────────────────────────

function useEntrance(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
}

function useFadeIn(startFrame = 0, durationFrames = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
}

// ─── SCENE 1 – Hero ───────────────────────────────────────────────────────

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const titleOpacity = useFadeIn(0, 15);
  const subOpacity = useFadeIn(20, 20);
  const leafOpacity = useFadeIn(10, 25);

  const rotate = interpolate(frame, [0, 150], [-6, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${GREEN_MID} 0%, ${GREEN_DARK} 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      {/* Foglie decorative */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: -60,
          fontSize: 220,
          opacity: leafOpacity * 0.18,
          transform: `rotate(${rotate}deg)`,
          userSelect: 'none',
        }}
      >
        🌿
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: -40,
          fontSize: 200,
          opacity: leafOpacity * 0.15,
          transform: `rotate(${-rotate * 0.8}deg)`,
          userSelect: 'none',
        }}
      >
        🌾
      </div>

      {/* Badge BIO */}
      <div
        style={{
          opacity: subOpacity,
          background: GOLD,
          borderRadius: 60,
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 48,
          paddingRight: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 38, fontFamily: 'serif' }}>🌱</span>
        <span
          style={{
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          100% Biologico
        </span>
      </div>

      {/* Titolo prodotto */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        <div
          style={{
            color: CREAM,
            fontFamily: 'Georgia, serif',
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: '0 4px 24px rgba(0,0,0,0.35)',
          }}
        >
          Gallette
        </div>
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: '0 4px 24px rgba(0,0,0,0.35)',
          }}
        >
          Mais Antichi
        </div>
      </div>

      {/* Emoji mais */}
      <div
        style={{
          fontSize: 130,
          opacity: leafOpacity,
          transform: `scale(${spring({ frame: frame - 10, fps, config: { damping: 12 } })})`,
        }}
      >
        🌽
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subOpacity,
          color: CREAM,
          fontFamily: 'Georgia, serif',
          fontSize: 38,
          textAlign: 'center',
          paddingLeft: 60,
          paddingRight: 60,
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}
      >
        Mais Spinato & Rostrato Rosso
        <br />
        dalla Val Seriana
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 – Ingredienti ────────────────────────────────────────────────

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = useFadeIn(0, 18);
  const bar1Width = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const bar2Width = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  const text1Opacity = useFadeIn(20, 15);
  const text2Opacity = useFadeIn(35, 15);
  const tagOpacity = useFadeIn(50, 20);

  return (
    <AbsoluteFill
      style={{
        background: CREAM,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 40,
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: titleOpacity,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 12 }}>🌾</div>
        <div
          style={{
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontSize: 60,
            fontWeight: 700,
          }}
        >
          Ingredienti puri
        </div>
        <div
          style={{
            color: GREEN_MID,
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            fontStyle: 'italic',
            marginTop: 8,
          }}
        >
          Solo la natura nel piatto
        </div>
      </div>

      {/* Barra mais */}
      <div style={{ width: '100%', opacity: text1Opacity }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontSize: 40,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <span>🌽 Mais antico biologico</span>
          <span style={{ color: GREEN_MID }}>99%</span>
        </div>
        <div
          style={{
            background: '#e0e0e0',
            borderRadius: 20,
            height: 28,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: `linear-gradient(90deg, ${GREEN_MID}, ${GREEN_LIGHT})`,
              borderRadius: 20,
              height: '100%',
              width: `${bar1Width * 99}%`,
            }}
          />
        </div>
      </div>

      {/* Barra sale */}
      <div style={{ width: '100%', opacity: text2Opacity }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontSize: 40,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          <span>🧂 Sale</span>
          <span style={{ color: GREEN_MID }}>1%</span>
        </div>
        <div
          style={{
            background: '#e0e0e0',
            borderRadius: 20,
            height: 28,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: `linear-gradient(90deg, ${GOLD}, #e8c040)`,
              borderRadius: 20,
              height: '100%',
              width: `${bar2Width * 1}%`,
            }}
          />
        </div>
      </div>

      {/* Tag */}
      <div
        style={{
          opacity: tagOpacity,
          background: GREEN_DARK,
          borderRadius: 24,
          paddingTop: 28,
          paddingBottom: 28,
          paddingLeft: 40,
          paddingRight: 40,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          Nessun additivo · Nessun conservante
          <br />
          Nessun glutine
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 – Certificazioni ─────────────────────────────────────────────

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = useFadeIn(0, 18);
  const card1Scale = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 130 } });
  const card2Scale = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 130 } });
  const card3Scale = spring({ frame: frame - 45, fps, config: { damping: 14, stiffness: 130 } });
  const card1Opacity = useFadeIn(15, 12);
  const card2Opacity = useFadeIn(30, 12);
  const card3Opacity = useFadeIn(45, 12);

  const cards = [
    { emoji: '🌱', label: 'Certificato\nBiologico', opacity: card1Opacity, scale: card1Scale },
    { emoji: '🚫🌾', label: 'Senza\nGlutine', opacity: card2Opacity, scale: card2Scale },
    { emoji: '🏔️', label: 'Val Seriana\nDOP', opacity: card3Opacity, scale: card3Scale },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${GREEN_DARK} 0%, #0d2e0d 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 60,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      <div style={{ opacity: titleOpacity, textAlign: 'center' }}>
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          Le nostre
        </div>
        <div
          style={{
            color: WHITE,
            fontFamily: 'Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          Garanzie
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
          width: '100%',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              opacity: card.opacity,
              transform: `scale(${card.scale})`,
              background: 'rgba(255,255,255,0.08)',
              border: `2px solid ${GOLD}`,
              borderRadius: 28,
              paddingTop: 36,
              paddingBottom: 36,
              paddingLeft: 48,
              paddingRight: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 36,
            }}
          >
            <span style={{ fontSize: 72 }}>{card.emoji}</span>
            <span
              style={{
                color: WHITE,
                fontFamily: 'Georgia, serif',
                fontSize: 46,
                fontWeight: 700,
                lineHeight: 1.3,
                whiteSpace: 'pre-line',
              }}
            >
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 – Valori nutrizionali ────────────────────────────────────────

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = useFadeIn(0, 18);

  const nutrients = [
    { label: 'Energia', value: '379 kcal', icon: '⚡' },
    { label: 'Proteine', value: '8,6 g', icon: '💪' },
    { label: 'Carboidrati', value: '82,3 g', icon: '🌾' },
    { label: 'Fibre', value: '5,3 g', icon: '🌿' },
    { label: 'Grassi', value: '2,3 g', icon: '✨' },
  ];

  return (
    <AbsoluteFill
      style={{
        background: CREAM,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 32,
        paddingLeft: 70,
        paddingRight: 70,
      }}
    >
      <div style={{ opacity: titleOpacity, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>📊</div>
        <div
          style={{
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontSize: 58,
            fontWeight: 700,
          }}
        >
          Valori per 100g
        </div>
        <div
          style={{
            color: GREEN_MID,
            fontFamily: 'Georgia, serif',
            fontSize: 34,
            fontStyle: 'italic',
            marginTop: 6,
          }}
        >
          Leggeri e nutrienti
        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {nutrients.map((n, i) => {
          const rowOpacity = useFadeIn(10 + i * 12, 14);
          const rowSlide = spring({ frame: frame - (10 + i * 12), fps, config: { damping: 200 } });
          return (
            <div
              key={i}
              style={{
                opacity: rowOpacity,
                transform: `translateX(${interpolate(rowSlide, [0, 1], [80, 0])}px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: i % 2 === 0 ? 'rgba(45,122,45,0.08)' : 'rgba(45,122,45,0.04)',
                borderRadius: 20,
                paddingTop: 22,
                paddingBottom: 22,
                paddingLeft: 36,
                paddingRight: 36,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 44 }}>{n.icon}</span>
                <span
                  style={{
                    color: GREEN_DARK,
                    fontFamily: 'Georgia, serif',
                    fontSize: 40,
                    fontWeight: 600,
                  }}
                >
                  {n.label}
                </span>
              </div>
              <span
                style={{
                  color: GREEN_MID,
                  fontFamily: 'Georgia, serif',
                  fontSize: 40,
                  fontWeight: 700,
                }}
              >
                {n.value}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 5 – CTA finale ─────────────────────────────────────────────────

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainOpacity = useFadeIn(0, 20);
  const priceScale = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 140 } });
  const ctaOpacity = useFadeIn(40, 20);
  const starOpacity = useFadeIn(55, 15);

  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.96, 1.04],
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${GREEN_MID} 0%, ${GREEN_DARK} 70%, #0a1e0a 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 44,
        paddingLeft: 70,
        paddingRight: 70,
      }}
    >
      {/* Stelle recensioni */}
      <div style={{ opacity: starOpacity, textAlign: 'center' }}>
        <div style={{ fontSize: 52, letterSpacing: 6 }}>⭐⭐⭐⭐⭐</div>
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 34,
            marginTop: 8,
            fontStyle: 'italic',
          }}
        >
          25 recensioni · Eccellente
        </div>
      </div>

      {/* Headline */}
      <div style={{ opacity: mainOpacity, textAlign: 'center' }}>
        <div
          style={{
            color: WHITE,
            fontFamily: 'Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Il gusto autentico
        </div>
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          della terra
        </div>
        <div
          style={{
            color: CREAM,
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            fontStyle: 'italic',
            marginTop: 16,
            lineHeight: 1.4,
          }}
        >
          Mais Spinato & Rostrato Rosso
          <br />
          coltivati in montagna con amore
        </div>
      </div>

      {/* Prezzo */}
      <div
        style={{
          transform: `scale(${priceScale * pulse})`,
          background: GOLD,
          borderRadius: 36,
          paddingTop: 28,
          paddingBottom: 28,
          paddingLeft: 64,
          paddingRight: 64,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          90g · 10 mesi di shelf life
        </div>
        <div
          style={{
            color: GREEN_DARK,
            fontFamily: 'Georgia, serif',
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          €2,99
        </div>
      </div>

      {/* CTA */}
      <div style={{ opacity: ctaOpacity, textAlign: 'center' }}>
        <div
          style={{
            color: CREAM,
            fontFamily: 'Georgia, serif',
            fontSize: 38,
            fontStyle: 'italic',
            lineHeight: 1.5,
          }}
        >
          Scopri su agrigal.com
        </div>
        <div
          style={{
            color: GREEN_LIGHT,
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            marginTop: 8,
          }}
        >
          🌿 negozio-bio-online
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composizione principale ───────────────────────────────────────────────

export const GallettaMais: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE1}>
        <Scene1 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE2}>
        <Scene2 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-left' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE3}>
        <Scene3 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE4}>
        <Scene4 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE5}>
        <Scene5 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
