"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  useReactFlow,
  Panel,
  Connection,
  Edge,
  Node,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BaseHandle } from "@/components/base-handle";
import {
  GripVertical,
  X,
  Save,
  Play,
  MapPin,
  Settings2,
  Zap,
  LayoutGrid,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Location {
  id: number;
  name: string;
  code: string;
  flag: string;
  region: string;
  is_active: boolean;
}

type NodeData = {
  location: Location;
  method: string;
  timeout: number;
  interval: number;
  expectedCodes: string;
  expanded: boolean;
  status: "idle" | "running" | "success" | "error";
  latency?: number;
  statusCode?: number;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
};

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];
const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-800 border-emerald-200",
  POST: "bg-blue-100 text-blue-800 border-blue-200",
  PUT: "bg-amber-100 text-amber-800 border-amber-200",
  PATCH: "bg-purple-100 text-purple-800 border-purple-200",
  DELETE: "bg-rose-100 text-rose-800 border-rose-200",
  HEAD: "bg-slate-100 text-slate-700 border-slate-200",
};

// ─── CUSTOM NODE: LocationNode ───────────────────────────────────────────────
const LocationNode = ({ id, data }: NodeProps<Node<NodeData>>) => {
  const methodColor = METHOD_COLORS[data.method] || "bg-gray-100 text-gray-700 border-gray-200";
  
  const statusStyles = {
    idle: "border-gray-200",
    running: "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse",
    success: "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    error: "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
  };

  return (
    <div className={`w-[220px] bg-white border-2 rounded-xl shadow-lg transition-all duration-300 relative ${statusStyles[data.status]}`}>
      {/* Target handle (left side) */}
      <BaseHandle
        type="target"
        position={Position.Left}
        className="w-4 h-4 -left-2 bg-violet-600 border-2 border-white shadow-sm z-50 cursor-crosshair"
      />

      {/* Header */}
      <div className="bg-slate-50 border-b border-gray-100 px-3 py-2 flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2 overflow-hidden">
          <GripVertical className="h-4 w-4 text-gray-300 drag-handle cursor-grab shrink-0" />
          <span className="text-sm shrink-0">{data.location.flag}</span>
          <span className="text-[11px] font-bold text-slate-700 truncate">
            {data.location.name}
          </span>
        </div>
        <button
          onClick={() => data.onRemove(id)}
          className="text-gray-400 hover:text-rose-500 transition-colors shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Method</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${methodColor}`}>
            {data.method}
          </span>
        </div>
        
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <span className="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Timeout</span>
            <span className="text-[11px] font-mono text-slate-600">{data.timeout}s</span>
          </div>
          <div className="flex-1 text-right">
            <span className="block text-[9px] text-gray-400 font-bold uppercase mb-0.5">Interval</span>
            <span className="text-[11px] font-mono text-slate-600">{data.interval}s</span>
          </div>
        </div>

        {data.status !== "idle" && (
          <div className="mb-3 p-2 bg-slate-50 rounded-lg border border-gray-100 flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div>
              <span className="block text-[8px] text-gray-400 font-bold uppercase">Latency</span>
              <span className={`text-[11px] font-mono font-bold ${data.status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {data.latency ? `${data.latency}ms` : '--'}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] text-gray-400 font-bold uppercase">Status</span>
              <span className={`text-[11px] font-mono font-bold ${data.status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {data.statusCode || '--'}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => data.onToggle(id)}
          className="w-full flex items-center justify-center gap-1.5 text-[10px] text-violet-600 font-bold py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors border border-violet-100"
        >
          <Settings2 className="h-3 w-3" />
          {data.expanded ? "Đóng cài đặt" : "Cài đặt chi tiết"}
        </button>
      </div>

      {/* Expanded Settings */}
      {data.expanded && (
        <div className="px-3 pb-4 space-y-3 bg-slate-50/50 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="pt-3">
            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Phương thức HTTP</label>
            <div className="flex flex-wrap gap-1">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => data.onUpdate(id, "method", m)}
                  className={`text-[9px] font-bold px-2 py-1 rounded border transition-all ${
                    data.method === m 
                      ? "bg-violet-600 text-white border-violet-600 shadow-sm" 
                      : "bg-white text-gray-500 border-gray-200 hover:border-violet-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Timeout (s)</label>
              <input
                type="number"
                min={1}
                value={data.timeout}
                onChange={(e) => data.onUpdate(id, "timeout", Number(e.target.value))}
                className="w-full h-8 bg-white border border-gray-200 rounded-md px-2 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 font-mono nodrag"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Cần lọc (s)</label>
              <input
                type="number"
                min={5}
                value={data.interval}
                onChange={(e) => data.onUpdate(id, "interval", Number(e.target.value))}
                className="w-full h-8 bg-white border border-gray-200 rounded-md px-2 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 font-mono nodrag"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Mã phản hồi mong đợi</label>
            <input
              placeholder="Ví dụ: 200, 201, 204"
              value={data.expectedCodes}
              onChange={(e) => data.onUpdate(id, "expectedCodes", e.target.value)}
              className="w-full h-8 bg-white border border-gray-200 rounded-md px-2 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-slate-700 font-mono nodrag"
            />
          </div>
        </div>
      )}

      {/* Source handle (right side) */}
      <BaseHandle
        type="source"
        position={Position.Right}
        className="w-4 h-4 -right-2 bg-violet-600 border-2 border-white shadow-sm z-50 cursor-crosshair"
      />
    </div>
  );
};

const nodeTypes = {
  locationNode: LocationNode,
};

// ─── CANVAS COMPONENT ────────────────────────────────────────────────────────
function WorkflowFlow({ monitorId }: { monitorId?: string | string[] }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const storageSuffix = monitorId ? `_${monitorId}` : "_global";

  // 1. Fetch Locations
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/api/locations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setLocations(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // 2. Load LocalStorage
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem(`workflow_nodes${storageSuffix}`);
      const savedEdges = localStorage.getItem(`workflow_edges${storageSuffix}`);
      if (savedNodes) setNodes(JSON.parse(savedNodes));
      if (savedEdges) setEdges(JSON.parse(savedEdges));
    } catch (e) {
      console.error("Failed to load workflow state", e);
    }
  }, [storageSuffix, setNodes, setEdges]);

  // 3. Handlers
  const onUpdateNode = useCallback((id: string, field: string, value: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, [field]: value } };
        }
        return n;
      })
    );
  }, [setNodes]);

  const onRemoveNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  const onToggleNode = useCallback((id: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, expanded: !n.data.expanded } };
        }
        return n;
      })
    );
  }, [setNodes]);

  // Inyectamos handlers frescos en la data de cada nodo
  const nodesWithHandlers = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      status: n.data.status || "idle",
      onUpdate: onUpdateNode,
      onRemove: onRemoveNode,
      onToggle: onToggleNode,
    },
  }));

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'default' }, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, location: Location) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(location));
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const location = JSON.parse(data) as Location;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<NodeData> = {
        id: `node_${Date.now()}`,
        type: "locationNode",
        position,
        dragHandle: ".drag-handle",
        data: {
          location,
          method: "GET",
          timeout: 30,
          interval: 60,
          expectedCodes: "200-299",
          expanded: false,
          status: "idle",
          onUpdate: onUpdateNode,
          onRemove: onRemoveNode,
          onToggle: onToggleNode,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, onUpdateNode, onRemoveNode, onToggleNode, setNodes]
  );

  const saveWorkflow = () => {
    // Lưu tạm thời vào localStorage (sau này có thể thay bằng API)
    // Loại bỏ các handler functions trước khi lưu JSON
    const nodesToSave = nodes.map(n => {
      const { onUpdate, onRemove, onToggle, ...restData } = n.data;
      return { ...n, data: restData };
    });
    localStorage.setItem(`workflow_nodes${storageSuffix}`, JSON.stringify(nodesToSave));
    localStorage.setItem(`workflow_edges${storageSuffix}`, JSON.stringify(edges));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const runWorkflow = async () => {
    if (isRunning || nodes.length === 0) return;
    setIsRunning(true);
    
    // Reset all nodes to idle
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle', latency: undefined, statusCode: undefined } })));

    // Find starting nodes (no incoming edges)
    const targetIds = edges.map(e => e.target);
    const startNodes = nodes.filter(n => !targetIds.includes(n.id));
    
    // If all have incoming, just pick the first one
    const startNode = startNodes.length > 0 ? startNodes[0] : nodes[0];
    
    let currentNodeId = startNode.id;
    const visited = new Set();

    while (currentNodeId && !visited.has(currentNodeId)) {
      visited.add(currentNodeId);
      
      // Mark running
      setNodes(nds => nds.map(n => n.id === currentNodeId ? { ...n, data: { ...n.data, status: 'running' } } : n));
      
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
      
      // Simulate Result
      const isSuccess = Math.random() > 0.1;
      const latency = Math.floor(100 + Math.random() * 400);
      const statusCode = isSuccess ? 200 : 500;
      
      setNodes(nds => nds.map(n => n.id === currentNodeId ? { 
        ...n, 
        data: { 
          ...n.data, 
          status: isSuccess ? 'success' : 'error',
          latency,
          statusCode
        } 
      } : n));

      if (!isSuccess) break; // Stop sequence on error

      // Find next node via edges
      const nextEdge = edges.find(e => e.source === currentNodeId);
      currentNodeId = nextEdge ? nextEdge.target : "";
      
      if (currentNodeId) await new Promise(r => setTimeout(r, 500)); // Gap between nodes
    }

    setIsRunning(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const grouped = locations.reduce<Record<string, Location[]>>((acc, loc) => {
    if (!acc[loc.region]) acc[loc.region] = [];
    acc[loc.region].push(loc);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[650px]">
      {/* Header Panel */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg tracking-tight">Quy trình kiểm tra (Workflows)</h2>
            <p className="text-xs text-slate-400 font-medium">Kéo thả địa điểm để tạo kịch bản giám sát tự động</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={runWorkflow}
            disabled={isRunning || nodes.length === 0}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
              isRunning 
                ? "bg-violet-100 text-violet-400 border-violet-100 cursor-not-allowed" 
                : "text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-100 shadow-sm shadow-violet-100/50"
            }`}
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                Đang chạy...
              </div>
            ) : (
              <><Play className="h-4 w-4" /> Chạy thử ngay</>
            )}
          </button>
          <button 
            onClick={saveWorkflow}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-lg ${
              saved 
              ? "bg-emerald-500 text-white shadow-emerald-200" 
              : "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800"
            }`}
          >
            <Save className="h-4 w-4" /> {saved ? "Đã lưu thành công!" : "Lưu quy trình"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Assets Sidebar */}
        <div className="w-64 border-r border-gray-100 bg-slate-50/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh sách địa điểm</span>
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(grouped).map(([region, items]) => (
              <div key={region}>
                <h3 className="text-[10px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded inline-block mb-3 uppercase tracking-tighter transition-colors">
                  {region}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {items.map((loc) => (
                    <div
                      key={loc.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, loc)}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-violet-400 hover:shadow-md transition-all group select-none"
                    >
                      <GripVertical className="h-3.5 w-3.5 text-gray-300 group-hover:text-violet-500 transition-colors shrink-0" />
                      <span className="text-lg shrink-0">{loc.flag}</span>
                      <span className="text-[11px] font-bold text-slate-700 truncate">{loc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flow Canvas */}
        <div className="flex-1 relative bg-slate-50 group">
          <div className="absolute inset-0 z-0">
            <ReactFlow
              nodes={nodesWithHandlers}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50/50"
            >
              <Background gap={20} size={1} color="#cbd5e1" variant={"dots" as any} />
              <Controls position="bottom-right" className="bg-white border-gray-200 shadow-xl rounded-xl overflow-hidden mb-4 mr-4" />
              <MiniMap 
                position="bottom-left"
                className="bg-white border-gray-200 shadow-xl rounded-xl overflow-hidden mb-4 ml-4"
                nodeColor={(n) => '#8b5cf6'}
                maskColor="rgba(241, 245, 249, 0.7)"
              />
              
              {nodes.length === 0 && (
                <Panel position="top-center" className="pointer-events-none">
                  <div className="flex flex-col items-center gap-4 bg-white/80 p-10 rounded-[40px] border border-white backdrop-blur-md shadow-2xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full flex items-center justify-center animate-pulse">
                      <LayoutGrid className="h-10 w-10 text-violet-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 font-extrabold text-lg tracking-tight">Bảng thiết kế trống</p>
                      <p className="text-slate-400 text-sm font-medium mt-1">Kéo một địa điểm từ thanh bên trái và thả vào đây nhé!</p>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>

          {/* Floating Toast Notification */}
          {showToast && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
              <div className="bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <Zap className="h-3 w-3 text-white fill-white" />
                </div>
                <span className="text-sm font-bold tracking-tight">Tính năng Chạy thật đang được hoàn thiện! 🚀</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap with Provider
export default function WorkflowBuilder({ monitorId }: { monitorId?: string | string[] }) {
  return (
    <ReactFlowProvider>
      <WorkflowFlow monitorId={monitorId} />
    </ReactFlowProvider>
  );
}
