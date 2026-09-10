"use client";

import { addEdge, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import type { Connection as FlowConnection, Edge as FlowEdge, Node as FlowNode, NodeProps as FlowNodeProps } from "@xyflow/react";
import { MousePointer2Icon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useCallback } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import { Node, NodeContent, NodeDescription, NodeFooter, NodeHeader, NodeTitle } from "@/components/ai-elements/node";
import { Panel } from "@/components/ai-elements/panel";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";

type WorkflowData = { title: string; description: string; detail: string; status: string };
type WorkflowFocus = "canvas" | "connection" | "controls" | "edge" | "node" | "panel" | "toolbar";

function WorkflowNode({ data, selected }: FlowNodeProps) {
  const item = data as WorkflowData;
  const { updateNodeData } = useReactFlow();
  return (
    <Node handles={{ source: true, target: true }} className={selected ? "ring-2 ring-ring" : undefined}>
      <NodeHeader><NodeTitle>{item.title}</NodeTitle><NodeDescription>{item.description}</NodeDescription></NodeHeader>
      <NodeContent><p className="text-xs leading-relaxed">{item.detail}</p></NodeContent>
      <NodeFooter><span className="font-mono text-[10px] text-muted-foreground">{item.status}</span><Toolbar isVisible={selected}><Button size="icon-sm" variant="ghost" aria-label="Run node" onClick={() => updateNodeData(item.title, { status: "Complete in 1.4 s" })}><PlayIcon /></Button><Button size="icon-sm" variant="ghost" aria-label="Reset node" onClick={() => updateNodeData(item.title, { status: "Waiting" })}><RotateCcwIcon /></Button></Toolbar></NodeFooter>
    </Node>
  );
}

const nodeTypes = { workflow: WorkflowNode };
const edgeTypes = { animated: Edge.Animated, temporary: Edge.Temporary };

export function WorkflowScene({ focus }: { focus: WorkflowFocus }) {
  const [nodes, , onNodesChange] = useNodesState<FlowNode>([
    { id: "Read request", type: "workflow", position: { x: 0, y: 70 }, selected: focus === "node" || focus === "toolbar", data: { title: "Read request", description: "Input", detail: "Collect the brief and approved source files.", status: "Complete in 0.8 s" } },
    { id: "Review evidence", type: "workflow", position: { x: 430, y: 70 }, selected: false, data: { title: "Review evidence", description: "Agent", detail: "Compare source claims before writing the answer.", status: "Running" } },
    { id: "Draft answer", type: "workflow", position: { x: 860, y: 70 }, selected: false, data: { title: "Draft answer", description: "Output", detail: "Return a concise response with citations.", status: "Waiting" } },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([
    { id: "request-review", source: "Read request", target: "Review evidence", type: focus === "edge" ? "temporary" : "animated" },
    { id: "review-answer", source: "Review evidence", target: "Draft answer", type: "animated" },
  ]);
  const onConnect = useCallback((connection: FlowConnection) => setEdges((current) => addEdge({ ...connection, type: "animated" }, current)), [setEdges]);
  return (
    <div className="h-[430px] w-full overflow-hidden rounded-md border bg-background">
      <Canvas nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} connectionLineComponent={Connection} onConnect={onConnect} onEdgesChange={onEdgesChange} onNodesChange={onNodesChange} fitView>
        <Controls />
        <Panel position="top-left"><div className="flex items-center gap-2 px-2 py-1 text-xs"><MousePointer2Icon className="size-3.5" /><span>{focus === "connection" ? "Drag a node handle to connect" : `${focus.charAt(0).toUpperCase()}${focus.slice(1)} preview`}</span></div></Panel>
      </Canvas>
    </div>
  );
}
