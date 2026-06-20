import { useState } from "react";
import { useAppSettings } from "../../contexts/AppSettingsContext";
import { cn } from "../../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', current: 0.2, future: 0.14 },
  { name: 'Feb', current: 0.4, future: 0.28 },
  { name: 'Mar', current: 0.6, future: 0.42 },
  { name: 'Apr', current: 0.8, future: 0.56 },
  { name: 'May', current: 1.0, future: 0.70 },
  { name: 'Jun', current: 1.2, future: 0.85 },
];

export default function ImpactTwin() {
  const { settings } = useAppSettings();
  const [view, setView] = useState<'twin'|'map'>('twin');

  return (
    <section 
      aria-labelledby="impact-twin-title"
      className={cn(
      "flex flex-col h-full shadow-xl relative",
      settings.accessibilityMode ? "bg-slate-100 border-4 border-black rounded-[2.5rem] p-2" : "bg-[#F1F5F9] rounded-[2.5rem] border-4 border-slate-200 p-2"
    )}>
      <h2 id="impact-twin-title" className="sr-only">Impact Twin and Map</h2>
      <div className="absolute top-6 right-6 z-20 flex bg-white/90 backdrop-blur rounded-full p-1 border border-slate-200 shadow-sm" role="tablist">
        <button 
          role="tab"
          aria-selected={view === 'map'}
          onClick={() => setView('map')}
          className={cn("px-4 py-1.5 text-sm font-bold transition-colors rounded-full", 
            view === 'map' ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
        )}>Map</button>
        <button 
          role="tab"
          aria-selected={view === 'twin'}
          onClick={() => setView('twin')}
          className={cn("px-4 py-1.5 text-sm font-bold transition-colors rounded-full", 
            view === 'twin' ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
        )}>Twin</button>
      </div>

      {view === 'twin' ? (
        <div className="h-full bg-white rounded-[2rem] p-6 pt-16 flex flex-col" role="tabpanel" aria-label="Twin View">
          <div className={cn(
            "rounded-[2rem] p-6 text-white flex flex-col gap-6 shadow-2xl mb-6",
            settings.accessibilityMode ? "bg-black border-4 border-emerald-400" : "bg-[#0F172A]"
          )}>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="text-center md:text-left flex flex-col items-center md:items-start">
                <p className={cn("text-xs font-bold uppercase tracking-widest", settings.accessibilityMode ? "text-emerald-400" : "text-slate-400")}>Future You Status</p>
                <p aria-hidden="true" className="text-4xl mt-2">🌳</p>
              </div>
              <div aria-hidden="true" className="hidden md:block h-12 w-px bg-slate-700"></div>
              <div className="text-center md:text-right">
                <p className="text-sm font-bold text-emerald-400">Carbon Impact Twin</p>
                <p className="text-xl font-bold mt-1">Projected Savings: <span className="text-emerald-400 text-2xl">0.7 Tons</span> by 2027</p>
              </div>
            </div>
            
            <div className={cn("flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl w-full",
              settings.accessibilityMode ? "bg-slate-900 border-2 border-slate-700" : "bg-slate-800"
            )}>
              <div className="text-center md:text-right w-32">
                <p className="text-xs font-bold text-slate-400 uppercase">Current Path</p>
                <p className="font-black">2.4 Tons</p>
              </div>
              <div className="flex-1 w-full h-3 bg-slate-600 rounded-full relative overflow-hidden" aria-hidden="true">
                <div className="absolute left-0 top-0 h-full w-[70%] bg-emerald-500 rounded-full"></div>
              </div>
              <div className="text-center md:text-left w-32">
                <p className="text-xs font-bold text-emerald-400 uppercase">C.A.R.E Path</p>
                <p className="font-black text-emerald-400">1.7 Tons</p>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[250px] mt-auto">
            {!settings.neurodivergentMode ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '16px', border: '2px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="current" name="Current Path" fill={settings.accessibilityMode ? "#334155" : "#CBD5E1"} radius={[8, 8, 0, 0]} barSize={24} />
                    <Bar dataKey="future" name="Future Action" fill={settings.accessibilityMode ? "#10b981" : "#10B981"} radius={[8, 8, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
            ) : (
              <div className={cn("h-full flex items-center justify-center p-6 text-center border-4 border-dashed rounded-xl font-bold", settings.accessibilityMode ? "border-black text-xl" : "border-slate-200 text-slate-500")}>
                Chart hidden in minimal sensory mode to reduce noise. 
                <br/><br/>
                 Your actions will save 0.7 Tons of CO2 this year!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full min-h-[300px] bg-[#E2E8F0] rounded-[2rem] overflow-hidden flex flex-wrap relative" role="tabpanel" aria-label="Map View">
          <div className={cn(
            "absolute top-16 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto z-10 p-5 rounded-3xl shadow-xl", 
            settings.accessibilityMode ? "bg-white border-4 border-black" : "bg-white/95 backdrop-blur-md border border-slate-200"
          )}>
            <h2 className={cn("text-sm font-black uppercase mb-3", settings.accessibilityMode ? "text-black" : "text-slate-400")}>Nearby Green Hubs</h2>
            <ul className="space-y-3" aria-label="List of green hubs">
              <li className={cn("flex items-center gap-3 text-sm font-bold", settings.accessibilityMode ? "text-black text-base" : "text-emerald-600")}>
                <span aria-hidden="true" className="text-lg">📍</span> Metro Station (200m)
              </li>
              <li className={cn("flex items-center gap-3 text-sm font-bold", settings.accessibilityMode ? "text-black text-base" : "text-sky-600")}>
                <span aria-hidden="true" className="text-lg">📍</span> EV Charging (1.2km)
              </li>
              <li className={cn("flex items-center gap-3 text-sm font-bold", settings.accessibilityMode ? "text-black text-base" : "text-amber-600")}>
                <span aria-hidden="true" className="text-lg">📍</span> Recycling Center (3km)
              </li>
            </ul>
          </div>
          
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#CBD5E1_1px,_transparent_1px)] bg-[size:24px_24px] flex items-center justify-center relative" aria-label="Stylized map showing nearby green hubs">
            <div className="w-[80%] h-[60%] border-4 border-white rounded-full opacity-30"></div>
            {!settings.neurodivergentMode && (
              <>
                <div role="img" aria-label="You are here" className="absolute top-1/2 left-1/3 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse z-10"></div>
                <div role="img" aria-label="Ev Charging" className="absolute top-1/4 right-1/4 w-5 h-5 bg-sky-500 rounded-full border-2 border-white shadow-md z-10"></div>
                <div role="img" aria-label="Recycling Center" className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-amber-500 rounded-full border-2 border-white shadow-md z-10"></div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
