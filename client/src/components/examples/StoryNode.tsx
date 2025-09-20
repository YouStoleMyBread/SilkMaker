import { StoryNode } from '../StoryNode';

export default function StoryNodeExample() {
  //todo: remove mock functionality
  const mockNode = {
    id: '1',
    title: 'The Mysterious Door',
    content: 'You find yourself standing before an ancient wooden door, its surface carved with intricate symbols that seem to glow faintly in the moonlight.',
    type: 'story' as const,
    position: { x: 50, y: 50 },
    connections: ['2', '3'],
    variables: { hasKey: false, courage: 5 },
    hasImage: true,
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <StoryNode
        data={mockNode}
        isSelected={true}
        onSelect={(id) => console.log('Selected node:', id)}
        onEdit={(id) => console.log('Edit node:', id)}
        onDelete={(id) => console.log('Delete node:', id)}
        onConnect={(id) => console.log('Connect node:', id)}
      />
    </div>
  );
}