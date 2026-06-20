import { useAppSettings } from "../../contexts/AppSettingsContext";
import { Settings2, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useAppSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-lg rounded-2xl shadow-xl overflow-hidden",
        settings.accessibilityMode ? "bg-white border-4 border-black" : "bg-white"
      )}>
        <div className={cn(
          "px-6 py-4 flex items-center justify-between border-b",
          settings.accessibilityMode ? "border-black border-b-4" : "border-slate-100"
        )}>
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Accessibility Settings
          </h2>
          <button 
            onClick={onClose}
            className={cn("p-2 rounded-full", settings.accessibilityMode ? "hover:bg-slate-200" : "hover:bg-slate-100 text-slate-500")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <ToggleOption 
            title="Accessibility Mode"
            description="Increases text size, uses high-contrast borders and colors."
            checked={settings.accessibilityMode}
            onChange={(c) => updateSettings({ accessibilityMode: c })}
            isA11y={settings.accessibilityMode}
          />
          <ToggleOption 
            title="Simplified Mode"
            description="Uses simpler metrics (e.g. 'Phones charged' instead of 'kg CO2')."
            checked={settings.simplifiedMode}
            onChange={(c) => updateSettings({ simplifiedMode: c })}
            isA11y={settings.accessibilityMode}
          />
          <ToggleOption 
            title="Neurodivergent-Friendly"
            description="Reduces visual noise, hides complex charts, and minimizes animations."
            checked={settings.neurodivergentMode}
            onChange={(c) => updateSettings({ neurodivergentMode: c })}
            isA11y={settings.accessibilityMode}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleOption({ title, description, checked, onChange, isA11y }: { title: string, description: string, checked: boolean, onChange: (c:boolean)=>void, isA11y: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className={cn("font-bold text-lg", isA11y && "text-xl")}>{title}</div>
        <div className={cn("text-slate-500", isA11y && "text-black font-medium text-base")}>{description}</div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-14 h-8 shrink-0 rounded-full transition-colors",
          checked 
            ? (isA11y ? "bg-black border-2 border-black" : "bg-emerald-500") 
            : (isA11y ? "bg-white border-4 border-black" : "bg-slate-200"),
        )}
      >
        <div className={cn(
          "absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform",
          isA11y && !checked && "bg-black w-4 h-4 top-1 left-1",
          checked ? (isA11y ? "translate-x-6 border-2 border-black" : "translate-x-6 shadow-sm") : "translate-x-0"
        )} />
      </button>
    </div>
  );
}
