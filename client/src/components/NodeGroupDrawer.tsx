import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Layers, 
  Plus, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Trash2,
  FolderOpen,
  Edit,
  Copy
} from 'lucide-react';
import type { EnhancedStoryNodeData } from './EnhancedStoryNode';

interface NodeGroup {
  id: string;
  name: string;
  color: string;
  nodeIds: string[];
  isVisible: boolean;
  thumbnail?: string; // Generated canvas snapshot
}

interface NodeGroupDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groups: NodeGroup[];
  nodes: EnhancedStoryNodeData[];
  selectedNodes: string[];
  onCreateGroup: (name: string, color: string, nodeIds: string[]) => void;
  onUpdateGroup: (groupId: string, updates: Partial<NodeGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
  onToggleGroupVisibility: (groupId: string) => void;
  onSelectGroup: (groupId: string) => void;
}

const groupColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export function NodeGroupDrawer({
  isOpen,
  onOpenChange,
  groups,
  nodes,
  selectedNodes,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onToggleGroupVisibility,
  onSelectGroup,
}: NodeGroupDrawerProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState(groupColors[0]);

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedNodes.length > 0) {
      onCreateGroup(newGroupName.trim(), newGroupColor, selectedNodes);
      setNewGroupName('');
      setNewGroupColor(groupColors[0]);
    }
  };

  const generateThumbnail = (group: NodeGroup) => {
    // In a real implementation, this would generate a canvas snapshot
    const groupNodes = nodes.filter(node => group.nodeIds.includes(node.id));
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="40" fill="${group.color}20" stroke="${group.color}" stroke-width="1" rx="4"/>
        <text x="30" y="25" text-anchor="middle" font-size="10" fill="${group.color}">${groupNodes.length}</text>
      </svg>
    `)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-open-groups">
          <Layers className="h-4 w-4 mr-2" />
          Groups
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Node Groups</SheetTitle>
          <SheetDescription>
            Organize your story nodes into groups for better management
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Create new group */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Create New Group</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  data-testid="input-group-name"
                />
              </div>
              
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-1">
                  {groupColors.map((color) => (
                    <button
                      key={color}
                      className={`
                        w-6 h-6 rounded border-2 transition-all
                        ${newGroupColor === color ? 'border-foreground scale-110' : 'border-border'}
                      `}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewGroupColor(color)}
                      data-testid={`group-color-${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Selected nodes: {selectedNodes.length}
              </div>

              <Button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || selectedNodes.length === 0}
                className="w-full"
                data-testid="button-create-group"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>
          </Card>

          {/* Existing groups */}
          <div>
            <h4 className="font-medium mb-3">Existing Groups</h4>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {groups.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No groups created yet
                  </p>
                ) : (
                  groups.map((group) => {
                    const groupNodes = nodes.filter(node => group.nodeIds.includes(node.id));
                    const thumbnail = generateThumbnail(group);
                    
                    return (
                      <Card
                        key={group.id}
                        className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                          !group.isVisible ? 'opacity-50' : ''
                        }`}
                        onClick={() => onSelectGroup(group.id)}
                        data-testid={`group-${group.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="w-12 h-8 bg-muted rounded border overflow-hidden">
                            <img
                              src={thumbnail}
                              alt={`${group.name} thumbnail`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Group info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: group.color }}
                              />
                              <h5 className="font-medium text-sm truncate">
                                {group.name}
                              </h5>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {groupNodes.length} nodes
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleGroupVisibility(group.id);
                              }}
                              data-testid={`button-toggle-visibility-${group.id}`}
                            >
                              {group.isVisible ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteGroup(group.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Node previews */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {groupNodes.slice(0, 3).map((node) => (
                            <Badge
                              key={node.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {node.title}
                            </Badge>
                          ))}
                          {groupNodes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{groupNodes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}