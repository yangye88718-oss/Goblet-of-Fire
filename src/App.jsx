import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Tone from 'tone';
import { 
  Music, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Trophy, 
  Volume2, 
  Sparkles, 
  Zap, 
  Flame 
} from 'lucide-react';

/**
 * 难度等级配置
 */
const DIFFICULTY_LEVELS = {
  NOVICE: { label: '入门', color: 'bg-green-500', icon: '🌱' },
  INTERMEDIATE: { label: '进阶', color: 'bg-indigo-500', icon: '✨' },
  MASTER: { label: '大师', color: 'bg-purple-600', icon: '👑' }
};

/**
 * 核心配置
 */
const CHORD_TYPES = {
  MAJOR: { 
    name: '大三和弦', 
    intervals: [0, 4, 7], 
    level: 'NOVICE',
    magicProps: [
      { type: '颜色', text: '明亮的明黄色', icon: '🎨' },
      { type: '意境', text: '晴朗的早晨', icon: '☀️' },
      { type: '动物', text: '快乐的小鸟', icon: '🐦' }
    ]
  },
  MINOR: { 
    name: '小三和弦', 
    intervals: [0, 3, 7], 
    level: 'NOVICE',
    magicProps: [
      { type: '颜色', text: '宁静的浅蓝色', icon: '🎨' },
      { type: '意境', text: '细雨连绵的下午', icon: '🌧️' },
      { type: '动物', text: '温顺的小羊', icon: '🐑' }
    ]
  },
  DOMINANT_7: { 
    name: '大小七和弦 (7)', 
    intervals: [0, 4, 7, 10], 
    level: 'INTERMEDIATE',
    magicProps: [
      { type: '颜色', text: '温暖的橘黄色', icon: '🎨' },
      { type: '意境', text: '阳光下的海滩', icon: '🏖️' },
      { type: '动物', text: '威武的大狮子', icon: '🦁' }
    ]
  },
  MINOR_7: { 
    name: '小小七和弦 (m7)', 
    intervals: [0, 3, 7, 10], 
    level: 'INTERMEDIATE',
    magicProps: [
      { type: '颜色', text: '忧郁的深蓝色', icon: '🎨' },
      { type: '意境', text: '宁静的星空下', icon: '🌌' },
      { type: '动物', text: '优雅的蓝鲸', icon: '🐋' }
    ]
  },
  HALF_DIMINISHED_7: { 
    name: '减小七和弦 (ø7)', 
    intervals: [0, 3, 6, 10], 
    level: 'MASTER',
    magicProps: [
      { type: '颜色', text: '神秘的淡紫色', icon: '🎨' },
      { type: '意境', text: '迷雾森林深处', icon: '🌲' },
      { type: '动物', text: '机警的小狐狸', icon: '🦊' }
    ]
  },
  DIMINISHED_7: { 
    name: '减减七和弦 (o7)', 
    intervals: [0, 3, 6, 9], 
    level: 'MASTER',
    magicProps: [
      { type: '颜色', text: '紧张的暗红色', icon: '🎨' },
      { type: '意境', text: '惊险的探险隧道', icon: '🔦' },
      { type: '动物', text: '躲藏的小蝙蝠', icon: '🦇' }
    ]
  },
};

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const MagicBackgroundDecor = () => {
  const decors = useMemo(() => {
    const items = [];
    const symbols = ['♪', '♫', '♬', '★', '✧', '✨', '✦', '🔥'];
    const colors = ['text-purple-300', 'text-indigo-400', 'text-yellow-200', 'text-white', 'text-orange-300'];
    for (let i = 0; i < 50; i++) {
      items.push({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 1.8 + 0.4}rem`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 8 + 4}s`,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-[#2e1a47] via-[#16213e] to-[#0f3460]">
      {/* 魔法流星 */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-30">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute w-[2px] h-[100px] bg-gradient-to-b from-white to-transparent rotate-[45deg] animate-shooting-star" 
               style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 50}%`, animationDelay: `${Math.random() * 10}s` }} />
        ))}
      </div>
      
      {/* 魔法圆环 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[1px] border-indigo-500/20 rounded-full animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-[1px] border-purple-500/10 rounded-full animate-spin-reverse-slow" />

      {decors.map(d => (
        <div key={d.id} className={`absolute animate-float ${d.color}`} style={{ left: d.left, top: d.top, fontSize: d.size, animationDelay: d.delay, animationDuration: d.duration, opacity: d.opacity }}>
          {d.symbol}
        </div>
      ))}
    </div>
  );
};

const MagicDisplay = ({ prop, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [prop, onComplete]);
  if (!prop) return null; 
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max z-50 pointer-events-none">
      <div className="flex items-center justify-center animate-fade-slow">
        <div className="bg-white/95 backdrop-blur-md border border-indigo-100 rounded-full px-5 py-2 flex items-center gap-2 shadow-xl ring-2 ring-white/60">
          <span className="text-xl">{prop.icon}</span>
          <span className="font-black text-indigo-900 text-sm italic whitespace-nowrap">{prop.text}</span>
        </div>
      </div>
    </div>
  );
};

const Particle = ({ x, y, color }) => {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 800);
    return () => clearTimeout(timer);
  }, []);
  if (!active) return null;
  return (
    <div className={`absolute rounded-full pointer-events-none animate-ping ${color}`} style={{ left: x, top: y, width: '20px', height: '20px' }} />
  );
};

const App = () => {
  const [gameState, setGameState] = useState('menu'); 
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);
  const [userInput, setUserInput] = useState([]); 
  const [feedback, setFeedback] = useState(null); 
  const [particles, setParticles] = useState([]);
  const [isToneStarted, setIsToneStarted] = useState(false);
  const [isSamplerLoaded, setIsSamplerLoaded] = useState(false);
  const [isPlayingChord, setIsPlayingChord] = useState(false);
  const [currentMagicProp, setCurrentMagicProp] = useState(null); 

  const scrollContainerRef = useRef(null);
  const isDragging = useRef(false);
  const isPointerDownOnKey = useRef(false); // 是否在按键上按下了指针
  const lastSlidedNote = useRef(null); // 上一个滑动触发的音符，防止重复
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const sampler = useRef(null);
  const keyRefs = useRef({}); 
  const chordTimerRef = useRef(null);

  // 初始化音色库
  useEffect(() => {
    sampler.current = new Tone.Sampler({
      urls: { A1: "A1.mp3", A2: "A2.mp3", A3: "A3.mp3", A4: "A4.mp3" },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      release: 1,
      onload: () => setIsSamplerLoaded(true)
    }).toDestination();
    
    // 默认滚动到 C4
    setTimeout(() => scrollToNote("C4"), 1200);

    // 全局清理滑动状态
    const clearPointer = () => {
      isPointerDownOnKey.current = false;
      lastSlidedNote.current = null;
    };
    window.addEventListener('pointerup', clearPointer);
    return () => window.removeEventListener('pointerup', clearPointer);
  }, []);

  // 监听难度变化，如果在游戏进行中，则刷新题目
  useEffect(() => {
    if (gameState === 'playing' && !isReviewMode) {
      if (chordTimerRef.current) clearTimeout(chordTimerRef.current);
      generateQuestion();
    }
  }, [difficulty]);

  const scrollToNote = (noteName) => {
    if (scrollContainerRef.current && keyRefs.current[noteName]) {
      const container = scrollContainerRef.current;
      const keyElement = keyRefs.current[noteName];
      const targetScroll = keyElement.offsetLeft - (container.offsetWidth / 2) + (keyElement.offsetWidth / 2);
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const playChord = async (notes, repeatCount = 1, showVisuals = true, magicProps = null) => {
    if (!sampler.current || !isSamplerLoaded) return;
    
    setIsPlayingChord(true);
    const now = Tone.now();
    const interval = 2.5;

    for (let i = 0; i < repeatCount; i++) {
      const startTime = now + (i * interval);
      if (magicProps && magicProps[i]) {
        setTimeout(() => setCurrentMagicProp(magicProps[i]), i * interval * 1000);
      }
      notes.forEach(note => sampler.current.triggerAttackRelease(note, "2n", startTime));
      if (showVisuals) {
        notes.forEach(note => {
          setTimeout(() => {
            setActiveKeys(prev => [...prev, note]);
            setTimeout(() => setActiveKeys(prev => prev.filter(n => n !== note)), 800);
          }, (i * interval * 1000) + 100);
        });
      }
    }
    
    if (chordTimerRef.current) clearTimeout(chordTimerRef.current);
    chordTimerRef.current = setTimeout(() => {
      setIsPlayingChord(false);
      setCurrentMagicProp(null);
    }, repeatCount * interval * 1000);
  };

  const generateQuestion = () => {
    let newQuestion = null;
    if (isReviewMode && mistakes.length > 0) {
      const randomIndex = Math.floor(Math.random() * mistakes.length);
      newQuestion = { ...mistakes[randomIndex] };
    } else {
      const rootIndex = Math.floor(Math.random() * 12);
      const octave = Math.random() > 0.5 ? 3 : 4; 
      
      const availableChords = Object.keys(CHORD_TYPES).filter(key => {
        const level = CHORD_TYPES[key].level;
        if (difficulty === 'NOVICE') return level === 'NOVICE';
        if (difficulty === 'INTERMEDIATE') return level === 'NOVICE' || level === 'INTERMEDIATE';
        return true;
      });
      const typeKey = availableChords[Math.floor(Math.random() * availableChords.length)];
      const type = CHORD_TYPES[typeKey];
      const notes = type.intervals.map(interval => {
        const idx = (rootIndex + interval) % 12;
        const octOffset = Math.floor((rootIndex + interval) / 12);
        return `${NOTES[idx]}${octave + octOffset}`;
      });
      newQuestion = { rootNote: NOTES[rootIndex], typeName: type.name, notes, typeKey, magicProps: type.magicProps };
    }
    
    setIsPlayingChord(false);
    setActiveKeys([]);
    setCurrentQuestion(newQuestion);
    setUserInput([]);
    setFeedback(null);
    setCurrentMagicProp(null);

    if (chordTimerRef.current) clearTimeout(chordTimerRef.current);
    chordTimerRef.current = setTimeout(() => playChord(newQuestion.notes, 3, false, newQuestion.magicProps), 500);
  };

  const handleInteractionStart = async () => {
    if (!isToneStarted) {
      await Tone.start();
      setIsToneStarted(true);
    }
  };

  const startLevel = async (review = false) => {
    if (!isSamplerLoaded) return; 
    await handleInteractionStart();
    setIsReviewMode(review);
    setGameState('playing');
    setTimeout(() => generateQuestion(), 100);
  };

  // 改进：音符触发函数支持点击和滑动
  const playAndSelectNote = (note) => {
    if (isPlayingChord || feedback) return;
    handleInteractionStart();

    // 如果已经在UserInput中，滑动经过不重复添加，但点击可以取消
    if (userInput.includes(note)) {
      // 只有在显式点击（而非滑动经过）时才执行反选
      if (lastSlidedNote.current === null) {
        setUserInput(prev => prev.filter(n => n !== note));
      }
    } else {
      if (sampler.current && isSamplerLoaded) {
        sampler.current.triggerAttackRelease(note, "4n", Tone.now());
      }
      setUserInput(prev => [...prev, note]);
    }
    lastSlidedNote.current = note;
  };

  const checkAnswer = () => {
    if (userInput.length === 0 || !currentQuestion) return;
    const sortedInput = [...userInput].sort();
    const sortedCorrect = [...currentQuestion.notes].sort();
    const isCorrect = JSON.stringify(sortedInput) === JSON.stringify(sortedCorrect);
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 10);
      playChord(currentQuestion.notes, 1, true); 
      if (isReviewMode) {
        setMistakes(prev => {
          const updated = prev.map(m => (m.rootNote === currentQuestion.rootNote && m.typeKey === currentQuestion.typeKey) ? { ...m, correctCount: (m.correctCount || 0) + 1 } : m);
          return updated.filter(m => (m.correctCount || 0) < 3);
        });
      }
      setParticles(Array.from({length: 8}).map((_, i) => ({ id: Date.now() + i, x: Math.random() * 80 + 10 + '%', y: Math.random() * 50 + 20 + '%', color: 'bg-yellow-400' })));
      setTimeout(() => generateQuestion(), 4000);
    } else {
      setFeedback('wrong');
      setMistakes(prev => {
        const exists = prev.find(m => m.rootNote === currentQuestion.rootNote && m.typeKey === currentQuestion.typeKey);
        if (exists) return prev.map(m => (m.rootNote === currentQuestion.rootNote && m.typeKey === currentQuestion.typeKey) ? { ...m, correctCount: 0 } : m);
        return [...prev, { ...currentQuestion, correctCount: 0 }];
      });
      playCorrectSequence();
    }
  };

  const playCorrectSequence = async () => {
    if (!sampler.current || !isSamplerLoaded || isPlayingChord) return;
    scrollToNote(currentQuestion.notes[0]);
    setIsPlayingChord(true);
    const now = Tone.now();
    const sequenceDelay = 0.8;
    currentQuestion.notes.forEach((note, i) => {
      sampler.current.triggerAttackRelease(note, "4n", now + i * sequenceDelay);
      setTimeout(() => {
        setActiveKeys(prev => [...prev, note]);
        setTimeout(() => setActiveKeys(prev => prev.filter(n => n !== note)), 400);
      }, i * sequenceDelay * 1000);
    });
    
    const chordStartTime = now + currentQuestion.notes.length * sequenceDelay;
    setTimeout(() => {
        currentQuestion.notes.forEach(note => {
            sampler.current.triggerAttackRelease(note, "2n", chordStartTime);
            setActiveKeys(prev => [...prev, note]);
            setTimeout(() => setActiveKeys(prev => prev.filter(n => n !== note)), 1500);
        });
    }, currentQuestion.notes.length * sequenceDelay * 1000);
    
    if (chordTimerRef.current) clearTimeout(chordTimerRef.current);
    chordTimerRef.current = setTimeout(() => {
      setIsPlayingChord(false);
      setUserInput([]);
      setFeedback(null);
    }, (currentQuestion.notes.length * sequenceDelay + 3.5) * 1000);
  };

  const handleMouseDown = (e) => {
    // 只有在非按键区域（容器背景）点击时才触发滚动拖拽
    if (e.target.closest('.piano-key-element')) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDragging.current = false; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const PianoKey = ({ note, isBlack }) => {
    const isHighlight = activeKeys.includes(note);
    const isSelected = userInput.includes(note);
    const feedbackActive = feedback !== null && isHighlight;
    
    return (
      <div 
        ref={el => keyRefs.current[note] = el}
        className={`relative flex-shrink-0 cursor-pointer select-none touch-none piano-key-element
          ${isBlack 
            ? 'w-10 h-28 -mx-5 z-10 rounded-b-md ' + (feedbackActive ? 'bg-amber-400 scale-95 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : isHighlight || isSelected ? 'bg-indigo-400 scale-95' : 'bg-slate-800 shadow-xl')
            : 'w-16 h-52 border-x border-slate-100 rounded-b-2xl ' + (feedbackActive ? 'bg-amber-100 shadow-[inset_0_0_15px_rgba(251,191,36,0.3)] translate-y-1' : isHighlight || isSelected ? 'bg-indigo-50 shadow-inner translate-y-1' : 'bg-white shadow-md')
          }
          ${isSelected && !isBlack && !feedbackActive ? 'bg-indigo-100 ring-2 ring-indigo-300' : ''}
          ${feedbackActive && !isBlack ? 'ring-4 ring-amber-400 ring-inset' : ''}
          active:scale-[0.97] transition-[background-color,transform,width] duration-75
        `}
        // 处理钢琴键盘的滑动交互
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          isPointerDownOnKey.current = true;
          playAndSelectNote(note);
        }}
        onPointerEnter={(e) => {
          // 如果指针已经按下，且滑入了新的按键，则触发
          if (isPointerDownOnKey.current && lastSlidedNote.current !== note) {
            playAndSelectNote(note);
          }
        }}
      >
        {(isSelected || isHighlight) && (
          <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full animate-pulse z-20 
            ${feedbackActive ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-indigo-500'}`} 
          />
        )}
        
        <span className={`absolute bottom-4 left-0 right-0 text-center text-[10px] font-bold pointer-events-none ${isBlack ? 'text-slate-400' : 'text-slate-300'}`}>
          {note.replace(/\d/, '')}
        </span>
      </div>
    );
  };

  const renderKeys = () => {
    const keys = [];
    for (let oct = 3; oct <= 4; oct++) {
      NOTES.forEach(name => {
        const note = `${name}${oct}`;
        const isBlack = name.includes('#');
        keys.push(<PianoKey key={note} note={note} isBlack={isBlack} />);
      });
    }
    keys.push(<PianoKey key="C5" note="C5" isBlack={false} />);
    return keys;
  };

  const cycleDifficulty = () => {
    setDifficulty(prev => {
        if (prev === 'NOVICE') return 'INTERMEDIATE';
        if (prev === 'INTERMEDIATE') return 'MASTER';
        return 'NOVICE';
    });
  };

  return (
    <div className="h-screen bg-[#0a0a1a] font-sans overflow-hidden flex flex-col relative text-slate-800">
      <div className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-md z-30 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg cursor-pointer" onClick={() => setGameState('menu')}>
            <Flame size={18} fill="currentColor" />
          </div>
          <div className="flex flex-col text-left">
             <h1 className="text-sm font-black text-amber-100 leading-none tracking-tight">Gobelet de Feu</h1>
             <p className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">和弦火焰杯</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={cycleDifficulty} className={`px-2 py-1 rounded-full text-white font-black text-[8px] uppercase transition-colors duration-300 shadow-md ${DIFFICULTY_LEVELS[difficulty].color}`}>
            {DIFFICULTY_LEVELS[difficulty].label}
          </button>
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full shadow-sm border border-white/20">
            <Star className="text-amber-400 fill-amber-400" size={12} />
            <span className="font-black text-amber-100 text-[10px]">{score}</span>
          </div>
        </div>
      </div>

      {gameState === 'menu' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <MagicBackgroundDecor />
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-amber-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-44 h-44 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 rounded-[3.5rem] shadow-2xl flex items-center justify-center relative z-10 border-2 border-white/20 overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
               <Flame size={90} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white italic tracking-tight drop-shadow-lg">和弦火焰杯</h2>
          <div className="mt-3 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full inline-block backdrop-blur-sm">
            <p className="text-amber-400 font-bold text-sm tracking-[0.2em]">送给杨团的孩子们</p>
          </div>
          
          <div className="flex flex-col gap-4 w-full max-w-[240px] mt-12 z-10">
            <button onClick={() => startLevel(false)} disabled={!isSamplerLoaded} className="group relative py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-[2rem] font-black text-lg shadow-[0_6px_0_#92400e] active:translate-y-1 active:shadow-none transition-all overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[45deg]" />
              <div className="flex items-center justify-center gap-2">
                <Zap size={22} fill="white" /> 接受试炼
              </div>
            </button>
            <button onClick={() => startLevel(true)} disabled={!isSamplerLoaded || mistakes.length === 0} className="py-3 bg-white/5 hover:bg-white/10 text-amber-200 border-2 border-amber-500/20 rounded-[2rem] font-black text-sm transition-all backdrop-blur-md">
              复习实验室 ({mistakes.length})
            </button>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
            Magic Music Academy 2024
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0a1a] z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-[#1a112e] via-[#0f172a] to-black opacity-90" />
             <MagicBackgroundDecor />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 z-10">
            {particles.map(p => <Particle key={p.id} {...p} />)}
            <div className={`w-full max-w-[320px] p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col transition-all duration-500 ${feedback === 'correct' ? 'bg-emerald-600 text-white' : 'bg-white/95 border-b-8 border-indigo-100'}`}>
              
              {isReviewMode && currentQuestion && (
                <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-[8px] font-black text-center py-1 uppercase tracking-widest">
                  需要连续成功 {3 - (currentQuestion.correctCount || 0)} 次
                </div>
              )}

              <div className="text-center mb-2 mt-4 h-6">
                <h3 className={`text-[10px] font-bold tracking-wider ${feedback === 'correct' ? 'text-white/80' : 'text-indigo-400'}`}>
                  {feedback === 'correct' ? '魔法共鸣成功！' : feedback === 'wrong' ? '它的魔法印记是：' : '听取火焰的低语，选择音符：'}
                </h3>
              </div>

              <div className="h-10 flex items-center justify-center mb-2">
                {feedback ? (
                  <div className="flex items-center gap-2 animate-in zoom-in">
                    <span className="text-3xl font-black">{currentQuestion?.rootNote}</span>
                    <span className="font-bold text-lg opacity-80">{currentQuestion?.typeName}</span>
                  </div>
                ) : (
                  <div className="text-indigo-100 text-2xl font-black animate-pulse tracking-[0.5em]">????</div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center min-h-[140px]">
                {!feedback ? (
                  <div className="flex flex-col items-center gap-4 relative">
                    <MagicDisplay key={currentMagicProp?.text} prop={currentMagicProp} onComplete={() => setCurrentMagicProp(null)} />
                    <button onPointerDown={() => playChord(currentQuestion?.notes || [], 1, false)} disabled={isPlayingChord} className={`p-7 rounded-full transition-all ${isPlayingChord ? 'bg-indigo-50 text-indigo-200' : 'bg-indigo-600 text-white shadow-xl active:scale-90 hover:shadow-indigo-300'}`}>
                      <Volume2 size={40} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                    {currentQuestion?.magicProps?.map((p, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${feedback === 'correct' ? 'bg-white/20' : 'bg-indigo-50/50'}`}>
                        <span className="text-xl">{p.icon}</span>
                        <div className="text-left leading-tight">
                          <div className={`text-[7px] font-bold uppercase ${feedback === 'correct' ? 'text-white/60' : 'text-indigo-400'}`}>{p.type}</div>
                          <div className={`text-xs font-black ${feedback === 'correct' ? 'text-white' : 'text-indigo-900'}`}>{p.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 justify-center h-2 overflow-hidden">
                {[...Array(currentQuestion?.notes?.length || 3)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < userInput.length ? 'w-8 bg-indigo-500' : 'w-2 bg-indigo-100'}`} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-2xl border-t border-white/20 pb-8 pt-4 flex flex-col gap-4 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
            <div ref={scrollContainerRef} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
               className="flex overflow-x-auto overflow-y-hidden scrollbar-hide select-none px-4 touch-pan-x">
               <div className="flex items-start pb-4 min-w-full justify-center">{renderKeys()}</div>
            </div>

            <div className="px-6 flex items-center gap-3 relative">
               <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-50 active:scale-90 flex-shrink-0" onClick={() => scrollContainerRef.current.scrollBy({left: -200, behavior: 'smooth'})}>
                 <ChevronLeft size={24} />
               </button>

               <div className="flex flex-1 items-center gap-3">
                 <button 
                  onClick={() => setUserInput([])} 
                  disabled={feedback || userInput.length === 0}
                  className="flex-1 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center gap-2 active:bg-slate-200 transition-colors disabled:opacity-30 border border-slate-200"
                 >
                   <RefreshCw size={18}/>
                   <span className="font-bold text-xs">重置仪式</span>
                 </button>
                 <button 
                   onClick={checkAnswer} 
                   disabled={userInput.length === 0 || feedback}
                   className={`flex-[2] h-12 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${userInput.length > 0 && !feedback ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                 >
                   <Zap size={18} fill={userInput.length > 0 ? "white" : "none"}/> 
                   <span className="text-sm">点燃火焰</span>
                 </button>
               </div>

               <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 border border-indigo-50 active:scale-90 flex-shrink-0" onClick={() => scrollContainerRef.current.scrollBy({left: 200, behavior: 'smooth'})}>
                 <ChevronRight size={24} />
               </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(45deg); opacity: 0; }
          10% { opacity: 1; }
          20% { transform: translateX(500px) translateY(500px) rotate(45deg); opacity: 0; }
          100% { transform: translateX(500px) translateY(500px) rotate(45deg); opacity: 0; }
        }
        .animate-shooting-star { animation: shooting-star 10s linear infinite; }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
        
        @keyframes spin-reverse-slow {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 60s linear infinite; }

        @keyframes fade-slow {
          0% { opacity: 0; transform: translateY(5px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }
        .animate-fade-slow { animation: fade-slow 2.5s ease-in-out forwards; }
        
        body { 
          margin: 0; 
          background-color: #0a0a1a; 
          touch-action: none; 
          height: 100vh; 
          width: 100vw; 
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default App;
