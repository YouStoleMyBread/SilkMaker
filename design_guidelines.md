# Design Guidelines: Modern Interactive Story Editor

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern creative tools like Figma, Notion, and Linear for their clean, professional interfaces that balance creativity with productivity.

## Core Design Elements

### Color Palette
**Dark Mode Primary** (Default):
- Background: 220 15% 8%
- Surface: 220 15% 12% 
- Border: 220 15% 18%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 70%
- Accent: 240 75% 65% (vibrant blue for connections)

**Light Mode**:
- Background: 220 15% 98%
- Surface: 220 15% 100%
- Border: 220 15% 85%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%

### Typography
- **Primary**: Inter via Google Fonts
- **Monospace**: JetBrains Mono for code/variable displays
- Hierarchy: text-3xl for headers, text-base for body, text-sm for metadata

### Layout System
**Tailwind Spacing**: Consistent use of 2, 4, 8, 12, 16 units
- Tight spacing: p-2, m-2
- Standard spacing: p-4, gap-4
- Generous spacing: p-8, mb-12
- Section spacing: mt-16

### Component Library

**Main Canvas Area**:
- Infinite grid background with subtle dot pattern
- Zoom controls (25% to 200%)
- Minimap in bottom-right corner

**Story Nodes**:
- Rounded rectangles (rounded-lg) with subtle shadows
- Width: w-64, minimum height: h-32
- Node types indicated by left border color
- Title bar with drag handle and node type icon

**Connection System**:
- Curved SVG lines connecting nodes
- Hover states show connection details
- Color-coded by condition type

**Sidebar Panels**:
- Left: Project tree and node library
- Right: Properties panel for selected node
- Collapsible with smooth transitions

**Top Toolbar**:
- File operations, view controls, and export options
- Breadcrumb navigation for nested stories
- Play button for preview mode

### Visual Hierarchy
- **Primary Actions**: Solid buttons with accent color
- **Secondary Actions**: Outline buttons with subtle borders
- **Danger Actions**: Red accent (0 75% 60%)
- **Success States**: Green accent (120 75% 45%)

### Interactive Elements
- Drag-and-drop with visual feedback
- Hover states for all interactive elements
- Selection indicators with accent color borders
- Context menus for right-click actions

### Export Preview
- Modal overlay showing generated HTML structure
- Syntax highlighting for code view
- Download/copy options with clear CTAs

This design prioritizes clarity and workflow efficiency while maintaining visual appeal for creative work.