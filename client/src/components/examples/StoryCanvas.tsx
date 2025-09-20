import { StoryCanvas } from '../StoryCanvas';

export default function StoryCanvasExample() {
  //todo: remove mock functionality
  const mockNodes = [
    {
      id: '1',
      title: 'The Beginning',
      content: 'Your adventure starts here in the enchanted forest.',
      type: 'start' as const,
      position: { x: 100, y: 100 },
      connections: ['2'],
    },
    {
      id: '2', 
      title: 'The Crossroads',
      content: 'You come to a fork in the path. Which way do you go?',
      type: 'choice' as const,
      position: { x: 400, y: 100 },
      connections: ['3', '4'],
    },
    {
      id: '3',
      title: 'The Dark Forest',
      content: 'You venture into the darker part of the forest.',
      type: 'story' as const,
      position: { x: 300, y: 300 },
      connections: ['5'],
    },
    {
      id: '4',
      title: 'The Sunny Meadow',
      content: 'You find yourself in a beautiful, peaceful meadow.',
      type: 'story' as const,
      position: { x: 500, y: 300 },
      connections: ['5'],
    },
    {
      id: '5',
      title: 'The End',
      content: 'Your journey comes to an end, but what an adventure it was!',
      type: 'end' as const,
      position: { x: 400, y: 500 },
      connections: [],
    },
  ];

  return (
    <div className="w-full h-screen">
      <StoryCanvas
        nodes={mockNodes}
        selectedNodeId="2"
        onNodeSelect={(id) => console.log('Selected node:', id)}
        onNodeEdit={(id) => console.log('Edit node:', id)}
        onNodeDelete={(id) => console.log('Delete node:', id)}
        onNodeConnect={(id) => console.log('Connect node:', id)}
        onCanvasClick={(pos) => console.log('Canvas clicked at:', pos)}
      />
    </div>
  );
}