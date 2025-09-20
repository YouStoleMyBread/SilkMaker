import { useState } from 'react';
import { NodeColorPicker } from '../NodeColorPicker';

export default function NodeColorPickerExample() {
  const [nodeColor, setNodeColor] = useState('#3b82f6');

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Node Color Picker</h2>
        <p className="text-muted-foreground">
          Choose colors for your story nodes to organize and categorize them visually.
        </p>
        
        <div className="flex items-center gap-4">
          <NodeColorPicker
            color={nodeColor}
            onColorChange={(color) => {
              setNodeColor(color);
              console.log('Node color changed to:', color);
            }}
          />
          <div className="text-sm">
            Selected color: <code className="font-mono">{nodeColor}</code>
          </div>
        </div>

        <div 
          className="w-full h-32 rounded border-2"
          style={{ 
            backgroundColor: `${nodeColor}20`,
            borderColor: `${nodeColor}80`
          }}
        >
          <div className="p-4">
            <h3 className="font-medium">Sample Node</h3>
            <p className="text-sm text-muted-foreground">
              This is how your node would look with the selected color.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}