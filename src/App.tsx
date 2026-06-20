/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { AppSettingsProvider, useAppSettings } from "./contexts/AppSettingsContext";
import CarbonSnapshot from "./components/dashboard/CarbonSnapshot";
import ActionCountdown from "./components/dashboard/ActionCountdown";
import EcoCoach from "./components/dashboard/EcoCoach";
import ImpactTwin from "./components/dashboard/ImpactTwin";
import SettingsModal from "./components/layout/SettingsModal";
import { Settings2, Leaf } from "lucide-react";
import { cn } from "./lib/utils";

function Dashboard() {
  const { settings } = useAppSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className={cn(
      "min-h-screen py-8 px-4 font-sans selection:bg-emerald-200 overflow-x-hidden flex flex-col",
      settings.accessibilityMode ? "bg-white text-black" : "bg-[#F0FDF4] text-[#164E63]"
    )}>
      <div className="max-w-6xl mx-auto space-y-6 w-full flex-grow flex flex-col">
        
        {/* Header */}
        <header aria-label="Application Header" className={cn(
          "flex items-center justify-between p-4 rounded-3xl",
          settings.accessibilityMode ? "border-4 border-black" : "bg-white/80 backdrop-blur-sm border-2 border-emerald-100 shadow-sm"
        )}>
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className={cn(
              "flex items-center justify-center",
              settings.accessibilityMode ? "text-4xl" : "text-3xl"
            )}>
              🌏
            </div>
            <div className="flex items-center gap-4">
              <h1 className={cn(
                "font-black tracking-tight", 
                settings.accessibilityMode 
                  ? "text-4xl underline" 
                  : "text-3xl text-emerald-900 underline decoration-emerald-400 decoration-4 underline-offset-4"
              )}>
                C.A.R.E.
              </h1>
              {!settings.accessibilityMode && (
                <span className="hidden md:inline-block text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  Carbon Awareness and Reduction Engine
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open User Settings"
            className={cn(
              "px-5 py-2 rounded-full font-bold flex items-center gap-2 transition-transform shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500",
              settings.accessibilityMode 
                ? "border-4 border-black text-lg hover:bg-slate-100" 
                : "bg-white border-2 border-slate-200 hover:scale-105 active:scale-95"
            )}
          >
            <div aria-hidden="true" className={cn("w-3 h-3 rounded-full", settings.accessibilityMode ? "bg-black" : "bg-green-400")}></div>
            <span className={cn("hidden sm:inline", settings.accessibilityMode && "block")}>Settings</span>
          </button>
        </header>

        {/* 2x2 Grid */}
        <main aria-label="Dashboard widgets" className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 flex-grow min-h-[800px] lg:h-[700px] mb-8">
          <div className="h-full min-h-[300px]">
            <CarbonSnapshot />
          </div>
          <div className="h-full min-h-[300px]">
            <ActionCountdown />
          </div>
          <div className="h-full auto-rows-max lg:min-h-[330px]">
            <EcoCoach />
          </div>
          <div className="h-full min-h-[350px]">
            <ImpactTwin />
          </div>
        </main>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppSettingsProvider>
        <Dashboard />
      </AppSettingsProvider>
    </AuthProvider>
  );
}
