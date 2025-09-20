import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface NodeColorPickerProps {
  color?: string;
  onColorChange: (color: string) => void;
}

const presetColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6b7280', // gray
  '#1f2937', // dark gray
  '#ffffff', // white
];

export function NodeColorPicker({ color = '#3b82f6', onColorChange }: NodeColorPickerProps) {
  const [customColor, setCustomColor] = useState(color);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0"
          data-testid="button-color-picker"
        >
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Preset Colors</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`
                    w-8 h-8 rounded border-2 hover:scale-110 transition-transform
                    ${color === presetColor ? 'border-primary' : 'border-border'}
                  `}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => onColorChange(presetColor)}
                  data-testid={`color-preset-${presetColor}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-color" className="text-sm font-medium">
              Custom Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-color"
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => onColorChange(customColor)}
                data-testid="button-apply-custom-color"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}