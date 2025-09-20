import { TopToolbar } from '../TopToolbar';

export default function TopToolbarExample() {
  return (
    <div className="min-h-screen bg-background">
      <TopToolbar
        projectName="The Enchanted Forest"
        isModified={true}
        canUndo={true}
        canRedo={false}
        isDarkMode={true}
        onSave={() => console.log('Save')}
        onNew={() => console.log('New')}
        onOpen={() => console.log('Open')}
        onExport={() => console.log('Export')}
        onPreview={() => console.log('Preview')}
        onShare={() => console.log('Share')}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        onToggleTheme={() => console.log('Toggle theme')}
        onSettings={() => console.log('Settings')}
        onHelp={() => console.log('Help')}
      />
      <div className="p-8">
        <p className="text-muted-foreground">Story editor workspace area</p>
      </div>
    </div>
  );
}