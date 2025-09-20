import { useState } from 'react';
import { NodeEditModal } from '../NodeEditModal';
import { Button } from '@/components/ui/button';

export default function NodeEditModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  //todo: remove mock functionality
  const mockNodeData = {
    id: '2',
    title: 'The Crossroads',
    content: 'You come to a fork in the path. The left path leads deeper into the forest where shadows dance between ancient trees.',
    type: 'choice' as const,
    variables: { hasKey: false, courage: 5 },
    hasImage: true,
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Node Edit Modal Example</h2>
        <p className="text-muted-foreground">Click the button below to open the node editing modal.</p>
        
        <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
          Edit Node
        </Button>
        
        <NodeEditModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          nodeData={mockNodeData}
          onSave={(data) => {
            console.log('Saved node data:', data);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
}