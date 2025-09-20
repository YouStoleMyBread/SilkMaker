import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Link2, 
  MoreVertical, 
  Type, 
  Image, 
  Variable,
  Palette,
  Music,
  Video,
  Code,
  GitBranch,
  Database
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface EnhancedStoryNodeData {
  id: string;
  title: string;
  content: string;
  type: 'start' | 'story' | 'choice' | 'end' | 'css' | 'variable' | 'condition' | 'audio' | 'video';
  position: { x: number; y: number };
  connections: string[];
  variables?: Record<string, any>;
  hasImage?: boolean;
  color?: string;
  cssStyles?: {
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  };
  audioFile?: string;
  videoFile?: string;
  wordCount?: number;
}

interface EnhancedStoryNodeProps {
  data: EnhancedStoryNodeData;
  isSelected?: boolean;
  isHovered?: boolean;
  showConnections?: boolean;
  connectedNodes?: EnhancedStoryNodeData[];
  onSelect?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onConnect?: (nodeId: string) => void;
  onHover?: (nodeId: string, isHovering: boolean) => void;
}

const nodeTypeConfig = {
  start: { icon: '▶', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' },
  story: { icon: '📖', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
  choice: { icon: '🔀', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' },
  end: { icon: '🏁', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50' },
  css: { icon: <Code className="h-3 w-3" />, bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50' },
  variable: { icon: <Database className="h-3 w-3" />, bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50' },
  condition: { icon: <GitBranch className="h-3 w-3" />, bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/50' },
  audio: { icon: <Music className="h-3 w-3" />, bgColor: 'bg-indigo-500/20', borderColor: 'border-indigo-500/50' },
  video: { icon: <Video className="h-3 w-3" />, bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/50' },
};

export function EnhancedStoryNode({ 
  data, 
  isSelected = false,
  isHovered = false,
  showConnections = false,
  connectedNodes = [],
  onSelect, 
  onEdit, 
  onDelete, 
  onConnect,
  onHover
}: EnhancedStoryNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const config = nodeTypeConfig[data.type];

  const handleMouseDown = () => {
    setIsDragging(true);
    onSelect?.(data.id);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    onHover?.(data.id, true);
  };

  const handleMouseLeave = () => {
    onHover?.(data.id, false);
  };

  const customStyle = data.color ? {
    backgroundColor: `${data.color}20`,
    borderColor: `${data.color}80`,
  } : {};

  const contentStyle = data.cssStyles ? {
    fontFamily: data.cssStyles.fontFamily,
    fontSize: data.cssStyles.fontSize,
    color: data.cssStyles.textColor,
    backgroundColor: data.cssStyles.backgroundColor,
    backgroundImage: data.cssStyles.backgroundImage ? `url(${data.cssStyles.backgroundImage})` : undefined,
  } : {};

  return (
    <div className="relative">
      <Card 
        className={`
          w-64 min-h-32 cursor-move select-none transition-all duration-200
          ${isSelected ? 'ring-2 ring-primary' : ''}
          ${isDragging ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}
          ${data.color ? 'border-2' : config.borderColor}
          ${!data.color ? config.bgColor : ''}
        `}
        style={{
          position: 'absolute',
          left: data.position.x,
          top: data.position.y,
          ...customStyle,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid={`enhanced-story-node-${data.id}`}
      >
        {/* Connection indicators */}
        {showConnections && data.connections.length > 0 && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge variant="secondary" className="text-xs">
              {data.connections.length}
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="p-3 pb-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {typeof config.icon === 'string' ? config.icon : config.icon}
              </span>
              <Badge variant="secondary" className="text-xs capitalize">
                {data.type}
              </Badge>
              {data.color && (
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: data.color }}
                />
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(data.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onConnect?.(data.id)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(data.id)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h3 className="font-medium text-sm mt-1 truncate" title={data.title}>
            {data.title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-3" style={contentStyle}>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {data.content}
          </p>
          
          {/* Content indicators */}
          <div className="flex items-center gap-1 mt-2">
            <Type className="h-3 w-3 text-muted-foreground" />
            {data.hasImage && <Image className="h-3 w-3 text-muted-foreground" />}
            {data.variables && Object.keys(data.variables).length > 0 && (
              <Variable className="h-3 w-3 text-muted-foreground" />
            )}
            {data.audioFile && <Music className="h-3 w-3 text-muted-foreground" />}
            {data.videoFile && <Video className="h-3 w-3 text-muted-foreground" />}
            {data.cssStyles && <Palette className="h-3 w-3 text-muted-foreground" />}
            
            <div className="ml-auto flex gap-1">
              {data.wordCount && (
                <Badge variant="outline" className="text-xs">
                  {data.wordCount}w
                </Badge>
              )}
              {data.connections.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {data.connections.length} links
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Connection lines (shown on hover) */}
      {showConnections && connectedNodes.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connectedNodes.map(targetNode => {
            const startX = data.position.x + 128; // half node width
            const startY = data.position.y + 64; // half node height
            const endX = targetNode.position.x + 128;
            const endY = targetNode.position.y + 64;
            
            return (
              <line
                key={`${data.id}-${targetNode.id}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="opacity-80"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}