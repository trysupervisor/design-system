"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  FileTextIcon,
  InfoIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DirectionProvider } from "@/components/ui/direction";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Questionnaire, QuestionnaireActions, QuestionnaireChoice, QuestionnaireChoices, QuestionnaireDescription, QuestionnaireError, QuestionnaireItem, QuestionnaireNext, QuestionnairePrevious, QuestionnaireProgress, QuestionnaireSubmit, QuestionnaireTitle } from "@/components/ui/questionnaire";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartGallery } from "@/components/chart-gallery";
import { DeviceExample } from "./device-example";

const companies = ["Aperture Labs", "Northstar Works", "Pine Research"];
const questionnaireItems = [{ name: "priority", required: true, choices: [{ value: "clarity" }, { value: "speed" }, { value: "control" }] }] as const;

function DataRows() {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Workspace</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Runs</TableHead></TableRow></TableHeader>
      <TableBody>
        <TableRow><TableCell>Aperture</TableCell><TableCell><Badge variant="secondary">Active</Badge></TableCell><TableCell className="text-right font-mono">184</TableCell></TableRow>
        <TableRow><TableCell>Field notes</TableCell><TableCell><Badge variant="outline">Paused</Badge></TableCell><TableCell className="text-right font-mono">73</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}

function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Aperture Labs");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="outline" role="combobox" aria-expanded={open} className="w-64 justify-between">{value}<ChevronDownIcon /></Button></PopoverTrigger>
      <PopoverContent className="w-64 p-0"><Command><CommandInput placeholder="Search workspaces" /><CommandList><CommandEmpty>No workspace found.</CommandEmpty><CommandGroup>{companies.map((company) => <CommandItem key={company} value={company} onSelect={() => { setValue(company); setOpen(false); }}>{company}{value === company && <CheckIcon className="ml-auto" />}</CommandItem>)}</CommandGroup></CommandList></Command></PopoverContent>
    </Popover>
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 10));
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline" className="w-64 justify-start"><CalendarIcon />{date ? date.toLocaleDateString("en", { dateStyle: "long" }) : "Choose a date"}</Button></PopoverTrigger>
      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} /></PopoverContent>
    </Popover>
  );
}

function FieldDemo() {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && !value.includes("@");
  return (
    <FieldSet className="w-full max-w-sm"><FieldGroup><Field data-invalid={invalid || undefined}><FieldLabel htmlFor="catalog-email">Email</FieldLabel><Input id="catalog-email" value={value} onChange={(event) => setValue(event.target.value)} aria-invalid={invalid} placeholder="you@example.com" /><FieldDescription>We use this address for account notices.</FieldDescription>{invalid && <FieldError>Enter a complete email address.</FieldError>}</Field></FieldGroup></FieldSet>
  );
}

function MessageScrollerDemo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-64 rounded-lg border">
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-4">
            {["Review the navigation labels.", "The labels are now shorter and keep their meaning.", "Run the focused checks next."].map((text, index) => <MessageScrollerItem key={text} scrollAnchor={index === 2}><Message align={index === 1 ? "end" : "start"}><MessageContent><Bubble variant={index === 1 ? "secondary" : "outline"}><BubbleContent>{text}</BubbleContent></Bubble></MessageContent></Message></MessageScrollerItem>)}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

export function ComponentExample({ slug }: { slug: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 10));
  const [page, setPage] = useState(1);

  switch (slug) {
    case "accordion": return <Accordion type="single" collapsible defaultValue="tokens"><AccordionItem value="tokens"><AccordionTrigger>Can I change the theme tokens?</AccordionTrigger><AccordionContent>Yes. Every component reads the same semantic variables.</AccordionContent></AccordionItem><AccordionItem value="source"><AccordionTrigger>Can I own the source?</AccordionTrigger><AccordionContent>The registry installs editable source files into your project.</AccordionContent></AccordionItem></Accordion>;
    case "alert": return <div className="grid w-full gap-3"><Alert><InfoIcon /><AlertTitle>Review ready</AlertTitle><AlertDescription>Four files changed and focused checks passed.</AlertDescription></Alert><Alert variant="destructive"><InfoIcon /><AlertTitle>Connection lost</AlertTitle><AlertDescription>Your draft remains in this browser.</AlertDescription></Alert></div>;
    case "alert-dialog": return <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Remove workspace</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this workspace?</AlertDialogTitle><AlertDialogDescription>This action removes its saved configuration.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Remove</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
    case "aspect-ratio": return <AspectRatio ratio={16 / 9} className="grid w-full place-items-center rounded-lg bg-muted"><div className="text-center"><p className="font-medium">16 by 9</p><p className="text-sm text-muted-foreground">Resize the page to test it.</p></div></AspectRatio>;
    case "attachment": return <Attachment className="w-full max-w-sm"><AttachmentMedia><FileTextIcon /></AttachmentMedia><AttachmentContent><AttachmentTitle>research-notes.pdf</AttachmentTitle><AttachmentDescription>PDF, 1.8 MB</AttachmentDescription></AttachmentContent><AttachmentActions><AttachmentAction aria-label="Remove attachment"><Trash2Icon /></AttachmentAction></AttachmentActions></Attachment>;
    case "avatar": return <AvatarGroup><Avatar><AvatarFallback>MO</AvatarFallback></Avatar><Avatar><AvatarFallback>IR</AvatarFallback></Avatar><Avatar><AvatarFallback>KA</AvatarFallback></Avatar><AvatarGroupCount>+4</AvatarGroupCount></AvatarGroup>;
    case "badge": return <div className="flex flex-wrap gap-2"><Badge>Default</Badge><Badge variant="secondary">In review</Badge><Badge variant="outline">Draft</Badge><Badge variant="destructive">Blocked</Badge></div>;
    case "breadcrumb": return <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink asChild><Link href="/components">Components</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>;
    case "bubble": return <BubbleGroup className="w-full"><Bubble variant="outline"><BubbleContent>Can you review the latest changes?</BubbleContent></Bubble><Bubble variant="secondary" align="end"><BubbleContent>The focused checks pass.</BubbleContent><BubbleReactions>Approved</BubbleReactions></Bubble></BubbleGroup>;
    case "button": return <div className="flex flex-wrap items-center gap-2"><Button onClick={() => toast.success("Saved")}>Save changes</Button><Button variant="outline">Preview</Button><Button variant="secondary">Duplicate</Button><Button variant="ghost">Cancel</Button><Button variant="destructive">Remove</Button><Button disabled>Unavailable</Button></div>;
    case "button-group": return <ButtonGroup><Button variant="outline">Run</Button><ButtonGroupSeparator /><Button variant="outline" size="icon" aria-label="Choose run option"><ChevronDownIcon /></Button><ButtonGroupText>Last run passed</ButtonGroupText></ButtonGroup>;
    case "calendar": return <div><Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} className="mx-auto" /><p className="mt-3 text-center text-sm text-muted-foreground">{date?.toLocaleDateString("en", { dateStyle: "long" })}</p></div>;
    case "card": return <Card className="w-full max-w-sm"><CardHeader><CardTitle>Weekly review</CardTitle><CardDescription>Eight completed runs across three workspaces.</CardDescription><CardAction><Badge variant="secondary">Current</Badge></CardAction></CardHeader><CardContent><p className="text-3xl font-medium tabular-nums">18.4 hours</p></CardContent><CardFooter><Button variant="outline" className="w-full">Open report</Button></CardFooter></Card>;
    case "carousel": return <Carousel className="mx-auto w-full max-w-sm"><CarouselContent>{["First", "Second", "Third"].map((label, index) => <CarouselItem key={label}><div className="grid aspect-[4/3] place-items-center rounded-lg border bg-muted/40"><span className="text-2xl font-medium">{index + 1}</span><span className="sr-only">{label} slide</span></div></CarouselItem>)}</CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>;
    case "chart": return <div className="w-full"><ChartGallery /></div>;
    case "checkbox": return <div className="grid gap-3"><div className="flex items-center gap-2"><Checkbox id="terms" defaultChecked /><Label htmlFor="terms">Accept the workspace terms</Label></div><div className="flex items-center gap-2"><Checkbox id="archive" disabled /><Label htmlFor="archive">Archive after completion</Label></div></div>;
    case "collapsible": return <Collapsible className="w-full max-w-md"><div className="flex items-center justify-between"><div><p className="font-medium">Advanced settings</p><p className="text-sm text-muted-foreground">Three optional controls</p></div><CollapsibleTrigger asChild><Button variant="ghost" size="icon" aria-label="Toggle advanced settings"><ChevronDownIcon /></Button></CollapsibleTrigger></div><CollapsibleContent className="mt-3 rounded-lg border p-4 text-sm">Timeout is 45 seconds. Retries are disabled.</CollapsibleContent></Collapsible>;
    case "combobox": return <ComboboxDemo />;
    case "command": return <Command className="w-full max-w-md rounded-lg border"><CommandInput placeholder="Search actions" /><CommandList><CommandEmpty>No action found.</CommandEmpty><CommandGroup heading="Workspace"><CommandItem><SearchIcon />Search files<CommandShortcut>⌘ K</CommandShortcut></CommandItem><CommandItem><SettingsIcon />Open settings<CommandShortcut>⌘ ,</CommandShortcut></CommandItem></CommandGroup></CommandList></Command>;
    case "context-menu": return <ContextMenu><ContextMenuTrigger className="grid h-36 w-full max-w-md place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">Use a secondary click here</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Open</ContextMenuItem><ContextMenuItem>Duplicate</ContextMenuItem><ContextMenuSeparator /><ContextMenuItem variant="destructive">Remove</ContextMenuItem></ContextMenuContent></ContextMenu>;
    case "data-table": return <div className="w-full"><div className="mb-3 flex justify-end"><Button variant="outline" size="sm">Columns <ChevronDownIcon /></Button></div><DataRows /></div>;
    case "date-picker": return <DatePickerDemo />;
    case "device": return <DeviceExample />;
    case "dialog": return <Dialog><DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Update the name shown to workspace members.</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="display-name">Display name</FieldLabel><Input id="display-name" defaultValue="Mara Ortega" /></Field><DialogFooter><DialogClose asChild><Button>Save</Button></DialogClose></DialogFooter></DialogContent></Dialog>;
    case "direction": return <DirectionProvider dir="rtl"><div dir="rtl" className="w-full max-w-md rounded-lg border p-5 text-right"><p className="font-medium">إعدادات مساحة العمل</p><p className="mt-2 text-sm text-muted-foreground">يطبق المزود اتجاه القراءة على المكونات التابعة.</p><Button variant="outline" className="mt-4">حفظ</Button></div></DirectionProvider>;
    case "drawer": return <Drawer><DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Choose a workspace</DrawerTitle><DrawerDescription>Switch context without leaving the current page.</DrawerDescription></DrawerHeader><div className="grid gap-2 px-4"><Button variant="outline">Aperture Labs</Button><Button variant="outline">Pine Research</Button></div><DrawerFooter><DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose></DrawerFooter></DrawerContent></Drawer>;
    case "dropdown-menu": return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Workspace <ChevronDownIcon /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem>Open settings</DropdownMenuItem><DropdownMenuItem>Duplicate workspace</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem variant="destructive">Remove</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
    case "empty": return <Empty className="w-full max-w-lg border"><EmptyHeader><EmptyMedia variant="icon"><SearchIcon /></EmptyMedia><EmptyTitle>No saved searches</EmptyTitle><EmptyDescription>Save a query to run it again from this page.</EmptyDescription></EmptyHeader><EmptyContent><Button>Save this search</Button></EmptyContent></Empty>;
    case "field": return <FieldDemo />;
    case "hover-card": return <HoverCard><HoverCardTrigger asChild><Button variant="link">Mara Ortega</Button></HoverCardTrigger><HoverCardContent><div className="flex gap-3"><Avatar><AvatarFallback>MO</AvatarFallback></Avatar><div><p className="font-medium">Mara Ortega</p><p className="text-sm text-muted-foreground">Design systems, Madrid</p></div></div></HoverCardContent></HoverCard>;
    case "input": return <div className="grid w-full max-w-sm gap-2"><Label htmlFor="workspace-name">Workspace name</Label><Input id="workspace-name" placeholder="Pine Research" /><p className="text-sm text-muted-foreground">Use a name your team will recognize.</p></div>;
    case "input-group": return <InputGroup className="w-full max-w-md"><InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon><InputGroupInput aria-label="Project domain" placeholder="project.example.com" /><InputGroupAddon align="inline-end"><InputGroupButton onClick={() => toast.success("Domain checked")}>Check</InputGroupButton></InputGroupAddon></InputGroup>;
    case "input-otp": return <div className="grid gap-3"><Label>Verification code</Label><InputOTP maxLength={6} aria-label="Verification code"><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup><InputOTPSeparator /><InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP></div>;
    case "item": return <ItemGroup className="w-full max-w-lg"><Item variant="outline"><ItemMedia variant="icon"><FileTextIcon /></ItemMedia><ItemContent><ItemTitle>Research brief</ItemTitle><ItemDescription>Updated twelve minutes ago by Inez Romero.</ItemDescription></ItemContent><ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions></Item><Item variant="muted"><ItemMedia variant="icon"><CheckIcon /></ItemMedia><ItemContent><ItemTitle>Review passed</ItemTitle><ItemDescription>All focused checks completed.</ItemDescription></ItemContent></Item></ItemGroup>;
    case "kbd": return <div className="flex items-center gap-3 text-sm"><KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup><span>Open command menu</span></div>;
    case "label": return <div className="grid w-full max-w-sm gap-2"><Label htmlFor="project-slug">Project slug</Label><Input id="project-slug" defaultValue="research-notes" /></div>;
    case "marker": return <div className="grid w-full max-w-md gap-5"><Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker><Marker variant="border"><MarkerIcon><CheckIcon /></MarkerIcon><MarkerContent>Three focused checks passed</MarkerContent></Marker></div>;
    case "menubar": return <Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New workspace</MenubarItem><MenubarItem>Open</MenubarItem><MenubarSeparator /><MenubarItem>Export</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>View</MenubarTrigger><MenubarContent><MenubarItem>Compact density</MenubarItem><MenubarItem>Comfortable density</MenubarItem></MenubarContent></MenubarMenu></Menubar>;
    case "message": return <MessageGroup className="w-full max-w-lg"><Message><MessageAvatar><Avatar><AvatarFallback>IR</AvatarFallback></Avatar></MessageAvatar><MessageContent><MessageHeader>Inez, 09:42</MessageHeader><Bubble variant="outline"><BubbleContent>The navigation review is ready.</BubbleContent></Bubble><MessageFooter>Delivered</MessageFooter></MessageContent></Message><Message align="end"><MessageContent><Bubble variant="secondary"><BubbleContent>I will read it now.</BubbleContent></Bubble><MessageFooter>Read</MessageFooter></MessageContent></Message></MessageGroup>;
    case "message-scroller": return <MessageScrollerDemo />;
    case "native-select": return <div className="grid w-full max-w-xs gap-2"><Label htmlFor="native-theme">Theme</Label><NativeSelect id="native-theme" defaultValue="system" className="w-full"><NativeSelectOptGroup label="Appearance"><NativeSelectOption value="light">Light</NativeSelectOption><NativeSelectOption value="dark">Dark</NativeSelectOption><NativeSelectOption value="system">System</NativeSelectOption></NativeSelectOptGroup></NativeSelect></div>;
    case "navigation-menu": return <NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger>Products</NavigationMenuTrigger><NavigationMenuContent><div className="grid w-80 gap-2 p-3"><NavigationMenuLink asChild><Link href="/components" className="rounded-md p-3 hover:bg-muted"><span className="font-medium">Components</span><span className="mt-1 block text-sm text-muted-foreground">Editable interface source.</span></Link></NavigationMenuLink><NavigationMenuLink asChild><Link href="/charts" className="rounded-md p-3 hover:bg-muted"><span className="font-medium">Charts</span><span className="mt-1 block text-sm text-muted-foreground">Responsive Recharts examples.</span></Link></NavigationMenuLink></div></NavigationMenuContent></NavigationMenuItem><NavigationMenuItem><NavigationMenuLink asChild><Link href="/themes" className="px-3 py-2">Themes</Link></NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu>;
    case "pagination": return <Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" onClick={(event) => { event.preventDefault(); setPage(Math.max(1, page - 1)); }} /></PaginationItem>{[1, 2, 3].map((number) => <PaginationItem key={number}><PaginationLink href="#" isActive={page === number} onClick={(event) => { event.preventDefault(); setPage(number); }}>{number}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationEllipsis /></PaginationItem><PaginationItem><PaginationNext href="#" onClick={(event) => { event.preventDefault(); setPage(Math.min(3, page + 1)); }} /></PaginationItem></PaginationContent></Pagination>;
    case "popover": return <Popover><PopoverTrigger asChild><Button variant="outline">View details</Button></PopoverTrigger><PopoverContent><PopoverHeader><PopoverTitle>Build complete</PopoverTitle><PopoverDescription>The registry contains every documented component.</PopoverDescription></PopoverHeader></PopoverContent></Popover>;
    case "progress": return <div className="w-full max-w-md"><div className="mb-2 flex justify-between text-sm"><span>Registry build</span><span className="tabular-nums">73%</span></div><Progress value={73} aria-label="Registry build progress" /></div>;
    case "questionnaire": return <Questionnaire items={questionnaireItems} defaultItem="priority" onSubmit={(event) => { event.preventDefault(); toast.success("Answer saved"); }} className="w-full max-w-lg"><QuestionnaireProgress /><QuestionnaireItem name="priority" required><QuestionnaireTitle>What matters most in this interface?</QuestionnaireTitle><QuestionnaireDescription>Choose one answer to continue.</QuestionnaireDescription><QuestionnaireChoices><QuestionnaireChoice value="clarity">Clear hierarchy</QuestionnaireChoice><QuestionnaireChoice value="speed">Fast interaction</QuestionnaireChoice><QuestionnaireChoice value="control">Fine control</QuestionnaireChoice></QuestionnaireChoices><QuestionnaireError /></QuestionnaireItem><QuestionnaireActions><QuestionnairePrevious /><QuestionnaireNext>Next</QuestionnaireNext><QuestionnaireSubmit>Save answer</QuestionnaireSubmit></QuestionnaireActions></Questionnaire>;
    case "radio-group": return <RadioGroup defaultValue="comfortable" className="grid gap-3"><div className="flex items-center gap-2"><RadioGroupItem value="compact" id="compact" /><Label htmlFor="compact">Compact</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="comfortable" id="comfortable" /><Label htmlFor="comfortable">Comfortable</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="spacious" id="spacious" /><Label htmlFor="spacious">Spacious</Label></div></RadioGroup>;
    case "resizable": return <ResizablePanelGroup orientation="horizontal" className="min-h-48 w-full rounded-lg border"><ResizablePanel defaultSize="38%"><div className="grid h-full place-items-center text-sm">Navigation</div></ResizablePanel><ResizableHandle withHandle /><ResizablePanel><div className="grid h-full place-items-center text-sm">Workspace</div></ResizablePanel></ResizablePanelGroup>;
    case "scroll-area": return <ScrollArea className="h-52 w-full max-w-sm rounded-lg border"><div className="p-4"><p className="mb-3 font-medium">Recent activity</p>{Array.from({ length: 12 }, (_, index) => <div key={index} className="border-t py-3 text-sm">Run {index + 1} completed</div>)}</div></ScrollArea>;
    case "select": return <div className="grid w-full max-w-xs gap-2"><Label htmlFor="custom-theme">Theme</Label><Select defaultValue="system"><SelectTrigger id="custom-theme" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Appearance</SelectLabel><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="system">System</SelectItem></SelectGroup></SelectContent></Select></div>;
    case "separator": return <div className="w-full max-w-md"><div className="flex h-5 items-center gap-4 text-sm"><span>Components</span><Separator orientation="vertical" /><span>Charts</span><Separator orientation="vertical" /><span>Themes</span></div><Separator className="my-5" /><p className="text-sm text-muted-foreground">Horizontal separators divide stacked sections.</p></div>;
    case "sheet": return <Sheet><SheetTrigger asChild><Button variant="outline">Open settings</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Workspace settings</SheetTitle><SheetDescription>Changes apply when you save.</SheetDescription></SheetHeader><div className="grid gap-2 p-4"><Label htmlFor="sheet-name">Name</Label><Input id="sheet-name" defaultValue="Aperture Labs" /></div><SheetFooter><SheetClose asChild><Button>Save changes</Button></SheetClose></SheetFooter></SheetContent></Sheet>;
    case "sidebar": return <SidebarProvider className="min-h-64 overflow-hidden rounded-lg border" style={{ "--sidebar-width": "13rem" } as React.CSSProperties}><Sidebar collapsible="none"><SidebarHeader><Input placeholder="Search" /></SidebarHeader><SidebarContent><SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{["Overview", "Components", "Charts"].map((item, index) => <SidebarMenuItem key={item}><SidebarMenuButton isActive={index === 1}><span>{item}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar><main className="grid flex-1 place-items-center text-sm text-muted-foreground">Page content</main></SidebarProvider>;
    case "skeleton": return <div className="flex w-full max-w-md items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/5" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-4/5" /></div></div>;
    case "slider": return <div className="grid w-full max-w-md gap-3"><div className="flex justify-between text-sm"><Label>Density</Label><span className="text-muted-foreground">Comfortable</span></div><Slider defaultValue={[42]} max={100} step={1} aria-label="Interface density" /></div>;
    case "spinner": return <div className="flex items-center gap-3"><Spinner /><span className="text-sm">Checking registry files</span><Button disabled><Spinner />Saving</Button></div>;
    case "switch": return <div className="flex w-full max-w-sm items-center justify-between rounded-lg border p-4"><div><Label htmlFor="notifications">Status notifications</Label><p className="mt-1 text-sm text-muted-foreground">Notify me when a run needs attention.</p></div><Switch id="notifications" defaultChecked /></div>;
    case "table": return <div className="w-full"><Table><TableCaption>Workspace activity for September.</TableCaption><TableHeader><TableRow><TableHead>Workspace</TableHead><TableHead>Owner</TableHead><TableHead className="text-right">Runs</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Aperture</TableCell><TableCell>Mara Ortega</TableCell><TableCell className="text-right">184</TableCell></TableRow><TableRow><TableCell>Pine Research</TableCell><TableCell>Inez Romero</TableCell><TableCell className="text-right">73</TableCell></TableRow></TableBody></Table></div>;
    case "tabs": return <Tabs defaultValue="overview" className="w-full max-w-lg"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="members">Members</TabsTrigger></TabsList><TabsContent value="overview" className="rounded-lg border p-4 text-sm">A current summary of this workspace.</TabsContent><TabsContent value="activity" className="rounded-lg border p-4 text-sm">Eight completed runs this week.</TabsContent><TabsContent value="members" className="rounded-lg border p-4 text-sm">Four people have access.</TabsContent></Tabs>;
    case "textarea": return <div className="grid w-full max-w-md gap-2"><Label htmlFor="review-note">Review note</Label><Textarea id="review-note" placeholder="Write a clear note for the next reviewer." /><p className="text-sm text-muted-foreground">Markdown is supported.</p></div>;
    case "toast": return <div className="flex flex-wrap gap-2"><Button onClick={() => toast.success("Theme saved", { description: "The preview now uses your changes." })}>Success toast</Button><Button variant="outline" onClick={() => toast.error("Build failed", { description: "One registry file needs attention." })}>Error toast</Button></div>;
    case "toggle": return <div className="flex gap-2"><Toggle aria-label="Toggle favorite"><StarIcon />Favorite</Toggle><Toggle variant="outline" aria-label="Toggle compact view">Compact</Toggle></div>;
    case "toggle-group": return <ToggleGroup type="single" defaultValue="week" variant="outline"><ToggleGroupItem value="day">Day</ToggleGroupItem><ToggleGroupItem value="week">Week</ToggleGroupItem><ToggleGroupItem value="month">Month</ToggleGroupItem></ToggleGroup>;
    case "tooltip": return <TooltipProvider><Tooltip><TooltipTrigger asChild><Button size="icon" variant="outline" aria-label="More options"><MoreHorizontalIcon /></Button></TooltipTrigger><TooltipContent>More options</TooltipContent></Tooltip></TooltipProvider>;
    case "typography": return <article className="w-full max-w-2xl"><p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Release note</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">A smaller, clearer component library</h2><p className="mt-4 leading-7 text-muted-foreground">Every example installs as editable source. Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">bunx shadcn add</code> to copy one into your project.</p><blockquote className="mt-5 border-l-2 pl-4 text-sm italic">Good defaults should remain easy to replace.</blockquote></article>;
    default: return <p role="alert">This component example is unavailable.</p>;
  }
}
