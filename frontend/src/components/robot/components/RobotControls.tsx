import { useRobotActions } from '../context';

interface RobotControlsProps {
  onOpenChat: () => void;
  isChatOpen: boolean;
}

export const RobotControls = ({ onOpenChat, isChatOpen }: RobotControlsProps) => {
  const { speak, setState } = useRobotActions();

  const handleReadPage = () => {
    const root = document.querySelector<HTMLElement>('main, .prose, body');
    const text = root?.innerText?.trim()?.replace(/\s+/g, ' ') || '';
    if (text) {
      setState('reading');
      speak(text, { forceReading: true });
    }
  };

  const handleReadSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setState('reading');
      speak(selection.toString(), { forceReading: true });
    } else {
      handleReadPage();
    }
  };

  return (
    <div className="robot-controls">
      <button onClick={handleReadSelection} className="robot-btn" title="Read selected text">
        Read
      </button>
      <button onClick={handleReadPage} className="robot-btn" title="Read all page content">
        Read All
      </button>
      <button
        onClick={onOpenChat}
        className={`robot-btn robot-btn-chat ${isChatOpen ? 'robot-btn-active' : ''}`}
        title="Open chat"
      >
        Chat
      </button>
    </div>
  );
};

export default RobotControls;
