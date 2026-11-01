export type Word = { id: string; en: string; zh: string; pos: string; unit: number; section: string; page: number; phrase: boolean }
// Transcribed from the supplied scanned textbook; page denotes the PDF page, not the printed page.
const rows: [number, number, string, string][] = [
[1,1,'Episode 1',`straightforward|简单的；易懂的|adj.
confuse|使困惑；把……弄糊涂|v.
ambiguous|含糊不清的；模棱两可的|adj.
interpret|理解；诠释|v.
submit|提交；呈送|v.
criteria|标准；准则；尺度|n.
Venus flytrap|捕蝇草|n.
hieroglyphics|象形文字|n.
breakthrough|突破；重大进展|n.
launch|上市；发行|v.
phenomenon|现象|n.
classify|把……分类|v.
smiley|笑容符|n.
symbol|象征；标志|n.
grin|露齿笑；咧嘴笑|n. / v.
eyebrow|眉毛|n.
shed|流泪|v.
laughter|笑声|n.
rosy|粉红色的；红润的|adj.
cheek|脸颊；脸蛋|n.
float|漂浮；漂流；飘动|v.
approval|批准；认可；赞许|n.
flame|火焰；火舌|n.
exemplary|优秀的；值得效仿的|adj.
take sb. / sth. (for example)|以某人或某事为例|phr.
come full circle|循环；又回到原处|phr.
varying|不同的|adj.
respondent|回答问题的人|n.`],
[1,2,'Episode 2',`neutral|中性的；中立的；不偏不倚的|adj.
tricky|难办的；难对付的|adj.
interpretation|解释；阐释|n.
ambiguity|模棱两可；不明确|n.
standardize|使符合统一规格；使标准化|v.
device|器械；设备；装置|n.
platform|计算机平台；站台|n.
perceive|理解；思考；认为|v.
exact|确切的；精确的|adj.
clenched|紧咬的；紧握的|adj.
dimension|方面；部分|n.
horn|角；喇叭|n.
cheat|欺骗；蒙骗|v.
thumbs-up|竖起大拇指|n.
literal|字面意思的；原义的|adj.
evolve|逐步发展；演化|v.
consistent|一致的；始终如一的|adj.
instantly|立即；马上|adv.
ravioli|意大利方饺|n.
ingot|铸块；锭|n.
bar|条；块|n.
transfer|使转移；搬迁|v.
expense|花费；费用|n.
what for|为什么|phr.
go for|努力争取某事物|phr.
athlete|运动员；体育家|n.
medal|奖牌；勋章|n.
disappointment|失望；扫兴；沮丧|n.`],
[1,3,'Text A',`diver|潜水者；跳水运动员|n.
malicious|恶意的；恶毒的|adj.
abuse|辱骂|n.
bully|威吓；欺侮；恃强凌弱者|v. / n.
persist|继续存在；持续；坚持|v.
defend|防卫；保卫|v.
harassment|骚扰；侵扰|n.
civil|文明的；有教养的；有礼貌的|adj.
interaction|互动；交流|n.
offensive|冒犯的；使人不快的|adj.
troll|发挑衅帖的人|n.
blurry|模糊不清的|adj.
detached|冷静的；不动感情的；客观的|adj.
reinforcement|加强；加固|n.
inflate|吹嘘；使充气；使膨胀|v.
self|自身；本身；自己|n.
notorious|臭名昭著的；声名狼藉的|adj.
proportion|部分；份儿|n.
netizen|网民|n.
tone|基调；语气；口气|n.
preventative|预防的；防止的|adj.
high-profile|受注目的|adj.
cyberbullying|网络欺凌|n.
guidance|指导|n.
transition|转变；过渡；变迁|n.
let sb. down|使某人失望|phr.
call sb. out|批评某人|phr.
keep ... in check|控制某人或某物|phr.
go away|消失|phr.`],
[1,4,'Text B',`go through|熬过困境；彻底检查|phr.
only just|才；刚刚|phr.
come to terms with sth.|接受令人不快或悲伤的现实|phr.
switch|使转变；使改变；使转换|v.
addicted|入迷的|adj.
chat|闲谈；聊天|v.
irony|奇异可笑之处；有讽刺意味的情况|n.
reform|改邪归正；改进；改革|v.
addict|对某事着迷的人|n.
suck|吮吸；吸；咂|v.
yoga|瑜伽|n.
limit|限度；极限|n.
realistic|切合实际的；能够实现的|adj.
notification|通知；通报；通告|n.
alert|警报|n.
interruption|打断；中断；打扰|n.
calm|使镇定；使平静|v.
wilderness|荒野；旷野|n.
offline|未联机的；未连线的|adj. / adv.
delete|删除；删去|v.
strengthen|使增强；使更加强烈|v.
switch off|关电灯或机器等|phr.
break out of|改变；逃脱某种情形或生活方式|phr.
log off|退出计算机系统|phr.
cut down|降低；减少|phr.
on average|通常；一般说来|phr.
first thing (in the morning)|早上第一件事|phr.
get back to|恢复；重做某事|phr.`],
[2,5,'Episode 1',`commercial|商业的；贸易的|adj.
agriculture|农业；农学|n.
embrace|欣然接受；拥抱|v.
transparency|透明度；公开度|n.
live stream|现场直播|n.
consumer|消费者|n.
mobile|活动的；移动的|adj.
guarantee|保证；担保；保障|v.
organic|有机的；无施化肥的|adj.
produce|农产品|n.
supplement|增补；补充；追加|v.
entrepreneurial|具有企业家素质的；富于企业家精神的|adj.
inspire|鼓励；激励；鼓舞|v.
jam|果酱|n.
additive|添加剂；添加物|n.
devise|发明；设计；想出|v.
chain|连锁商店；链子；链条|n.
supplier|供应者；供应商；供应国|n.
shelf|搁板；架子|n.
Flemish|佛兰芒语|n.
core|核心；最重要的部分|n. / adj.
concept|概念|n.
set your sights on|决心做到；以某事为奋斗目标|phr.
check on|检查；察看|phr.
take off|迅速成功；起飞|phr.
later on|以后；过后；后来|phr.
pick up|注意到|phr.
run sb. through|使某人迅速了解|phr.
be on the same page|意见一致；立场相同|phr.`],
[2,6,'Episode 2',`match ... up|把相关或适合的两者配对起来|phr.
thrash out|通过讨论找到解决办法或达成协议|phr.
sampling|抽样；取样|n.
infer|推断；推断出|v.
characteristic|特征；特点；品质|n.
gender|性别|n.
questionnaire|调查问卷；调查表|n.
participant|参加者；参与者|n.
administer|执行；实施；管理；治理|v.
follow-up|后续的|adj.
clarification|澄清；解释|n.
time-consuming|耗费时间的|adj.
costly|费钱的；昂贵的|adj.
broadly|大体上说来；总体上来讲|adv.
statistical|统计的|adj.
moderator|会议主持；辩论会主席|n.
perception|理解；看法；认识|n.
sequence|顺序；次序；先后|n.
gauge|判定；判断人们的情感或意图|v.
brand|商标；牌子|n.
openly|公开地；公然地；坦率地|adv.
feedback|反馈意见|n.
brilliant|极好的；聪颖的；才华横溢的|adj.
tutor|家庭教师；私人教师|n.
review|评论文章|n.`],
[2,7,'Text A',`dedicate|把时间和精力用在某事上|v.
advert|广告|n.
Thai|泰语|n.
Spanish|西班牙语|n.
lend itself to sth.|适于某种用途|phr.
put in|花费；耗费；投入时间或心思|phr.
work out|成功地发展；锻炼身体|phr.
apart from|除了……之外；除……之外|phr.
think twice|仔细考虑；三思|phr.
give sth. a miss|决定放弃某事|phr.
gig|工作；代指自由职业谋生之道|n.
employment|职业；工作|n.
workforce|劳动力；劳动大军；劳动人口|n.
autonomy|自主；自主权|n.
shift|改变；转变；使转移|n. / v.
entrepreneurship|创业能力；创业精神|n.
disrupt|使混乱；使中断；打乱|v.
remotely|远距离地|adv.
breed|类型；种类；生育；繁殖|n. / v.
opt|选择；决定|v.
digital nomad|数字游民|n.
delivery|送货；投递|n.
furthermore|此外；而且；不仅如此|adv.
favor|较喜欢；选择；帮助；恩惠|v. / n.
bureaucracy|官僚制度；官僚作风|n.
observer|观察家|n.
conventional|常规的；传统的；因袭的|adj.
progression|发展；演化；进展|n.`],
[2,8,'Text B',`ladder|阶梯；途径；梯子|n.
freelance|从事自由职业的|adj. / adv.
implication|可能的影响或结果|n.
downside|不足之处；不利方面；缺点|n.
predict|预测；预言；预料|v.
health care|医疗服务|n.
by no means|绝不；丝毫不；一点儿不|phr.
to begin with|首先；第一|phr.
break free|摆脱；脱身|phr.
as and when|当某时；到某时|phr.
worse off|处于更差的境况|phr.
be here to stay|被普遍接受；成为风尚|phr.
on all sides|在各方向；在四面八方|phr.
artificial|人造的；人工的|adj.
intelligence|智力；智慧；悟性|n.
towel|毛巾；抹布|n.
fraction|少量；一点儿|n.
inevitable|必然的；不可避免的|adj.
populate|居住于；生活于；构成某地的人口|v.
compete|竞争；对抗|v.
equivalent|等同物；相同的；等同的|n. / adj.
robotics|机器人学|n.
ultimately|最终；终于|adv.
automation|自动化|n.
threaten|威胁到；危及|v.
eliminate|消除；删除；根除|v.
redundant|多余的；不必要的|adj.
characterize|以某事为特征；以某事为典型|v.
predictable|可预料的；可预见的|adj.`],
[2,9,'Text B',`repetitive|长期重复的；单调的|adj.
manufacturing|制造业|n.
unrest|不安宁；动乱；骚乱|n.
revolution|突变；大变化|n.
steam|蒸汽压力；水蒸气|n.
transportation|交通运输系统；运输方式|n.
urbanization|城市化；都市化|n.
innovation|新观念；新方法；新发明|n.
productivity|生产率；生产力|n.
transform|使改观；使变形；使转化|v.
dramatically|突然地；明显地|adv.
manual|手工的；用手的|adj.
conclude|推断出；推论出|v.
adaptability|适应能力；适应性|n.
imperative|重要且紧迫的事；紧要的|n. / adj.
along the lines of|类似于|phr.
give rise to|引起；使发生|phr.`]
]
export const vocabulary: Word[] = rows.flatMap(([unit,page,section,text]) => text.split('\n').map((row,i) => { const [en,zh,pos] = row.split('|'); const actualSection=page===1&&['varying','respondent'].includes(en)?'Episode 2':page===2&&['athlete','medal','disappointment'].includes(en)?'Text A':page===4&&['go through','only just','come to terms with sth.'].includes(en)?'Text A':page===5&&['match ... up','thrash out'].includes(en)?'Episode 1':page===6&&['match ... up','thrash out'].includes(en)?'Episode 1':page===7&&i<10?'Episode 2':page===8&&i<13?'Text A':section; return {id:`${page}-${i}`,en,zh,pos,unit,page,section:actualSection,phrase:pos==='phr.'} }))
export const sourceName = '扫描文件_20261101_181926.pdf'
export const unitNames = ['全部单元', 'Unit 1 · 数字时代的连接', 'Unit 2 · 工作与技术']
