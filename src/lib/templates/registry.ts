export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  htmlTemplate: string;
}

export const templates: Template[] = [
  {
    id: "menu-board",
    name: "メニューボード",
    description: "カフェや飲食店のメニュー表",
    category: "ビジネス",
    icon: "🍽️",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;padding:2rem}.menu{max-width:480px;margin:0 auto}.menu h1{font-size:1.5rem;margin-bottom:1.5rem;text-align:center}.item{display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #eee}.item-name{font-weight:500}.item-price{color:#666}</style></head><body><div class="menu"><h1>{{title}}</h1>{{items}}</div></body></html>`,
  },
  {
    id: "todo-list",
    name: "やることリスト",
    description: "シンプルなタスク管理",
    category: "生産性",
    icon: "✅",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;padding:2rem}.todo{max-width:480px;margin:0 auto}.todo h1{font-size:1.5rem;margin-bottom:1.5rem}.task{display:flex;align-items:center;gap:.75rem;padding:.75rem 0;border-bottom:1px solid #eee}input[type=checkbox]{width:1.25rem;height:1.25rem}</style></head><body><div class="todo"><h1>{{title}}</h1>{{tasks}}</div></body></html>`,
  },
  {
    id: "countdown",
    name: "カウントダウン",
    description: "イベントまでの日数カウント",
    category: "エンタメ",
    icon: "⏰",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}.countdown{text-align:center}.countdown h1{font-size:1.25rem;opacity:.7;margin-bottom:1rem}.number{font-size:5rem;font-weight:700}.label{font-size:1rem;opacity:.5;margin-top:.5rem}</style></head><body><div class="countdown"><h1>{{title}}</h1><div class="number" id="days">0</div><div class="label">日</div></div><script>const target=new Date("{{date}}");function update(){const d=Math.max(0,Math.ceil((target-new Date())/864e5));document.getElementById("days").textContent=d}update();setInterval(update,6e4)</script></body></html>`,
  },
  {
    id: "poll",
    name: "投票・アンケート",
    description: "みんなの意見を集める",
    category: "コミュニケーション",
    icon: "📊",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;padding:2rem}.poll{max-width:480px;margin:0 auto}.poll h1{font-size:1.5rem;margin-bottom:1.5rem}.option{padding:1rem;margin-bottom:.5rem;background:#fff;border:1px solid #eee;border-radius:.75rem;cursor:pointer;transition:all .2s}.option:hover{border-color:#333}</style></head><body><div class="poll"><h1>{{title}}</h1>{{options}}</div></body></html>`,
  },
  {
    id: "profile-card",
    name: "プロフィールカード",
    description: "自己紹介ページ",
    category: "個人",
    icon: "👤",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{name}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{max-width:400px;width:100%;background:#fff;border-radius:1rem;padding:2.5rem;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.08)}.avatar{width:80px;height:80px;border-radius:50%;background:#eee;margin:0 auto 1rem}.name{font-size:1.5rem;font-weight:600;margin-bottom:.5rem}.bio{color:#666;line-height:1.6}</style></head><body><div class="card"><div class="avatar"></div><div class="name">{{name}}</div><div class="bio">{{bio}}</div></div></body></html>`,
  },
  {
    id: "price-table",
    name: "料金表",
    description: "サービスの料金プラン",
    category: "ビジネス",
    icon: "💰",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;padding:2rem}.plans{max-width:720px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}.plan{background:#fff;border-radius:1rem;padding:2rem;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.08)}.plan-name{font-size:1.1rem;margin-bottom:.5rem}.plan-price{font-size:2rem;font-weight:700;margin-bottom:1rem}.plan-features{list-style:none;color:#666;line-height:2}</style></head><body><h1 style="text-align:center;margin-bottom:2rem">{{title}}</h1><div class="plans">{{plans}}</div></body></html>`,
  },
  {
    id: "flashcard",
    name: "フラッシュカード",
    description: "学習用カード",
    category: "教育",
    icon: "🃏",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{width:320px;height:200px;background:#fff;border-radius:1rem;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.08);font-size:1.25rem;padding:2rem;text-align:center;transition:transform .3s}.card:active{transform:scale(.97)}</style></head><body><div class="card" onclick="flip()"><span id="text">{{front}}</span></div><script>let showing="front";const data={front:"{{front}}",back:"{{back}}"};function flip(){showing=showing==="front"?"back":"front";document.getElementById("text").textContent=data[showing]}</script></body></html>`,
  },
  {
    id: "link-tree",
    name: "リンクまとめ",
    description: "SNSやリンクを1ページに",
    category: "個人",
    icon: "🔗",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{name}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.links{max-width:400px;width:100%;padding:2rem;text-align:center}.links h1{font-size:1.25rem;margin-bottom:1.5rem}.link{display:block;padding:1rem;margin-bottom:.75rem;background:#fff;border:1px solid #eee;border-radius:.75rem;text-decoration:none;color:#333;transition:all .2s}.link:hover{border-color:#333}</style></head><body><div class="links"><h1>{{name}}</h1>{{links}}</div></body></html>`,
  },
  {
    id: "event-page",
    name: "イベントページ",
    description: "イベント告知ページ",
    category: "コミュニケーション",
    icon: "🎉",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{title}}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;padding:2rem}.event{max-width:480px;margin:0 auto;background:#fff;border-radius:1rem;padding:2.5rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}.event h1{font-size:1.5rem;margin-bottom:1rem}.meta{color:#666;margin-bottom:1.5rem;line-height:1.8}.desc{line-height:1.8}</style></head><body><div class="event"><h1>{{title}}</h1><div class="meta">📅 {{date}}<br>📍 {{location}}</div><div class="desc">{{description}}</div></div></body></html>`,
  },
  {
    id: "calculator",
    name: "計算ツール",
    description: "シンプルな計算機",
    category: "ツール",
    icon: "🔢",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>計算ツール</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.calc{width:280px;background:#fff;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}.display{background:#f5f5f5;border-radius:.5rem;padding:1rem;text-align:right;font-size:1.5rem;margin-bottom:1rem;min-height:3rem}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}.btn{padding:.75rem;border:none;border-radius:.5rem;font-size:1.1rem;cursor:pointer;background:#eee;transition:background .2s}.btn:hover{background:#ddd}.btn.op{background:#333;color:#fff}.btn.op:hover{background:#555}</style></head><body><div class="calc"><div class="display" id="display">0</div><div class="grid"><button class="btn" onclick="press('7')">7</button><button class="btn" onclick="press('8')">8</button><button class="btn" onclick="press('9')">9</button><button class="btn op" onclick="press('/')">÷</button><button class="btn" onclick="press('4')">4</button><button class="btn" onclick="press('5')">5</button><button class="btn" onclick="press('6')">6</button><button class="btn op" onclick="press('*')">×</button><button class="btn" onclick="press('1')">1</button><button class="btn" onclick="press('2')">2</button><button class="btn" onclick="press('3')">3</button><button class="btn op" onclick="press('-')">−</button><button class="btn" onclick="press('0')">0</button><button class="btn" onclick="press('.')">.</button><button class="btn op" onclick="calc()">=</button><button class="btn op" onclick="press('+')">+</button></div></div><script>let expr="";function press(v){expr+=v;document.getElementById("display").textContent=expr}function calc(){try{document.getElementById("display").textContent=Function("return "+expr)()}catch{document.getElementById("display").textContent="Error"}expr=""}</script></body></html>`,
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter((t) => t.category === category);
}
