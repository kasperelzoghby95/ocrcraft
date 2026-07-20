'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Workflow,
  Merge,
  Scissors,
  Minimize2,
  RotateCw,
  GripVertical,
  Plus,
  Trash2,
  Play,
  Save,
  Loader2,
  CheckCircle2,
  ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type StepType = 'merge' | 'split' | 'compress' | 'rotate';

interface WorkflowStep {
  id: string;
  type: StepType;
  label: string;
  params: Record<string, string>;
}

const stepTypes: { type: StepType; label: string; icon: typeof Merge; color: string }[] = [
  { type: 'merge', label: 'Merge', icon: Merge, color: 'text-blue-500 bg-blue-500/10' },
  { type: 'split', label: 'Split', icon: Scissors, color: 'text-purple-500 bg-purple-500/10' },
  { type: 'compress', label: 'Compress', icon: Minimize2, color: 'text-green-500 bg-green-500/10' },
  { type: 'rotate', label: 'Rotate', icon: RotateCw, color: 'text-orange-500 bg-orange-500/10' },
];

function getStepInfo(type: StepType) {
  return stepTypes.find((s) => s.type === type)!;
}

function SortableStep({
  step,
  index,
  onDelete,
  onUpdateParams,
}: {
  step: WorkflowStep;
  index: number;
  onDelete: () => void;
  onUpdateParams: (params: Record<string, string>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const info = getStepInfo(step.type);
  const Icon = info.icon;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className={clsx('rounded-lg p-2 shrink-0', info.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Step {index + 1}</span>
            <span className="font-medium text-sm">{info.label}</span>
          </div>
          {step.type === 'split' && (
            <input
              type="text"
              value={step.params.ranges || ''}
              onChange={(e) => onUpdateParams({ ...step.params, ranges: e.target.value })}
              placeholder="Page ranges: 1-3,5,7-9"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}
          {step.type === 'rotate' && (
            <div className="flex gap-2">
              <input
                type="number"
                value={step.params.pageIndex || '0'}
                onChange={(e) => onUpdateParams({ ...step.params, pageIndex: e.target.value })}
                placeholder="Page #"
                className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <select
                value={step.params.degrees || '90'}
                onChange={(e) => onUpdateParams({ ...step.params, degrees: e.target.value })}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="90">90° CW</option>
                <option value="180">180°</option>
                <option value="270">90° CCW</option>
              </select>
            </div>
          )}
          {(step.type === 'merge' || step.type === 'compress') && (
            <p className="text-xs text-muted-foreground">
              {step.type === 'merge' ? 'Combines all input files' : 'Reduces file size'}
            </p>
          )}
        </div>
        <button
          onClick={onDelete}
          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {index < 0 && (
        <div className="absolute left-12 -bottom-3 z-10">
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function WorkflowEditorPage() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [workflowTitle, setWorkflowTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addStep = (type: StepType) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      label: getStepInfo(type).label,
      params: {},
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const deleteStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStepParams = (id: string, params: Record<string, string>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, params } : s)));
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSteps((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleSave = async () => {
    if (!workflowTitle.trim() || steps.length === 0) return;
    setSaving(true);
    try {
      await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: workflowTitle,
          workflowData: JSON.stringify({ steps }),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-3">
            <Workflow className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Workflow Editor</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Chain multiple PDF operations into a reusable workflow. Drag to reorder steps.
        </p>

        {/* Add Step Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {stepTypes.map((st) => {
            const Icon = st.icon;
            return (
              <button
                key={st.type}
                onClick={() => addStep(st.type)}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80',
                  st.color
                )}
              >
                <Plus className="h-4 w-4" />
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Steps Canvas */}
        {steps.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-16 text-center">
            <Workflow className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No steps yet. Click a button above to add your first workflow step.
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <SortableStep
                    key={step.id}
                    step={step}
                    index={index}
                    onDelete={() => deleteStep(step.id)}
                    onUpdateParams={(params) => updateStepParams(step.id, params)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Save Workflow */}
        {steps.length > 0 && (
          <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              placeholder="Workflow title..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            <button
              onClick={handleSave}
              disabled={saving || !workflowTitle.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:bg-pink-600 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Workflow
                </>
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : ''}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
