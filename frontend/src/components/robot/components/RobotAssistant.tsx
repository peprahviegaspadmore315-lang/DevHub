import { useState } from 'react';
import { useRobot } from '../context';
import { ChatBox } from './ChatBox';
import { RobotAvatar } from './RobotAvatar';
import { RobotControls } from './RobotControls';

export const RobotAssistant = () => {
  const { state } = useRobot();
  const [chatOpen, setChatOpen] = useState(false);

  const handleToggleChat = () => {
    setChatOpen(prev => !prev);
  };

  return (
    <>
      <ChatBox isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      
      <div className={`robot ${state}`}>
        <RobotAvatar state={state} size="md" />
        
        <RobotControls 
          onOpenChat={handleToggleChat} 
          isChatOpen={chatOpen}
        />
      </div>
    </>
  );
};

export default RobotAssistant;
