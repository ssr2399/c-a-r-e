import { useState, useRef, useEffect } from "react";
import { useAppSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { Bot, Send, Mic, Loader2, User } from "lucide-react";
import { cn } from "../../lib/utils";

export default function EcoCoach() {
  const { settings } = useAppSettings();
  const { user } = useAuth();
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am your Eco Coach. How can I help you reduce your footprint today?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    try {
      const q = query(collection(db, "users", user.uid, "messages"), orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages: {role: 'user'|'model', text: string}[] = [];
        snapshot.forEach((doc) => {
          loadedMessages.push({
            role: doc.data().role as 'user'|'model',
            text: doc.data().text
          });
        });
        
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
          localStorage.setItem('care_chat_history', JSON.stringify(loadedMessages));
        }
      }, (error) => {
        console.warn("Firestore error, loading from local storage:", error.message);
        const saved = localStorage.getItem('care_chat_history');
        if (saved) setMessages(JSON.parse(saved));
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore skipped for chat");
      const saved = localStorage.getItem('care_chat_history');
      if (saved) setMessages(JSON.parse(saved));
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const saveMessage = async (role: 'user'|'model', text: string, currentMessages: any[]) => {
    const newMessages = [...currentMessages, { role, text }];
    localStorage.setItem('care_chat_history', JSON.stringify(newMessages));

    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "messages"), {
        role,
        text,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn("Error saving message to Firestore, saved locally");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    const messagesWithUser = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(messagesWithUser);
    await saveMessage('user', userMessage, messages);
    
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          settings
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessages([...messagesWithUser, { role: 'model', text: data.text }]);
        await saveMessage('model', data.text, messagesWithUser);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      const errorText = "Sorry, I'm having trouble connecting right now.";
      setMessages([...messagesWithUser, { role: 'model', text: errorText }]);
      await saveMessage('model', errorText, messagesWithUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      aria-labelledby="eco-coach-title"
      className={cn(
      "flex flex-col h-full p-8 shadow-xl relative overflow-hidden",
      settings.accessibilityMode ? "bg-blue-50 border-4 border-black rounded-[2.5rem]" : "bg-[#EEF2FF] rounded-[2.5rem] border-4 border-indigo-200"
    )}>
      <h2 id="eco-coach-title" className={cn("mb-4", 
        settings.accessibilityMode ? "text-2xl font-bold text-black" : "text-xl font-black uppercase tracking-tight text-indigo-700"
      )}>
        Eco Coach AI
      </h2>

      <div 
        ref={scrollRef} 
        aria-live="polite"
        className="flex-grow overflow-y-auto space-y-4 pr-2 flex flex-col focus:outline-none" 
      >
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end ml-12" : "items-start mr-12")}>
            <div className={cn(
              "p-4 rounded-3xl",
              settings.accessibilityMode ? "text-lg font-bold border-2 border-black" : "text-lg font-medium shadow-sm",
              msg.role === 'user' 
                ? (settings.accessibilityMode ? "bg-slate-100 text-black rounded-tr-none" : "bg-indigo-600 text-white rounded-tr-none")
                : (settings.accessibilityMode ? "bg-white text-black rounded-tl-none" : "bg-white border border-indigo-100 text-slate-700 rounded-tl-none")
            )}>
              <span className="sr-only">{msg.role === 'user' ? 'You said:' : 'Coach said:'}</span>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start mr-12" aria-label="Coach is typing...">
             <div className="p-4 bg-white border border-indigo-100 rounded-3xl rounded-tl-none text-slate-400 flex gap-1 shadow-sm">
               <span aria-hidden="true" className="animate-bounce">.</span><span aria-hidden="true" className="animate-bounce delay-100">.</span><span aria-hidden="true" className="animate-bounce delay-200">.</span>
             </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <label htmlFor="coach-input" className="sr-only">Ask Coach a question</label>
        <input 
          id="coach-input"
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Coach..."
          className={cn(
            "flex-grow p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors",
            settings.accessibilityMode 
              ? "bg-white border-4 border-black text-xl font-bold" 
              : "bg-white border-2 border-indigo-200 focus:border-indigo-400 font-medium"
          )}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          aria-label="Send message to Eco Coach"
          className={cn(
            "p-4 rounded-2xl transition-colors min-w-[56px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500",
            input.trim() && !isLoading
              ? (settings.accessibilityMode ? "bg-black text-white hover:bg-slate-800" : "bg-indigo-500 text-white hover:bg-indigo-600") 
              : (settings.accessibilityMode ? "bg-slate-300 text-slate-500" : "bg-indigo-300 text-white")
          )}
        >
          <Send aria-hidden="true" className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
