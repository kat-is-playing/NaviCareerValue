import React, { useState, useMemo, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Briefcase, Heart, User, Sparkles, X, Shuffle, GripVertical, Check, ChevronDown, Filter, Trash2, Download } from "lucide-react";
import html2canvas from "html2canvas";

// --- Types & Data ---

// Inline SVG Logo Component to replace the external image
const BrandLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left: Teal Rounded Square Bubble */}
    <rect x="4" y="4" width="36" height="36" rx="12" fill="#37A6A9" />
    <path d="M28 38L38 46L36 32" fill="#37A6A9" />
    
    {/* Middle: Yellow Circle Bubble */}
    <circle cx="70" cy="22" r="19" fill="#F9C04C" />
    <path d="M70 40L70 48L80 36" fill="#F9C04C" />

    {/* Right: Blue Rounded Triangle Bubble */}
    <path d="M116 6L134 36H98L116 6Z" fill="#17335F" stroke="#17335F" strokeWidth="6" strokeLinejoin="round" />
    <path d="M108 38L102 46L118 38" fill="#17335F" />
  </svg>
);

type Category = "WORK" | "VIRTUE" | "RELATIONSHIP" | "SELF";

interface CardData {
  id: number;
  text: string;
  category: Category;
}

const CATEGORY_CONFIG: Record<Category, { 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
  bg: string; 
  border: string; 
  ring: string;
}> = {
  WORK: {
    label: "工作追求",
    icon: <Briefcase size={14} />,
    color: "text-[#595757]",
    bg: "bg-[#595757]/10",
    border: "border-[#595757]/15",
    ring: "ring-[#595757]/30"
  },
  VIRTUE: {
    label: "美德價值",
    icon: <Sparkles size={14} />,
    color: "text-[#37A6A9]",
    bg: "bg-[#37A6A9]/10",
    border: "border-[#37A6A9]/30",
    ring: "ring-[#37A6A9]/30"
  },
  RELATIONSHIP: {
    label: "人際關係",
    icon: <Heart size={14} />,
    color: "text-[#F9C04C]",
    bg: "bg-[#F9C04C]/10",
    border: "border-[#F9C04C]/30",
    ring: "ring-[#F9C04C]/30"
  },
  SELF: {
    label: "自我與生活",
    icon: <User size={14} />,
    color: "text-[#2A5DAC]",
    bg: "bg-[#2A5DAC]/10",
    border: "border-[#2A5DAC]/15",
    ring: "ring-[#2A5DAC]/30"
  }
};

// Official WORK category cards (30 items)
// Formatting Rule: Replace '、' with newline '\n' (as requested previously)
const WORK_TEXTS_SOURCE = [
  "有夥伴一起打拼",
  "解決他人的問題、幫助他人成長",
  "對他人社會有影響力",
  "負責、勇於承擔責任",
  "資產與金錢",
  "晉升的機會與速度",
  "擁有自己的事業",
  "權威身份、擁有特定地位職權",
  "社會認可、受人尊重肯定",
  "有效率、有效能",
  "領導團隊",
  "務實、重視可行性",
  "能被看見、有舞台能發光",
  "清楚的流程與規範",
  "隨遇而安、順勢而為",
  "工作穩定性",
  "工作生活平衡",
  "發揮自己的天賦能力",
  "追求美感或藝術",
  "專業",
  "創新與創造",
  "追求工作品質",
  "獨立自主",
  "邏輯清晰",
  "能持續自我成長",
  "安全感、工作上或心理面可預測可掌控",
  "冒險挑戰",
  "有明確的目標或方向",
  "有成就感",
  "有秩序與穩定的環境"
];
const WORK_TEXTS = WORK_TEXTS_SOURCE.map(t => t.replace(/、/g, '\n'));

// Official SELF category cards (19 items)
// Formatting Rule: Replace ' ' (space) with newline '\n', keep '、' (comma)
const SELF_TEXTS_SOURCE = [
  "享受生活、美食等休閒娛樂",
  "有趣的人事物",
  "忠於自我",
  "自由自在不受拘束",
  "內在的平靜",
  "對生命、人性或人生的洞察智慧",
  "保持潔淨 身體、心靈或環境",
  "健康的身體與心靈",
  "保有隱私、不受人打擾",
  "追求真理與知性",
  "自我肯定、喜歡自己",
  "自我表達與呈現",
  "舒適的環境",
  "信仰、宗教 或靈性的生活",
  "平凡的生活",
  "能親近大自然",
  "規律的生活",
  "有獨處的空間",
  "低調、不張揚"
];
const SELF_TEXTS = SELF_TEXTS_SOURCE.map(t => t.replace(/ /g, '\n'));

// Official VIRTUE category cards (11 items)
// Formatting Rule: Keep original text (preserve comma)
const VIRTUE_TEXTS = [
  "忠誠",
  "國家主權、民族意識",
  "不欺騙、不說謊",
  "不要傷害別人",
  "知恩圖報",
  "真誠一致",
  "全人類的福祉",
  "尊重傳統延續歷史",
  "公平正義",
  "保護環境或動植物",
  "社會公益、關懷弱勢"
];

// Official RELATIONSHIP category cards (10 items)
// Formatting Rule: Replace ' ' (space) with newline '\n'
const RELATIONSHIP_TEXTS_SOURCE = [
  "交友廣闊",
  "愛與被愛",
  "歸屬與認同 屬於某個身份或團體",
  "能彼此尊重",
  "獲得父母的認同",
  "有一個安穩的家",
  "深刻友誼",
  "人際和諧",
  "有小孩",
  "能好好照顧家人"
];
const RELATIONSHIP_TEXTS = RELATIONSHIP_TEXTS_SOURCE.map(t => t.replace(/ /g, '\n'));

// Generate 70 cards total
// 30 WORK + 19 SELF + 11 VIRTUE + 10 RELATIONSHIP = 70
const generateCards = (): CardData[] => {
  const cards: CardData[] = [];
  let idCounter = 1;

  // 1. Add 30 WORK cards
  WORK_TEXTS.forEach(text => {
    cards.push({
      id: idCounter++,
      text: text,
      category: "WORK"
    });
  });

  // 2. Add 19 SELF cards
  SELF_TEXTS.forEach(text => {
    cards.push({
      id: idCounter++,
      text: text,
      category: "SELF"
    });
  });

  // 3. Add 11 VIRTUE cards
  VIRTUE_TEXTS.forEach(text => {
    cards.push({
      id: idCounter++,
      text: text,
      category: "VIRTUE"
    });
  });

  // 4. Add 10 RELATIONSHIP cards
  RELATIONSHIP_TEXTS.forEach(text => {
    cards.push({
      id: idCounter++,
      text: text,
      category: "RELATIONSHIP"
    });
  });

  return cards;
};

const INITIAL_CARDS = generateCards();
const ALL_CATEGORIES: Category[] = ["WORK", "RELATIONSHIP", "VIRTUE", "SELF"];

// --- Helper Functions ---

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Replace '\n' with <br /> for display
const formatCardText = (text: string) => {
  if (!text.includes("\n")) return text;
  return text.split("\n").map((part, index, arr) => (
    <React.Fragment key={index}>
      {part}
      {index < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};

// --- Components ---

interface CardProps {
  data: CardData;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "default" | "small";
  // Drag props
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  dragIndicator?: 'left' | 'right' | null;
}

const Card: React.FC<CardProps> = ({ 
  data, 
  isSelected, 
  onClick, 
  variant = "default",
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnter,
  onDragLeave,
  isDragging,
  dragIndicator
}) => {
  const config = CATEGORY_CONFIG[data.category];

  if (variant === "small") {
    return (
      <div 
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        // Removed onClick from the container to prevent accidental removal
        className={`
          relative flex-shrink-0 w-24 h-32 p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing
          transition-all duration-200
          flex flex-col justify-between bg-white border-stone-200 group
          ${isDragging ? 'opacity-30' : 'hover:-translate-y-1 hover:shadow-md'}
        `}
      >
        {/* Drag Indicators */}
        {dragIndicator === 'left' && (
          <div className="absolute top-0 bottom-0 -left-2 w-1 bg-stone-800 rounded-full z-20 pointer-events-none" />
        )}
        {dragIndicator === 'right' && (
          <div className="absolute top-0 bottom-0 -right-2 w-1 bg-stone-800 rounded-full z-20 pointer-events-none" />
        )}

        <div 
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-white rounded-full p-1 z-10 cursor-pointer hover:scale-110"
        >
           <X size={12} />
        </div>
        
        {/* Drag Handle Icon (Visual cue) */}
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-40 text-stone-400">
           <GripVertical size={12} />
        </div>

        {/* Updated for better text handling of long sentences */}
        <div className="serif-font text-xs font-semibold text-stone-700 leading-tight mt-1 line-clamp-4">
          {formatCardText(data.text)}
        </div>
        <div className={`flex justify-end ${config.color}`}>
          {config.icon}
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div 
      onClick={onClick}
      className={`
        relative aspect-[3/4] p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between
        ${isSelected 
          ? `ring-2 ring-offset-2 ${config.ring} ${config.bg} ${config.border} scale-95 opacity-80` 
          : `bg-white hover:shadow-lg hover:-translate-y-1 ${config.border} hover:border-stone-300`
        }
      `}
    >
      {/* Content */}
      <div className="flex-grow flex items-center justify-center text-center">
        <h3 className={`serif-font text-lg font-medium text-stone-800 tracking-wide ${isSelected ? 'line-through decoration-stone-400 text-stone-500' : ''}`}>
          {formatCardText(data.text)}
        </h3>
      </div>

      {/* Footer Icon */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
          {CATEGORY_CONFIG[data.category].label}
        </span>
        <div className={`${config.color}`}>
          {config.icon}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Data State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Filter State
  const [visibleCategories, setVisibleCategories] = useState<Category[]>(ALL_CATEGORIES);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragTarget, setDragTarget] = useState<{ id: number; pos: 'left' | 'right' } | null>(null);

  // Export Ref
  const exportRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    setCards(shuffleArray(INITIAL_CARDS));
    setIsLoaded(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handlers ---

  const handleShuffle = () => {
    setCards(prev => shuffleArray(prev));
  };

  const toggleCategoryFilter = (cat: Category) => {
    setVisibleCategories(prev => {
      if (prev.includes(cat)) {
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDownload = async () => {
    if (!exportRef.current || selectedIds.length === 0) return;
    setIsDownloading(true);

    try {
      // Wait a tick to ensure rendering if needed
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: "#f5f5f4", // bg-stone-100 matches better
        useCORS: true,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = image;
      link.download = "職游價值導航卡-我的選擇.jpg";
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Drag Handlers (unchanged) ---
  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };
  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    const pos = e.clientX < midX ? 'left' : 'right';
    setDragTarget({ id: targetId, pos });
  };
  const handleDragLeave = () => {};
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId === null || !dragTarget) {
      setDragTarget(null); setDraggedId(null); return;
    }
    const { id: targetId, pos } = dragTarget;
    if (draggedId === targetId) {
      setDragTarget(null); setDraggedId(null); return;
    }
    const newOrder = [...selectedIds];
    const dragIndex = newOrder.indexOf(draggedId);
    if (dragIndex === -1) { setDragTarget(null); setDraggedId(null); return; }
    
    const [removed] = newOrder.splice(dragIndex, 1);
    let newTargetIndex = newOrder.indexOf(targetId);
    if (newTargetIndex === -1) { // Should not happen if target is selected
       setDragTarget(null); setDraggedId(null); return;
    }
    if (pos === 'right') newTargetIndex += 1;
    newOrder.splice(newTargetIndex, 0, removed);
    setSelectedIds(newOrder);
    setDragTarget(null); setDraggedId(null);
  };

  // --- Derived State ---
  const getCardData = (id: number) => INITIAL_CARDS.find(c => c.id === id);
  
  const filteredCards = useMemo(() => {
    return cards.filter(card => visibleCategories.includes(card.category));
  }, [cards, visibleCategories]);

  const filterLabel = useMemo(() => {
    if (visibleCategories.length === ALL_CATEGORIES.length) return "所有類別";
    if (visibleCategories.length === 0) return "未選擇";
    return `已選 ${visibleCategories.length} 項`;
  }, [visibleCategories]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen pb-64 selection:bg-stone-200">
      {/* Header */}
      <header className="pt-10 pb-8 px-6 max-w-7xl mx-auto text-center relative z-40">
        <h1 className="serif-font text-3xl md:text-4xl font-semibold text-stone-800 mb-3 flex items-center justify-center gap-3">
          <span>職游</span>
          <BrandLogo className="h-6 md:h-7 w-auto" />
          <span>價值導航卡</span>
        </h1>
        <p className="text-stone-500 text-sm md:text-base max-w-xl mx-auto mb-8">
          請選擇對你來說最在乎和重視的 10~15 張牌卡並排序
        </p>
        
        {/* Actions & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
          
          {/* Shuffle Button */}
          <button 
            onClick={handleShuffle}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-200 text-stone-600 shadow-sm hover:shadow-md hover:border-stone-300 hover:bg-stone-50 transition-all duration-300 active:scale-95"
          >
            <Shuffle size={16} />
            <span className="text-sm font-medium">隨機排序</span>
          </button>

          <div className="w-full md:w-px h-px md:h-8 bg-stone-200 md:block hidden"></div>

          {/* Dropdown Filter */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm transition-all duration-300
                ${isDropdownOpen 
                  ? 'bg-stone-50 border-stone-300 text-stone-800' 
                  : 'bg-white border-stone-200 text-stone-600 hover:shadow-md hover:border-stone-300'
                }
              `}
            >
              <Filter size={16} className="text-stone-600" />
              <span className="text-sm font-medium min-w-[4rem] text-left">
                {filterLabel}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                
                {ALL_CATEGORIES.map((cat) => {
                  const config = CATEGORY_CONFIG[cat];
                  const isActive = visibleCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategoryFilter(cat)}
                      className={`
                        w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-stone-50 transition-colors
                        ${isActive ? "font-medium bg-stone-50" : ""}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`${config.color}`}>
                           {config.icon}
                        </div>
                        <span className={isActive ? config.color : "text-stone-600"}>
                          {config.label}
                        </span>
                      </div>
                      {isActive && <Check size={14} className={config.color} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 animate-in fade-in zoom-in-95 duration-500">
            {filteredCards.map(card => (
              <Card 
                key={card.id} 
                data={card} 
                isSelected={selectedIds.includes(card.id)} 
                onClick={() => toggleSelection(card.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-stone-400 italic">
            請選擇至少一個牌卡類別
          </div>
        )}
      </main>

      {/* Bottom Selection Bar */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50 
          bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]
          transition-transform duration-500 ease-in-out
          ${selectedIds.length > 0 ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-6 flex flex-col gap-2">
          
          {/* Header Row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">已選</span>
              <span className="serif-font text-lg font-bold text-stone-800">{selectedIds.length}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">張牌卡</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading || selectedIds.length === 0}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-stone-400 hover:text-stone-600 transition-all duration-200 group disabled:opacity-50"
                title="下載結果圖片"
              >
                 <Download size={14} className="group-hover:text-stone-600 transition-colors" />
                 <span>{isDownloading ? "下載中..." : "下載結果圖片"}</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-1.5 px-2 py-1 -mr-2 rounded-md text-xs font-medium text-stone-400 hover:text-red-600 transition-all duration-200 group"
                title="移除全部牌卡"
              >
                 <Trash2 size={14} className="group-hover:text-red-600 transition-colors" />
                 <span>移除全部牌卡</span>
              </button>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="w-full overflow-x-auto no-scrollbar">
            {/* Added py-2 to allow shadow/transform space */}
            <div className="flex gap-3 px-2 py-2 min-w-min"
                 onDragOver={(e) => {
                    e.preventDefault(); 
                    // Clear indicator if dragging over empty space in container
                    if(e.target === e.currentTarget) setDragTarget(null);
                 }}
                 onDrop={(e) => {
                    // Handle drop in empty space if necessary, or just clear
                    if(e.target === e.currentTarget) {
                        setDragTarget(null);
                        setDraggedId(null);
                    }
                 }}
            >
              {selectedIds.map((id) => {
                const card = getCardData(id);
                if (!card) return null;
                
                const isDragTarget = dragTarget?.id === id;
                const indicator = isDragTarget ? dragTarget.pos : null;

                return (
                  <Card 
                    key={`selected-${id}`}
                    data={card}
                    variant="small"
                    draggable
                    isDragging={draggedId === id}
                    dragIndicator={indicator}
                    onDragStart={() => handleDragStart(id)}
                    onDragOver={(e) => handleDragOver(e, id)}
                    onDrop={handleDrop}
                    onClick={() => toggleSelection(id)}
                  />
                );
              })}
              {selectedIds.length === 0 && (
                <div className="flex items-center text-stone-400 text-sm italic pl-2">
                  尚未選擇任何牌卡...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Export Container */}
      <div 
        ref={exportRef}
        className="fixed -left-[9999px] -top-[9999px] w-[1200px] bg-stone-50 p-16"
      >
        <div className="text-center mb-12">
          <h2 className="serif-font text-3xl font-bold text-stone-800 mb-4 flex items-center justify-center gap-3">
             <span>我的精選價值觀牌卡</span>
          </h2>
        </div>
        
        {selectedIds.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {selectedIds.map((id, index) => {
              const card = getCardData(id);
              if (!card) return null;
              const config = CATEGORY_CONFIG[card.category];
              
              return (
                <div 
                  key={`export-${id}`}
                  className={`
                    relative aspect-[3/4] p-6 rounded-xl border bg-white flex flex-col justify-between shadow-sm
                    ${config.border}
                  `}
                >
                  {/* Sequence Number */}
                  <div className="absolute top-3 left-4">
                    <span className="serif-font text-stone-300 text-2xl font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-grow flex items-center justify-center text-center px-2">
                    <h3 className="serif-font text-2xl font-medium text-stone-800 tracking-wide leading-relaxed">
                      {formatCardText(card.text)}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                      {config.label}
                    </span>
                    <div className={`${config.color}`}>
                      {/* React Node (Icon) cloning to ensure size/props */}
                      {React.cloneElement(config.icon as React.ReactElement<any>, { size: 18 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-stone-400">
            尚未選擇牌卡
          </div>
        )}

      </div>

    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}