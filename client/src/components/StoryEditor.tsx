import { useState } from 'react';
import { TopToolbar } from './TopToolbar';
import { ProjectSidebar } from './ProjectSidebar';
import { StoryCanvas } from './StoryCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { NodeEditModal } from './NodeEditModal';
import { ThemeProvider, useTheme } from './ThemeProvider';
import type { StoryNodeData } from './StoryNode';

function StoryEditorContent() {
  const { theme, toggleTheme } = useTheme();
  
  // Application state
  const [currentProject, setCurrentProject] = useState({
    id: '1',
    name: 'The Enchanted Forest',
    description: 'A magical adventure story with multiple paths',
    nodeCount: 5,
    lastModified: '2 hours ago',
  });
  
  //todo: remove mock functionality - Mock story nodes for demo
  const [nodes, setNodes] = useState<StoryNodeData[]>([
    {
      id: '1',
      title: 'The Beginning',
      content: 'Your adventure starts here in the enchanted forest. The morning mist swirls around ancient oak trees, and you can hear the distant sound of a babbling brook.',
      type: 'start',
      position: { x: 100, y: 100 },
      connections: ['2'],
    },
    {
      id: '2', 
      title: 'The Crossroads',
      content: 'You come to a fork in the path. The left path leads deeper into the forest where shadows dance between ancient trees. The right path climbs toward a sunny hilltop.',
      type: 'choice',
      position: { x: 400, y: 100 },
      connections: ['3', '4'],
      variables: { decision: 'pending' },
    },
    {
      id: '3',
      title: 'The Dark Forest',
      content: 'You venture into the darker part of the forest. The canopy above blocks most of the sunlight, and strange sounds echo from the depths.',
      type: 'story',
      position: { x: 300, y: 300 },
      connections: ['5'],
      hasImage: true,
    },
    {
      id: '4',
      title: 'The Sunny Meadow',
      content: 'You find yourself in a beautiful, peaceful meadow filled with wildflowers. Butterflies dance in the warm sunlight.',
      type: 'story',
      position: { x: 500, y: 300 },
      connections: ['5'],
    },
    {
      id: '5',
      title: 'The End',
      content: 'Your journey comes to an end, but what an adventure it was! You have many stories to tell.',
      type: 'end',
      position: { x: 400, y: 500 },
      connections: [],
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('2');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<StoryNodeData | undefined>();
  const [isModified, setIsModified] = useState(false);

  // Event handlers
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeEdit = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    setEditingNode(node);
    setIsEditModalOpen(true);
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId('');
    }
    setIsModified(true);
  };

  const handleNodeConnect = (nodeId: string) => {
    console.log('Connect node:', nodeId);
    // In a real app, this would open a connection interface
  };

  const handleCanvasClick = (position: { x: number; y: number }) => {
    console.log('Canvas clicked at:', position);
    // In a real app, this could add a new node at the clicked position
  };

  const handleUpdateNode = (nodeId: string, updates: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
    setIsModified(true);
  };

  const handleSaveNode = (data: any) => {
    if (editingNode) {
      handleUpdateNode(editingNode.id, data);
    } else {
      // Create new node
      const newNode: StoryNodeData = {
        id: `node-${Date.now()}`,
        title: data.title,
        content: data.content,
        type: data.type,
        position: { x: 200, y: 200 },
        connections: [],
        variables: data.variables,
        hasImage: data.hasImage,
      };
      setNodes(prev => [...prev, newNode]);
    }
    setIsModified(true);
  };

  const handleAddNode = (type: 'start' | 'story' | 'choice' | 'end') => {
    setEditingNode(undefined);
    setIsEditModalOpen(true);
    // The modal will handle creating the new node with the specified type
  };

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : undefined;
  const availableNodes = nodes.map(n => ({ id: n.id, title: n.title }));

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <TopToolbar
        projectName={currentProject.name}
        isModified={isModified}
        canUndo={false} // TODO: Implement undo/redo
        canRedo={false}
        isDarkMode={theme === 'dark'}
        onSave={() => {
          setIsModified(false);
          console.log('Project saved');
        }}
        onNew={() => console.log('New project')}
        onOpen={() => console.log('Open project')}
        onExport={() => console.log('Export to HTML')}
        onPreview={() => console.log('Preview story')}
        onShare={() => console.log('Share project')}
        onUndo={() => console.log('Undo')}
        onRedo={() => console.log('Redo')}
        onToggleTheme={toggleTheme}
        onSettings={() => console.log('Settings')}
        onHelp={() => console.log('Help')}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <ProjectSidebar
          currentProject={currentProject}
          onNewProject={() => console.log('New project')}
          onOpenProject={() => console.log('Open project')}
          onExportProject={() => console.log('Export project')}
          onPreviewStory={() => console.log('Preview story')}
          onAddNode={handleAddNode}
        />

        {/* Canvas Area */}
        <StoryCanvas
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
          onNodeEdit={handleNodeEdit}
          onNodeDelete={handleNodeDelete}
          onNodeConnect={handleNodeConnect}
          onCanvasClick={handleCanvasClick}
        />

        {/* Right Properties Panel */}
        <PropertiesPanel
          selectedNode={selectedNode}
          availableNodes={availableNodes}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleNodeDelete}
        />
      </div>

      {/* Node Edit Modal */}
      <NodeEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNode(undefined);
        }}
        nodeData={editingNode}
        onSave={handleSaveNode}
      />
    </div>
  );
}

export function StoryEditor() {
  return (
    <ThemeProvider defaultTheme="dark">
      <StoryEditorContent />
    </ThemeProvider>
  );
}