import React, { useState, useRef } from 'react';
import { BookOpen, Download, Heart, Quote, Hash, User, MapPin, Zap, Coffee, ArrowUpRight, Loader2, Layers, Moon, Stars } from 'lucide-react';
// import html2canvas from 'html2canvas'; // 移除这行会导致编译错误的静态导入

const App = () => {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '你的名字',
    communityName: '与月言书·明亮的夜晚🌒',
    bookCount: '24',
    favoriteBook: '《悉达多》',
    favoriteAuthor: '赫尔曼·黑塞',
    topGenre: '哲学 / 心理学',
    longestBook: '《卡拉马佐夫兄弟》',
    relatableBook: '《蛤蟆先生去看心理医生》',
    comfortZoneBook: '《量子力学义理》',
    memorableEnv: '下暴雨的午后，在咖啡馆窗边',
    communityRec: '《纳瓦尔宝典》',
    memorableQuote: '“知识是甚至可以传授的，但智慧却无法传授。” —— 《悉达多》',
    theme: 'moonlight'
  });

  // 定制主题配置
  const themes = {
    moonlight: {
      id: 'moonlight',
      name: '月夜深蓝',
      bg: 'bg-[#0f172a]', // Slate-900 深蓝
      text: 'text-slate-200',
      accent: 'text-amber-200', // 月光金
      subtext: 'text-slate-400',
      border: 'border-slate-700',
      font: 'font-serif',
      decoration: 'bg-slate-800',
      shadow: 'shadow-xl shadow-slate-900',
      iconColor: 'text-amber-100'
    },
    silver: {
      id: 'silver',
      name: '皓月千里',
      bg: 'bg-[#f8fafc]', // Slate-50 极淡的银灰
      text: 'text-slate-700',
      accent: 'text-indigo-900', // 深邃的夜空蓝
      subtext: 'text-slate-400',
      border: 'border-slate-200',
      font: 'font-sans',
      decoration: 'bg-slate-200',
      shadow: 'shadow-2xl shadow-slate-200',
      iconColor: 'text-indigo-800'
    },
    paper: {
      id: 'paper',
      name: '灯下展卷',
      bg: 'bg-[#fdfbf7]', // 暖纸色
      text: 'text-stone-800',
      accent: 'text-amber-800',
      subtext: 'text-stone-500',
      border: 'border-stone-300',
      font: 'font-serif',
      decoration: 'bg-amber-100',
      shadow: 'shadow-xl shadow-stone-300',
      iconColor: 'text-amber-700'
    }
  };

  const currentTheme = themes[formData.theme];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 生成图片逻辑 - 改回动态加载以兼容所有环境
  const downloadImage = async () => {
    setLoading(true);
    try {
      // 检查是否已经加载了 html2canvas
      if (!window.html2canvas) {
        // 动态加载库
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const element = cardRef.current;
      // 临时移除阴影以获得更干净的边缘
      const originalShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';
      
      const canvas = await window.html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      
      // 恢复阴影
      element.style.boxShadow = originalShadow;

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${formData.name || '我的'}_2025月夜阅读总结.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('生成图片失败:', error);
      alert('抱歉，生成图片出错了，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  // 通用的输入框组件
  const InputGroup = ({ label, name, placeholder, icon: Icon }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3 text-amber-600" />} {label}
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 outline-none transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* 左侧：输入控制区 */}
      <div className="w-full md:w-[400px] p-6 bg-white shadow-xl overflow-y-auto z-10 h-screen sticky top-0 border-r border-gray-100">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            阅读问卷生成器
          </h1>
          <p className="text-xs text-gray-500 mt-1">定制主题：与月言书·明亮的夜晚</p>
        </div>

        <div className="space-y-6 pb-20">
          {/* 基础信息 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">01. 基础信息</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">昵称</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border-gray-300 border px-2 py-1.5 text-sm"
                  placeholder="你的名字"
                />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">阅读总数 (本)</label>
                <input
                  type="number"
                  name="bookCount"
                  value={formData.bookCount}
                  onChange={handleInputChange}
                  className="w-full rounded border-gray-300 border px-2 py-1.5 text-sm"
                />
              </div>
            </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">社群名称</label>
                <input
                  type="text"
                  name="communityName"
                  value={formData.communityName}
                  onChange={handleInputChange}
                  className="w-full rounded border-gray-300 border px-2 py-1.5 text-sm"
                />
              </div>
          </div>

          {/* 风格选择 */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">选择月夜主题</label>
             <div className="flex gap-2">
              {Object.values(themes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFormData({ ...formData, theme: t.id })}
                  className={`flex-1 py-3 px-2 rounded text-xs transition-all border flex flex-col items-center gap-1 ${
                    formData.theme === t.id 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${t.bg} border border-gray-300 block mb-1`}></span>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* 核心问卷 */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider border-b pb-2">02. 年度回顾</h3>
            
            <InputGroup label="今年最喜欢的书？" name="favoriteBook" placeholder="Top 1 书籍" icon={Heart} />
            <InputGroup label="今年最喜欢的作家？" name="favoriteAuthor" placeholder="作家名字" icon={User} />
            <InputGroup label="读得最多的题材？" name="topGenre" placeholder="如：科幻、历史..." icon={Layers} />
            
            <div className="my-4 border-t border-dashed border-gray-200"></div>
            
            <InputGroup label="字数最多的一本书？" name="longestBook" placeholder="最厚的一本" icon={Hash} />
            <InputGroup label="和生活关联最多的一本书？" name="relatableBook" placeholder="最有共鸣的一本" icon={ArrowUpRight} />
            <InputGroup label="离舒适区最远的一本书？" name="comfortZoneBook" placeholder="最难啃/最意外的一本" icon={Zap} />
            <InputGroup label="群里种草最满意的一本书？" name="communityRec" placeholder="社群推荐" icon={BookOpen} />
            
            <div className="my-4 border-t border-dashed border-gray-200"></div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" /> 记忆犹新的阅读环境？
              </label>
              <textarea
                name="memorableEnv"
                rows={2}
                value={formData.memorableEnv}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm outline-none resize-none"
                placeholder="描述那个时刻..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Quote className="w-3 h-3 text-amber-600" /> 印象最深的一段话/情节？
              </label>
              <textarea
                name="memorableQuote"
                rows={3}
                value={formData.memorableQuote}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm outline-none resize-none"
                placeholder="摘录或描述情节..."
              />
            </div>
          </div>
        </div>

        {/* 底部悬浮按钮 */}
        <div className="fixed bottom-0 left-0 md:left-0 md:w-[400px] w-full p-4 bg-white border-t border-gray-200 z-20">
          <button
            onClick={downloadImage}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
            {loading ? '正在生成...' : '生成总结长图'}
          </button>
        </div>
      </div>

      {/* 右侧：预览区 */}
      <div className="flex-1 bg-gray-200 p-4 md:p-10 flex items-start justify-center overflow-auto">
        {/* 长图容器 */}
        <div 
          ref={cardRef}
          id="reading-card"
          className={`relative w-[375px] shrink-0 ${currentTheme.shadow} transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text} overflow-hidden flex flex-col`}
          style={{ minHeight: '800px' }} 
        >
          {/* 装饰性背景：月亮与星光 */}
          <div className="absolute top-[-50px] right-[-50px] opacity-10 pointer-events-none">
             <div className="w-64 h-64 rounded-full bg-current blur-3xl"></div>
          </div>
          {/* 使用绝对定位的 Moon 图标作为装饰 */}
          <Moon 
            className={`absolute top-12 right-6 w-16 h-16 opacity-10 rotate-12 ${currentTheme.accent}`} 
            fill="currentColor"
          />
          <Stars 
            className={`absolute top-24 left-10 w-8 h-8 opacity-20 ${currentTheme.accent}`} 
          />

          {/* 纹理背景 */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")` }}>
          </div>

          {/* 内容区 */}
          <div className="relative z-10 px-6 py-8 flex flex-col h-full gap-6">
            
            {/* Header */}
            <div className="text-center border-b pb-6 relative" style={{ borderColor: 'currentColor', borderBottomWidth: '1px', borderStyle: 'solid',  borderOpacity: 0.2 }}>
              <div className="flex justify-center mb-2 opacity-80">
                 {/* 小Logo位置 */}
                 <div className={`p-1 rounded-full border border-current`}>
                   <BookOpen className="w-4 h-4" />
                 </div>
              </div>
              <h2 className={`text-3xl font-bold tracking-tight mb-2 ${currentTheme.font}`}>2025 阅读总结</h2>
              <p className={`text-xs opacity-70 tracking-widest uppercase ${currentTheme.font}`}>The Stories We Shared With The Moon</p>
            </div>

            {/* 核心数据展示 */}
            <div className={`flex justify-between items-center py-5 px-4 rounded-lg ${currentTheme.decoration} bg-opacity-20 backdrop-blur-sm`}>
              <div className="text-center">
                <div className={`text-xs opacity-60 mb-1 ${currentTheme.subtext}`}>阅读总数</div>
                <div className={`text-2xl font-bold ${currentTheme.accent}`}>{formData.bookCount || '-'}</div>
              </div>
              <div className="w-px h-8 bg-current opacity-20"></div>
              <div className="text-center">
                <div className={`text-xs opacity-60 mb-1 ${currentTheme.subtext}`}>偏爱题材</div>
                <div className={`text-sm font-bold ${currentTheme.accent} max-w-[100px] truncate`}>{formData.topGenre || '-'}</div>
              </div>
              <div className="w-px h-8 bg-current opacity-20"></div>
              <div className="text-center">
                <div className={`text-xs opacity-60 mb-1 ${currentTheme.subtext}`}>最爱作家</div>
                <div className={`text-sm font-bold ${currentTheme.accent} max-w-[100px] truncate`}>{formData.favoriteAuthor || '-'}</div>
              </div>
            </div>

            {/* 列表项组件 */}
            {/* Section 1: 年度之最 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-60">
                 <Heart className={`w-4 h-4 ${currentTheme.iconColor}`} fill={formData.theme === 'moonlight' ? "currentColor" : "none"} />
                 <span className="text-xs font-bold tracking-widest uppercase">The Best</span>
              </div>
              
              <div className="space-y-1">
                <div className={`text-xs ${currentTheme.subtext}`}>年度最爱 TOP 1</div>
                <div className={`text-lg font-bold ${currentTheme.font} ${currentTheme.accent} border-l-2 pl-3`} style={{ borderColor: 'currentColor' }}>
                  {formData.favoriteBook || '尚未填写'}
                </div>
              </div>

              <div className="space-y-1 mt-4">
                <div className={`text-xs ${currentTheme.subtext}`}>社群种草最满意</div>
                <div className={`text-base font-bold ${currentTheme.font} border-l-2 pl-3 opacity-90`} style={{ borderColor: 'currentColor' }}>
                  {formData.communityRec || '尚未填写'}
                </div>
              </div>
            </div>

             {/* 分割线 */}
             <div className="border-t border-dashed opacity-20"></div>

            {/* Section 2: 阅读足迹 */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 opacity-60">
                 <MapPin className={`w-4 h-4 ${currentTheme.iconColor}`} />
                 <span className="text-xs font-bold tracking-widest uppercase">Footprints</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                   <div className={`absolute -left-3 top-2 w-1 h-1 rounded-full ${currentTheme.accent}`}></div>
                   <div className={`text-xs ${currentTheme.subtext} mb-1`}>字数最多 / 最厚的一本</div>
                   <div className="font-medium">{formData.longestBook || '-'}</div>
                </div>
                
                <div className="relative">
                   <div className={`absolute -left-3 top-2 w-1 h-1 rounded-full ${currentTheme.accent}`}></div>
                   <div className={`text-xs ${currentTheme.subtext} mb-1`}>生活关联最强 / 最有共鸣</div>
                   <div className="font-medium">{formData.relatableBook || '-'}</div>
                </div>

                <div className="relative">
                   <div className={`absolute -left-3 top-2 w-1 h-1 rounded-full ${currentTheme.accent}`}></div>
                   <div className={`text-xs ${currentTheme.subtext} mb-1`}>离舒适区最远 / 挑战之书</div>
                   <div className="font-medium">{formData.comfortZoneBook || '-'}</div>
                </div>
              </div>
            </div>

            {/* Section 3: 记忆与时刻 */}
            <div className="space-y-4 pt-2">
               <div className="flex items-center gap-2 opacity-60">
                 <Coffee className={`w-4 h-4 ${currentTheme.iconColor}`} />
                 <span className="text-xs font-bold tracking-widest uppercase">Moments</span>
              </div>

              <div className={`p-4 rounded-lg ${currentTheme.decoration} bg-opacity-20 backdrop-blur-sm`}>
                 <div className={`text-sm italic opacity-90 leading-relaxed ${currentTheme.font}`}>
                    “{formData.memorableEnv || '...'}”
                 </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-2">
               <div className="flex items-center gap-2 opacity-60 mb-3">
                 <Quote className={`w-4 h-4 ${currentTheme.iconColor}`} />
                 <span className="text-xs font-bold tracking-widest uppercase">Highlight</span>
              </div>
              <div className="relative py-2">
                 <Quote className={`absolute -top-1 -left-1 w-4 h-4 ${currentTheme.accent} opacity-40 transform -scale-x-100`} />
                 <p className={`text-lg leading-relaxed font-bold opacity-90 ${currentTheme.font} px-4`}>
                   {formData.memorableQuote || '等待一段触动灵魂的文字...'}
                 </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 opacity-40 mb-3">
                 <div className="h-px w-10 bg-current"></div>
                 <Moon className="w-3 h-3" />
                 <div className="h-px w-10 bg-current"></div>
              </div>
              <p className="text-sm font-bold tracking-widest opacity-90">
                 {formData.communityName}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2 opacity-50 text-[10px] font-mono">
                 <span>{formData.name || 'READER'}</span>
                 <span>·</span>
                 <span>2025</span>
              </div>
            </div>

          </div>
          
          {/* 底部装饰条 */}
          <div className={`h-1.5 w-full ${currentTheme.decoration} opacity-40 mt-auto`}></div>
        </div>
      </div>
    </div>
  );
};

export default App;