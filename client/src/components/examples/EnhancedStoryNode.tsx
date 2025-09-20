import { useState } from 'react';
import { EnhancedStoryNode } from '../EnhancedStoryNode';

export default function EnhancedStoryNodeExample() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  //todo: remove mock functionality
  const mockNodes = [
    {
      id: '1',
      title: 'The Mysterious Door',
      content: 'You find yourself standing before an ancient wooden door, its surface carved with intricate symbols that seem to glow faintly in the moonlight.',
      type: 'story' as const,
      position: { x: 50, y: 50 },
      connections: ['2', '3'],
      variables: { hasKey: false, courage: 5 },
      hasImage: true,
      color: '#3b82f6',
      wordCount: 28,
    },
    {
      id: '2',
      title: 'CSS Styling Node',
      content: 'This node demonstrates custom CSS styling capabilities.',
      type: 'css' as const,
      position: { x: 350, y: 50 },
      connections: [],
      cssStyles: {
        fontFamily: 'serif',
        fontSize: '14px',
        textColor: '#ec4899',
        backgroundColor: '#fdf2f8',
      },
      color: '#ec4899',
      wordCount: 9,
    },
    {
      id: '3',
      title: 'Variable Storage',
      content: 'playerName = "Hero"\\ncourage = 10\\nhasKey = true',
      type: 'variable' as const,
      position: { x: 50, y: 300 },
      connections: [],
      variables: { playerName: 'Hero', courage: 10, hasKey: true },
      color: '#f59e0b',
      wordCount: 6,
    },
    {
      id: '4',
      title: 'Background Music',
      content: 'Plays ambient forest sounds during this scene.',
      type: 'audio' as const,
      position: { x: 350, y: 300 },
      connections: [],
      audioFile: 'forest-ambient.mp3',
      color: '#8b5cf6',
      wordCount: 8,
    },
  ];

  const getConnectedNodes = (nodeId: string) => {
    const node = mockNodes.find(n => n.id === nodeId);
    if (!node) return [];
    return mockNodes.filter(n => node.connections.some(connId => connId === n.id));
  };

  return (
    <div className="p-8 bg-background min-h-screen relative">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Enhanced Story Nodes</h2>
        <p className="text-muted-foreground">
          Hover over nodes to see their connections. Each node type has unique capabilities.
        </p>
      </div>

      <div className="relative" style={{ height: '600px', width: '100%' }}>
        {mockNodes.map(node => (
          <EnhancedStoryNode
            key={node.id}
            data={node}
            isSelected={false}
            isHovered={hoveredNode === node.id}
            showConnections={hoveredNode === node.id}
            connectedNodes={getConnectedNodes(node.id)}
            onSelect={(id) => console.log('Selected node:', id)}
            onEdit={(id) => console.log('Edit node:', id)}
            onDelete={(id) => console.log('Delete node:', id)}
            onConnect={(id) => console.log('Connect node:', id)}
            onHover={(id, isHovering) => setHoveredNode(isHovering ? id : null)}
          />
        ))}
      </div>
    </div>
  );
}