import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './AIAssistant.css';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import AIAssistantPanel from './AIAssistantPanel';

const FLOATING_BUTTON_SIZE = 78;
const EDGE_PADDING = 16;
const PANEL_GAP = 16;
const PANEL_DEFAULT_WIDTH = 420;
const PANEL_MAX_WIDTH = 420;
const PANEL_DEFAULT_HEIGHT = 700;
const PANEL_MAX_HEIGHT = 760;
const PANEL_MIN_WIDTH = 340;
const PANEL_MIN_HEIGHT = 420;
const PANEL_MINIMIZED_HEIGHT = 122;
const LAUNCHER_POSITION_STORAGE_KEY = 'devhub-ai-launcher-position-v2';

type LauncherPosition = {
  x: number;
  y: number;
};

type PanelRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type PanelMode = 'default' | 'minimized' | 'maximized';

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getDefaultPosition = (
  viewportWidth: number,
  viewportHeight: number,
): LauncherPosition => ({
  x: Math.max(EDGE_PADDING, viewportWidth - FLOATING_BUTTON_SIZE - 24),
  y: Math.max(EDGE_PADDING, viewportHeight - FLOATING_BUTTON_SIZE - 28),
});

const getMinPanelWidth = (viewportWidth: number) =>
  Math.min(PANEL_MIN_WIDTH, Math.max(290, viewportWidth - EDGE_PADDING * 2));

const getMinPanelHeight = (
  viewportHeight: number,
  isMinimized: boolean,
) =>
  isMinimized
    ? PANEL_MINIMIZED_HEIGHT
    : Math.min(PANEL_MIN_HEIGHT, Math.max(260, viewportHeight - EDGE_PADDING * 2));

const clampPosition = (
  position: LauncherPosition,
  viewportWidth: number,
  viewportHeight: number,
): LauncherPosition => ({
  x: Math.min(
    Math.max(position.x, EDGE_PADDING),
    Math.max(EDGE_PADDING, viewportWidth - FLOATING_BUTTON_SIZE - EDGE_PADDING),
  ),
  y: Math.min(
    Math.max(position.y, EDGE_PADDING),
    Math.max(EDGE_PADDING, viewportHeight - FLOATING_BUTTON_SIZE - EDGE_PADDING),
  ),
});

const clampPanelRect = (
  rect: PanelRect,
  viewportWidth: number,
  viewportHeight: number,
  isMinimized = false,
): PanelRect => {
  const minWidth = getMinPanelWidth(viewportWidth);
  const minHeight = getMinPanelHeight(viewportHeight, isMinimized);
  const maxWidth = Math.max(minWidth, viewportWidth - EDGE_PADDING * 2);
  const maxHeight = Math.max(minHeight, viewportHeight - EDGE_PADDING * 2);
  const width = clampValue(rect.width, minWidth, maxWidth);
  const height = clampValue(rect.height, minHeight, maxHeight);

  return {
    left: clampValue(
      rect.left,
      EDGE_PADDING,
      Math.max(EDGE_PADDING, viewportWidth - width - EDGE_PADDING),
    ),
    top: clampValue(
      rect.top,
      EDGE_PADDING,
      Math.max(EDGE_PADDING, viewportHeight - height - EDGE_PADDING),
    ),
    width,
    height,
  };
};

const getMaximizedPanelRect = (
  viewportWidth: number,
  viewportHeight: number,
): PanelRect => ({
  left: EDGE_PADDING,
  top: EDGE_PADDING,
  width: Math.max(getMinPanelWidth(viewportWidth), viewportWidth - EDGE_PADDING * 2),
  height: Math.max(
    getMinPanelHeight(viewportHeight, false),
    viewportHeight - EDGE_PADDING * 2,
  ),
});

const getDefaultPanelRect = (
  launcherPosition: LauncherPosition,
  viewportWidth: number,
  viewportHeight: number,
): PanelRect => {
  const width = Math.min(
    PANEL_MAX_WIDTH,
    Math.max(getMinPanelWidth(viewportWidth), PANEL_DEFAULT_WIDTH),
  );
  const height = Math.min(
    PANEL_MAX_HEIGHT,
    Math.max(getMinPanelHeight(viewportHeight, false), PANEL_DEFAULT_HEIGHT),
  );
  const openAbove = launcherPosition.y > viewportHeight * 0.5;
  const openFromRight = launcherPosition.x > viewportWidth * 0.55;

  const nextRect: PanelRect = {
    left: openFromRight
      ? launcherPosition.x + FLOATING_BUTTON_SIZE - width
      : launcherPosition.x,
    top: openAbove
      ? launcherPosition.y - PANEL_GAP - height
      : launcherPosition.y + FLOATING_BUTTON_SIZE + PANEL_GAP,
    width,
    height,
  };

  return clampPanelRect(nextRect, viewportWidth, viewportHeight);
};

const getResizeCursor = (direction: ResizeDirection) => {
  switch (direction) {
    case 'top':
    case 'bottom':
      return 'ns-resize';
    case 'left':
    case 'right':
      return 'ew-resize';
    case 'top-left':
    case 'bottom-right':
      return 'nwse-resize';
    case 'top-right':
    case 'bottom-left':
      return 'nesw-resize';
    default:
      return 'default';
  }
};

const AIAssistant: React.FC = () => {
  const { isOpen, setIsOpen } = useAIAssistant();
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }));
  const [position, setPosition] = useState<LauncherPosition>(() => {
    if (typeof window === 'undefined') {
      return { x: EDGE_PADDING, y: EDGE_PADDING };
    }

    return getDefaultPosition(window.innerWidth, window.innerHeight);
  });
  const [panelRect, setPanelRect] = useState<PanelRect>(() => {
    if (typeof window === 'undefined') {
      return {
        left: EDGE_PADDING,
        top: EDGE_PADDING,
        width: PANEL_DEFAULT_WIDTH,
        height: PANEL_DEFAULT_HEIGHT,
      };
    }

    return getDefaultPanelRect(
      getDefaultPosition(window.innerWidth, window.innerHeight),
      window.innerWidth,
      window.innerHeight,
    );
  });
  const [panelMode, setPanelMode] = useState<PanelMode>('default');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [interactionCursor, setInteractionCursor] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const suppressClickRef = useRef(false);
  const panelRestoreRectRef = useRef<PanelRect | null>(null);
  const panelModeBeforeMinimizeRef =
    useRef<Exclude<PanelMode, 'minimized'>>('default');
  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });
  const resizeStateRef = useRef<{
    direction: ResizeDirection;
    pointerId: number;
    startRect: PanelRect;
    startX: number;
    startY: number;
  } | null>(null);

  const persistPosition = useCallback((nextPosition: LauncherPosition) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      LAUNCHER_POSITION_STORAGE_KEY,
      JSON.stringify(nextPosition),
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncViewport = () => {
      const nextViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      setViewportSize(nextViewport);
      setPosition((currentPosition) => {
        const clamped = clampPosition(
          currentPosition,
          nextViewport.width,
          nextViewport.height,
        );

        persistPosition(clamped);
        return clamped;
      });
      setPanelRect((currentPanelRect) => {
        if (panelMode === 'maximized') {
          return getMaximizedPanelRect(nextViewport.width, nextViewport.height);
        }

        return clampPanelRect(
          currentPanelRect,
          nextViewport.width,
          nextViewport.height,
          panelMode === 'minimized',
        );
      });
    };

    const storedPosition = window.localStorage.getItem(
      LAUNCHER_POSITION_STORAGE_KEY,
    );

    if (storedPosition) {
      try {
        const parsedPosition = JSON.parse(storedPosition) as LauncherPosition;
        setPosition(
          clampPosition(parsedPosition, window.innerWidth, window.innerHeight),
        );
      } catch {
        setPosition(getDefaultPosition(window.innerWidth, window.innerHeight));
      }
    }

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => {
      window.removeEventListener('resize', syncViewport);
    };
  }, [panelMode, persistPosition]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsTooltipVisible(true);
    const tooltipTimeout = window.setTimeout(() => {
      setIsTooltipVisible(false);
    }, 3000);

    return () => {
      window.clearTimeout(tooltipTimeout);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.userSelect = isDragging || isResizing ? 'none' : '';
    document.body.style.cursor = interactionCursor;

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [interactionCursor, isDragging, isResizing]);

  const endDrag = useCallback(
    (pointerId?: number) => {
      const dragState = dragStateRef.current;

      if (dragState.pointerId === null) {
        return;
      }

      if (
        typeof pointerId === 'number' &&
        dragState.pointerId !== pointerId
      ) {
        return;
      }

      if (buttonRef.current && typeof dragState.pointerId === 'number') {
        try {
          buttonRef.current.releasePointerCapture(dragState.pointerId);
        } catch {
          // Ignore if the pointer capture is already released.
        }
      }

      if (dragState.moved) {
        suppressClickRef.current = true;
        persistPosition(position);
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }

      dragStateRef.current = {
        pointerId: null,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        moved: false,
      };
      setIsDragging(false);
      setInteractionCursor('');
    },
    [persistPosition, position],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      buttonRef.current = event.currentTarget;
      event.currentTarget.setPointerCapture(event.pointerId);

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
        moved: false,
      };
    },
    [position.x, position.y],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const dragState = dragStateRef.current;
      if (dragState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      const nextPosition = clampPosition(
        {
          x: dragState.originX + deltaX,
          y: dragState.originY + deltaY,
        },
        window.innerWidth,
        window.innerHeight,
      );

      if (!dragState.moved && Math.hypot(deltaX, deltaY) > 6) {
        dragState.moved = true;
        setIsDragging(true);
        setInteractionCursor('grabbing');
      }

      if (dragState.moved) {
        event.preventDefault();
        setPosition(nextPosition);
      }
    },
    [],
  );

  const handleToggleMinimized = useCallback(() => {
    if (!viewportSize.width || !viewportSize.height) {
      return;
    }

    if (panelMode === 'minimized') {
      const restoreMode = panelModeBeforeMinimizeRef.current;
      setPanelMode(restoreMode);

      if (restoreMode === 'maximized') {
        setPanelRect(getMaximizedPanelRect(viewportSize.width, viewportSize.height));
        return;
      }

      setPanelRect((currentPanelRect) =>
        clampPanelRect(
          panelRestoreRectRef.current ?? currentPanelRect,
          viewportSize.width,
          viewportSize.height,
        ),
      );
      return;
    }

    panelModeBeforeMinimizeRef.current =
      panelMode === 'maximized' ? 'maximized' : 'default';
    panelRestoreRectRef.current = panelRect;
    setPanelMode('minimized');
    setPanelRect((currentPanelRect) =>
      clampPanelRect(
        {
          ...currentPanelRect,
          height: PANEL_MINIMIZED_HEIGHT,
        },
        viewportSize.width,
        viewportSize.height,
        true,
      ),
    );
  }, [panelMode, panelRect, viewportSize.height, viewportSize.width]);

  const handleToggleMaximized = useCallback(() => {
    if (!viewportSize.width || !viewportSize.height) {
      return;
    }

    if (panelMode === 'maximized') {
      const restoreRect =
        panelRestoreRectRef.current ??
        getDefaultPanelRect(position, viewportSize.width, viewportSize.height);
      setPanelMode('default');
      setPanelRect(
        clampPanelRect(restoreRect, viewportSize.width, viewportSize.height),
      );
      return;
    }

    if (panelMode === 'default') {
      panelRestoreRectRef.current = panelRect;
    } else if (panelMode === 'minimized') {
      panelModeBeforeMinimizeRef.current = 'maximized';
    }

    setPanelMode('maximized');
    setPanelRect(getMaximizedPanelRect(viewportSize.width, viewportSize.height));
  }, [panelMode, panelRect, position, viewportSize.height, viewportSize.width]);

  const endResize = useCallback(() => {
    resizeStateRef.current = null;
    setIsResizing(false);
    setInteractionCursor('');
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const resizeState = resizeStateRef.current;
      if (!resizeState || resizeState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - resizeState.startX;
      const deltaY = event.clientY - resizeState.startY;
      const minWidth = getMinPanelWidth(window.innerWidth);
      const minHeight = getMinPanelHeight(window.innerHeight, false);
      const maxWidth = Math.max(minWidth, window.innerWidth - EDGE_PADDING * 2);
      const maxHeight = Math.max(minHeight, window.innerHeight - EDGE_PADDING * 2);
      const startRight =
        resizeState.startRect.left + resizeState.startRect.width;
      const startBottom =
        resizeState.startRect.top + resizeState.startRect.height;
      const nextRect: PanelRect = { ...resizeState.startRect };

      if (resizeState.direction.includes('right')) {
        nextRect.width = clampValue(
          resizeState.startRect.width + deltaX,
          minWidth,
          window.innerWidth - resizeState.startRect.left - EDGE_PADDING,
        );
      }

      if (resizeState.direction.includes('left')) {
        const nextLeft = clampValue(
          resizeState.startRect.left + deltaX,
          EDGE_PADDING,
          startRight - minWidth,
        );
        nextRect.left = nextLeft;
        nextRect.width = clampValue(startRight - nextLeft, minWidth, maxWidth);
      }

      if (resizeState.direction.includes('bottom')) {
        nextRect.height = clampValue(
          resizeState.startRect.height + deltaY,
          minHeight,
          window.innerHeight - resizeState.startRect.top - EDGE_PADDING,
        );
      }

      if (resizeState.direction.includes('top')) {
        const nextTop = clampValue(
          resizeState.startRect.top + deltaY,
          EDGE_PADDING,
          startBottom - minHeight,
        );
        nextRect.top = nextTop;
        nextRect.height = clampValue(startBottom - nextTop, minHeight, maxHeight);
      }

      setPanelRect(clampPanelRect(nextRect, window.innerWidth, window.innerHeight));
    };

    const handlePointerUp = (event: PointerEvent) => {
      const resizeState = resizeStateRef.current;
      if (!resizeState || resizeState.pointerId !== event.pointerId) {
        return;
      }

      endResize();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [endResize, isResizing]);

  const handleResizeStart = useCallback(
    (
      direction: ResizeDirection,
      event: React.PointerEvent<HTMLSpanElement>,
    ) => {
      if (panelMode !== 'default' || event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      resizeStateRef.current = {
        direction,
        pointerId: event.pointerId,
        startRect: panelRect,
        startX: event.clientX,
        startY: event.clientY,
      };
      setIsResizing(true);
      setInteractionCursor(getResizeCursor(direction));
    },
    [panelMode, panelRect],
  );

  const toggleAssistant = useCallback(() => {
    if (suppressClickRef.current) {
      return;
    }

    if (!isOpen && panelMode === 'minimized') {
      const restoreMode = panelModeBeforeMinimizeRef.current;
      setPanelMode(restoreMode);
      if (restoreMode === 'maximized') {
        setPanelRect(getMaximizedPanelRect(viewportSize.width, viewportSize.height));
      } else {
        setPanelRect((currentPanelRect) =>
          clampPanelRect(
            panelRestoreRectRef.current ?? currentPanelRect,
            viewportSize.width,
            viewportSize.height,
          ),
        );
      }
    }

    setIsOpen(!isOpen);
  }, [isOpen, panelMode, setIsOpen, viewportSize.height, viewportSize.width]);

  const panelStyle = useMemo<React.CSSProperties>(
    () => ({
      left: panelRect.left,
      top: panelRect.top,
      width: panelRect.width,
      height: panelRect.height,
    }),
    [panelRect.height, panelRect.left, panelRect.top, panelRect.width],
  );

  return (
    <div
      className={`ai-assistant-wrapper${isDragging ? ' dragging' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div
        className={`ai-assistant-tooltip${isTooltipVisible ? ' visible' : ''}`}
        aria-hidden="true"
      >
        <span className="ai-assistant-tooltip-title">DevHub AI</span>
        <span className="ai-assistant-tooltip-subtitle">
          Drag to move, tap to open
        </span>
      </div>

      <button
        ref={buttonRef}
        className="ai-assistant-floating-btn"
        onClick={toggleAssistant}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event.pointerId)}
        onPointerCancel={(event) => endDrag(event.pointerId)}
        aria-label={isOpen ? 'Close DevHub AI' : 'Open DevHub AI'}
        aria-expanded={isOpen}
        title="Drag to move, tap to open DevHub AI"
      >
        <span className="ai-assistant-halo" aria-hidden="true" />
        <span className="ai-assistant-badge">AI</span>
        <span className="robot-shell" aria-hidden="true">
          <span className="robot-antenna" />
          <span className="robot-face">
            <span className="robot-eyes">
              <span className="eye left" />
              <span className="eye right" />
            </span>
            <span className="robot-mouth" />
          </span>
        </span>
      </button>

      {isOpen && (
        <AIAssistantPanel
          onClose={() => setIsOpen(false)}
          onResizeStart={handleResizeStart}
          onToggleMaximized={handleToggleMaximized}
          onToggleMinimized={handleToggleMinimized}
          isMaximized={panelMode === 'maximized'}
          isMinimized={panelMode === 'minimized'}
          isResizable={panelMode === 'default'}
          isResizing={isResizing}
          style={panelStyle}
        />
      )}
    </div>
  );
};

export default AIAssistant;
