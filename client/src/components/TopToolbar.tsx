import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Save,
  FileText,
  Play,
  Download,
  Share,
  Undo,
  Redo,
  Settings,
  Moon,
  Sun,
  HelpCircle,
} from 'lucide-react';

interface TopToolbarProps {
  projectName?: string;
  isModified?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  isDarkMode?: boolean;
  onSave?: () => void;
  onNew?: () => void;
  onOpen?: () => void;
  onExport?: () => void;
  onPreview?: () => void;
  onShare?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleTheme?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export function TopToolbar({
  projectName = 'Untitled Story',
  isModified = false,
  canUndo = false,
  canRedo = false,
  isDarkMode = true,
  onSave,
  onNew,
  onOpen,
  onExport,
  onPreview,
  onShare,
  onUndo,
  onRedo,
  onToggleTheme,
  onSettings,
  onHelp,
}: TopToolbarProps) {
  return (
    <div className="h-14 bg-background border-b border-border flex items-center px-4 gap-4">
      {/* Project info */}
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-lg">{projectName}</h1>
        {isModified && (
          <Badge variant="secondary" className="text-xs">
            Unsaved
          </Badge>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* File operations */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" data-testid="button-file-menu">
              <FileText className="h-4 w-4 mr-1" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onNew}>
              <FileText className="h-4 w-4 mr-2" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpen}>
              Open Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSave} disabled={!isModified}>
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export to HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={!isModified}
          data-testid="button-save"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Edit operations */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          data-testid="button-undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          data-testid="button-redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Story operations */}
      <div className="flex items-center gap-1">
        <Button
          variant="default"
          size="sm"
          onClick={onPreview}
          data-testid="button-preview"
        >
          <Play className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          data-testid="button-export"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          data-testid="button-toggle-theme"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onHelp}
          data-testid="button-help"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSettings}
          data-testid="button-settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}