export type Word = { id: string; en: string; zh: string; pos: string; unit: number; section: string; page: number; phrase: boolean; starred: boolean; ipa?: string; high?: boolean }
// Transcribed from the supplied scanned textbook; page denotes the PDF page, not the printed page.
const rows: [number, number, string, string][] = [
[1,1,'Episode 1',`straightforward|简单的；易懂的|adj.
confuse|使困惑；把……弄糊涂|v.
ambiguous|含糊不清的；模棱两可的|adj.
interpret|理解|v.
submit|提交；呈送|v.
criteria|标准；准则；尺度|n.
Venus flytrap|捕蝇草|n.
hieroglyphics|象形文字（尤指古埃及文字）|n.
breakthrough|突破；重大发现；重大成就|n.
launch|（首次）上市，发行|v.
phenomenon|现象|n.
classify|把……分类；把……分级|v.
smiley|笑容符（电子邮件中使用的表示愉快或高兴的符号，如 :-) ）|n.
symbol|象征；标志|n.
grin|露齿笑；咧嘴笑；露齿而笑|n. / v.
eyebrow|眉毛|n.
shed|流泪|v.
laughter|笑声|n.
rosy|粉红色的；红润的|adj.
cheek|脸颊；脸蛋|n.
float|浮动；漂流；飘动；飘移|v.
approval|批准；核准；认可；赞成；赞许|n.
flame|火焰；火舌|n.
exemplary|优异的；值得效仿的；可作楷模的|adj.
take sb. / sth. (for example)|举例说明；以某人 / 某事为例|phr.
come full circle|循环；又回到原处|phr.
varying|不同的|adj.
respondent|（尤指调查中）回答问题的人|n.`],
[1,2,'Episode 2',`neutral|中性的；不带感情色彩的；中立的；不偏不倚的|adj.
tricky|难办的；难对付的|adj.
interpretation|解释；阐释|n.
ambiguity|模棱两可；不明确（的事物）|n.
standardize|使合乎规格；使标准化|v.
device|器械；设备；装置|n.
platform|计算机平台；站台；月台|n.
perceive|理解；思考；认为|v.
exact|一样的颜色 / 时刻 / 类型等；确切的；精确的|adj.
clenched|紧咬的；紧握的|adj.
dimension|（形势或品质的）方面，部分|n.
horn|（牛、羊等动物的）角；（车辆上的）喇叭|n.
cheat|欺骗；蒙骗|v.
thumbs-up|竖起大拇指（表示赞成或满意）|n.
literal|字面意思的；原义的|adj.
evolve|逐步发展；演化|v.
consistent|一致的；始终如一的|adj.
instantly|立即；马上|adv.
ravioli|（肉、奶酪或蔬菜馅的）意大利方饺|n.
ingot|（金、银或其他金属的）铸块，锭|n.
bar|（长方形）条，块|n.
transfer|（使）转移；搬迁|v.
expense|花费；费用|n.
what for|为什么？|phr.
go for|努力争取（某事物）|phr.
athlete|运动员；体育家；（尤指）田径运动员|n.
medal|奖牌；勋章|n.
disappointment|令人失望的人或事；失望；扫兴；沮丧|n.`],
[1,3,'Text A',`diver|跳水者；跳水运动员|n.
malicious|恶意的；恶毒的|adj.
abuse|辱骂|n.
bully|威吓；欺侮；恃强凌弱者|v. / n.
persist|继续存在；持续；坚持；执意|v.
defend|防卫；保卫|v.
harassment|骚扰；侵扰|n.
civil|文明的；有教养的；有礼貌的；彬彬有礼的|adj.
interaction|互动；交流|n.
offensive|冒犯的；使人不快的；令人难堪的|adj.
troll|发挑衅帖子的人|n.
blurry|模糊不清的|adj.
detached|冷静的；不动感情的；客观的|adj.
reinforcement|加强；加固|n.
inflate|吹嘘；吹捧；（使）充气；（使）膨胀|v.
self|某人的自我意识；自身；本身；自己|n.
notorious|臭名昭著的；声名狼藉的|adj.
proportion|部分；份儿|n.
netizen|网民|n.
tone|（作品、演讲、活动等的）基调，格调；气氛；（说话的）语气，口气，腔调|n.
preventative|预防（性）的；防止的|adj.
high-profile|引人注目的|adj.
cyberbullying|网络欺凌|n.
guidance|指导|n.
transition|转变；过渡；变迁|n.
let sb. down|使某人失望|phr.
call sb. out|批评某人|phr.
keep ... in check|控制某人或某物|phr.
go away|消失|phr.`],
[1,4,'Text B',`go through|熬过（困境）；彻底检查；彻底搜查|phr.
only just|才；刚刚|phr.
come to terms with sth.|与某事妥协；对某事让步；接受（令人不快或悲伤的现实）|phr.
switch|（使）转变；（使）改变；（使）转换|v.
addicted|入迷的|adj.
chat|闲谈；聊天|v.
irony|（出乎意料的）奇异可笑之处；有讽刺意味的情况|n.
reform|改邪归正；改造；改革；革新；改进|v.
addict|对……着迷的人|n.
suck|吮吸；吸；咂；啜|v.
yoga|瑜伽|n.
limit|限度；极限|n.
realistic|明智的；恰如其分的；能够实现的|adj.
notification|通知；通报；通告|n.
alert|警报|n.
interruption|打断；中断；打扰|n.
calm|使镇定；使平静|v.
wilderness|荒野；旷野；荒无人烟的地方|n.
offline|未联机的（地）；未连线的（地）|adj. / adv.
delete|删除；删去|v.
strengthen|使（情感、决心等）更强烈；使（关系）更加紧密；增强（体质）|v.
switch off|关（电灯、机器等）|phr.
break out of|改变，逃脱（某种情形或生活方式）|phr.
log off|（键入某个词）退出（计算机系统）|phr.
cut down|降低；减少|phr.
on average|通常；一般说来|phr.
first thing (in the morning)|早上第一件事|phr.
get back to|恢复，重新（做某事）|phr.`],
[2,5,'Episode 1',`commercial|商业的；贸易的|adj.
agriculture|农业；农学|n.
embrace|欣然接受；拥抱|v.
transparency|透明度；公开度|n.
live stream|现场直播|n.
consumer|消费者|n.
mobile|活动的；移动的|adj.
guarantee|保证；担保；保障|v.
organic|（食物或饮料）有机的，未施化肥的|adj.
produce|（水果、蔬菜等）农产品|n.
supplement|增补；补充；追加|v.
entrepreneurial|具有企业家素质的；富于企业家精神的|adj.
inspire|激励；鼓舞|v.
jam|（通常涂在面包上的）果酱|n.
additive|（食品的）添加剂，添加物|n.
devise|发明；设计；想出|v.
chain|连锁商店（或旅馆）；链子；链条；锁链|n.
supplier|（产品或服务的）供应者，供应商，供应国|n.
shelf|（墙上或橱柜里的）搁板，架子|n.
Flemish|佛兰芒语（比利时北部地区的一种语言，为荷兰语的一种变体）|n.
core|核心的；最重要的；最基本的；最重要（或最基本）的部分；核心|n. / adj.
concept|概念|n.
set your sights on|以……为奋斗目标；决心做到|phr.
check on|检查，察看（以确定是否安全、满意等）|phr.
take off|迅速成功；迅速走红；起飞|phr.
later on|以后；过后；后来|phr.
pick up|注意到|phr.
run sb. through|使……迅速了解|phr.
be on the same page|意见一致；立场相同|phr.`],
[2,6,'Episode 2',`match ... up|把……（和……）配对起来|phr.
thrash out|通过讨论找到（解决办法）；通过商讨达成（协议）|phr.
sampling|抽样；取样|n.
infer|推理；推断；断定|v.
characteristic|特征；特点；品质|n.
gender|性别|n.
questionnaire|调查问卷；调查表|n.
participant|参加者；参与者|n.
administer|执行；实施；给予；管理；治理|v.
follow-up|后续的|adj.
clarification|澄清；解释|n.
time-consuming|耗费时间的|adj.
costly|费钱的；昂贵的|adj.
broadly|大体上说来；总体上讲|adv.
statistical|统计的|adj.
moderator|会议主持；辩论会主席|n.
perception|理解；看法；认识|n.
sequence|顺序；次序；先后|n.
gauge|判定，判断（人们的情感或意图）|v.
brand|商标；牌子|n.
openly|公开地；公然地；坦率地|adv.
feedback|反馈意见|n.
brilliant|极好的；极妙的；极有趣的；聪颖的；才华横溢的|adj.
tutor|家庭教师；私人教师|n.
review|评论（文章）|n.`],
[2,7,'Text A',`dedicate|把（时间和力量）用在……上|v.
advert|广告|n.
Thai|泰语|n.
Spanish|西班牙语|n.
lend itself to sth.|适于……|phr.
put in|花费，耗费，投入（时间、心思等）|phr.
work out|成功地发展；锻炼身体；做运动|phr.
apart from|除……之外还；除……之外|phr.
think twice|仔细考虑；三思|phr.
give sth. a miss|决定放弃某事|phr.
gig|工作；（尤指自雇的）谋生之道|n.
employment|职业；工作|n.
workforce|（国家或行业等的）劳动力，劳动大军，劳动人口|n.
autonomy|自主；自主权|n.
shift|（想法、做法等的）改变，转变；（使）移动；（使）转移|n. / v.
entrepreneurship|创业能力；创业精神|n.
disrupt|扰乱；使中断；打乱|v.
remotely|远距离地|adv.
breed|（人或物的）类型，种类；（动物）生育，繁殖|n. / v.
opt|选择；决定|v.
digital nomad|数字游民|n.
delivery|送货；投递|n.
furthermore|此外；而且；不仅如此；更有甚者|adv.
favor|较喜欢；选择；帮助；好事；恩惠|v. / n.
bureaucracy|官僚制度；官僚作风；官僚主义|n.
observer|观察家|n.
conventional|常例的；传统的；因袭的|adj.
progression|（逐步的）变化，发展，进展|n.`],
[2,8,'Text B',`ladder|（发迹、晋升等的）阶梯，途径；梯子|n.
freelance|从事自由职业者的（地）|adj. / adv.
implication|可能的影响（或结果）|n.
downside|（某事物的）不足之处，不利方面，缺点|n.
predict|预测；预言；预料；预计|v.
health care|医疗（服务）|n.
by no means|绝不；丝毫不；一点儿不|phr.
to begin with|首先；第一|phr.
break free|摆脱（某人或某种局面）|phr.
as and when|当……时；到……的时候|phr.
worse off|（形势比以前或别人）更糟的|phr.
be here to stay|被普遍接受（或使用）；成为风尚|phr.
on all sides|在各方向；在四面八方|phr.
artificial|人造的；人工的|adj.
intelligence|智慧；智力；悟性|n.
towel|毛巾；抹布|n.
fraction|少量；一点儿|n.
inevitable|必然的；不可避免的|adj.
populate|居住于；生活于；构成……的人口|v.
compete|竞争；对抗|v.
equivalent|等同物；等价物；对应物；等同的；等值的；相当的|n. / adj.
robotics|机器人学|n.
ultimately|最终；终于|adv.
automation|自动化|n.
threaten|威胁到；危及；威胁；恐吓|v.
eliminate|消除；剔除；根除|v.
redundant|多余的；不必要的|adj.
characterize|（人、地方或事物）以……为特征，以……为典型|v.
predictable|可预料的；可预见的|adj.`],
[2,9,'Text B',`repetitive|（长时间）重复的；单调的|adj.
manufacturing|制造业|n.
unrest|不安宁；动乱；骚乱|n.
revolution|（尤指思想或方式的）突然变革，大变化；革命；革命运动|n.
steam|蒸汽压力（或动力）；水蒸气；蒸汽|n.
transportation|交通运输系统；运输方式|n.
urbanization|城市化；都市化|n.
innovation|新观念；新方法；新发明|n.
productivity|生产率；生产力|n.
transform|使改观；使变形；使转化|v.
dramatically|突然地；明显地|adv.
manual|手工的；用手的|adj.
conclude|推断出；推论出|v.
adaptability|适应能力；适应性|n.
imperative|紧迫的事；紧要之物；紧迫的；紧要的|n. / adj.
along the lines of|类似于|phr.
give rise to|引起（或导致）某事（尤指令人不快或出人意料的事）|phr.`]
]
// 原书单词表中带 * 号的为大学英语四级词汇（重点词）
const STARRED = new Set<string>([
  'straightforward','confuse','interpret','submit','criteria','breakthrough','launch','phenomenon','classify','symbol','grin','eyebrow','shed','laughter','rosy','cheek','float','approval','flame','exemplary','varying','respondent',
  'neutral','tricky','interpretation','standardize','device','platform','perceive','exact','dimension','horn','cheat','literal','evolve','consistent','instantly','bar','transfer','expense','athlete','medal','disappointment',
  'abuse','bully','persist','defend','civil','interaction','offensive','troll','blurry','detached','reinforcement','inflate','self','notorious','proportion','tone','preventative','guidance',
  'switch','addicted','chat','irony','reform','addict','suck','yoga','limit','realistic','notification','alert','interruption','calm','wilderness','offline','delete','strengthen',
  'commercial','agriculture','embrace','transparency','consumer','mobile','guarantee','organic','produce','supplement','entrepreneurial','inspire','jam','devise','chain','supplier','shelf','core','concept',
  'infer','characteristic','gender','questionnaire','participant','administer','clarification','costly','broadly','statistical','moderator','perception','sequence','brand','openly','feedback','brilliant','tutor','review',
  'employment','workforce','shift','disrupt','remotely','breed','opt','delivery','furthermore','favor','observer','conventional','progression',
  'ladder','implication','predict','artificial','intelligence','towel','fraction','inevitable','populate','compete','equivalent','ultimately','automation','threaten','eliminate','redundant','characterize','predictable',
  'repetitive','revolution','steam','transportation','urbanization','innovation','productivity','transform','dramatically','manual','conclude','imperative',
])

export const vocabulary: Word[] = rows.flatMap(([unit,page,section,text]) => text.split('\n').map((row,i) => { const [en,zh,pos] = row.split('|'); const actualSection=page===1&&['varying','respondent'].includes(en)?'Episode 2':page===2&&['athlete','medal','disappointment'].includes(en)?'Text A':page===4&&['go through','only just','come to terms with sth.'].includes(en)?'Text A':page===5&&['match ... up','thrash out'].includes(en)?'Episode 1':page===6&&['match ... up','thrash out'].includes(en)?'Episode 1':page===7&&i<10?'Episode 2':page===8&&i<13?'Text A':section; return {id:`${page}-${i}`,en,zh,pos,unit,page,section:actualSection,phrase:pos==='phr.',starred:STARRED.has(en)} }))
export const sourceName = '扫描文件_20261101_181926.pdf'
export const unitNames = ['全部单元', 'Unit 1 · 数字时代的连接', 'Unit 2 · 工作与技术']
export const sectionNames = ['Episode 1', 'Episode 2', 'Text A', 'Text B']
export const sectionsOf = (unit: number) => sectionNames.filter(s => vocabulary.some(w => (!unit || w.unit === unit) && w.section === s))
