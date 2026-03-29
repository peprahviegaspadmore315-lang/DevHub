import React, { type CSSProperties } from 'react';
import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import './AIAssistant.css';
import ChatTab from './tabs/ChatTab';
import ExplainCodeTab from './tabs/ExplainCodeTab';
import QuizTab from './tabs/QuizTab';
import ReadingTab from './tabs/ReadingTab';
import DevHubWordmark from '@/components/ui/devhub-wordmark';
import {
  useAIAssistant,
  type AIAssistantTab,
} from '@/contexts/AIAssistantContext';

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface AIAssistantPanelProps {
  onClose: () => void;
  onResizeStart: (
    direction: ResizeDirection,
    event: React.PointerEvent<HTMLSpanElement>,
  ) => void;
  onToggleMaximized: () => void;
  onToggleMinimized: () => void;
  isMaximized: boolean;
  isMinimized: boolean;
  isResizable: boolean;
  isResizing: boolean;
  style?: CSSProperties;
}

const resizeHandles: ResizeDirection[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isMaximized,
  isMinimized,
  isResizable,
  isResizing,
  onClose,
  onResizeStart,
  onToggleMaximized,
  onToggleMinimized,
  style,
}) => {
  const { activeTab, setActiveTab } = useAIAssistant();
  const tabs: Array<{ id: AIAssistantTab; label: string }> = [
    { id: 'chat', label: 'Chat' },
    { id: 'explain', label: 'Explain Code' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'reading', label: 'Reading' },
  ];

  return (
    <div
      className={`ai-assistant-panel${isMinimized ? ' minimized' : ''}${isMaximized ? ' maximized' : ''}${isResizing ? ' resizing' : ''}`}
      style={style}
    >
      <div className="ai-assistant-header">
        <div className="ai-assistant-header-copy">
          <span className="ai-assistant-header-kicker">DevHub Companion</span>
          <h2>
            <DevHubWordmark
              tone="light"
              suffix=" AI"
              devClassName="text-sky-300"
              hubClassName="text-cyan-400"
              suffixClassName="text-white"
            />
          </h2>
          <p>Chat, explain code, generate quizzes, or read lessons aloud.</p>
        </div>

        <div className="ai-assistant-window-actions">
          <button
            className="ai-assistant-window-btn"
            onClick={onToggleMinimized}
            aria-label={isMinimized ? 'Restore AI Assistant' : 'Minimize AI Assistant'}
            title={isMinimized ? 'Restore' : 'Minimize'}
          >
            {isMinimized ? <Minimize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </button>
          <button
            className="ai-assistant-window-btn"
            onClick={onToggleMaximized}
            aria-label={isMaximized ? 'Restore window size' : 'Maximize AI Assistant'}
            title={isMaximized ? 'Restore size' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            className="ai-assistant-close-btn"
            onClick={onClose}
            aria-label="Close AI Assistant"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="ai-assistant-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ai-assistant-tab-content">
            <div className={activeTab === 'chat' ? 'h-full' : 'hidden'} aria-hidden={activeTab !== 'chat'}>
              <ChatTab />
            </div>
            <div className={activeTab === 'explain' ? 'h-full' : 'hidden'} aria-hidden={activeTab !== 'explain'}>
              <ExplainCodeTab />
            </div>
            <div className={activeTab === 'quiz' ? 'h-full' : 'hidden'} aria-hidden={activeTab !== 'quiz'}>
              <QuizTab />
            </div>
            <div className={activeTab === 'reading' ? 'h-full' : 'hidden'} aria-hidden={activeTab !== 'reading'}>
              <ReadingTab />
            </div>
          </div>
        </>
      )}

      {isResizable && (
        <>
          {resizeHandles.map((direction) => (
            <span
              key={direction}
              className={`ai-assistant-resize-handle ${direction}`}
              onPointerDown={(event) => onResizeStart(direction, event)}
            />
          ))}
          <span className="ai-assistant-corner-grip" aria-hidden="true" />
        </>
      )}
    </div>
  );
};

export default AIAssistantPanel;
