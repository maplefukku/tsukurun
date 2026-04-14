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
    id: "calculator",
    name: "計算ツール",
    description: "シンプルな計算機",
    category: "ツール",
    icon: "🔢",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>計算ツール</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.calc{width:280px;background:#fff;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}.display{background:#f5f5f5;border-radius:.5rem;padding:1rem;text-align:right;font-size:1.5rem;margin-bottom:1rem;min-height:3rem}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem}.btn{padding:.75rem;border:none;border-radius:.5rem;font-size:1.1rem;cursor:pointer;background:#eee;transition:background .2s}.btn:hover{background:#ddd}.btn.op{background:#333;color:#fff}.btn.op:hover{background:#555}</style></head><body><div class="calc"><div class="display" id="display">0</div><div class="grid"><button class="btn" onclick="press('7')">7</button><button class="btn" onclick="press('8')">8</button><button class="btn" onclick="press('9')">9</button><button class="btn op" onclick="press('/')">÷</button><button class="btn" onclick="press('4')">4</button><button class="btn" onclick="press('5')">5</button><button class="btn" onclick="press('6')">6</button><button class="btn op" onclick="press('*')">×</button><button class="btn" onclick="press('1')">1</button><button class="btn" onclick="press('2')">2</button><button class="btn" onclick="press('3')">3</button><button class="btn op" onclick="press('-')">−</button><button class="btn" onclick="press('0')">0</button><button class="btn" onclick="press('.')">.</button><button class="btn op" onclick="calc()">=</button><button class="btn op" onclick="press('+')">+</button></div></div><script>let expr="";function press(v){expr+=v;document.getElementById("display").textContent=expr}function calc(){try{document.getElementById("display").textContent=Function("return "+expr)()}catch{document.getElementById("display").textContent="Error"}expr=""}</script></body></html>`,
  },
  {
    id: "personality-quiz",
    name: "性格診断",
    description: "4つの質問で性格タイプを判定",
    category: "診断",
    icon: "🧠",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>性格診断</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.quiz{max-width:480px;width:100%;padding:2rem}.quiz h1{font-size:1.5rem;margin-bottom:1.5rem;text-align:center}.q{margin-bottom:1.5rem}.q p{font-weight:500;margin-bottom:.5rem}.opts label{display:block;padding:.5rem 1rem;margin-bottom:.25rem;background:#fff;border:1px solid #eee;border-radius:.5rem;cursor:pointer}.opts input{margin-right:.5rem}#result{text-align:center;font-size:1.25rem;font-weight:600;margin-top:1rem;display:none}.btn{display:block;width:100%;padding:.75rem;background:#333;color:#fff;border:none;border-radius:.75rem;font-size:1rem;cursor:pointer}.btn:hover{background:#555}</style></head><body><div class="quiz"><h1>性格診断</h1><div id="questions"><div class="q"><p>1. 休日の過ごし方は？</p><div class="opts"><label><input type="radio" name="q1" value="a">友達とワイワイ</label><label><input type="radio" name="q1" value="b">一人でまったり</label></div></div><div class="q"><p>2. 決断するとき重視するのは？</p><div class="opts"><label><input type="radio" name="q2" value="a">直感</label><label><input type="radio" name="q2" value="b">データ</label></div></div><div class="q"><p>3. 計画は？</p><div class="opts"><label><input type="radio" name="q3" value="a">きっちり立てる</label><label><input type="radio" name="q3" value="b">その場のノリ</label></div></div><div class="q"><p>4. ストレス解消法は？</p><div class="opts"><label><input type="radio" name="q4" value="a">体を動かす</label><label><input type="radio" name="q4" value="b">音楽や読書</label></div></div></div><button class="btn" onclick="diagnose()">診断する</button><div id="result"></div></div><script>const types={aaaa:"リーダータイプ🦁",aabb:"クリエイタータイプ🎨",abab:"バランサータイプ⚖️",bbbb:"研究者タイプ🔬",default:"アーティストタイプ🌟"};function diagnose(){const ans=[1,2,3,4].map(n=>{const r=document.querySelector('input[name=q'+n+']:checked');return r?r.value:"a"}).join("");const el=document.getElementById("result");el.style.display="block";el.textContent="あなたは…"+(types[ans]||types.default)}</script></body></html>`,
  },
  {
    id: "love-compatibility",
    name: "相性診断",
    description: "2人の名前で相性パーセントを表示",
    category: "診断",
    icon: "💕",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>相性診断</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.compat{max-width:400px;width:100%;padding:2rem;text-align:center}.compat h1{font-size:1.5rem;margin-bottom:1.5rem}input{width:100%;padding:.75rem 1rem;border:1px solid #ddd;border-radius:.75rem;font-size:1rem;margin-bottom:.75rem}input:focus{outline:none;border-color:#333}.btn{width:100%;padding:.75rem;background:#333;color:#fff;border:none;border-radius:.75rem;font-size:1rem;cursor:pointer}.btn:hover{background:#555}#result{margin-top:1.5rem;display:none}.pct{font-size:3rem;font-weight:700}.msg{margin-top:.5rem;color:#666}</style></head><body><div class="compat"><h1>💕 相性診断</h1><input id="name1" placeholder="あなたの名前"><input id="name2" placeholder="相手の名前"><button class="btn" onclick="check()">診断する</button><div id="result"><div class="pct" id="pct"></div><div class="msg" id="msg"></div></div></div><script>function check(){const a=document.getElementById("name1").value;const b=document.getElementById("name2").value;if(!a||!b)return;let h=0;for(let i=0;i<a.length+b.length;i++){h=((h<<5)-h+(a+b).charCodeAt(i%((a+b).length)))|0}const p=Math.abs(h%101);const el=document.getElementById("result");el.style.display="block";document.getElementById("pct").textContent=p+"%";const msgs=["もっと話してみよう！","いい感じかも！","なかなかの相性！","運命かも…！","最高の相性！"];document.getElementById("msg").textContent=msgs[Math.min(Math.floor(p/20),4)]}</script></body></html>`,
  },
  {
    id: "skill-check",
    name: "スキルチェッカー",
    description: "選択式の質問でスキルレベルを判定",
    category: "診断",
    icon: "📋",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>スキルチェック</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.check{max-width:480px;width:100%;padding:2rem}.check h1{font-size:1.5rem;margin-bottom:1.5rem;text-align:center}.q{margin-bottom:1.25rem}.q p{font-weight:500;margin-bottom:.5rem}.q select{width:100%;padding:.5rem;border:1px solid #ddd;border-radius:.5rem;font-size:1rem}.btn{display:block;width:100%;padding:.75rem;background:#333;color:#fff;border:none;border-radius:.75rem;font-size:1rem;cursor:pointer;margin-top:1rem}.btn:hover{background:#555}#result{text-align:center;margin-top:1.5rem;display:none}.level{font-size:2rem;font-weight:700}.bar{height:8px;background:#eee;border-radius:4px;margin-top:1rem;overflow:hidden}.bar-fill{height:100%;background:#333;border-radius:4px;transition:width .5s}</style></head><body><div class="check"><h1>スキルチェッカー</h1><div class="q"><p>1. 経験年数は？</p><select id="s1"><option value="1">1年未満</option><option value="2">1〜3年</option><option value="3">3年以上</option></select></div><div class="q"><p>2. 実務でどの程度使う？</p><select id="s2"><option value="1">たまに</option><option value="2">週に数回</option><option value="3">毎日</option></select></div><div class="q"><p>3. 他の人に教えられる？</p><select id="s3"><option value="1">難しい</option><option value="2">基本なら</option><option value="3">余裕</option></select></div><button class="btn" onclick="judge()">判定する</button><div id="result"><div class="level" id="level"></div><div class="bar"><div class="bar-fill" id="bar"></div></div></div></div><script>function judge(){const s=[1,2,3].reduce((a,i)=>a+Number(document.getElementById("s"+i).value),0);const pct=Math.round(s/9*100);const lvs=["ビギナー🌱","ミドル🌿","エキスパート🌳"];const lv=s<=4?0:s<=7?1:2;const el=document.getElementById("result");el.style.display="block";document.getElementById("level").textContent=lvs[lv];document.getElementById("bar").style.width=pct+"%"}</script></body></html>`,
  },
  {
    id: "mood-analyzer",
    name: "気分診断",
    description: "今の気分を選んで結果を表示",
    category: "診断",
    icon: "😊",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>気分診断</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.mood{max-width:400px;width:100%;padding:2rem;text-align:center}.mood h1{font-size:1.5rem;margin-bottom:1.5rem}.options{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem}.opt{padding:1.25rem;background:#fff;border:1px solid #eee;border-radius:1rem;cursor:pointer;font-size:1.5rem;transition:all .2s}.opt:hover{border-color:#333;transform:scale(1.05)}#result{margin-top:1.5rem;display:none}.emoji{font-size:3rem;margin-bottom:.5rem}.advice{color:#666;line-height:1.6}</style></head><body><div class="mood"><h1>今の気分は？</h1><div class="options"><div class="opt" onclick="pick(0)">😄<br><small>ハッピー</small></div><div class="opt" onclick="pick(1)">😔<br><small>しょんぼり</small></div><div class="opt" onclick="pick(2)">😤<br><small>イライラ</small></div><div class="opt" onclick="pick(3)">😴<br><small>おつかれ</small></div></div><div id="result"><div class="emoji" id="remoji"></div><div class="advice" id="advice"></div></div></div><script>const data=[{e:"🌈",a:"いい調子！その気持ちを大切にして、誰かにシェアしてみよう"},{e:"🍵",a:"温かい飲み物でも飲んで、ゆっくり深呼吸してみよう"},{e:"🌊",a:"少し体を動かすとスッキリするかも。散歩もおすすめ"},{e:"🛌",a:"今日はがんばった！早めに休んで自分を労ってあげよう"}];function pick(i){const el=document.getElementById("result");el.style.display="block";document.getElementById("remoji").textContent=data[i].e;document.getElementById("advice").textContent=data[i].a}</script></body></html>`,
  },
  {
    id: "fortune",
    name: "今日の運勢",
    description: "ランダムで今日の運勢を表示",
    category: "診断",
    icon: "🔮",
    htmlTemplate: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>今日の運勢</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#fafafa;display:flex;align-items:center;justify-content:center;min-height:100vh}.fortune{max-width:400px;width:100%;padding:2rem;text-align:center}.fortune h1{font-size:1.5rem;margin-bottom:1.5rem}.btn{padding:.75rem 2rem;background:#333;color:#fff;border:none;border-radius:.75rem;font-size:1rem;cursor:pointer}.btn:hover{background:#555}#result{margin-top:1.5rem;display:none}.luck{font-size:3rem;font-weight:700;margin-bottom:.5rem}.star{font-size:1.5rem;margin-bottom:.75rem}.message{color:#666;line-height:1.6}.item{display:inline-block;margin:.25rem .5rem;padding:.25rem .75rem;background:#fff;border:1px solid #eee;border-radius:1rem;font-size:.875rem}</style></head><body><div class="fortune"><h1>🔮 今日の運勢</h1><button class="btn" onclick="tell()">占う</button><div id="result"><div class="luck" id="luck"></div><div class="star" id="star"></div><div class="message" id="msg"></div><div id="items" style="margin-top:1rem"></div></div></div><script>const lucks=["大吉","吉","中吉","小吉","末吉"];const msgs=["最高の一日になりそう！","いい流れが来ています","穏やかに過ごせそう","小さな幸せを見つけて","焦らずゆっくりいこう"];const colors=["ラッキーカラー: 赤","ラッキーカラー: 青","ラッキーカラー: 緑","ラッキーカラー: 黄","ラッキーカラー: 紫"];const foods=["ラッキーフード: カレー","ラッキーフード: ラーメン","ラッキーフード: 寿司","ラッキーフード: パスタ","ラッキーフード: うどん"];function tell(){const i=Math.floor(Math.random()*5);const stars="⭐".repeat(5-i);document.getElementById("luck").textContent=lucks[i];document.getElementById("star").textContent=stars;document.getElementById("msg").textContent=msgs[i];document.getElementById("items").innerHTML='<span class="item">'+colors[i]+'</span><span class="item">'+foods[i]+'</span>';document.getElementById("result").style.display="block"}</script></body></html>`,
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter((t) => t.category === category);
}
