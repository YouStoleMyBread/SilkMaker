import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Link2, MoreVertical, Type, Image, Variable } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface StoryNodeData {
  id: string;
  title: string;
  content: string;
  type: 'start' | 'story' | 'choice' | 'end';
  position: { x: number; y: number };
  connections: string[];
  variables?: Record<string, any>;
  hasImage?: boolean;
}

interface StoryNodeProps {
  data: StoryNodeData;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onConnect?: (nodeId: string) => void;
}

const nodeTypeColors = {
  start: 'bg-green-500/20 border-green-500/50',
  story: 'bg-blue-500/20 border-blue-500/50',
  choice: 'bg-yellow-500/20 border-yellow-500/50',
  end: 'bg-red-500/20 border-red-500/50',
};

const nodeTypeIcons = {
  start: '▶',
  story: '📖',
  choice: '🔀',
  end: '🏁',
};

export function StoryNode({ 
  data, 
  isSelected = false, 
  onSelect, 
  onEdit, 
  onDelete, 
  onConnect 
}: StoryNodeProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
    onSelect?.(data.id);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card 
      className={`
        w-64 min-h-32 cursor-move select-none transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary' : ''}
        ${isDragging ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}
        ${nodeTypeColors[data.type]}
      `}
      style={{
        position: 'absolute',
        left: data.position.x,
        top: data.position.y,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      data-testid={`story-node-${data.id}`}
    >
      {/* Header */}
      <div className="p-3 pb-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{nodeTypeIcons[data.type]}</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {data.type}
            </Badge>
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
      <div className="p-3">
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
          {data.connections.length > 0 && (
            <Badge variant="outline" className="text-xs ml-auto">
              {data.connections.length} connections
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}