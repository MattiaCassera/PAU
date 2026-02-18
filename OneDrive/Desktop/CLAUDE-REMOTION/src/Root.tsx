import { Composition } from 'remotion';
import { GallettaMais } from './GallettaMais';
import { WhistleBike } from './WhistleBike';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="GallettaMais"
        component={GallettaMais}
        durationInFrames={390}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="WhistleBike"
        component={WhistleBike}
        durationInFrames={440}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
