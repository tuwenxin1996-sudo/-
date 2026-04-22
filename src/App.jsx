import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  Monitor,
  Database,
  Layout,
  Briefcase,
  Award,
  Zap,
  Globe,
  X,
  AlertCircle,
  Settings,
  RefreshCw,
  Layers,
  Sparkles,
  Search,
  Eye,
  ChevronRight,
  Menu,
  Terminal,
  Cpu,
  Video,
  Music,
  PenTool,
  Upload,
  Image as ImageIcon,
  MousePointer2,
  GitMerge,
  Star,
  Clapperboard,
  HardDrive,
  MessageSquare,
  Scissors,
  DollarSign,
  PieChart,
  Rocket,
  Code2,
  Smartphone,
  Stethoscope,
  Lightbulb,
  BookCopy,
  Building2,
  FileText,
  Presentation
} from 'lucide-react';


const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      id: 3,
      category: 'Hackathon',
      title: '笔镜 NoteLens: 小红书 AI 搜索监测 SaaS',
      shortDesc: '针对小红书“点点AI”搜索入口的 GEO 监测工具。48h 黑客松极速原型，填补品牌方在 AI 搜索归因领域的空白。',
      impact: 'WAB (周活品牌) 增长指标',
      tags: ['AI Coding', 'GEO 方法论', '市场空白'],
      details: {
        role: "独立开发者 & 产品经理 (Full-stack AI Coding & Product Strategy)",
        background: "笔镜 NoteLens 诞生于对小红书‘点点AI’搜索机制的深度洞察。点点AI 的内容池封闭、引用单元原子化、用户决策链路前置，决定了品牌方必须在账号矩阵与内容维度重建监测体系。NoteLens 旨在系统化监测品牌在 AI 搜索中的可见度与引用表现。",
        coreValue: "可视化归因。让品牌方第一次看见自己在 AI 搜索中的分布，并基于 GEO（Generative Engine Optimization）方法论提供‘下一步该做什么’的具体建议。",
        northStar: { label: "周活品牌数 (WAB)", desc: "反映产品对品牌方持续价值与数据更新新鲜度。" },
        positioning: {
          is: ["点点AI 单场景深度监测工具", "独立 SaaS 产品 / 监控+诊断+建议", "品牌运营决策支持"],
          not: ["小红书全站数据工具 (非千瓜替代品)", "投放/执行/接单平台", "通用 GEO 平台扩展"]
        },
        userProfiles: [
          { name: "Linda", role: "美妆品牌运营总监", pain: "无法量化投放内容在 AI 搜索中的引用率，难以根据 AI 趋势优化矩阵策略。" },
          { name: "David", role: "3C 品牌内容策划", pain: "缺乏底层反馈，想知道什么类型的笔记更容易被点点AI 引用以指导创作。" }
        ],
        contribution: [
          { label: "AI 协同全栈研发", icon: <Code2 size={16} />, desc: "通过 AI Coding 在 48h 内完成从需求拆解到 Vite + Tailwind + Shancn/UI 的全栈交付。" },
          { label: "GEO 监测体系构建", icon: <Target size={16} />, desc: "定义点点AI 搜索下的引用单元原子化归因逻辑，填补品牌级监测空白。" },
          { label: "多场景价值闭环", icon: <Layers size={16} />, desc: "设计了从日常巡检 (S1) 到内容策略反推 (S5) 的全链路业务场景。" },
          { label: "高保真 LUI 交互呈现", icon: <Layout size={16} />, desc: "利用 LSI 混合交互逻辑，实现类似飞书的平滑、沉浸式数据分析体验。" }
        ],
        solutions: [
          "功能完整性：P0 级功能 100% 上线，引用识别准确率 ≥ 92%，验证了 AI Coding 的交付质量。",
          "数据新鲜度：核心问答 T+1 完成率 ≥ 95%，确保护肤/美妆类高活品牌的数据时效。",
          "商业验证：MVP 阶段即获得 3 家种子客户付费意愿，验证了‘可见性归因’的客单价值。"
        ],
        screenshots: [
          {
            title: "全景数据仪表盘",
            desc: "一站式汇总品牌可见度指标与核心告警流。适配运营总监日常决策场景，实现数据驱动的实时预警 (S1)。",
            rationale: "场景化聚合：将复杂的搜推指标转化为颗粒度适中的决策信号，消除信息过载。",
            imgUrl: "/assets/notelens-dashboard.png"
          },
          {
            title: "小红书“点点AI”表现分析",
            desc: "深度钻取 AI 搜索池占位表现。通过多维雷达图与健康度趋势，量化品牌在封闭生态内的存量资产价值。",
            rationale: "资产确权：首次实现对 AI 搜索推荐逻辑的黑盒透视，量化品牌资产被引深度。",
            imgUrl: "/assets/notelens-diandian.png"
          },
          {
            title: "矩阵账号监测中心",
            desc: "穿透主号、子号、员工号及合作 KOL 的多层级矩阵。自动评估不同账号对于 AI 引用的实际贡献权重 (S4)。",
            rationale: "协同归因：解决‘谁在被引用’的难题，实现对矩阵账号群的精细化效率评估。",
            imgUrl: "/assets/notelens-matrix.png"
          },
          {
            title: "笔记级原子化归因监测",
            desc: "追踪单篇笔记被 AI 搜索引用的时效与片段特征。识别‘高潜力被引’内容模版，驱动内容策略生成 (S5)。",
            rationale: "内容闭环：将 AI 引用结果反推至前置创作端，形成‘生产-反馈-优化’的正向循环。",
            imgUrl: "/assets/notelens-note.png"
          },
          {
            title: "竞品对比分析矩阵",
            desc: "横向对比品牌与竞品在 AI 下的占有率差距 (S3)。多指标 Top N 排行，识别策略性防御与进攻机会。",
            rationale: "竞争穿透：打破数据孤岛，在 AI 搜索的新战场上建立实时的动态竞争象限。",
            imgUrl: "/assets/notelens-competitor.png"
          },
          {
            title: "话题与问题分析中心",
            desc: "监测 AI 环境中高频出现的检索话题与品牌讨论趋势。颗粒度对齐‘爆款感’热词，捕捉语义级商业机会。",
            rationale: "语义洞察：将 AI 的黑盒生成拆解为可被运营理解的话题标签占比。",
            imgUrl: "/assets/notelens-topic.png"
          },
          {
            title: "策略建议与智能告警",
            desc: "基于规则引擎自动产出诊断报告与优化清单。实时监控流量异动，大幅降低运营响应延迟。",
            rationale: "行动导向：不只是呈现数据，而是通过告警流强制驱动运营执行闭环。",
            imgUrl: "/assets/notelens-strategy.png"
          },
          {
            title: "工业级 PDF 报告导出",
            desc: "一站式生成标准品牌周/月报。支持多维指标透视与图表自动生成，完美适配向上汇报场景 (S2)。",
            rationale: "汇报降本：将数小时的人工数据整理工作压缩至秒级导出，提升组织效能。",
            imgUrl: "/assets/notelens-report.png"
          },
          {
            title: "全维参数监测配置",
            desc: "灵活管理品牌主关键词、竞品实体及监控账号矩阵。支持问题库一键同步与告警规则深度定制。",
            rationale: "系统底座：提供高自由度的监测粒度控制，确保 AIGC 数据采集的纯净度与相关性。",
            imgUrl: "/assets/notelens-config.png"
          }
        ]
      }
    },

    {
      id: 2,
      category: 'Agent',
      title: '漫剧智能体 Catimind.Ani 0-1 孵化',
      shortDesc: '构建多角色 AI Agent 协同体系。将漫剧生产周期从 7 天缩短至 24 小时。',
      impact: '生产效率提升 70%',
      tags: ['Agentic Workflow', '角色锁定', '工业化创作'],
      details: {
        role: "AI 产品经理 (AI Product Manager)",
        background: "基于 AI 的自动化漫剧（短剧）生成工具，实现单人完成从剧本到成品的全流程制作。核心解决传统漫剧制作多人协作、周期长、成本高的痛点。",
        coreValue: "降低制作门槛。通过多 Agent 协同，使用户仅需输入剧本即可自动生成配音漫剧视频，实现单人全流程操作。",
        targetUsers: [
          { label: "网文作者", desc: "IP 漫剧化快速预览" },
          { label: "漫画创作者", desc: "静态作品动态化升级" },
          { label: "视频创作者", desc: "高效短视频内容生产" },
          { label: "MCN 机构", desc: "批量化内容矩阵产出" }
        ],
        contribution: [
          { label: "多 Agent 功能规划", icon: <Cpu size={16} />, desc: "负责多 Agent 协同功能及 DAG 工作流组合的规划与闭环搭建。" },
          { label: "分镜编辑模块落地", icon: <Clapperboard size={16} />, desc: "主导分镜视频编辑模块的产品设计，确交互与生成逻辑的确定性。" },
          { label: "资产管理体系构建", icon: <HardDrive size={16} />, desc: "搭建资源资产管理体系（Character Assets），确保跨场景角色一致性。" },
          { label: "案例实操全链路验证", icon: <Star size={16} />, desc: "通过多重案例实操，验证从文本输入到视频产出的工业化链路稳定性。" }
        ],
        debugging: [
          { issue: "人物一致性", cause: "远近景切换脸部偏差", fix: "拼合图制作法 (分镜图 + 人物形象拼合) 或 9 宫格分镜法" },
          { issue: "字幕干扰", cause: "对话分镜随机出现文字", fix: "提示词优化，加强特定词汇控制力" },
          { issue: "镜头失衡", cause: "特写过多，远景过少", fix: "优化分镜摄影系统提示词，强制平衡镜头类型" },
          { issue: "动态感不足", cause: "画面死板，动作僵硬", fix: "动态词库引导，增强运镜指令权重" },
          { issue: "独白识别", cause: "独白被误识别为对白", fix: "导演模块新增独白规则，独立划分画面镜头" }
        ],
        costEfficiency: {
          strategy: "分级调度策略 (Stratified Scheduling)。在工具端通过代码逻辑设置分级频道。",
          tiers: [
            { name: "低成本体验", desc: "90% 镜头走普通通道，10% 关键镜头路由至 Pro 通道。", cost: "约 27.91 元/分" },
            { name: "中端稳定版", desc: "关键镜头使用 Sora 2 Pro 或内部微调模型。", cost: "约 43.05 元/分" },
            { name: "旗舰全效版", desc: "全片采用 Pro 通道自研逆向管线。", cost: "约 77.55 元/分" }
          ],
          logic: "相比原厂 600 元/分的成本，将总成本控制在 100 元以内，同时保证核心画质。"
        },
        agents: [
          {
            id: "screenwriter",
            name: "编剧 Agent",
            role: "The Screenwriter",
            icon: <PenTool size={20} />,
            desc: "语义拆解。提取角色、场景、对白。输出分镜剧本 (JSON)。"
          },
          {
            id: "art-director",
            name: "视觉导演 Agent",
            role: "The Art Director",
            icon: <Layers size={20} />,
            desc: "风格管控。生成 Character Seed。锁定角色视觉一致性。"
          },
          {
            id: "storyboarder",
            name: "分镜师 Agent",
            role: "The Storyboarder",
            icon: <Layout size={20} />,
            desc: "静态故事板。生成预览供确认，支持单镜头 In-painting 重绘。"
          },
          {
            id: "production",
            name: "后期制片 Agent",
            role: "The Production Suite",
            icon: <Video size={20} />,
            desc: "后期合成。调用 SV3D 动感模型，挂载 Suno 进行情感配音。"
          }
        ],
        screenshots: [
          {
            title: "Catimind 智作首页",
            desc: "一句话开启创作。支持故事梗概/人物小传导入，利用 AI 快速构建具备节奏感的漫剧世界。",
            rationale: "极简入口：降低 AI 模型参数对用户的认知干扰。",
            imgUrl: "/assets/catimind-home.png"
          },
          {
            title: "剧本拆解与参数配置",
            desc: "AI 自动提取剧本摘要、角色形象及主要情节。支持分集管理与多比例（9:16/16:9）适配。",
            rationale: "结构化转换：将非线性创意转化为可量化的生产任务。",
            imgUrl: "/assets/catimind-config.png"
          },
          {
            title: "角色与道具设计中心",
            desc: "基于 Lora 与 ControlNet 锁定角色一致性。支持 3D 姿态引导及道具细节深度定制。",
            rationale: "视觉连续性：通过工业级资产管理，解决 AIGC 角色频闪问题。",
            imgUrl: "/assets/catimind-assets.png"
          },
          {
            title: "分镜图片批量生成",
            desc: "基于拼合图法的一键分镜生成。支持多参微调、局部重绘及镜头角度精确控制。",
            rationale: "工业化产出：将单点生图升级为管线化批量交付。",
            imgUrl: "/assets/catimind-storyboard.png"
          },
          {
            title: "分镜首帧图视频合成",
            desc: "调用 SVD/SV3D 赋予画面动态感。集成音色参考与情感配音，实现成品预览级产出。",
            rationale: "全链路闭环：完成从文字到动态影像的最后一公里交付。",
            imgUrl: "/assets/catimind-video.png"
          },
          {
            title: "全量项目资产管理",
            desc: "支持剧本、素材、成片及音频的分类管理。通过状态驱动的列表逻辑，确保生产全链路透明。",
            rationale: "工业级效能：利用扁平化管理架构，消除传统制作中的文件查找损耗。",
            imgUrl: "/assets/catimind-asset-mgmt.png"
          },
          {
            title: "3D 可视化角度编辑器",
            desc: "创新的镜头控制方案。通过拖拽三轴球体实时调整摄像机方位与聚焦中心，实现精确到角度的分镜控制。",
            rationale: "确定性交互：将复杂的坐标参数设计为直观的空间几何，极大幅度提升分镜调整效率。",
            imgUrl: "/assets/catimind-angle-editor.png"
          }
        ]
      }
    },
    {
      id: 1,
      category: 'AIGC',
      title: '百丽国际: AIGC Fashion 工作流重构',
      shortDesc: '针对 P0 级业务需求，重构时尚行业从趋势预测到视觉产出的全链路生产管线。',
      impact: '效率提升 85%',
      tags: ['业务数字化', 'LUI+GUI 混合交互', 'SOP 闭环'],
      details: {
        background: "为了快速响应市场需求，优先解决 P0 级核心诉求，目标直指精准趋势预测与上线周期优化。通过 AI 技术重构从趋势洞察到视觉交付的全流程。",
        pipeline: [
          {
            stage: "信息导入环节 (Input)",
            icon: <Upload size={18} />,
            color: "blue",
            tasks: [
              { label: "参考图上传与解析", desc: "由于后台大模型自动识别服装特征，生成基础提示词。" },
              { label: "提示词微调 (LUI)", desc: "用户交互判断提示词可用性，手动微调核心语义。" },
              { label: "风格模版/LoRA 注入", desc: "选择预设风格模版或加载特定 LoRA 权重进行精度控制。" }
            ]
          },
          {
            stage: "图片生成环节 (Process)",
            icon: <ImageIcon size={18} />,
            color: "purple",
            tasks: [
              { label: "生成策略配置", desc: "选择场景图、模特图或组合图生成路径，配置 3D 辅助功能。" },
              { label: "多维特征锁定", desc: "细化配置季节、环境、时段、人种、体型、姿态及拍摄角度。" },
              { label: "大模型推理渲染", desc: "基于锁定参数进行工业级推理，生成初步视觉稿。" }
            ]
          },
          {
            stage: "最终修正环节 (Refine)",
            icon: <GitMerge size={18} />,
            color: "green",
            tasks: [
              { label: "可用性判定 (QC)", desc: "用户对生成稿进行质量评估，决定是否进入二次修正。" },
              { label: "局部重绘与合成", desc: "针对瑕疵处进行单人/单图局部重绘或背景合成。" },
              { label: "工业级产出", desc: "渲染完成并导出可直接用于营销渠道的高保真视觉资产。" }
            ]
          }
        ],
        painPoints: [
          { title: "数据滞后与整合度低", desc: "缺乏统一数据基座，各环节理解偏差，导致趋势预测混乱，决策效率低。" },
          { title: "展示成本与退货风险", desc: "传统拍摄费用高昂；不智能的展示导致客户试错成本高，退换货损失大。" },
          { title: "跨部门协作执行偏差", desc: "设计与市场部缺乏可视化评比资料，导致交付偏差逐级放大。" }
        ],
        solutions: [
          "整合趋势网站与内部数据库，利用 AI 实现精准趋势图表整合与预测。",
          "建立 AI 场景与模特微调模型，提升展示体验，预计节省 20%-30% 拍摄成本。",
          "通过 AI 生成多模态可视化资料，对齐各部门理解，确保任务交付零偏差。"
        ],
        screenshots: [
          {
            title: "AI 综合趋势预测看板",
            desc: "基于过去 5 年品牌关注度走势，利用 AI 情绪分析与长尾效应分析，实现 2025 年爆款流行色与款式的精准预测。",
            rationale: "数据可视化中台：将碎片化市场情绪转化为可量化的增长指数。",
            imgUrl: "/assets/trend-dashboard.png"
          },
          {
            title: "细粒度设计趋势预测工作台",
            desc: "支持按色彩、面料、款式等维度进行多维组合筛选。系统自动抓取并解析过去 7 天热门竞品的核心设计特征。",
            rationale: "结构化洞察 (Structured Insight)：将市场爆款拆解为可复用的设计标签。",
            imgUrl: "/assets/design-workbench.png"
          },
          {
            title: "LUI+GUI 混合生图界面",
            desc: "将复杂的 ControlNet、LoRA 触发词等底层参数封装为直观的创作节点。支持一键 3D 生成与场景/模特自动化合成。",
            rationale: "降门槛设计：通过视觉模版直接透明化算法逻辑，让非技术背景人员也能实现工业级产出。",
            imgUrl: "/assets/aigc-ui.png"
          },
          {
            title: "设计/营销决策工作台",
            desc: "过去 7 天热门设计纪要与营销活动回顾。通过 AI 辅助生成的“最新流行色+经典版型”进行跨部门预热。",
            rationale: "信息对称场：利用飞书式的信息聚合逻辑，消除部门间的信息孤岛。",
            imgUrl: "/assets/collab-workspace.png"
          }
        ]
      }
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab || (activeTab === 'all'));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2329] font-sans selection:bg-[#3370FF] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#3370FF] rounded-lg md:rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">T</div>
            <span className="text-lg md:text-xl font-black tracking-tighter uppercase italic whitespace-nowrap">Wenxin Tu</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#about" className="hover:text-[#3370FF] transition-all">学术背景</a>
            <a href="#expertise" className="hover:text-[#3370FF] transition-all">能力矩阵</a>
            <a href="#projects" className="hover:text-[#3370FF] transition-all">实战案例</a>
            <button className="bg-[#1F2329] text-white px-8 py-3 rounded-full hover:bg-[#3370FF] transition-all shadow-xl hover:shadow-blue-200 flex items-center gap-2">
              <Zap size={14} className="fill-current" /> 业务咨询
            </button>
          </div>

          <button 
            className="lg:hidden p-2 text-slate-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] bg-white z-[90] animate-in slide-in-from-top duration-300">
            <div className="flex flex-col items-center gap-8 pt-12 text-lg font-black uppercase tracking-widest">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>学术背景</a>
              <a href="#expertise" onClick={() => setIsMobileMenuOpen(false)}>能力矩阵</a>
              <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>实战案例</a>
              <button className="mt-4 bg-[#3370FF] text-white px-10 py-4 rounded-full shadow-xl shadow-blue-200">业务咨询</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="about" className="py-24 md:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="bg-slate-900 rounded-[40px] md:rounded-[80px] p-10 md:p-32 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#3370FF15,transparent)]" />
            <div className="relative z-10 grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
              <div className="lg:col-span-12 xl:col-span-7 space-y-8 md:space-y-10 text-center xl:text-left">
                <div className="inline-flex items-center gap-4 text-[#3370FF] font-black text-xs uppercase tracking-[0.4em]">
                  <Award size={24} /> Academic & Professional Background
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">英国创意艺术大学 设计学硕士一等学位毕业</h2>
                <div className="text-xl md:text-2xl text-blue-400 font-black uppercase italic tracking-widest mt-2">沈阳大学 设计系毕业成绩综合排名 第二名</div>
                <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium italic">
                  “最好的顾问，必须同时具备"读懂业务"的结构性洞察与"快速验证"的极速执行力。借助 AI 工具协同，我能将客户复杂诉求在极短周期内转化为可感知的业务价值。”
                </p>
                <div className="flex flex-wrap justify-center xl:justify-start gap-10 md:gap-14 pt-6">
                   <div><div className="text-3xl md:text-5xl font-black text-white">4+ Yrs</div><div className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">AI 实战经验</div></div>
                   <div><div className="text-3xl md:text-5xl font-black text-white">3+</div><div className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">标杆落地项目</div></div>
                   <div><div className="text-3xl md:text-5xl font-black text-white">22W+</div><div className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">内容影响力</div></div>
                </div>
              </div>
              <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                 <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[40px] space-y-4">
                    <h3 className="text-white text-xl font-black italic uppercase tracking-tighter flex items-center gap-3"><FileText size={20} className="text-[#3370FF]" /> 核心方法论</h3>
                    <ul className="space-y-3">
                      {['业务场景诊断 → 效能基线建立', '工具选型与解决方案设计', '项目启动 · 推进 · 落地 · 复盘', '标杆沉淠与行业 Playbook 输出'].map((m, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                          <div className="w-1.5 h-1.5 bg-[#3370FF] rounded-full shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[40px] space-y-4">
                    <h3 className="text-white text-xl font-black italic uppercase tracking-tighter flex items-center gap-3"><Building2 size={20} className="text-[#3370FF]" /> 行业实践领域</h3>
                    <div className="flex flex-wrap gap-2">
                      {['时尚零售', '内容 MCN', '电商品牌', 'AIGC 内容生产', '数字营销', 'SaaS 产品'].map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/10 text-slate-300 text-[10px] font-bold rounded-full uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Matrix Section */}
      <section id="expertise" className="py-20 md:py-32 bg-[#F8FAFC] border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 text-[#3370FF] font-black text-xs uppercase tracking-[0.3em] mb-6">
              <Sparkles size={16} /> Core Competency Matrix
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">能力矩阵</h2>
              <p className="text-slate-400 font-medium max-w-lg md:text-right leading-relaxed text-sm">
                以行业业务专家视角，将复杂组织问题沉淀为可规模化复制的效能解决方案。
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Stethoscope size={26} />,
                num: '01',
                title: '行业业务\n诊断',
                en: 'Industry Diagnosis',
                desc: '对中大型客户的复杂业务进行全面梳理与深度诊断，识别关键场景痛点，构建效能改善基线，树立行业标杆实践。',
                tags: ['业务梳理', '场景识别', '痛点量化']
              },
              {
                icon: <Lightbulb size={26} />,
                num: '02',
                title: '效能方案\n设计落地',
                en: 'Solution Delivery',
                desc: '结合飞书及 AI 工具设计端到端解决方案。完整负责项目启动、推进、落地与复盘，交付阶段性里程碑成果。',
                tags: ['飞书方案', 'AI 工具整合', '项目复盘']
              },
              {
                icon: <Presentation size={26} />,
                num: '03',
                title: '高层价值\n传递对话',
                en: 'Executive Engagement',
                desc: '主导客户高层拜访与战略价值传递，将效能改善与工具价值转化为高管语言，建立长期稳定合作信任。',
                tags: ['高管对话', '价值感知', '关系维护']
              },
              {
                icon: <BookCopy size={26} />,
                num: '04',
                title: '方案沉淀\n可复制化',
                en: 'Replication & Scale',
                desc: '提炼项目经验为高复制性行业 Playbook，撰写方案文档，形成标杆案例，构建行业影响力与知识资产。',
                tags: ['方案文档', '行业 Playbook', '标杆影响力']
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 md:p-10 bg-white rounded-[40px] border border-slate-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#3370FF] group-hover:bg-[#3370FF] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="text-[52px] font-black text-slate-100 group-hover:text-blue-50 transition-colors leading-none">{item.num}</div>
                </div>
                <div className="text-[10px] text-[#3370FF] font-black uppercase tracking-widest mb-2">{item.en}</div>
                <h3 className="text-2xl font-black tracking-tight uppercase italic whitespace-pre-line mb-4 leading-snug">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1 mb-8">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-wider border border-slate-100 group-hover:border-blue-100 transition-colors">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">标杆实战案例</h2>
            <div className="flex flex-wrap gap-2 text-wrap">
              {['all', 'Hackathon', 'Agent', 'AIGC'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black transition-all uppercase tracking-widest border ${activeTab === tab ? 'bg-[#3370FF] text-white border-[#3370FF]' : 'bg-white text-slate-500 border-slate-100'}`}
                >
                   {tab === 'all' ? '全部' : 
                    tab === 'Hackathon' ? '黑客松极客' : 
                    tab === 'AIGC' ? '工业化 AIGC' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredProjects.map((p) => (
              <div 
                key={p.id}
                onClick={() => p.details && setSelectedProject(p)}
                className={`bg-white rounded-3xl md:rounded-[40px] overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-blue-100 p-8 md:p-10 ${p.details ? 'cursor-pointer' : ''}`}
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-tighter">{tag}</span>
                  ))}
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-4 leading-tight group-hover:text-[#3370FF] transition-colors uppercase">{p.title}</h3>
                <p className="text-slate-500 text-sm mb-8 flex-1 font-medium leading-relaxed">{p.shortDesc}</p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Impact</div>
                    <div className="text-[#3370FF] text-xl font-black italic">{p.impact}</div>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#3370FF] group-hover:text-white transition-all transform group-hover:translate-x-2">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 overflow-hidden animate-in fade-in duration-300">
          <div onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
          <div className="relative bg-white w-full max-w-[1280px] max-h-[92vh] overflow-y-auto rounded-3xl md:rounded-[48px] shadow-2xl no-scrollbar border border-white/20 animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <button 
              onClick={() => setSelectedProject(null)}
              className="fixed top-8 right-8 md:top-12 md:right-12 p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all z-[210] border border-white/20 shadow-xl"
            >
              <X size={24} />
            </button>
            
            <div className="p-8 md:p-20">
              <div className="mb-16 border-b border-slate-100 pb-16 relative">
                 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 text-[#3370FF] font-black text-xs uppercase tracking-[0.3em] mb-6">
                        <Database size={18} /> Deep Dive Case Analysis
                      </div>
                      <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-tight">{selectedProject.title}</h2>
                    </div>
                    {selectedProject.details?.role && (
                      <div className="lg:text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 italic">Project Role</div>
                        <div className="text-[#3370FF] text-xl font-black italic uppercase">{selectedProject.details.role}</div>
                      </div>
                    )}
                 </div>
                <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium pl-6 border-l-4 border-blue-500 max-w-4xl italic">
                  {selectedProject.details?.background}
                </p>
                {selectedProject.details?.coreValue && (
                  <div className="mt-10 p-8 bg-blue-50/50 rounded-[32px] border border-blue-100">
                    <div className="text-[#3370FF] font-black text-[10px] uppercase tracking-widest mb-2">Core Value Proposition</div>
                    <p className="text-lg text-slate-700 font-bold italic">“ {selectedProject.details.coreValue} ”</p>
                  </div>
                )}
              </div>

              {/* Product Positioning Boundary (New) */}
              {selectedProject.details?.positioning && (
                <div className="mb-24 px-2">
                  <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic border-l-8 border-slate-900 pl-4">
                    Product Positioning Boundary
                  </h4>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-blue-50/30 rounded-[40px] p-10 border border-blue-100">
                      <div className="text-[#3370FF] font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                        <CheckCircle2 size={18} /> What it IS
                      </div>
                      <div className="space-y-4">
                        {selectedProject.details.positioning.is.map((item, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="mt-1 w-2 h-2 bg-[#3370FF] rounded-full shrink-0" />
                            <span className="text-slate-700 font-bold italic text-lg">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-50/50 rounded-[40px] p-10 border border-slate-100">
                      <div className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                        <X size={18} /> What it is NOT
                      </div>
                      <div className="space-y-4">
                        {selectedProject.details.positioning.not.map((item, i) => (
                          <div key={i} className="flex gap-4 items-start opacity-60">
                            <div className="mt-1 w-2 h-2 bg-slate-400 rounded-full shrink-0" />
                            <span className="text-slate-500 font-medium italic text-lg">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Target User Personas (New) */}
              {selectedProject.details?.userProfiles && (
                <div className="mb-24 px-2">
                  <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic border-l-8 border-blue-600 pl-4">
                    Target User Personas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    {selectedProject.details.userProfiles.map((p, idx) => (
                      <div key={idx} className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                         <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic group-hover:bg-[#3370FF] transition-colors">{p.name[0]}</div>
                            <div>
                               <div className="text-2xl font-black italic uppercase tracking-tighter">{p.name}</div>
                               <div className="text-xs text-[#3370FF] font-black uppercase tracking-widest">{p.role}</div>
                            </div>
                         </div>
                         <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-slate-200">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Core Pain Point</div>
                            <p className="text-slate-600 font-bold italic leading-relaxed">“ {p.pain} ”</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Contributions */}
              {selectedProject.details?.contribution && (
                <div className="mb-24 px-2">
                   <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic">
                    <Briefcase className="text-[#3370FF]" size={28} /> Core Responsibilities
                  </h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    {selectedProject.details.contribution.map((item, idx) => (
                      <div key={idx} className="flex gap-6 p-8 bg-slate-50 rounded-[32px] border border-transparent hover:border-blue-100 transition-all hover:bg-white hover:shadow-xl group">
                         <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#3370FF] group-hover:bg-[#3370FF] group-hover:text-white transition-all">
                           {item.icon}
                         </div>
                         <div className="flex-1">
                           <div className="font-black text-xl mb-2 uppercase tracking-tight italic">{item.label}</div>
                           <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Catimind Special: Targets & Key Debugging sections (Handling different project types) */}
              {selectedProject.details?.debugging && (
                <div className="mb-24 px-2">
                  <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic text-slate-900 border-l-8 border-orange-500 pl-4">
                    Solving Core Pain Points
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {selectedProject.details.debugging.map((item, i) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[40px] border border-transparent hover:border-blue-100 transition-all group relative overflow-hidden h-full flex flex-col shadow-sm">
                         <div className="text-[50px] font-black text-slate-100 absolute -top-4 -right-4 group-hover:text-blue-50 transition-colors">0{i+1}</div>
                         <div className="relative z-10 flex flex-col h-full">
                           <div className="flex items-center gap-2 mb-4">
                              <AlertCircle size={16} className="text-orange-500" />
                              <span className="font-black text-sm uppercase tracking-tight">{item.issue}</span>
                           </div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase mb-4 h-10">{item.cause}</div>
                           <div className="mt-auto pt-6 border-t border-slate-200">
                              <div className="text-[#3370FF] font-black text-[9px] uppercase tracking-widest mb-2 flex items-center gap-1"><CheckCircle2 size={12}/> Solution</div>
                              <p className="text-xs text-slate-600 font-bold leading-relaxed">{item.fix}</p>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Management Logic */}
              {selectedProject.details?.costEfficiency && (
                <div className="mb-24 px-2">
                  <div className="bg-slate-900 rounded-[56px] p-10 md:p-16 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
                    <div className="relative z-10 space-y-12">
                       <h4 className="text-3xl font-black italic uppercase text-[#3370FF] flex items-center gap-4 border-l-8 border-[#3370FF] pl-6">
                        Cost Management Strategy
                      </h4>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed italic max-w-3xl">
                        “ {selectedProject.details.costEfficiency.strategy} ”
                      </p>
                      <div className="grid md:grid-cols-3 gap-8">
                        {selectedProject.details.costEfficiency.tiers.map((tier, i) => (
                           <div key={i} className="p-10 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                              <h5 className="font-black text-xl mb-2 text-[#3370FF] uppercase italic tracking-tight">{tier.name}</h5>
                              <p className="text-slate-400 text-xs font-medium mb-10 h-12 leading-relaxed">{tier.desc}</p>
                              <div className="pt-6 border-t border-white/10 flex items-end justify-between">
                                 <div>
                                   <div className="text-[10px] text-[#3370FF] font-black uppercase tracking-widest mb-1 italic">Est. Cost</div>
                                   <div className="text-2xl font-black tracking-tight">{tier.cost}</div>
                                 </div>
                                 <div className="text-slate-600 text-[10px] font-black uppercase">Channel Configured</div>
                              </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Industrial SOP Workflow (For Belle & Projects with Pipeline) */}
              {selectedProject.details?.pipeline && (
                <div className="mb-24 px-2">
                  <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic border-l-8 border-blue-600 pl-4">
                    Industrial SOP Workflow
                  </h4>
                   <div className="grid lg:grid-cols-3 gap-10 relative">
                    <div className="hidden lg:block absolute top-1/4 left-1/4 right-[5%] h-0.5 bg-slate-100 -z-0" />
                    {selectedProject.details.pipeline.map((step, idx) => (
                      <div key={idx} className="relative z-10 space-y-8 group">
                        <div className={`w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500`}>
                          {step.icon}
                        </div>
                        <div className="space-y-4">
                          <h5 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-2">
                             <span className="text-[10px] text-slate-300 font-black">0{idx + 1}</span>
                             {step.stage}
                          </h5>
                          <div className="space-y-4">
                            {step.tasks.map((task, tidx) => (
                              <div key={tidx} className="p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all cursor-default">
                                <div className="font-bold text-sm mb-1 uppercase text-slate-900">{task.label}</div>
                                <div className="text-[11px] text-slate-500 font-medium leading-relaxed">{task.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent Framework (For Agentic projects) */}
              {selectedProject.details?.agents && (
                <div className="mb-24 px-2">
                  <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic border-l-8 border-blue-500 pl-4">
                    The Agentic Architecture
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedProject.details.agents.map(agent => (
                      <div key={agent.id} className="p-8 bg-slate-50 rounded-[32px] border border-transparent hover:border-blue-100 transition-all group shadow-sm">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#3370FF] group-hover:text-white transition-colors">
                          {agent.icon}
                        </div>
                        <div className="font-bold text-[10px] text-[#3370FF] uppercase tracking-widest mb-1">{agent.role}</div>
                        <h5 className="font-black text-xl mb-4 uppercase italic">{agent.name}</h5>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{agent.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Panorama */}
              {selectedProject.details?.screenshots && (
                <div className="mb-24 px-2">
                  <h4 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase italic border-l-8 border-[#3370FF] pl-4">
                    Product Panorama
                  </h4>
                  <div className="space-y-20 md:space-y-32">
                    {selectedProject.details.screenshots.map((screen, idx) => (
                      <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                        <div className="flex-1 w-full bg-slate-50 rounded-3xl overflow-hidden aspect-video border border-slate-100 shadow-xl group hover:shadow-2xl transition-all duration-700">
                           <img src={screen.imgUrl} alt={screen.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        </div>
                        <div className="flex-[0.8] space-y-6">
                          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase tracking-widest">
                            Module 0{idx + 1}
                          </div>
                          <h5 className="text-3xl font-black uppercase tracking-tight">{screen.title}</h5>
                          <p className="text-lg text-slate-500 leading-relaxed font-medium italic">“ {screen.desc} ”</p>
                          <div className="p-6 bg-blue-50/50 rounded-2xl border-l-4 border-[#3370FF]">
                            <span className="text-[#3370FF] font-black text-[10px] uppercase tracking-widest block mb-1">Architecture Rationale</span>
                            <span className="text-slate-800 font-bold italic leading-snug">{screen.rationale}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Insights / Solutions Grid */}
              <div className="grid lg:grid-cols-2 gap-16 md:gap-24 px-2">
                <div className="space-y-12">
                  <h4 className="text-2xl font-black mb-8 flex items-center gap-4 uppercase italic">
                    <Target className="text-[#3370FF]" size={28} /> Core Strategic Benchmarks
                  </h4>
                  <div className="space-y-6">
                    {(selectedProject.details?.goals || selectedProject.details?.painPoints)?.map((item, i) => (
                      <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:translate-x-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3370FF] flex items-center justify-center shrink-0">
                           <CheckCircle2 size={20} />
                        </div>
                        <span className="text-lg text-slate-700 font-bold leading-tight italic">{item.label || item.title || item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />
                  <h4 className="text-2xl font-black mb-10 flex items-center gap-4 italic uppercase text-[#3370FF] relative z-10">
                    <CheckCircle2 size={28} /> Quantified Impact
                  </h4>
                  <ul className="space-y-8 relative z-10">
                    {selectedProject.details?.solutions?.map((sol, i) => (
                      <li key={i} className="flex gap-4 group/li">
                        <div className="mt-1 w-5 h-5 rounded-full border-2 border-[#3370FF] flex items-center justify-center text-[#3370FF] group-hover/li:bg-[#3370FF] transition-all">
                          <div className="w-2 h-2 bg-[#3370FF] rounded-full group-hover/li:bg-white" />
                        </div>
                        <span className="text-slate-400 font-medium group-hover/li:text-white transition-colors leading-relaxed">{sol}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 italic">Quantified Result</div>
                    <div className="text-5xl md:text-7xl font-black text-[#3370FF] italic tracking-tighter">
                      {selectedProject.impact}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 min-h-[90vh] flex items-center bg-white border-b border-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-b lg:bg-gradient-to-l from-blue-50/40 to-transparent -z-0" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
            <div className="flex-1 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-[#3370FF] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
                <Award size={14} />
                UCA Product Design · Distinction · AI 行业效能专家
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black leading-[1.05] tracking-tighter">
                洞察复杂业务<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3370FF] to-blue-400">快速验证标准</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
                4 年跨行业 AI 落地实战。专注于中大型客户<span className="text-[#1F2329] font-bold">核心业务场景诊断</span>，
                结合飞书及 AI 工具设计端到端效能方案，推动<span className="text-[#1F2329] font-bold">可量化的组织进化</span>，
                沉淀高复制性行业实践。
              </p>
              
              <div className="flex flex-wrap gap-4 md:gap-6 pt-2">
                {[
                  { label: '效能提升达成', value: '85%', icon: <Zap className="text-[#3370FF]" /> },
                  { label: '标杆落地项目', value: '3+', icon: <Building2 className="text-orange-500" /> },
                  { label: '内容影响力触达', value: '22W+', icon: <Globe className="text-green-600" /> }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 bg-white rounded-2xl md:rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all grow md:grow-0">
                    <div className="p-2 md:p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black tracking-tight">{stat.value}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {['业务效能咨询', '业务数字化转型', '飞书方案落地', '组织效能诊断', '高层价值传递', 'AI 工具整合'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-500">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:block flex-[0.85] relative">
               <div className="relative z-10 w-full aspect-square bg-slate-50 rounded-[60px] flex items-center justify-center overflow-hidden border border-slate-100">
                 <div className="text-[160px] font-black italic text-slate-100">WT</div>
                 <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-lg">
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">正在寻找</div>
                   <div className="text-slate-900 font-black text-lg leading-tight">飞书行业业务专家 · 效能咨询顾问</div>
                   <div className="mt-3 flex items-center gap-2 text-[#3370FF] font-black text-xs uppercase tracking-widest">
                     <div className="w-2 h-2 bg-[#3370FF] rounded-full animate-pulse" />
                     Available Now
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl md:rounded-[32px] flex items-center justify-center text-white font-black text-3xl md:text-4xl italic">T</div>
              <div>
                <div className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic text-slate-900">屠文鑫 Wenxin Tu</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Industry Business Expert · AI-Powered Efficiency Consultant</div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-6 text-sm font-black text-slate-900 uppercase tracking-widest">
              <a href="mailto:tuwenxin@outlook.com" className="hover:text-[#3370FF] transition-all relative group">
                tuwenxin@outlook.com
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3370FF] transition-all group-hover:w-full" />
              </a>
              <div className="text-[10px] text-slate-400 font-bold tracking-[0.4em]">© 2026 Wenxin Tu Studio.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
