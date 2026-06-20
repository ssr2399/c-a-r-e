import { useAppSettings } from "../../contexts/AppSettingsContext";
import { Clock, Route, Leaf, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ActionCountdown() {
  const { settings } = useAppSettings();

  return (
    <section 
      aria-labelledby="action-countdown-title"
      className={cn(
      "flex flex-col h-full p-8 shadow-xl",
      settings.accessibilityMode ? "bg-amber-100 border-4 border-black rounded-[2.5rem]" : "bg-[#FFFBEB] rounded-[2.5rem] border-4 border-amber-400"
    )}>
      <h2 id="action-countdown-title" className={cn("mb-6", 
        settings.accessibilityMode ? "text-2xl font-bold text-black" : "text-xl font-black uppercase tracking-tight text-amber-700"
      )}>
        Next Action
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {!settings.neurodivergentMode && (
          <div aria-hidden="true" className={cn("flex items-center justify-center mb-4 text-4xl", 
            settings.accessibilityMode ? "w-24 h-24 bg-white border-4 border-black rounded-full" : "w-24 h-24 bg-amber-400 rounded-full shadow-inner"
          )}>
            🚶
          </div>
        )}
        
        <h3 className={cn(
          "leading-tight mb-4",
          settings.accessibilityMode ? "font-bold text-3xl text-black" : "text-3xl font-black text-amber-900"
        )}>
          Walk 1 km instead of driving
        </h3>
        
        <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Action impact">
          <span className={cn("px-4 py-2 rounded-2xl font-bold", 
            settings.accessibilityMode ? "bg-white border-2 border-black text-black text-lg" : "bg-white text-amber-600 shadow-sm"
          )}>
            {settings.simplifiedMode ? "-10 charges" : "-250g CO₂"}
          </span>
          <span className={cn("px-4 py-2 rounded-2xl font-bold",
            settings.accessibilityMode ? "bg-white border-2 border-black text-black text-lg" : "bg-white text-amber-600 shadow-sm"
          )}>
             12 Minutes
          </span>
        </div>
      </div>

      <button 
        aria-label="Commit to this eco action"
        className={cn(
        "w-full py-4 rounded-2xl mt-4 transition-transform shadow-lg",
        settings.accessibilityMode 
          ? "bg-black text-white text-xl font-bold border-4 border-black hover:bg-slate-800" 
          : "bg-amber-500 hover:bg-amber-600 text-white font-black text-xl hover:scale-[1.02] active:scale-95",
        settings.neurodivergentMode && "hover:scale-100 transition-none"
      )}>
        I'M DOING THIS!
      </button>
    </section>
  );
}
