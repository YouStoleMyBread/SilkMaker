import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, Variable, Type } from 'lucide-react';

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData?: {
    id: string;
    title: string;
    content: string;
    type: 'start' | 'story' | 'choice' | 'end';
    variables?: Record<string, any>;
    hasImage?: boolean;
  };
  onSave: (data: any) => void;
}

export function NodeEditModal({ isOpen, onClose, nodeData, onSave }: NodeEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'story' as 'start' | 'story' | 'choice' | 'end',
    variables: {} as Record<string, any>,
    hasImage: false,
  });

  // Update form when nodeData changes
  useEffect(() => {
    if (nodeData) {
      setFormData({
        title: nodeData.title || '',
        content: nodeData.content || '',
        type: nodeData.type || 'story',
        variables: nodeData.variables || {},
        hasImage: nodeData.hasImage || false,
      });
    } else {
      // Reset for new node
      setFormData({
        title: '',
        content: '',
        type: 'story',
        variables: {},
        hasImage: false,
      });
    }
  }, [nodeData]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const addVariable = () => {
    const key = prompt('Variable name:');
    const value = prompt('Variable value:');
    if (key && value) {
      setFormData(prev => ({
        ...prev,
        variables: { ...prev.variables, [key]: value }
      }));
    }
  };

  const removeVariable = (key: string) => {
    setFormData(prev => ({
      ...prev,
      variables: Object.fromEntries(
        Object.entries(prev.variables).filter(([k]) => k !== key)
      )
    }));
  };

  const nodeTypeDescriptions = {
    start: 'The beginning of your story',
    story: 'Main narrative content',
    choice: 'A decision point for readers',
    end: 'A conclusion to your story',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-node-edit">
        <DialogHeader>
          <DialogTitle>
            {nodeData ? 'Edit Node' : 'Create New Node'}
          </DialogTitle>
          <DialogDescription>
            {nodeData ? 'Modify your story node content and settings.' : 'Add a new node to your story.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">
              <Type className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media">
              <ImageIcon className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="variables">
              <Variable className="h-4 w-4 mr-2" />
              Variables
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter node title..."
                  data-testid="input-edit-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Node Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger data-testid="select-edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">▶ Start Node</SelectItem>
                    <SelectItem value="story">📖 Story Node</SelectItem>
                    <SelectItem value="choice">🔀 Choice Node</SelectItem>
                    <SelectItem value="end">🏁 End Node</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {nodeTypeDescriptions[formData.type]}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your story content here..."
                className="min-h-40"
                data-testid="textarea-edit-content"
              />
              <p className="text-xs text-muted-foreground">
                Use Markdown formatting for rich text. Links to other nodes will be created automatically.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Add Images</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop images here, or click to browse
                </p>
                <Button variant="outline" size="sm" data-testid="button-upload-image">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              
              {formData.hasImage && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm">Image attached</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setFormData(prev => ({ ...prev, hasImage: false }))}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Story Variables</Label>
                <Button 
                  size="sm" 
                  onClick={addVariable}
                  data-testid="button-add-variable-modal"
                >
                  Add Variable
                </Button>
              </div>
              
              {Object.keys(formData.variables).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No variables defined. Variables can store values and control story flow.
                </p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(formData.variables).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {key}
                        </Badge>
                        <span className="text-sm">=</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVariable(key)}
                        data-testid={`button-remove-variable-modal-${key}`}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-edit">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-edit">
            {nodeData ? 'Save Changes' : 'Create Node'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}