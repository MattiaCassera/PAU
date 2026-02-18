import { Composition, Folder } from 'remotion';
import { GallettaMais } from './GallettaMais';
import { PatatineMaisAntichi } from './PatatineMaisAntichi';
import { WhistleBike } from './WhistleBike';
import { WhistleBikeH } from './WhistleBikeH';

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Agrigal">
        <Composition
          id="GallettaMais"
          component={GallettaMais}
          durationInFrames={390}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="PatatineMaisAntichi"
          component={PatatineMaisAntichi}
          durationInFrames={450}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="WhistleBike">
        <Composition
          id="WhistleBike-Vertical"
          component={WhistleBike}
          durationInFrames={440}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="WhistleBike-Horizontal"
          component={WhistleBikeH}
          durationInFrames={570}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
