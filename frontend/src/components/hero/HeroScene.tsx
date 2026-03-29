import { memo } from 'react';
import Hero3DScene from './Hero3DScene';
import SceneRobot from './SceneRobot';
import './HeroScene.css';

interface HeroSceneProps {
  showRobot?: boolean;
  robotPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const HeroSceneComponent: React.FC<HeroSceneProps> = ({
  showRobot = true,
  robotPosition = 'bottom-right'
}) => {
  return (
    <div className="hero-scene">
      <Hero3DScene className="hero-scene__background" />
      {showRobot && (
        <SceneRobot 
          position={robotPosition}
          className="hero-scene__robot"
        />
      )}
    </div>
  );
};

export default memo(HeroSceneComponent);
