const boardData = {
  internal: {
    brandLeft: '内部技能',
    brandRight: '公司办公',
    logos: [],
    columns: ['通用办公', '产品/项目', '研发/测试', '推荐强度', '设计/内容', '市场/运营', '职能支持'],
    rows: [
      ['S', [['会议纪要', '把会议变成待办'], ['需求文档', '把想法写成方案'], ['代码检查', '找问题并补测试']], '内部主力', [['页面原型', '先出结构再做页面'], ['活动方案', '整理卖点和计划'], ['通知/汇报', '生成清晰初稿']], ['员工可用', '按权限使用']],
      ['A', [['周报总结', '把素材整理成周报'], ['项目计划', '拆分任务和风险'], ['数据解读', '解释表格和指标']], '推荐使用', [['文案润色', '调整语气和结构'], ['竞品整理', '汇总公开资料'], ['培训材料', '生成课程提纲']], ['员工可用', '按权限使用']],
      ['B', [['专项分析', '需要明确目标和材料']], '按需补充', [['专业报告', '先人工核对'], ['复杂表格', '先脱敏']], ['内部评估', '人工确认']],
      ['C', [['暂不推荐', '不适合新手直接使用']], '暂缓', [['高风险动作', '不开放'], ['不明来源', '不收录']], ['不开放', '']],
    ],
  },
  external: {
    brandLeft: '外部工具',
    brandRight: '互联网精选',
    logos: [
      ['OpenAI', 'Codex', '◎'],
      ['Anthropic', 'Claude Code · Skills', '◇'],
      ['Google', 'Gemini · Gemini CLI', '✦'],
      ['DeepSeek', 'DeepSeek', '◌'],
      ['阿里云', '通义千问 · Qoder', 'Q'],
      ['月之暗面', 'Kimi', '月'],
      ['智谱', 'GLM', 'Z'],
      ['MiniMax', 'MiniMax', 'M'],
      ['字节跳动', '豆包 · TRAE', '豆'],
      ['腾讯', '混元', '腾'],
      ['百度', '文心', '文'],
      ['科大讯飞', '星火', '讯'],
      ['阶跃星辰', 'Step 系列', '阶'],
      ['百川智能', 'Baichuan', '百'],
      ['零一万物', 'Yi 系列', 'Yi'],
      ['Mistral AI', 'Mistral', 'Mi'],
      ['xAI', 'Grok', 'G'],
      ['Cohere', 'Command', 'C'],
      ['Perplexity', 'Sonar', 'P'],
      ['GitHub', 'Copilot', '◉'],
    ],
    columns: ['研发/算法', '产品/项目', '通用办公', '推荐强度', '设计/内容', '研究/分析', '销售/运营'],
    rows: [
      ['S', [['Codex', '写代码、修复和测试'], ['Claude Code', '终端技术任务'], ['Gemini CLI', '研发辅助']], '高', [['官方工具', ''], ['官方仓库', '']], ['已筛选', '']],
      ['A', [['Qoder', '综合办公和研发'], ['Anthropic Skills', '文档、PDF、PPT'], ['LarkSuite CLI', '飞书办公资料']], '推荐使用', [['精选工具', ''], ['官方仓库', '']], ['已收录', '']],
      ['B', [['模型对比', '先看公开资料'], ['专业插件', '先做安全检查'], ['—', '']], '试用观察', [['外部链接', ''], ['需审查', '']], ['候选', '']],
      ['C', [['暂不推荐', '来源或安全信息不足'], ['—', ''], ['—', '']], '暂缓', [['—', ''], ['—', '']], ['不收录', '']],
    ],
  },
};

const boardFrame = document.querySelector('#board-frame');
const switchers = [...document.querySelectorAll('[data-board]')];
const catalogGrid = document.querySelector('#catalog-grid');
const repoLinks = {
  Codex: 'https://github.com/openai/codex',
  'Anthropic Skills': 'https://github.com/anthropics/skills',
  'Gemini CLI': 'https://github.com/google-gemini/gemini-cli',
  'LarkSuite CLI': 'https://github.com/larksuite/cli',
  'Microsoft Skills': 'https://github.com/microsoft/skills',
};
const internalDownload = '#internal-access';
const modelRankingUrl = 'https://artificialanalysis.ai/models';
const openClawHome = 'https://openclaw.ai/';
const openClawDocs = 'https://docs.openclaw.ai/';

function toolCell(items) {
  return items.map(([name, note]) => {
    const content = `${name}${note ? `<small>${note}</small>` : ''}`;
    return repoLinks[name] ? `<a class="matrix-cell matrix-link ${name === '—' ? '' : 'hot'}" href="${repoLinks[name]}" target="_blank" rel="noopener noreferrer" title="打开 GitHub 仓库">${content}</a>` : `<div class="matrix-cell ${name === '—' ? '' : 'hot'}">${content}</div>`;
  }).join('');
}

function renderBoard(mode) {
  const data = boardData[mode];
  const logoMarkup = data.logos.map(([brand, name, mark]) => `<div class="logo-lockup"><span class="logo-mark">${mark}</span><span><b>${brand}</b><small>${name}</small></span></div>`).join('');
  boardFrame.innerHTML = `
    ${data.logos.length ? `<div class="logo-strip" aria-label="互联网模型和工具品牌"><div class="logo-strip-track">${logoMarkup}${logoMarkup}</div></div>` : ''}
    <div class="matrix-head"><div class="head-tier">等级</div>${data.columns.map((column, index) => `<div class="${index === 3 ? 'rail-head' : ''}">${column}</div>`).join('')}</div>
    ${data.rows.map(([tier, leftItems, strength, rightItems, range]) => `<div class="matrix-row tier-${tier.toLowerCase()}"><div class="tier-label">${tier}</div>${toolCell(leftItems)}<div class="rail">${strength}</div>${toolCell(rightItems)}<div class="matrix-cell">${range[0]}${range[1] ? `<small>${range[1]}</small>` : ''}</div></div>`).join('')}
  `;
}

const catalogData = {
  internal: [
    {title: '内部技能推荐', items: []},
    {title: '个性化万能提示词模板', items: [['通用任务拆解', '适合 GPT、Claude、Gemini、Qwen、DeepSeek、Kimi、GLM 等通用模型', 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', '你是协作助手。请先把目标拆成步骤，列出输入、输出、风险和验收标准；信息不足只问一个关键问题；不要执行外部操作。'], ['代码协作 / Codex', '适合 Codex、Claude Code、Gemini CLI 等研发工具', 'https://developers.openai.com/codex/', '先读取项目规则和相关文件，再给出修改方案；未经确认不要改文件、发消息、删除数据或访问密钥。'], ['办公文档总结', '适合 Word、PDF、PPT、Excel 和长文档整理', 'https://github.com/anthropics/skills', '请把以下内容整理成结论、依据、待办和风险四部分；保留关键数字；不要补写原文没有的信息。'], ['研究检索 / 对比', '适合需要来源、日期和多方案比较的任务', 'https://ai.google.dev/gemini-api/docs/prompting-strategies', '请先列出检索计划，再回答问题；每个关键结论给出来源和日期；不确定的地方明确标注，不要猜测。'], ['会议与工作汇报', '适合会议纪要、周报、月报和管理层摘要', 'https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/prompt-engineering', '请按受众和长度要求整理内容，先给一段摘要，再列行动项、负责人和截止时间；缺失信息留空，不要虚构。']]},
    {title: 'Skills技能使用演示', items: [['Codex', '官方入门教程：从任务描述到代码交付', 'https://developers.openai.com/codex/'], ['Claude', '官方 Academy：对话、文件和 Claude Code 入门', 'https://www.anthropic.com/academy'], ['Gemini', '官方 Gemini CLI 文档与上手教程', 'https://geminicli.com/docs/'], ['Qoder', '官方产品文档：编程、文档和综合办公', 'https://docs.qoder.com/']]},
    {title: '最新 OpenClaw 排名（正版下载安装）', items: [['OpenClaw 官方主页', '项目介绍、正版入口和最新动态', openClawHome], ['OpenClaw 官方安装', 'Windows、macOS、Linux 安装与初始化', openClawDocs], ['OpenClaw 官方文档', 'Onboarding、Gateway、Skills 和安全设置', openClawDocs]]},
  ],
  external: [
    {title: '文档文件', items: [['docx · Anthropic Skills', '用途：Word 文档创建、读取和格式化；用法：说明要创建、读取或修改的目标', 'https://github.com/anthropics/skills/tree/main/skills/docx'], ['pptx · Anthropic Skills', '用途：PPT 创建、编辑和检查；用法：提供主题、页数和受众后再生成', 'https://github.com/anthropics/skills/tree/main/skills/pptx'], ['frontend-design', '用途：网页界面设计与实现；用法：说明页面目标、风格和布局后生成代码', 'https://github.com/anthropics/skills/tree/main/skills/frontend-design']]},
    {title: '快速工具', items: [['Codex', '用途：代码阅读、修改、测试和交付；用法：先说明项目和目标，再让它给方案', repoLinks.Codex], ['Gemini CLI', '用途：终端操作、代码分析和研发辅助；用法：进入项目目录后描述任务', repoLinks['Gemini CLI']], ['LarkSuite CLI', '用途：飞书办公数据和会议流程；用法：先指定文档或会议，再执行只读查询', repoLinks['LarkSuite CLI']], ['Qoder', '用途：编程、文档、表格和综合办公；用法：选择项目或文件后说明输出格式', '#qoder']]},
    {title: 'AGI 指令', items: [['Anthropic Skills', '用途：可复用的 Agent 工作指令；用法：选择任务模板并补充目标、输入和限制', repoLinks['Anthropic Skills']], ['Microsoft Skills', '用途：Agent 指令模板和开发辅助；用法：先选场景，再按模板填写约束', repoLinks['Microsoft Skills']], ['Gemini CLI', '用途：终端 Agent 指令实践；用法：先列步骤和验收标准，再执行', repoLinks['Gemini CLI']], ['LarkSuite CLI', '用途：飞书 Agent 指令实践；用法：先指定对象和只读范围', repoLinks['LarkSuite CLI']]]},
    {title: '各大模型排行榜 · 2026年09月12日', items: [['Claude Fable 5.1', '综合能力参考，点击查看今日 Artificial Analysis 榜单', modelRankingUrl], ['Claude Fable 5.1', '综合能力参考，点击查看今日 Artificial Analysis 榜单', modelRankingUrl], ['GPT-6 Astra', '综合能力参考，点击查看今日 Artificial Analysis 榜单', modelRankingUrl], ['Claude Fable 5.1', '综合能力参考，点击查看今日 Artificial Analysis 榜单', modelRankingUrl], ['Claude Fable 5.1', '综合能力参考，点击查看今日 Artificial Analysis 榜单', modelRankingUrl]]},
  ],
};

function renderCatalog(mode) {
  catalogGrid.dataset.mode = mode;
  catalogGrid.innerHTML = catalogData[mode].map((category) => `<article class="catalog-type-card"><h3>${category.title}</h3><ol>${category.items.map(([name, desc, href, prompt]) => `<li><div class="catalog-item-line">${href && !href.startsWith('#') ? `<a class="catalog-card-link" href="${href}" target="_blank" rel="noopener"><b>${name}</b></a>` : `<div class="catalog-card-link"><b>${name}</b></div>`}${prompt ? `<button class="copy-btn" type="button" data-copy="${prompt.replace(/"/g, '&quot;')}">复制</button>` : ''}</div><span class="catalog-item-desc">${desc}</span></li>`).join('')}</ol></article>`).join('');
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('.copy-btn');
  if (!button) return;
  const text = button.dataset.copy || '';
  try { await navigator.clipboard.writeText(text); } catch { const area = document.createElement('textarea'); area.value = text; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); }
  const previous = button.textContent; button.textContent = '已复制'; setTimeout(() => { button.textContent = previous; }, 1400);
});

switchers.forEach((button) => button.addEventListener('click', () => {
  switchers.forEach((item) => item.classList.toggle('active', item === button));
  renderBoard(button.dataset.board);
  renderCatalog(button.dataset.board);
}));

const initialBoard = new URLSearchParams(location.search).get('board') === 'internal' ? 'internal' : 'external';
switchers.forEach((item) => item.classList.toggle('active', item.dataset.board === initialBoard));
renderBoard(initialBoard);
renderCatalog(initialBoard);
