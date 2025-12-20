import React, { useState, useRef } from 'react';
import { BookOpen, Download, Heart, Quote, Hash, User, MapPin, Zap, Coffee, ArrowUpRight, Loader2, Layers, Moon, Stars } from 'lucide-react';
import html2canvas from "html2canvas";

// 1. 将子组件移到 App 外部，防止每次渲染都重新创建导致失去焦点
const InputGroup = ({ label, name, value, onChange, placeholder, icon: Icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3 text-amber-600" />} {label}
    </label>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value || ''} // 确保不为 undefined
      onChange={onChange}
      className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 outline-none transition"
    />
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: ' ',
    communityName: '与月言书·明亮的夜晚🌒',
    bookCount: ' ',
    favoriteBook: '',
    favoriteAuthor: '',
    topGenre: '',
    longestBook: '',
    relatableBook: '',
    comfortZoneBook: '',
    communityRec: '',
    rereadBook: '',
    impressiveEnvironment: '',
    favoriteCharacter: '',
    hardestBook: '',
    droppedBook: '',
    memorableQuote: '',
    theme: 'moonlight'
  });

  // 定制主题配置
  const themes = {
    moonlight: {
      id: 'moonlight',
      name: '月夜深蓝',
      bg: 'bg-[#0f172a]', // Slate-900 深蓝
      text: 'text-stone-50',
      accent: 'text-amber-200', // 月光金
      subtext: 'text-white',
      border: 'border-slate-700',
      fontFamily: '"Microsoft YaHei"',
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
      fontFamily: '"KingHwaOldSong"',
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
      fontFamily: '"KingHwaOldSong"',
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

  const exportImage = async () => {
    setLoading(true);
    try {
      const element = cardRef.current || document.getElementById("reading-card");
      if (!element) return;

      // ✅ 等字体和布局稳定（很重要）
      await document.fonts?.ready;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      // 保存原样式
      const originalPadding = element.style.padding;
      const originalBackground = element.style.background;
      const originalBorder = element.style.border;

      // 临时导出样式（你可以换成你的暗黑主题）
      element.style.padding = "40px";
      element.style.border = "12px solid rgba(255,255,255,0.10)";

      // 再等一帧让样式生效
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (el) => el?.hasAttribute?.("data-html2canvas-ignore"),

        // ✅ 关键：导出时修复 html2canvas 的 grid 计算问题
        onclone: (doc) => {
          // 1) 去 blur（避免发灰、发糊）
          doc.querySelectorAll(".glass-panel").forEach((p) => {
            p.style.backdropFilter = "none";
            p.style.webkitBackdropFilter = "none";
          });

          // 2) 把最容易挤成乱码的 grid 降级为 flex（只对导出副本生效）
          const style = doc.createElement("style");
          style.textContent = `
            /* KPI 那块：grid-cols-[1fr_auto_1fr_auto_1fr] 导出时用 flex */
            #reading-card .glass-panel.grid{
                display:flex !important;
                align-items:stretch !important;
                justify-content:space-between !important;
                gap:14px !important;
            }
            #reading-card .glass-panel.grid > div{
                flex:1 1 0 !important;
                min-width:0 !important;
            }
            #reading-card .glass-panel.grid .w-px{
                width:1px !important;
                flex:0 0 1px !important;
                align-self:stretch !important;
            }

            /* 其他 grid 保底（如果你有 grid-cols-2） */
            #reading-card .grid.grid-cols-2{
                display:flex !important;
                gap:16px !important;
            }
            #reading-card .grid.grid-cols-2 > div{
                flex:1 1 0 !important;
                min-width:0 !important;
            }
            /* 保证装饰 SVG 在纹理层之上 */
            #reading-card svg { position: relative; }
            #reading-card .z-20 { z-index: 20 !important; }
            #reading-card .z-0  { z-index: 0 !important; }
            `;
          doc.head.appendChild(style);
        },
      });

      // 下载
      const link = document.createElement("a");
      link.download = "reading-summary.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      // 恢复样式
      element.style.padding = originalPadding;
      element.style.background = originalBackground;
      element.style.border = originalBorder;
    } catch (e) {
      console.error(e);
      alert("导出失败：常见原因是 grid/backdrop-filter 或跨域图片。");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">

      {/* 左侧：输入控制区 */}
      <div className="w-full md:w-[400px] p-6 bg-white shadow-xl overflow-y-auto z-10 h-screen sticky top-0 border-r border-gray-100">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            2025年阅读总结
          </h1>
          <p className="text-xs text-gray-500 mt-1">设计人：小胖雀儿</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">02.选择月夜主题</label>
            <div className="flex gap-2">
              {Object.values(themes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFormData({ ...formData, theme: t.id })}
                  className={`flex-1 py-3 px-2 rounded text-xs transition-all border flex flex-col items-center gap-1 ${formData.theme === t.id
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

          {/* 核心问卷 - 2. 更新调用方式，显式传递 value 和 onChange */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider border-b pb-2">03. 年度回顾</h3>

            <InputGroup
              label="今年读到最喜欢的书是什么？"
              name="favoriteBook"
              value={formData.favoriteBook}
              onChange={handleInputChange}
              placeholder="最爱作品"
              icon={Heart}
            />
            <InputGroup
              label="今年最喜欢的作家是谁？"
              name="favoriteAuthor"
              value={formData.favoriteAuthor}
              onChange={handleInputChange}
              placeholder="最爱作家"
              icon={User}
            />
            <InputGroup
              label="今年读什么题材最多？"
              name="topGenre"
              value={formData.topGenre}
              onChange={handleInputChange}
              placeholder="科幻？历史？文学？推理？.."
              icon={Layers}
            />

            <div className="my-4 border-t border-dashed border-gray-200"></div>

            <InputGroup
              label="今年哪本书字数最多？"
              name="longestBook"
              value={formData.longestBook}
              onChange={handleInputChange}
              placeholder="大～～部头哇～"
              icon={Hash}
            />
            <InputGroup
              label="今年读的哪本书和你生活的关联最多？"
              name="relatableBook"
              value={formData.relatableBook}
              onChange={handleInputChange}
              placeholder="或许别人不喜欢，但是你最有共鸣的一本"
              icon={ArrowUpRight}
            />
            <InputGroup
              label="今年读的哪本书离你的舒适区最远？"
              name="comfortZoneBook"
              value={formData.comfortZoneBook}
              onChange={handleInputChange}
              placeholder="你平时不太会读的类型，还是今年一年都很舒适吗哈哈哈"
              icon={Zap}
            />
            <InputGroup
              label="今年你从群里种草的哪本书最满意？"
              name="communityRec"
              value={formData.communityRec}
              onChange={handleInputChange}
              placeholder="论水群的重要性（bushi"
              icon={BookOpen}
            />
            <InputGroup
              label="今年读到的哪本书有可能重读？"
              name="rereadBook"
              value={formData.rereadBook}
              onChange={handleInputChange}
              placeholder="值得重读之书"
              icon={Stars}
            />
            <InputGroup
              label="今年读哪本书时的环境让你记忆犹新？"
              name="impressiveEnvironment"
              value={formData.impressiveEnvironment}
              onChange={handleInputChange}
              placeholder="有猫的咖啡店？还是家里哪个角落？"
              icon={Heart}
            />
            <InputGroup
              label="今年最喜欢书里哪本书里的哪个人物？"
              name="favoriteCharacter"
              value={formData.favoriteCharacter}
              onChange={handleInputChange}
              placeholder="也有可能是个反派哦哇哈哈哈哈哈"
              icon={User}
            />
            <InputGroup
              label="今年最难啃的书是什么？"
              name="hardestBook"
              value={formData.hardestBook}
              onChange={handleInputChange}
              placeholder="阅读难度Max的书"
              icon={Zap}
            />
            <InputGroup
              label="今年有弃读的书吗？"
              name="droppedBook"
              value={formData.droppedBook}
              onChange={handleInputChange}
              placeholder="是登味太重？还是太无聊？"
              icon={Moon}
            />

            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Quote className="w-3 h-3 text-amber-600" /> 今年读到最喜欢的片段是什么？
              </label>
              <textarea
                name="memorableQuote"
                rows={3}
                value={formData.memorableQuote}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm outline-none resize-none"
                placeholder="摘录或描述情节..."
              />
            </div> */}

          </div>
        </div>
      </div>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-0 left-0 md:left-0 md:w-[400px] w-full p-4 bg-white border-t border-gray-200 z-20">
        <button
          onClick={exportImage}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
          {loading ? '正在生成...' : '生成总结长图'}
        </button>
      </div>

      {/* 右侧：预览区 */}
      <div className="flex-1 bg-gray-200 p-4 md:p-10 flex items-start justify-center overflow-auto">
        {/* 长图容器 */}
        <div
          ref={cardRef}
          id="reading-card"
          className={`relative w-[375px] shrink-0 ${currentTheme.shadow} transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text} overflow-hidden flex flex-col`}
          style={{ minHeight: '800px', fontFamily: currentTheme.fontFamily }}
        >
          {/* 装饰性背景：月亮与星光 */}
          <div className="absolute top-[-50px] right-[-50px] z-0 opacity-10 pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-current blur-3xl"></div>
          </div>
          {/* 使用绝对定位的 Moon 图标作为装饰
          <Moon
            className={`absolute top-12 right-6 z-20 pointer-events-none w-16 h-16 opacity-10 rotate-12 ${currentTheme.accent}`}
            fill="currentColor"
          />
          <Stars
            className={`absolute top-24 left-10 z-20 pointer-events-none w-8 h-8 opacity-20 ${currentTheme.accent}`}
          /> */}

          {/* 纹理背景 */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,...")` }}
          />

          {/* 内容区 */}
          <div className="relative z-10 px-6 py-8 flex flex-col h-full gap-6">

            {/* Header */}
            <div className="text-center border-b pb-6 relative" style={{ borderColor: 'currentColor', borderBottomWidth: '1px', borderStyle: 'solid', borderOpacity: 0.2 }}>
              <div className="flex justify-center mb-2 opacity-80">
                {/* 小Logo位置 */}
                <div className={`p-1 rounded-full border border-current`}>
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <h2 className={`text-3xl font-bold mb-2`}>2025 阅读总结</h2>
              <p className={`text-xs opacity-70 tracking-widest uppercase`}>The Stories We Shared With The Moon</p>
            </div>

            {/* 核心数据展示 - 修复对齐：使用双行Grid布局，实现底部对齐 */}
            {/* 核心数据展示 - 三栏居中对齐版 */}
            {/* 核心数据展示 - 顶部重点：阅读量、年度之书、年度作者 */}
            <div
              className={`glass-panel grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center justify-items-center px-6 py-6 rounded-lg ${currentTheme.decoration} bg-opacity-20 backdrop-blur-sm`}
            >
              {/* Column 1: 阅读量 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`text-xs opacity-100 ${currentTheme.subtext}`}>阅读总数</div>
                <div className="h-[2.5rem] flex items-center justify-center mt-2">
                  <div className={`text-2xl font-bold ${currentTheme.accent} leading-none`}>
                    {formData.bookCount || "-"}
                  </div>
                </div>
              </div>

              <div className="w-px bg-current opacity-20 self-stretch" />

              {/* Column 2: 年度之书 */}
              <div className="flex flex-col items-center text-center gap-2 px-2">
                <div className={`text-xs opacity-100 ${currentTheme.subtext}`}>年度作品</div>
                <div className="h-[2.5rem] flex items-center justify-center mt-2">
                  <div className={`text-lg font-bold ${currentTheme.accent} break-words leading-snug line-clamp-2`}>
                    {formData.favoriteBook || "-"}
                  </div>
                </div>
              </div>

              <div className="w-px bg-current opacity-20 self-stretch" />

              {/* Column 3: 最爱作者 */}
              <div className="flex flex-col items-center text-center gap-2 px-2">
                <div className={`text-xs opacity-100 ${currentTheme.subtext}`}>年度作家</div>
                <div className="h-[2.5rem] flex items-center justify-center mt-2">
                  <div className={`text-lg font-bold ${currentTheme.accent} break-words leading-snug line-clamp-2`}>
                    {formData.favoriteAuthor || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* 列表项组件 - 平行展示其他所有问题 */}
            <div className="space-y-4">
              {/* 统一的 Grid 布局 */}
              <div className="space-y-3">
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>最偏爱题材</div>
                  <div className="font-medium">{formData.topGenre || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>与生活关联最多的书</div>
                  <div className="font-medium">{formData.relatableBook || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>从群里种草的最喜欢的书</div>
                  <div className="font-medium">{formData.communityRec || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>有可能重读的书</div>
                  <div className="font-medium">{formData.rereadBook || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>阅读难度最大的书</div>
                  <div className="font-medium">{formData.hardestBook || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>忍不住弃读的书</div>
                  <div className="font-medium">{formData.droppedBook || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>字数最多的一本的书</div>
                  <div className="font-medium">{formData.longestBook || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>离舒适区最远的书</div>
                  <div className="font-medium">{formData.comfortZoneBook || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>记忆犹新的阅读环境</div>
                  <div className="font-medium italic opacity-90">{formData.impressiveEnvironment || '-'}</div>
                </div>
                <div className="relative pl-4 border-l-2" style={{ borderColor: 'currentColor' }}>
                  <div className={`text-xs ${currentTheme.subtext} opacity-80 mb-1`}>最喜欢的书中人物</div>
                  <div className="font-medium opacity-90">{formData.favoriteCharacter || '-'}</div>
                </div>
              </div>


              {/* Quote
              <div className={`glass-panel p-4 rounded-lg mt-4 ${currentTheme.decoration} bg-opacity-10 backdrop-blur-sm`}>
                <div className="flex items-center gap-2 opacity-60 mb-2">
                  <Quote className={`w-3 h-3 ${currentTheme.iconColor}`} />
                  <span className="text-xs font-bold tracking-widest uppercase">Highlight</span>
                </div>
                <p className={`text-sm leading-relaxed font-bold opacity-90 italic text-center px-2`}>
                  “{formData.memorableQuote}”
                </p>
              </div> */}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-8 pb-4 text-center">
              <div className="flex items-center justify-center gap-2 opacity-40 mb-3">
                <div className="h-px w-10 bg-current"></div>
                <Moon className="w-3 h-3" />
                <div className="h-px w-10 bg-current"></div>
              </div>
              <p className="text-sm font-bold opacity-90">
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
    </div >
  );
};

export default App;