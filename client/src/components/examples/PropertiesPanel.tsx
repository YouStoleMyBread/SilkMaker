import { PropertiesPanel } from '../PropertiesPanel';

export default function PropertiesPanelExample() {
  //todo: remove mock functionality
  const selectedNode = {
    id: '2',
    title: 'The Crossroads',
    content: 'You come to a fork in the path. The left path leads deeper into the forest where shadows dance between ancient trees. The right path climbs toward a sunny hilltop where wildflowers sway in the breeze.',
    type: 'choice' as const,
    connections: ['3', '4'],
    variables: { hasKey: false, courage: 5, timeOfDay: 'afternoon' },
    hasImage: true,
  };

  const availableNodes = [
    { id: '1', title: 'The Beginning' },
    { id: '3', title: 'The Dark Forest' },
    { id: '4', title: 'The Sunny Meadow' },
    { id: '5', title: 'The End' },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Main content area</p>
      </div>
      <PropertiesPanel
        selectedNode={selectedNode}
        availableNodes={availableNodes}
        onUpdateNode={(id, updates) => console.log('Update node:', id, updates)}
        onDeleteNode={(id) => console.log('Delete node:', id)}
      />
    </div>
  );
}