import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';

// ─── Brand palette Agrigal ─────────────────────────────────────────────────
const GREEN_DARK = '#1a4a1a';
const GREEN_MID = '#2d7a2d';
const GOLD = '#d4a017';
const CREAM = '#fdf6e3';
const WHITE = '#ffffff';

// ─── Durate (30 fps · max 15s = 450 frame) ────────────────────────────────
// Transizioni: 18 frame ciascuna → totale sottratto: 18 * 2 = 36
// Totale scene: 450 + 36 = 486 → ma vogliamo stare a 450
// Scene: 160 + 145 + 145 = 450; con 2 transizioni da 18 → 450 - 36 = 414? No:
// Con TransitionSeries la durata totale = somma scene - somma transizioni
// Vogliamo 450 frame: (S1 + S2 + S3) - (T1 + T2) = 450
// 160 + 160 + 148 - 18 = 450 ✓ (2 transizioni da 9 → 160+160+148-9-9=450)
const T = 9;    // transition frames (9 = 0.3s, molto snappy)
const SCENE1 = 160; // 5.3s — Hero con foto prodotto + nome
const SCENE2 = 160; // 5.3s — Dettaglio mais + qualità bio
const SCENE3 = 148; // 4.9s — CTA con foto lifestyle
// Totale: 160 + 160 + 148 - 9 - 9 = 450 frame = 15s ✓

// ─── Helpers ───────────────────────────────────────────────────────────────

function useFade(from: number, dur = 20) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
}

function useSlideUp(delay = 0, damping = 200) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping } });
  return interpolate(s, [0, 1], [60, 0]);
}

// ─── SCENE 1 – Hero ────────────────────────────────────────────────────────

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns sulla foto: lieve zoom-in
  const imgScale = interpolate(frame, [0, SCENE1], [1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overlayOpacity = useFade(0, 25);
  const badgeY = useSlideUp(10, 200);
  const badgeOpacity = useFade(10, 18);
  const titleY = useSlideUp(25, 180);
  const titleOpacity = useFade(25, 20);
  const subtitleOpacity = useFade(50, 22);
  const subtitleY = useSlideUp(50, 200);

  const tagScale = spring({ frame: frame - 70, fps, config: { damping: 14, stiffness: 130 } });
  const tagOpacity = useFade(70, 15);

  return (
    <AbsoluteFill>
      {/* Foto prodotto come sfondo con Ken Burns */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('patatine-rosmarino-gallette.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>

      {/* Overlay gradiente brand */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(26,74,26,0.55) 0%,
            rgba(26,74,26,0.15) 35%,
            rgba(26,74,26,0.10) 55%,
            rgba(10,30,10,0.85) 100%
          )`,
          opacity: overlayOpacity,
        }}
      />

      {/* Badge BIO in alto */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
        }}
      >
        <div
          style={{
            background: GOLD,
            borderRadius: 100,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 44,
            paddingRight: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 32 }}>🌱</span>
          <span
            style={{
              color: GREEN_DARK,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 3,
              textTransform: 'uppercase' as const,
            }}
          >
            100% Biologico
          </span>
        </div>
      </div>

      {/* Contenuto in basso */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 64px 100px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Nome prodotto */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              color: CREAM,
              fontFamily: 'Georgia, serif',
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              textShadow: '0 3px 20px rgba(0,0,0,0.5)',
            }}
          >
            Patatine
          </div>
          <div
            style={{
              color: GOLD,
              fontFamily: 'Georgia, serif',
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              textShadow: '0 3px 20px rgba(0,0,0,0.5)',
            }}
          >
            Mais Antichi
          </div>
        </div>

        {/* Sottotitolo */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            color: CREAM,
            fontFamily: 'Georgia, serif',
            fontSize: 34,
            fontStyle: 'italic',
            lineHeight: 1.4,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          Mais Spinato & Rostrato Rosso
          <br />
          dalla Val Seriana
        </div>

        {/* Tag ingredienti */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap' as const,
            opacity: tagOpacity,
            transform: `scale(${tagScale})`,
          }}
        >
          {['🌽 99% Mais', '🧂 Sale', '🚫 Senza Glutine'].map((t) => (
            <div
              key={t}
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: `1.5px solid ${GOLD}`,
                borderRadius: 40,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 24,
                paddingRight: 24,
                color: WHITE,
                fontFamily: 'Georgia, serif',
                fontSize: 28,
                backdropFilter: 'blur(6px)',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 – Qualità & Dettaglio ────────────────────────────────────────

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pan leggero sull'immagine
  const imgX = interpolate(frame, [0, SCENE2], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const imgScale = interpolate(frame, [0, SCENE2], [1.06, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overlayOpacity = useFade(0, 20);
  const topLabelOpacity = useFade(8, 18);
  const topLabelY = useSlideUp(8, 180);

  const features = [
    { icon: '🌿', title: 'Biologico certificato', sub: 'UE Reg. 2018/848' },
    { icon: '🏔️', title: 'Val Seriana', sub: 'Mais autoctono di montagna' },
    { icon: '✨', title: 'Solo 2 ingredienti', sub: 'Mais 99% · Sale 1%' },
  ];

  return (
    <AbsoluteFill>
      {/* Foto dettaglio mais */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('patatine-mais-dettaglio.jpg')}
          style={{
            width: '110%',
            height: '100%',
            objectFit: 'cover',
            transform: `translateX(${imgX}px) scale(${imgScale})`,
            transformOrigin: 'center center',
          }}
        />
      </AbsoluteFill>

      {/* Overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,30,10,0.70) 0%,
            rgba(26,74,26,0.20) 30%,
            rgba(10,30,10,0.78) 100%
          )`,
          opacity: overlayOpacity,
        }}
      />

      {/* Label in alto */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: topLabelOpacity,
          transform: `translateY(${topLabelY}px)`,
          padding: '0 60px',
        }}
      >
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 52,
            fontWeight: 700,
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
          }}
        >
          Qualità che si vede
        </div>
        <div
          style={{
            color: CREAM,
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            fontStyle: 'italic',
            marginTop: 12,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          Coltivato con rispetto per la terra
        </div>
      </div>

      {/* Cards features in basso */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 48px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {features.map((f, i) => {
          const cardOpacity = useFade(25 + i * 18, 16);
          const cardY = useSlideUp(25 + i * 18, 200);
          const cardScale = spring({
            frame: frame - (25 + i * 18),
            fps,
            config: { damping: 200 },
          });

          return (
            <div
              key={f.title}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                background: 'rgba(26,74,26,0.82)',
                border: `1.5px solid rgba(212,160,23,0.6)`,
                borderRadius: 22,
                paddingTop: 22,
                paddingBottom: 22,
                paddingLeft: 32,
                paddingRight: 32,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ fontSize: 52, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div
                  style={{
                    color: WHITE,
                    fontFamily: 'Georgia, serif',
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    color: GOLD,
                    fontFamily: 'Georgia, serif',
                    fontSize: 26,
                    fontStyle: 'italic',
                    marginTop: 4,
                  }}
                >
                  {f.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 – CTA finale ─────────────────────────────────────────────────

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = interpolate(frame, [0, SCENE3], [1.04, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overlayOpacity = useFade(0, 22);
  const starOpacity = useFade(5, 18);
  const starY = useSlideUp(5, 180);
  const headlineOpacity = useFade(22, 20);
  const headlineY = useSlideUp(22, 170);
  const priceScale = spring({ frame: frame - 55, fps, config: { damping: 12, stiffness: 140 } });
  const priceOpacity = useFade(55, 18);

  // Pulsazione leggera sul pulsante CTA
  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.8),
    [-1, 1],
    [0.97, 1.03],
  );

  const ctaOpacity = useFade(85, 20);
  const ctaY = useSlideUp(85, 200);

  return (
    <AbsoluteFill>
      {/* Foto lifestyle */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('patatine-rosmarino-dettaglio.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
            transformOrigin: '60% 50%',
          }}
        />
      </AbsoluteFill>

      {/* Overlay scuro brand */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,30,10,0.80) 0%,
            rgba(26,74,26,0.25) 40%,
            rgba(10,20,10,0.90) 100%
          )`,
          opacity: overlayOpacity,
        }}
      />

      {/* Stelle + rating in alto */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: starOpacity,
          transform: `translateY(${starY}px)`,
        }}
      >
        <div style={{ fontSize: 44, letterSpacing: 4 }}>⭐⭐⭐⭐⭐</div>
        <div
          style={{
            color: GOLD,
            fontFamily: 'Georgia, serif',
            fontSize: 28,
            fontStyle: 'italic',
            marginTop: 8,
          }}
        >
          25 recensioni · Eccellente
        </div>
      </div>

      {/* Contenuto centrale + basso */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 60px 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          alignItems: 'center',
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: WHITE,
              fontFamily: 'Georgia, serif',
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.15,
              textShadow: '0 3px 20px rgba(0,0,0,0.55)',
            }}
          >
            Il gusto autentico
          </div>
          <div
            style={{
              color: GOLD,
              fontFamily: 'Georgia, serif',
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.15,
              textShadow: '0 3px 20px rgba(0,0,0,0.55)',
            }}
          >
            della terra
          </div>
        </div>

        {/* Badge prezzo */}
        <div
          style={{
            opacity: priceOpacity,
            transform: `scale(${priceScale * pulse})`,
            background: GOLD,
            borderRadius: 32,
            paddingTop: 22,
            paddingBottom: 22,
            paddingLeft: 56,
            paddingRight: 56,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: GREEN_DARK,
              fontFamily: 'Georgia, serif',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            90g · Senza Glutine
          </div>
          <div
            style={{
              color: GREEN_DARK,
              fontFamily: 'Georgia, serif',
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            €2,99
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: GREEN_MID,
              border: `2px solid ${GOLD}`,
              borderRadius: 50,
              paddingTop: 22,
              paddingBottom: 22,
              paddingLeft: 64,
              paddingRight: 64,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                color: WHITE,
                fontFamily: 'Georgia, serif',
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              🛒 Ordina ora
            </span>
          </div>
          <div
            style={{
              color: CREAM,
              fontFamily: 'Georgia, serif',
              fontSize: 30,
              fontStyle: 'italic',
            }}
          >
            agrigal.com · negozio-bio-online
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Composizione principale ───────────────────────────────────────────────

export const PatatineMaisAntichi: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE1}>
        <Scene1 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE2}>
        <Scene2 />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE3}>
        <Scene3 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
