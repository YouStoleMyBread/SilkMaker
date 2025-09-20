import { useState, useRef, useCallback } from 'react';
import { StoryNode, type StoryNodeData } from './StoryNode';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface StoryCanvasProps {
  nodes: StoryNodeData[];
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
  onNodeEdit?: (nodeId: string) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeConnect?: (nodeId: string) => void;
  onCanvasClick?: (position: { x: number; y: number }) => void;
}

export function StoryCanvas({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodeEdit,
  onNodeDelete,
  onNodeConnect,
  onCanvasClick
}: StoryCanvasProps) {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
      
      // If clicking on empty canvas, trigger add node
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && onCanvasClick) {
        const x = (e.clientX - rect.left - pan.x) / (zoom / 100);
        const y = (e.clientY - rect.top - pan.y) / (zoom / 100);
        onCanvasClick({ x, y });
      }
    }
  }, [pan, zoom, onCanvasClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleZoomFit = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
        style={{
          backgroundImage: `
            radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        data-testid="story-canvas"
      >
        {/* Canvas content */}
        <div
          className="relative"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map(node => 
              node.connections.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (!targetNode) return null;
                
                const startX = node.position.x + 128; // half node width
                const startY = node.position.y + 64; // half node height
                const endX = targetNode.position.x + 128;
                const endY = targetNode.position.y + 64;
                
                // Create curved path
                const midX = (startX + endX) / 2;
                const controlX1 = midX;
                const controlX2 = midX;
                const controlY1 = startY;
                const controlY2 = endY;
                
                return (
                  <path
                    key={`${node.id}-${targetId}`}
                    d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  />
                );
              })
            )}
          </svg>

          {/* Story nodes */}
          {nodes.map(node => (
            <StoryNode
              key={node.id}
              data={node}
              isSelected={selectedNodeId === node.id}
              onSelect={onNodeSelect}
              onEdit={onNodeEdit}
              onDelete={onNodeDelete}
              onConnect={onNodeConnect}
            />
          ))}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          data-testid="button-zoom-in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          disabled={zoom <= 25}
          data-testid="button-zoom-out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomFit}
          data-testid="button-zoom-fit"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <div className="bg-secondary px-2 py-1 rounded text-xs font-mono text-center">
          {zoom}%
        </div>
      </div>

      {/* Canvas instructions */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Your story canvas is empty</h3>
            <p className="text-sm">Click anywhere to add your first story node</p>
          </div>
        </div>
      )}
    </div>
  );
}