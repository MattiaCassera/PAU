import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import { Audio } from '@remotion/media';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';

// ─── Brand palette Agrigal ─────────────────────────────────────────────────
const GREEN_DARK = '#1a4a1a';
const GREEN_MID = '#2d7a2d';
const GOLD = '#d4a017';
const GOLD_LIGHT = '#f0c040';
const CREAM = '#fdf6e3';
const WHITE = '#ffffff';

// ─── Durate ────────────────────────────────────────────────────────────────
const T = 9;
const SCENE1 = 160;
const SCENE2 = 160;
const SCENE3 = 148;
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

function useSlideUp(delay = 0, damping = 200, distance = 80) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping } });
  return interpolate(s, [0, 1], [distance, 0]);
}

// ─── SCENE 1 – Hero ────────────────────────────────────────────────────────

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = interpolate(frame, [0, SCENE1], [1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overlayOpacity = useFade(0, 25);
  const badgeY = useSlideUp(8, 180, 60);
  const badgeOpacity = useFade(8, 16);
  const titleY = useSlideUp(22, 160, 100);
  const titleOpacity = useFade(22, 18);
  const subtitleOpacity = useFade(45, 20);
  const subtitleY = useSlideUp(45, 180, 80);
  const tagOpacity = useFade(65, 15);
  const tagY = useSlideUp(65, 200, 60);

  return (
    <AbsoluteFill>
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

      {/* Overlay più scuro e contrastato */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,30,10,0.72) 0%,
            rgba(26,74,26,0.10) 38%,
            rgba(10,20,10,0.92) 100%
          )`,
          opacity: overlayOpacity,
        }}
      />

      {/* Badge BIO — più grande e impattante */}
      <div
        style={{
          position: 'absolute',
          top: 100,
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
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
            borderRadius: 120,
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 56,
            paddingRight: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 8px 32px rgba(212,160,23,0.5)',
          }}
        >
          <span style={{ fontSize: 38 }}>🌱</span>
          <span
            style={{
              color: GREEN_DARK,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              fontSize: 36,
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
          padding: '0 56px 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Nome prodotto — font più grande */}
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
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.0,
              textShadow: '0 4px 28px rgba(0,0,0,0.7)',
              letterSpacing: -1,
            }}
          >
            Patatine
          </div>
          <div
            style={{
              color: GOLD_LIGHT,
              fontFamily: 'Georgia, serif',
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.0,
              textShadow: '0 4px 28px rgba(0,0,0,0.7)',
              letterSpacing: -1,
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
            fontSize: 38,
            fontStyle: 'italic',
            lineHeight: 1.4,
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
          }}
        >
          Mais Spinato & Rostrato Rosso
          <br />
          dalla Val Seriana
        </div>

        {/* Tag ingredienti — più grandi e con sfondo pieno */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap' as const,
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          {[
            { label: '🌽 99% Mais', bg: 'rgba(212,160,23,0.25)' },
            { label: '🧂 Sale', bg: 'rgba(212,160,23,0.25)' },
            { label: '🚫 Senza Glutine', bg: 'rgba(255,255,255,0.15)' },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                background: t.bg,
                border: `2px solid ${GOLD}`,
                borderRadius: 50,
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 30,
                paddingRight: 30,
                color: WHITE,
                fontFamily: 'Georgia, serif',
                fontSize: 32,
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}
            >
              {t.label}
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

  const imgX = interpolate(frame, [0, SCENE2], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const imgScale = interpolate(frame, [0, SCENE2], [1.06, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const overlayOpacity = useFade(0, 20);
  const topLabelOpacity = useFade(6, 16);
  const topLabelY = useSlideUp(6, 160, 70);

  const features = [
    { icon: '🌿', title: 'Biologico certificato', sub: 'UE Reg. 2018/848' },
    { icon: '🏔️', title: 'Val Seriana', sub: 'Mais autoctono di montagna' },
    { icon: '✨', title: 'Solo 2 ingredienti', sub: 'Mais 99% · Sale 1%' },
  ];

  return (
    <AbsoluteFill>
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

      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,30,10,0.80) 0%,
            rgba(26,74,26,0.15) 30%,
            rgba(10,20,10,0.88) 100%
          )`,
          opacity: overlayOpacity,
        }}
      />

      {/* Titolo in alto — più grande */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: topLabelOpacity,
          transform: `translateY(${topLabelY}px)`,
          padding: '0 56px',
        }}
      >
        <div
          style={{
            color: GOLD_LIGHT,
            fontFamily: 'Georgia, serif',
            fontSize: 64,
            fontWeight: 700,
            textShadow: '0 3px 20px rgba(0,0,0,0.7)',
          }}
        >
          Qualità che si vede
        </div>
        <div
          style={{
            color: CREAM,
            fontFamily: 'Georgia, serif',
            fontSize: 36,
            fontStyle: 'italic',
            marginTop: 14,
            textShadow: '0 2px 14px rgba(0,0,0,0.6)',
          }}
        >
          Coltivato con rispetto per la terra
        </div>
      </div>

      {/* Cards features — più grandi, più visibili */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 44px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {features.map((f, i) => {
          const cardOpacity = useFade(20 + i * 16, 14);
          const cardY = useSlideUp(20 + i * 16, 180, 70);
          const cardScale = spring({
            frame: frame - (20 + i * 16),
            fps,
            config: { damping: 18, stiffness: 150 },
          });

          return (
            <div
              key={f.title}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                background: 'rgba(15,45,15,0.90)',
                border: `2.5px solid ${GOLD}`,
                borderRadius: 28,
                paddingTop: 28,
                paddingBottom: 28,
                paddingLeft: 36,
                paddingRight: 36,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <span style={{ fontSize: 64, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div
                  style={{
                    color: WHITE,
                    fontFamily: 'Georgia, serif',
                    fontSize: 44,
                    fontWeight: 700,
                    lineHeight: 1.15,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    color: GOLD_LIGHT,
                    fontFamily: 'Georgia, serif',
                    fontSize: 32,
                    fontStyle: 'italic',
                    marginTop: 6,
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
  const starOpacity = useFade(5, 16);
  const starY = useSlideUp(5, 160, 60);
  const headlineOpacity = useFade(20, 18);
  const headlineY = useSlideUp(20, 160, 90);
  const priceScale = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 140 } });
  const priceOpacity = useFade(50, 16);

  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.8),
    [-1, 1],
    [0.96, 1.04],
  );

  const ctaScale = spring({ frame: frame - 85, fps, config: { damping: 14, stiffness: 160 } });
  const ctaOpacity = useFade(85, 18);

  return (
    <AbsoluteFill>
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

      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,30,10,0.85) 0%,
            rgba(26,74,26,0.20) 38%,
            rgba(5,15,5,0.95) 100%
          )`,
          opacity: overlayOpacity,
        }}
      />

      {/* Stelle + rating — più grandi */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: starOpacity,
          transform: `translateY(${starY}px)`,
        }}
      >
        <div style={{ fontSize: 56, letterSpacing: 6 }}>⭐⭐⭐⭐⭐</div>
        <div
          style={{
            color: GOLD_LIGHT,
            fontFamily: 'Georgia, serif',
            fontSize: 34,
            fontStyle: 'italic',
            marginTop: 10,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          25 recensioni · Eccellente
        </div>
      </div>

      {/* Contenuto basso */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 52px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          alignItems: 'center',
        }}
      >
        {/* Headline — più grande */}
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
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow: '0 4px 28px rgba(0,0,0,0.7)',
            }}
          >
            Il gusto autentico
          </div>
          <div
            style={{
              color: GOLD_LIGHT,
              fontFamily: 'Georgia, serif',
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow: '0 4px 28px rgba(0,0,0,0.7)',
            }}
          >
            della terra
          </div>
        </div>

        {/* Badge prezzo — più grande e luminoso */}
        <div
          style={{
            opacity: priceOpacity,
            transform: `scale(${priceScale * pulse})`,
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
            borderRadius: 36,
            paddingTop: 26,
            paddingBottom: 26,
            paddingLeft: 64,
            paddingRight: 64,
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(212,160,23,0.6)',
          }}
        >
          <div
            style={{
              color: GREEN_DARK,
              fontFamily: 'Georgia, serif',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            90g · Senza Glutine
          </div>
          <div
            style={{
              color: GREEN_DARK,
              fontFamily: 'Georgia, serif',
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            €2,99
          </div>
        </div>

        {/* CTA — molto più in evidenza con spring + glow */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${GREEN_MID} 0%, #3a9a3a 100%)`,
              border: `3px solid ${GOLD_LIGHT}`,
              borderRadius: 60,
              paddingTop: 30,
              paddingBottom: 30,
              paddingLeft: 0,
              paddingRight: 0,
              marginBottom: 20,
              boxShadow: `0 12px 48px rgba(45,122,45,0.6), 0 0 0 6px rgba(212,160,23,0.2)`,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{ fontSize: 44 }}>🛒</span>
            <span
              style={{
                color: WHITE,
                fontFamily: 'Georgia, serif',
                fontSize: 48,
                fontWeight: 700,
                letterSpacing: 1,
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              Ordina ora
            </span>
          </div>
          <div
            style={{
              color: CREAM,
              fontFamily: 'Georgia, serif',
              fontSize: 32,
              fontStyle: 'italic',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
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
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fade-in 1s all'inizio, fade-out 1.5s prima della fine
  const volume = interpolate(
    frame,
    [0, 1 * fps, durationInFrames - 1.5 * fps, durationInFrames],
    [0, 0.35, 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <>
      <Audio
        src={staticFile('background-music.mp3')}
        volume={volume}
        loop
      />
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
    </>
  );
};
