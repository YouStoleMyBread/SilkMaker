import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Edit,
  Link2,
  Variable,
  Image,
  Trash2,
  Plus,
  X,
} from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode?: {
    id: string;
    title: string;
    content: string;
    type: 'start' | 'story' | 'choice' | 'end';
    connections: string[];
    variables?: Record<string, any>;
    hasImage?: boolean;
  };
  availableNodes?: Array<{ id: string; title: string }>;
  onUpdateNode?: (nodeId: string, updates: any) => void;
  onDeleteNode?: (nodeId: string) => void;
}

export function PropertiesPanel({
  selectedNode,
  availableNodes = [],
  onUpdateNode,
  onDeleteNode,
}: PropertiesPanelProps) {
  const [localTitle, setLocalTitle] = useState(selectedNode?.title || '');
  const [localContent, setLocalContent] = useState(selectedNode?.content || '');
  const [newVariable, setNewVariable] = useState({ key: '', value: '' });

  // Update local state when selected node changes
  if (selectedNode && (localTitle !== selectedNode.title || localContent !== selectedNode.content)) {
    setLocalTitle(selectedNode.title);
    setLocalContent(selectedNode.content);
  }

  if (!selectedNode) {
    return (
      <div className="w-80 bg-card border-l border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground p-4">
          <Edit className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateNode?.(selectedNode.id, {
      title: localTitle,
      content: localContent,
    });
  };

  const handleAddConnection = (targetNodeId: string) => {
    if (!selectedNode.connections.includes(targetNodeId)) {
      onUpdateNode?.(selectedNode.id, {
        connections: [...selectedNode.connections, targetNodeId],
      });
    }
  };

  const handleRemoveConnection = (targetNodeId: string) => {
    onUpdateNode?.(selectedNode.id, {
      connections: selectedNode.connections.filter(id => id !== targetNodeId),
    });
  };

  const handleAddVariable = () => {
    if (newVariable.key && newVariable.value) {
      onUpdateNode?.(selectedNode.id, {
        variables: {
          ...selectedNode.variables,
          [newVariable.key]: newVariable.value,
        },
      });
      setNewVariable({ key: '', value: '' });
    }
  };

  const handleRemoveVariable = (key: string) => {
    const updatedVariables = { ...selectedNode.variables };
    delete updatedVariables[key];
    onUpdateNode?.(selectedNode.id, {
      variables: updatedVariables,
    });
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Node Properties</h3>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDeleteNode?.(selectedNode.id)}
            data-testid="button-delete-node"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="secondary" className="capitalize">
          {selectedNode.type} Node
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="connections">Links</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="node-title">Title</Label>
                <Input
                  id="node-title"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  placeholder="Enter node title..."
                  data-testid="input-node-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="node-content">Content</Label>
                <Textarea
                  id="node-content"
                  value={localContent}
                  onChange={(e) => setLocalContent(e.target.value)}
                  placeholder="Write your story content here..."
                  className="min-h-32"
                  data-testid="textarea-node-content"
                />
              </div>

              <div className="space-y-2">
                <Label>Node Type</Label>
                <Select
                  value={selectedNode.type}
                  onValueChange={(value) => onUpdateNode?.(selectedNode.id, { type: value })}
                >
                  <SelectTrigger data-testid="select-node-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start Node</SelectItem>
                    <SelectItem value="story">Story Node</SelectItem>
                    <SelectItem value="choice">Choice Node</SelectItem>
                    <SelectItem value="end">End Node</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} className="w-full" data-testid="button-save-node">
                Save Changes
              </Button>
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="space-y-2">
                <Label>Current Connections</Label>
                {selectedNode.connections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No connections</p>
                ) : (
                  <div className="space-y-2">
                    {selectedNode.connections.map((connectionId) => {
                      const targetNode = availableNodes.find(n => n.id === connectionId);
                      return (
                        <div
                          key={connectionId}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="text-sm">
                            {targetNode?.title || `Node ${connectionId}`}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveConnection(connectionId)}
                            data-testid={`button-remove-connection-${connectionId}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Add Connection</Label>
                <Select onValueChange={handleAddConnection}>
                  <SelectTrigger data-testid="select-add-connection">
                    <SelectValue placeholder="Select a node to connect to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNodes
                      .filter(node => 
                        node.id !== selectedNode.id && 
                        !selectedNode.connections.includes(node.id)
                      )
                      .map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4">
              <div className="space-y-2">
                <Label>Story Variables</Label>
                {selectedNode.variables && Object.keys(selectedNode.variables).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(selectedNode.variables).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="text-sm">
                          <span className="font-mono">{key}</span>
                          <span className="text-muted-foreground"> = </span>
                          <span>{String(value)}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveVariable(key)}
                          data-testid={`button-remove-variable-${key}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No variables defined</p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Add Variable</Label>
                <Input
                  placeholder="Variable name"
                  value={newVariable.key}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                  data-testid="input-variable-key"
                />
                <Input
                  placeholder="Variable value"
                  value={newVariable.value}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
                  data-testid="input-variable-value"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddVariable}
                  disabled={!newVariable.key || !newVariable.value}
                  data-testid="button-add-variable"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Variable
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}