# Geist component motion reference audit

Captured 17 September 2026 from [Geist introduction](https://vercel.com/geist/introduction). The introduction lists 72 component rows and 71 unique pages because Pill links to the Badge page. The audit covers the public HTML for every unique page, three referenced stylesheets, and the publicly delivered modules used to resolve uncertain overlay behavior. Source links appear in every row. Captures remain local and are not redistributed with the registry.

Evidence labels are compact on purpose. `HTML` means a rendered component class or inline style in the public page. `CSS` means a matching public stylesheet rule or motion token. `Live` means the supplied browser measurement. `None found` means the public server rendered example and its styles expose no motion owned by that component. It does not prove that an unrendered client state has no motion.

The public tokens set overlay motion to 300 ms and popover motion to 200 ms. Both use `cubic-bezier(.175,.885,.32,1.1)`. A token alone does not establish which states a component animates. The current Menu opens immediately and fades on exit over 150 ms. Combobox and Context Menu have no entrance animation in their delivered components. Their exit utility is referenced in the component but absent from the captured stylesheets, so its intended 200 ms duration is not a verified live exit. The normal utility default is 150 ms with `cubic-bezier(.4,0,.2,1)`. Focus states can explicitly disable transitions.

| Component | Source | Motion and evidence | Duration, easing, transform | Width rule |
|---|---|---|---|---|
| Avatar | [page](https://vercel.com/geist/avatar) | Motion. High, HTML and CSS | Background 200 ms ease in out. Unresolved image shimmer moves background for 8 s, infinite. | Square size comes from `--size`. |
| Badge | [page](https://vercel.com/geist/badge) | None found | Static state styles | Fits content. |
| Banner | [page](https://vercel.com/geist/banner) | None found for the banner body | Trigger buttons use shared 150 ms control motion | Fills its container. |
| Book | [page](https://vercel.com/geist/book) | Motion. High, CSS | Hover changes rotate Y, scale, and X translation over 250 ms ease out. Cover media fades over 250 ms or 500 ms ease out. | Width and depth come from book variables. Wrapper fits content. |
| Breadcrumbs | [page](https://vercel.com/geist/breadcrumbs) | Motion. High, HTML | Text, border, and background colors change over 200 ms. | Content flow. Items allow truncation with minimum width zero. |
| Browser | [page](https://vercel.com/geist/browser) | Motion. High, HTML | Header icon states crossfade and scale between zero and one over 150 ms ease out. | Browser frame fills the example width. |
| Button | [page](https://vercel.com/geist/button) | Motion. High, HTML | Border, background, color, transform, and shadow use 150 ms ease in out. Focus can disable the transition. | Content width by default. Fluid examples fill the parent. |
| Calendar | [page](https://vercel.com/geist/calendar) | None found for date movement | Static selection states in captured HTML | Content sized calendar surface. |
| Checkbox | [page](https://vercel.com/geist/checkbox) | Motion. High, HTML | Control geometry, transform, and background use 150 ms ease out. Other state colors use 200 ms. | Fixed square control. Label row uses available width. |
| Choicebox | [page](https://vercel.com/geist/choicebox) | Motion. High, HTML | Radio mark scales from zero to one over 150 ms ease in. Border and background use 200 ms ease in. | Cards fill the assigned layout columns. |
| Clearable Input | [page](https://vercel.com/geist/clearable-input) | Motion. High, HTML | Input shell uses 150 ms. Clear adornments translate using component duration and timing variables. | Full width within a maximum width wrapper. |
| Code | [page](https://vercel.com/geist/code) | None found | Static inline token | Fits content. |
| Code Block | [page](https://vercel.com/geist/code-block) | Motion. High, HTML and CSS | Copy state scales and fades over 150 ms. Line number color uses 125 ms ease out. | Block fills its container and scrolls overflow. |
| Collapse | [page](https://vercel.com/geist/collapse) | Motion. High, HTML and Live | Panel height changes over 200 ms ease in out with default cubic bezier `.4,0,.2,1`. Chevron rotates 90 degrees over 200 ms. Measured height was 0 px closed and 88 px open. | Fills its container. Content can cap at 60 viewport height. |
| Combobox | [page](https://vercel.com/geist/combobox) | Motion. HTML, Live, and delivered component | Popup appears immediately. Input shadow uses 200 ms. Chevron opens at rotate 180 with no transition, then closes to rotate zero over 150 ms with cubic bezier `.4,0,.2,1`. List height changes over 100 ms ease in out after first render. Intended exit uses the 200 ms popover token, with the stylesheet limitation described above. | Standard example filled 812 px available width. Custom input was 256 px. List wrapper matches the anchor width and adds 6 px padding on each side. Separate list width is supported. |
| Command Menu | [page](https://vercel.com/geist/command-menu) | Motion. High, CSS token | Overlay fades and panel scales over 300 ms with swift cubic bezier. Loading sweep uses 1.1 s with cubic bezier `.455,.03,.515,.955`, infinite. | Dialog width is constrained by its overlay layout. |
| Context Card | [page](https://vercel.com/geist/context-card) | Shared token evidence only | Shared popover token is 200 ms. Actual entrance, exit, and trigger delay were not measured. | Content width is constrained by the popover implementation. |
| Context Menu | [page](https://vercel.com/geist/context-menu) | Delivered component and shared token | Instant entrance. Intended exit uses the 200 ms popover token, with the stylesheet limitation described above. | Menu is content sized within viewport constraints. |
| Copy Button | [page](https://vercel.com/geist/copy-button) | Motion. High, HTML | Copy status icon fades and scales between one half and one over 150 ms ease in out. | Button is content sized or icon sized. |
| Description | [page](https://vercel.com/geist/description) | None found | Static definition layout | Width comes from the parent layout. |
| Destructive Action Modal | [page](https://vercel.com/geist/destructive-action-modal) | Motion. High, shared modal CSS | Same 300 ms opacity and scale overlay motion as Modal. | Uses the modal width constraint. |
| Dots Menu | [page](https://vercel.com/geist/dots-menu) | Shared Menu behavior | Uses the Menu family. Menu opens immediately and its wrapper fades on exit over 150 ms. | Menu is content sized within viewport constraints. |
| Drawer | [page](https://vercel.com/geist/drawer) | Motion. High, CSS | Bottom drawer uses Y translation and opacity. Public dialog CSS uses 350 ms with cubic bezier `.4,0,.2,1`. | Full viewport width. Height is content driven, with 75 to 80 viewport height caps in public CSS. |
| Empty State | [page](https://vercel.com/geist/empty-state) | None found for the container | Example icon treatment uses a 100 ms state change | Width comes from its parent. |
| Entity | [page](https://vercel.com/geist/entity) | Motion. High, HTML through child primitives | Avatar background uses 200 ms and unresolved content shimmers. Skeleton child uses 1.5 s. | Row fills available width. |
| Error | [page](https://vercel.com/geist/error) | Motion. High, HTML | Error visibility uses a 100 ms opacity transition. | Width comes from the associated field. |
| Error Card | [page](https://vercel.com/geist/error-card) | None found | Static card state | Fills its parent or assigned column. |
| Feedback | [page](https://vercel.com/geist/feedback) | Motion. High, CSS | Initial appearance takes 500 ms after a 100 ms delay, from opacity zero and translate Y 5 px. Followup fade and scale use 100 ms in and 200 ms out with cubic bezier `.16,1,.3,1`. | Inline or container width, depending on placement. |
| Fieldset | [page](https://vercel.com/geist/fieldset) | None found for the fieldset | Child controls carry their own transitions | Fills the assigned form width. |
| File Tree | [page](https://vercel.com/geist/file-tree) | None found | Static expansion state in captured HTML | Fills its container. |
| Gauge | [page](https://vercel.com/geist/gauge) | Motion. High, HTML | Stroke dash array, stroke, and rotation change over 1 s ease. Step delay is 200 ms. | Square size comes from `--circle-size`. |
| Grid | [page](https://vercel.com/geist/grid) | Motion only in debug overlay. High, CSS | Breakpoint label disappears over 2 s ease out. | Grid width comes from its container and column tokens. |
| Input | [page](https://vercel.com/geist/input) | Motion. High, HTML | Shell and shadow use 150 ms. Animated adornments translate using component duration and timing variables. | Full width within a maximum width wrapper. |
| JSON View | [page](https://vercel.com/geist/json-view) | None found | Static disclosure state in captured HTML | Width comes from its container. |
| Keyboard Input | [page](https://vercel.com/geist/keyboard-input) | None found | Static keycap | Fits content. |
| Label | [page](https://vercel.com/geist/label) | None found | Static label. Child input has its own motion. | Width follows associated content. |
| Load More Button | [page](https://vercel.com/geist/load-more-button) | Motion. High, HTML through Button and Spinner | Control colors and shadow use 150 ms. Spinner segments pulse over 1 s linear, infinite. | Content sized by default. |
| Loading Dots | [page](https://vercel.com/geist/loading-dots) | Motion. High, HTML and CSS | Dots pulse opacity from .2 to 1 and back over 1.4 s, infinite, with staggered delays. | Fits content. |
| Menu | [page](https://vercel.com/geist/menu) | Motion. Live and delivered component | Instant entrance. Wrapper opacity fades over 150 ms ease in out on exit, with a 400 ms maximum presence timeout. Trigger chevron rotates over 150 ms. | The measured default menu was 200 px wide. Position adapts to viewport bounds. |
| MiddleTruncate | [page](https://vercel.com/geist/middle-truncate) | None found | Static truncation | Fills the assigned width and truncates the middle. |
| Modal | [page](https://vercel.com/geist/modal) | Motion. High, Live and CSS | Opacity and transform use 300 ms with cubic bezier `.175,.885,.32,1.1`. | Default settled width measured 540 px. Responsive behavior is capped by viewport space. |
| Multi Select | [page](https://vercel.com/geist/multi-select) | HTML and shared token evidence | Trigger icon color and transform use the 150 ms default. The shared popover token is 200 ms; popup timing was not measured. | Trigger fills its wrapper. Menu follows the anchor constraint. |
| Note | [page](https://vercel.com/geist/note) | None found | Static status surface | Fills its parent. |
| Pagination | [page](https://vercel.com/geist/pagination) | None found beyond button state motion | Buttons use shared 150 ms control transitions | Content sized row. |
| Phone | [page](https://vercel.com/geist/phone) | None found for the frame | Static mock phone | Fixed aspect frame within available width. |
| Pill | [page](https://vercel.com/geist/badge#pill) | None found | Static Badge variant | Fits content. |
| Progress | [page](https://vercel.com/geist/progress) | Motion. High, HTML | Fill width and color change over 100 ms ease in. | Track fills its parent. |
| Project Banner | [page](https://vercel.com/geist/project-banner) | None found | Static banner | Fills its parent. |
| Radio | [page](https://vercel.com/geist/radio) | Motion. High, HTML | Dot scales from zero to one over 150 ms ease in. Border and background use 200 ms ease in. | Fixed circle control. Label row uses available width. |
| Relative Time Card | [page](https://vercel.com/geist/relative-time-card) | Shared token evidence only | Shared popover token is 200 ms. Actual entrance, exit, and trigger delay were not measured. | Content width is constrained by the card implementation. |
| Scroller | [page](https://vercel.com/geist/scroller) | Motion. High, CSS | Edge mask background position changes over 300 ms. | Overlay is 100 percent width and height. Scroller follows its parent. |
| Search Input | [page](https://vercel.com/geist/search-input) | Motion. High, HTML | Shell uses 150 ms. Clear adornments translate using component duration and timing variables. | Full width within a maximum width wrapper. |
| Select | [page](https://vercel.com/geist/select) | Motion. High, HTML | Shadow and color change over 200 ms. Chevron color uses 150 ms ease in. | Full width within its wrapper. |
| Separator | [page](https://vercel.com/geist/separator) | None found | Static line | Horizontal fills width. Vertical fills height. |
| Sheet | [page](https://vercel.com/geist/sheet) | Motion. High, Live | Right variant fades and moves from 20 px right on entry, then to 40 px right on exit. Both directions take 200 ms ease in out. | Side sheet width follows its configured panel width and viewport cap. |
| Show more | [page](https://vercel.com/geist/show-more) | Motion. High, HTML | Chevron rotates 180 degrees over 200 ms ease in out. Content expansion follows disclosure state. | Fills its content wrapper. |
| Skeleton | [page](https://vercel.com/geist/skeleton) | Motion. High, CSS | Shimmer translates horizontally over 1.5 s ease in out, infinite reverse. | Fills the dimensions supplied by its parent. |
| Slider | [page](https://vercel.com/geist/slider) | Motion. High, HTML | Thumb scales to 1.2 on drag or keyboard focus over 100 ms. | Track fills its wrapper. Fill width reflects the current value. |
| Snippet | [page](https://vercel.com/geist/snippet) | Motion. High, HTML | Copy status icon fades and scales between one half and one over 150 ms ease in out. | Fits content with maximum width 100 percent. Examples use explicit 300 px widths. |
| Spinner | [page](https://vercel.com/geist/spinner) | Motion. High, HTML | Segment opacity cycles over 1 s linear, infinite. Delays are staggered by segment count. Segments are rotated around the center. | Fixed square sizes by variant. |
| Split Button | [page](https://vercel.com/geist/split-button) | HTML and shared token evidence | Button states use 150 ms ease in out. The shared popover token is 200 ms. Attached menu timing was not measured separately; the Supervisor composition uses the Menu family behavior. | Combined control fits its content. |
| Status Dot | [page](https://vercel.com/geist/status-dot) | None found | Static dot | Fixed dot with content sized label. |
| Switch | [page](https://vercel.com/geist/switch) | Motion. High, HTML | Segmented item colors change over 150 ms. Selection changes background without a sliding indicator. | Group fills available width or divides its assigned width evenly. |
| Table | [page](https://vercel.com/geist/table) | Motion. High, HTML | Sort icon transform uses 200 ms ease in out. Row color uses the default transition. | Table fills its container and can scroll horizontally. |
| Tabs | [page](https://vercel.com/geist/tabs) | No selection motion. High, Live and HTML | Primary v1 switches the underline instantly. There is no sliding indicator. Secondary switches background instantly. | Tab list follows content width and scrolls horizontally when needed. |
| Text With Copy Button | [page](https://vercel.com/geist/text-with-copy-button) | Motion. High, HTML | Text and icon color use 100 ms ease in out. Copy status fades and scales between one half and one over 150 ms ease in out. | Fills its parent while text truncates as needed. |
| Textarea | [page](https://vercel.com/geist/textarea) | Motion. High, HTML | Border, shadow, and related state styles use 150 ms. | Full width within a maximum width wrapper. |
| Theme Switcher | [page](https://vercel.com/geist/theme-switcher) | None found for selection movement | Selection changes state without a sliding element in captured HTML | Content sized segmented control. |
| Toast | [page](https://vercel.com/geist/toast) | Motion. Medium, overlay CSS | Toast container height uses 400 ms and content opacity uses 200 ms in the public stylesheet. | Toast width is constrained by its viewport container. |
| Toggle | [page](https://vercel.com/geist/toggle) | Motion. High, HTML and Live | Track color uses 150 ms with cubic bezier `.0,0,.2,1`. Thumb translation uses 150 ms with cubic bezier `.4,0,.2,1`. Small thumb moves 14 px. | Small track is 28 by 14 px. Larger examples use 36 by 20 px and 40 by 24 px. |
| Tooltip | [page](https://vercel.com/geist/tooltip) | Motion. High, CSS | Opacity enters over 100 ms ease in after either 100 ms or 400 ms delay. | Content sized with viewport collision limits. |
| Video | [page](https://vercel.com/geist/video) | None found for the video frame | Native media behavior is outside the component CSS | Width follows the media container. |

## Implementation priorities

The strongest current references are the values measured live for Modal, Combobox, Sheet, Collapse, Tabs, and Toggle. These should win over older assumptions. In particular, the current Sheet right variant travels only 20 px on entry and 40 px on exit. It does not translate by its full width. Tabs v1 does not animate an indicator. Combobox prevents a chevron animation on opening, then animates the return on closing.

Small control feedback usually takes 100 to 150 ms. Disclosure changes take 200 ms. Modal changes use 300 ms with the swift overshoot curve. Loading indicators run continuously and must stop under reduced motion. Menu opening remains immediate. These differences are part of the behavior being reproduced.

## Supervisor mapping and baseline findings

The audit starts from `b0df59a`, the current remote integration branch when work began. The older local checkout lacked the Ledger and chart catalog updates. Those updates are part of the implementation base.

| Supervisor component or group | Geist reference | Baseline finding |
| --- | --- | --- |
| Dialog, Alert Dialog, Command dialog | Modal, Destructive Action Modal, Command Menu | Local dialog and backdrop use a 100 ms stock animation. Geist Modal uses 300 ms and scale .96. Keep dialog centering, focus containment, dismissal, and restoration. |
| Combobox | Combobox | Documentation duplicates the component with fixed 256 px widths and a static downward arrow. The installable composition uses a different arrow and an intrinsic trigger width. Both need one implementation. |
| Popover, Date Picker | Combobox and contextual overlays | Stock 100 ms fade, zoom, and directional offsets differ from immediate contextual opening. Preserve calendar selection and collision handling. |
| Dropdown Menu, Menubar, Button Group menu actions | Menu, Dots Menu, Split Button | Stock zoom animations differ from Menu's instant entrance and 150 ms exit fade. Submenus need the same handling as top level menus. |
| Context Menu | Context Menu | Preserve pointer anchoring and keyboard navigation. The public reference has immediate opening. |
| Hover Card | Context Card, Relative Time Card | The shared popover token exists, but actual trigger delays were not verified. Retain the consumer's configured trigger timing. |
| Sheet | Sheet | Local opening uses a 40 px translation. Current Geist right sheet uses 20 px on entry and 40 px on exit, both over 200 ms. |
| Drawer | Drawer | Existing Vaul implementation owns drag, snap, and dismissal behavior. Its gesture model is an adaptation, not an exact copy of Geist's internal drawer. |
| Accordion, Collapsible | Collapse, Show more | Accordion swaps separate icons. Collapsible has no shared height animation. Preserve dynamic content sizing and closed state accessibility. |
| Switch | Toggle | Boolean track and thumb need separate 150 ms transitions. Geist's naming differs from shadcn here. |
| Toggle, Toggle Group | Switch | Segmented selection changes color without a traveling indicator. Preserve single and multiple selection semantics. |
| Checkbox, Radio Group | Checkbox, Radio, Choicebox | Check and radio indicators require state motion in addition to control color transitions. |
| Button, Pagination, Breadcrumb | Button, Pagination, Breadcrumbs | Verify existing hover, press, color, shadow, and keyboard focus feedback. Do not add unrelated scale effects. |
| Input, Input Group, Textarea, Field | Input, Search Input, Clearable Input, Textarea, Fieldset, Error | Preserve invalid state and grouped focus borders. Adornments only animate when the composition actually contains them. |
| Select, Native Select | Select | Keep platform behavior for Native Select. Preserve custom Select positioning and consumer controlled values. |
| Tabs | Tabs | Keep immediate content changes and selection. Do not add a moving indicator absent from the reference. |
| Slider, Progress | Slider, Progress | Slider thumb state uses 100 ms. Progress fill changes use 100 ms. Keep numeric and keyboard semantics. |
| Skeleton, Spinner | Skeleton, Spinner, Loading Dots | Stock pulse and continuous rotation differ from the reference shimmer and segmented loading indicator. Verify any change in installed source as well as the preview. |
| Table, Data Table | Table | The sortable composition swaps arrow icons rather than rotating one persistent arrow. Preserve sorting values and row identity. |
| Toast | Toast | Existing Sonner manages stacking, swipe dismissal, and presence. Treat this as a library adaptation. |
| AI Elements copy controls | Copy Button, Code Block, Snippet, Text With Copy Button | Code Block, Snippet, Terminal, Commit, Environment Variables, and Stack Trace swap status icons. Preserve clipboard errors, callbacks, and reset timers while adding state motion. |
| AI Elements File Tree and code views | File Tree, Code, Code Block, JSON View | Keep existing disclosure semantics and code content. A static reference is not a reason to add animation. |
| Avatar, Item, Message | Avatar, Entity | Preserve image loading and fallback semantics. Never make a resolved fallback shimmer indefinitely. |
| Chart and the 21 chart families | Gauge | Existing chart transitions belong to the chart implementation. A one value Geist gauge does not define every chart family's motion. |
| Scroll Area, Message Scroller | Scroller | Preserve scrolling, anchoring, user position, and reduced motion. |
| Navigation Menu, Sidebar, Carousel, Resizable, Questionnaire | No direct equivalent for the complete component | Audit existing transitions and inherited controls without replacing their interaction models. |
| Alert, Badge, Card, Empty, Aspect Ratio, Device, Direction, Kbd, Label, Separator, Typography, Attachment, Bubble, Marker, Input OTP | Static references or Supervisor additions | Preserve layout, status, media, and text behavior. Child buttons and inputs inherit the appropriate shared motion. |

Geist Book, Browser chrome, Feedback, Multi Select, and several application specific wrappers have no exact standalone counterpart in this catalog. Their motion is documented above. This task updates the existing component library; it does not add every absent Geist component as a new public API.

## Distribution constraints

Most Supervisor registry entries deliberately delegate component source to shadcn so the consumer keeps its selected Radix or Base UI implementation. Shared motion must therefore ship through `supervisor-foundation`, not only through local wrapper classes. Radix uses `data-state`; Base UI also exposes `data-open`, `data-closed`, `data-starting-style`, and `data-ending-style`. Disclosure measurements use different CSS variables in each base.

Registry generation converts CSS into an object. Duplicate selectors and duplicate media blocks must retain all declarations when exported. A successful local preview does not prove this conversion kept the motion, font, shape, or accessibility rules.

Ledger defines its own motion durations and curves. Those recipe settings remain authoritative. The generic Geist timings describe the shared default, not a mandate to overwrite every theme's deliberate behavior.

## Browser verification

The following checks use the running Supervisor implementation. Reference measurements above describe Geist; this table describes the port.

| Check | Observed result |
| --- | --- |
| Dialog entrance | Opacity and scale use 300 ms with `cubic-bezier(.175,.885,.32,1.1)`. The settled panel is 540 px wide and remains centered. CSS `translate` retains the centering offset while `scale` animates independently. |
| Dialog keyboard behavior | Initial focus reaches the display name field. Tab from the final close button returns to the first field. Escape starts the exit animation. After exit, the dialog unmounts, the body scroll lock clears, and focus returns to the opening button. |
| Dialog dark mode | The Geist theme retains dark colors, visible focus, the same geometry, and 300 ms timing. |
| Ledger dialog | The panel retains the recipe's 220 ms entrance with `cubic-bezier(.22,1,.36,1)` and 260 ms exit with `cubic-bezier(.4,0,.6,1)`. |
| Combobox default width | A 704 px container produces a 704 px trigger and 704 px popup. A 240 px container produces a 240 px trigger and popup. |
| Combobox custom width | A 256 px trigger can open a separately configured 384 px menu. |
| Combobox long labels | A long selected label stays within the 240 px trigger. The full label remains in the DOM and the field keeps its stable accessible name. |
| Combobox duplicate labels | Two options named "Same label" remain distinct. Keyboard selection of the second option submits its value `second`. |
| Combobox controlled values | An external value update changes the selected label. The uncontrolled example retains its own selected value and submits through its named field. |
| Combobox results | Searching updates the result height with a 100 ms transition. An unmatched search displays the configured empty message. |
| Combobox disabled state | The disabled trigger reports disabled and cannot open. |
| Combobox nested in a dialog | Search and keyboard selection work inside the modal. Closing the popup leaves the containing modal available. |
| Menus | Top level and nested menus open without an entrance animation. Top level exit uses a 150 ms opacity fade and retains its anchor while closing. |
| Sheet | The right panel uses the measured 200 ms ease in out animation and remains anchored to the right edge. |
| Dynamic Accordion content | The panel opens at 46 px. Adding content after the animation grows the panel and its inner wrapper to 86 px, matching the scroll height without clipping. |
| Slider keyboard feedback | Arrow Right changes the value from 42 to 43. The focused thumb scales to 1.2 over 100 ms. |
| Skeleton | The stock pulse is removed. A pseudo element moves horizontally over 1.5 s with ease in out timing. |
| Spinner | Twelve original radial segments animate opacity over 1 s with staggered delays. The outer SVG does not rotate. |
| Copy feedback | Snippet keeps both status icons mounted. Copying changes opacity and scale between .5 and 1 over 150 ms. |
| Switch thumb | Translation interpolates over 150 ms. The transition includes both `translate` and `transform` so the installed Tailwind 4 utility keeps moving smoothly. |
| Data Table sorting | Sorting changes row order and `aria-sort`. One persistent arrow rotates to show descending order. |
| Installed Base UI Combobox | The trigger measured 462.22 px and the popup 462 px after layout rounding. Popup entrance has no animation. The chevron uses `aria-expanded`, rotates to 180 degrees immediately on opening, and restores a 150 ms transition on closing. Keyboard selection updates the value. |
| Installed Base UI Spinner | Twelve segments retain staggered 1 s opacity animations. The outer SVG does not rotate. |

The browser session ran at 1280 by 720. The available viewport override did not change the rendered viewport, so the narrow combobox checks use real constrained containers. They are not a completed phone viewport test. Reduced motion must also be verified in compiled registry CSS; this browser connection does not expose preference emulation.

## Delivered changes and validation

Shared motion now ships in `supervisor-foundation`, including overlay presence, menu exit fades, disclosure height and chevrons, control feedback, skeleton shimmer, and reduced motion. Component source changes cover Combobox, Accordion, Data Table, Spinner, and six AI Elements copy controls. Documentation examples now use the installable Combobox and Data Table implementations.

The CSS exporter merges repeated selectors and media blocks so later motion declarations do not erase earlier typography, geometry, or accessibility rules. It preserves semantic theme filtering. Repeated selectors retain their first insertion position in the exported object. The current repeated selector only adds a transition duration; future overlapping rules must account for that ordering limitation.

| Validation | Result |
| --- | --- |
| Lint | Passed. |
| Type checking | Passed. |
| Tests | 116 passed, zero failed, 3578 assertions across 16 files. |
| Registry generation | 182 items generated. Affected component source matches the published JSON content, and both registry indexes match. |
| Production build | Passed, generating 125 pages. |
| Installation matrix | All five cases passed: root Radix TypeScript, source directory Base UI TypeScript, custom aliases, Radix JavaScript, and Tailwind 3 Radix. |
| Final Base UI correction | The Base UI installation case passed again after changing the chevron to the shared `aria-expanded` state. The installed production build passed the browser checks above. |
| Reduced motion | Compiled CSS and exported rules retain duration limits and one animation iteration. Copy icons also carry explicit reduced motion classes. Browser preference emulation was unavailable. |

The port preserves Ledger recipe motion, the 21 chart families, existing theme settings, and third party license notices. Vaul drawer gestures and Sonner toast stacking remain library adaptations. Context Menu and Combobox exit timing uses the documented token interpretation where a live reference exit could not be established. No proprietary source, stylesheets, icons, or logos are included.
