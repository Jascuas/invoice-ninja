import { Player } from '@lottiefiles/react-lottie-player';

interface LottiePlayerProps {
  className?: string;
  src: string;
}

const LottiePlayer: React.FC<LottiePlayerProps> = ({
  className = 'w-40 h-40',
  src,
}) => {
  return <Player autoplay loop className={className} src={src} />;
};

export default LottiePlayer;
