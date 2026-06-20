import { useMemo } from "react";
import { useAppSettings } from "../../contexts/AppSettingsContext";
import { ArrowDownRight, Footprints, Info } from "lucide-react";
import { cn } from "../../lib/utils";

export default function CarbonSnapshot() {
  const { settings } = useAppSettings();

  const snapshotData = useMemo(() => ({
    simplifiedValue: "500",
    simplifiedLabel: "phones charged",
    standardValue: "4.2",
    standardLabel: "kg CO₂",
    trendText: "15% vs last week",
    mostImpactful: "Commuted by Electric Metro"
  }), []);

  return (
    <section 
      aria-labelledby="carbon-snapshot-title"
      className={cn(
        "flex flex-col justify-between h-full p-8 shadow-xl",
        settings.accessibilityMode ? "bg-white border-4 border-black rounded-[2.5rem]" : "bg-white rounded-[2.5rem] border-4 border-emerald-500/10"
      )}
    >
      <div className="flex items-start justify-between">
        <h2 id="carbon-snapshot-title" className={cn("tracking-tight flex items-center gap-2", 
          settings.accessibilityMode ? "text-2xl font-bold text-black" : "text-xl font-black uppercase text-slate-500"
        )}>
          <span className="sr-only">Icon</span>
          <Footprints aria-hidden="true" className={cn(settings.accessibilityMode ? "w-8 h-8" : "w-5 h-5", "text-emerald-500")} />
          My Carbon Snapshot
        </h2>
        <div 
          role="status"
          className={cn(
            "px-4 py-1 font-bold rounded-full text-sm",
            settings.accessibilityMode ? "bg-black text-white border-2 border-black" : "bg-green-500 text-white"
          )}
        >
          <span aria-hidden="true">🟢 </span> EXCELLENT
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-end gap-4 mt-6 mb-8">
          {settings.simplifiedMode ? (
            <div className="flex items-end gap-4" aria-label={`Current usage is equivalent to ${snapshotData.simplifiedValue} ${snapshotData.simplifiedLabel}`}>
              <span className={cn("font-black", settings.accessibilityMode ? "text-7xl text-black" : "text-8xl text-emerald-600")}>
                {snapshotData.simplifiedValue}
              </span>
              <div className="pb-2 sm:pb-4">
                <p className={cn("font-bold", settings.accessibilityMode ? "text-3xl text-black" : "text-2xl")}>{snapshotData.simplifiedLabel}</p>
                <p className={cn("font-bold flex items-center gap-1", settings.accessibilityMode ? "text-xl text-black" : "text-emerald-500")} aria-label={`Down ${snapshotData.trendText}`}>
                  <ArrowDownRight aria-hidden="true" className="w-5 h-5" /> {snapshotData.trendText}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-4" aria-label={`Current usage is ${snapshotData.standardValue} ${snapshotData.standardLabel}`}>
              <span className={cn("font-black shrink-0 leading-none", settings.accessibilityMode ? "text-7xl text-black" : "text-8xl text-emerald-600")}>
                {snapshotData.standardValue}
              </span>
              <div className="pb-1 sm:pb-4">
                <p className={cn("font-bold leading-tight", settings.accessibilityMode ? "text-3xl text-black" : "text-2xl")}>{snapshotData.standardLabel}</p>
                <p className={cn("font-bold flex items-center gap-1 my-1 sm:my-0", settings.accessibilityMode ? "text-xl text-black" : "text-emerald-500 leading-tight block whitespace-nowrap")} aria-label={`Down ${snapshotData.trendText}`}>
                  <ArrowDownRight aria-hidden="true" className="w-4 h-4" /> {snapshotData.trendText}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={cn("mt-auto p-4 rounded-2xl", 
             settings.accessibilityMode ? "bg-black/5 border-2 border-black text-black text-lg" : "bg-slate-50 border-l-8 border-emerald-500"
        )}>
          <p className={cn("uppercase mb-1", settings.accessibilityMode ? "font-bold text-base" : "text-sm font-bold text-slate-400")}>Most Impactful Today</p>
          <p className={cn("font-bold", settings.accessibilityMode ? "text-xl" : "text-lg")}>{snapshotData.mostImpactful}</p>
        </div>
      </div>
    </section>
  );
}
