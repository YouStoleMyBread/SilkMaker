import { useState } from 'react';
import { NodeGroupDrawer } from '../NodeGroupDrawer';
import { Button } from '@/components/ui/button';

export default function NodeGroupDrawerExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState(['1', '2']);

  //todo: remove mock functionality
  const mockGroups = [
    {
      id: 'group-1',
      name: 'Introduction',
      color: '#3b82f6',
      nodeIds: ['1', '2'],
      isVisible: true,
    },
    {
      id: 'group-2', 
      name: 'Forest Scenes',
      color: '#10b981',
      nodeIds: ['3', '4', '5'],
      isVisible: true,
    },
  ];

  const mockNodes = [
    { id: '1', title: 'Opening Scene', type: 'start' as const, content: 'Start', position: { x: 0, y: 0 }, connections: [] },
    { id: '2', title: 'Character Introduction', type: 'story' as const, content: 'Story', position: { x: 0, y: 0 }, connections: [] },
    { id: '3', title: 'Enter the Forest', type: 'story' as const, content: 'Story', position: { x: 0, y: 0 }, connections: [] },
    { id: '4', title: 'Forest Choice', type: 'choice' as const, content: 'Choice', position: { x: 0, y: 0 }, connections: [] },
    { id: '5', title: 'Forest Ending', type: 'end' as const, content: 'End', position: { x: 0, y: 0 }, connections: [] },
  ];

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Node Groups</h2>
        <p className="text-muted-foreground">
          Organize your story nodes into groups for better project management.
        </p>
        
        <div className="space-y-2">
          <p className="text-sm">Selected nodes: {selectedNodes.length}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setSelectedNodes(['1', '2'])}
              variant={selectedNodes.length === 2 ? 'default' : 'outline'}
            >
              Select 2 nodes
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedNodes(['3', '4', '5'])}
              variant={selectedNodes.length === 3 ? 'default' : 'outline'}
            >
              Select 3 nodes
            </Button>
          </div>
        </div>
        
        <NodeGroupDrawer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          groups={mockGroups}
          nodes={mockNodes}
          selectedNodes={selectedNodes}
          onCreateGroup={(name, color, nodeIds) => {
            console.log('Create group:', { name, color, nodeIds });
          }}
          onUpdateGroup={(groupId, updates) => {
            console.log('Update group:', groupId, updates);
          }}
          onDeleteGroup={(groupId) => {
            console.log('Delete group:', groupId);
          }}
          onToggleGroupVisibility={(groupId) => {
            console.log('Toggle visibility:', groupId);
          }}
          onSelectGroup={(groupId) => {
            console.log('Select group:', groupId);
          }}
        />
      </div>
    </div>
  );
}