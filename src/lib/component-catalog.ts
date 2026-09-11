export const COMPONENT_CATEGORIES = [
  "Actions",
  "Input",
  "Navigation",
  "Feedback",
  "Display",
  "Overlays",
  "Charts",
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];

export type ComponentCatalogEntry = {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
};

export const COMPONENTS = [
  { slug: "accordion", name: "Accordion", description: "A vertical set of sections that reveal one or more panels.", category: "Display" },
  { slug: "alert", name: "Alert", description: "A short message that calls attention to a change or condition.", category: "Feedback" },
  { slug: "alert-dialog", name: "Alert Dialog", description: "A modal confirmation for an action that needs a clear decision.", category: "Overlays" },
  { slug: "aspect-ratio", name: "Aspect Ratio", description: "A container that preserves a fixed proportion as its width changes.", category: "Display" },
  { slug: "attachment", name: "Attachment", description: "A compact file preview with status, details, and actions.", category: "Display" },
  { slug: "avatar", name: "Avatar", description: "A person or workspace image with a readable fallback.", category: "Display" },
  { slug: "badge", name: "Badge", description: "A small label for status, metadata, or a category.", category: "Display" },
  { slug: "breadcrumb", name: "Breadcrumb", description: "A path that shows the current page within a hierarchy.", category: "Navigation" },
  { slug: "bubble", name: "Bubble", description: "A compact message body for conversational interfaces.", category: "Display" },
  { slug: "button", name: "Button", description: "A control that starts an action or submits a form.", category: "Actions" },
  { slug: "button-group", name: "Button Group", description: "Related actions arranged as one connected control.", category: "Actions" },
  { slug: "calendar", name: "Calendar", description: "A month view for selecting one date or a date range.", category: "Input" },
  { slug: "card", name: "Card", description: "A bordered content group with an optional header and footer.", category: "Display" },
  { slug: "carousel", name: "Carousel", description: "A keyboard accessible sequence of content slides.", category: "Display" },
  { slug: "chart", name: "Chart", description: "Theme aware chart helpers built for Recharts.", category: "Charts" },
  { slug: "checkbox", name: "Checkbox", description: "A control for selecting one or more independent options.", category: "Input" },
  { slug: "collapsible", name: "Collapsible", description: "A single panel that expands and closes on demand.", category: "Display" },
  { slug: "combobox", name: "Combobox", description: "A searchable list for choosing one option.", category: "Input" },
  { slug: "command", name: "Command", description: "A fast keyboard driven menu with filtering and groups.", category: "Navigation" },
  { slug: "context-menu", name: "Context Menu", description: "Actions that open from a secondary pointer click.", category: "Overlays" },
  { slug: "data-table", name: "Data Table", description: "A table pattern with sorting, selection, and row actions.", category: "Display" },
  { slug: "date-picker", name: "Date Picker", description: "A date field composed from a popover and calendar.", category: "Input" },
  { slug: "device", name: "Device", description: "Present screenshots, video, and React content inside photographic PNG device frames.", category: "Display" },
  { slug: "dialog", name: "Dialog", description: "A modal window for focused content or a short task.", category: "Overlays" },
  { slug: "direction", name: "Direction", description: "A provider for left to right and right to left layouts.", category: "Display" },
  { slug: "drawer", name: "Drawer", description: "A panel that slides from an edge and supports touch gestures.", category: "Overlays" },
  { slug: "dropdown-menu", name: "Dropdown Menu", description: "A menu of actions opened from a compact trigger.", category: "Overlays" },
  { slug: "empty", name: "Empty", description: "A clear explanation and next action when content is absent.", category: "Feedback" },
  { slug: "field", name: "Field", description: "A form control with its label, help text, and error state.", category: "Input" },
  { slug: "hover-card", name: "Hover Card", description: "Preview content that appears while a link has hover or focus.", category: "Overlays" },
  { slug: "input", name: "Input", description: "A single line field for text, numbers, dates, and files.", category: "Input" },
  { slug: "input-group", name: "Input Group", description: "An input combined with text, icons, or nearby actions.", category: "Input" },
  { slug: "input-otp", name: "Input OTP", description: "A segmented field for a short one time code.", category: "Input" },
  { slug: "item", name: "Item", description: "A flexible row with media, content, and actions.", category: "Display" },
  { slug: "kbd", name: "Kbd", description: "A visual label for a keyboard key or shortcut.", category: "Display" },
  { slug: "label", name: "Label", description: "An accessible name for a form control.", category: "Input" },
  { slug: "marker", name: "Marker", description: "A compact divider or annotation within a content stream.", category: "Display" },
  { slug: "menubar", name: "Menubar", description: "A persistent row of menus for application commands.", category: "Navigation" },
  { slug: "message", name: "Message", description: "A structured conversational row with avatar, body, and metadata.", category: "Display" },
  { slug: "message-scroller", name: "Message Scroller", description: "An anchored message viewport that follows new content.", category: "Display" },
  { slug: "native-select", name: "Native Select", description: "A styled browser select with native platform behavior.", category: "Input" },
  { slug: "navigation-menu", name: "Navigation Menu", description: "Primary links with optional content panels.", category: "Navigation" },
  { slug: "pagination", name: "Pagination", description: "Controls for moving through a paged collection.", category: "Navigation" },
  { slug: "popover", name: "Popover", description: "Contextual content anchored to a trigger.", category: "Overlays" },
  { slug: "progress", name: "Progress", description: "A visual measure of task completion.", category: "Feedback" },
  { slug: "questionnaire", name: "Questionnaire", description: "A guided sequence of questions with progress and choices.", category: "Input" },
  { slug: "radio-group", name: "Radio Group", description: "A set of options where only one can be selected.", category: "Input" },
  { slug: "resizable", name: "Resizable", description: "Panels whose sizes can be changed with a draggable handle.", category: "Display" },
  { slug: "scroll-area", name: "Scroll Area", description: "A bounded region with consistent custom scrollbars.", category: "Display" },
  { slug: "select", name: "Select", description: "A custom menu for choosing one option from a list.", category: "Input" },
  { slug: "separator", name: "Separator", description: "A visual divider between related groups of content.", category: "Display" },
  { slug: "sheet", name: "Sheet", description: "A side panel for supporting content and short workflows.", category: "Overlays" },
  { slug: "sidebar", name: "Sidebar", description: "A composable application sidebar with responsive collapse behavior.", category: "Navigation" },
  { slug: "skeleton", name: "Skeleton", description: "A placeholder that mirrors content while it loads.", category: "Feedback" },
  { slug: "slider", name: "Slider", description: "A pointer and keyboard control for choosing a numeric value.", category: "Input" },
  { slug: "spinner", name: "Spinner", description: "A small animated indicator for an active task.", category: "Feedback" },
  { slug: "switch", name: "Switch", description: "A control that turns one setting on or off.", category: "Input" },
  { slug: "table", name: "Table", description: "A responsive structure for rows and columns of data.", category: "Display" },
  { slug: "tabs", name: "Tabs", description: "A compact way to switch between related panels.", category: "Navigation" },
  { slug: "textarea", name: "Textarea", description: "A resizable field for longer text input.", category: "Input" },
  { slug: "toast", name: "Toast", description: "A brief notification delivered through Sonner.", category: "Feedback" },
  { slug: "toggle", name: "Toggle", description: "A two state button for a format or view option.", category: "Actions" },
  { slug: "toggle-group", name: "Toggle Group", description: "Related toggle controls with single or multiple selection.", category: "Actions" },
  { slug: "tooltip", name: "Tooltip", description: "A short label revealed by hover or keyboard focus.", category: "Overlays" },
  { slug: "typography", name: "Typography", description: "Text styles for headings, paragraphs, lists, and inline code.", category: "Display" },
] as const satisfies readonly ComponentCatalogEntry[];

export const COMPONENT_GROUPS = COMPONENT_CATEGORIES.map((category) => ({
  category,
  components: COMPONENTS.filter((component) => component.category === category),
})).filter((group) => group.components.length > 0);

export function getComponent(slug: string) {
  return COMPONENTS.find((component) => component.slug === slug);
}
