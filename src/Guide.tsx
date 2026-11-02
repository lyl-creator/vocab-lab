import type { ReactNode } from 'react'

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section className="guide-section" id={id}>
    <h2>{title}</h2>
    {children}
  </section>
)

export default function GuidePage() {
  return (
    <div className="guide">
      <div className="page-heading">
        <div>
          <div className="eyebrow">HOW TO USE VOCAB LAB</div>
          <h1>使用指南<span className="heading-dot">.</span></h1>
          <p>五分钟了解所有功能：词库、题型、真题、生词本、云同步与数据备份。</p>
        </div>
      </div>

      <nav className="guide-toc">
        <a href="#quick">快速开始</a>
        <a href="#dicts">三个词库</a>
        <a href="#modes">六种练习</a>
        <a href="#exams">四级真题</a>
        <a href="#notebook">生词本与统计</a>
        <a href="#daily">每日一词</a>
        <a href="#account">账号与云同步</a>
        <a href="#links">链接与分享</a>
        <a href="#data">数据与备份</a>
        <a href="#faq">常见问题</a>
      </nav>

      <Section id="quick" title="快速开始">
        <ol className="guide-list">
          <li>左侧（手机为左上角菜单）选择<b>词库</b>：课本词库、四级词库或翻译词汇。</li>
          <li>在「学习概览」点<b>开始词汇测验</b>，选练习方式与范围后开始。</li>
          <li>答完提交，立即看到正误；整组结束后生成<b>测评报告</b>。</li>
          <li>错题自动进入<b>生词本</b>，可以复习，也可以在「学习统计」看趋势。</li>
        </ol>
        <p className="guide-note">不限时，随时可以暂停或结束；结束未完成的测验不计入统计。</p>
      </Section>

      <Section id="dicts" title="三个词库">
        <ul className="guide-list">
          <li><b>课本词库</b>：教材 9 页扫描件整理的 241 个词，带 ★ 重点词标记，可按 Unit 与 Episode / Text 栏目筛选。</li>
          <li><b>四级词库</b>：大纲 4428 词，其中 577 个高频词；可勾选「只考高频词」；额外提供<b>真题选词填空</b>与<b>真题翻译</b>。</li>
          <li><b>翻译词汇</b>：四六级翻译常用表达 548 条，按 11 个主题分组。</li>
        </ul>
        <p className="guide-note">三个词库的生词本、学习统计、顺序练习进度都是<b>彼此独立</b>的，切到哪个词库就只看哪一份数据。</p>
      </Section>

      <Section id="modes" title="六种练习">
        <ul className="guide-list">
          <li><b>英译中</b>：看英文选中文释义，四个选项。</li>
          <li><b>中译英</b>：看中文选英文单词。</li>
          <li><b>拼写填空</b>：不给选项，直接拼写；会标出是单词还是短语，含 <code>sb./sth.</code> 等占位符的短语不参与拼写。</li>
          <li><b>词义配对</b>：左右两列点击配对，每组最多 4 个词。</li>
          <li><b>选词填空</b>：课本用课文原文挖 10 空；四级直接使用真题（10 空 + 15 个候选词）。判分按文章中的词形，忽略大小写。</li>
          <li><b>翻译题</b>（仅四级）：翻译一段中文，提交后对照参考译文与点拨，自行判定「掌握 / 还需练习」。</li>
        </ul>
        <p className="guide-note">出题会优先抽取重点词（课本 ★ / 四级高频），不足时才用其余词补齐。</p>
      </Section>

      <Section id="exams" title="四级真题">
        <p>选词填空 12 套（2024.06 / 2024.12 / 2025.06 / 2025.12 各三套，外加 2026.06 三套）；翻译题 15 套（多出 2024.12 的三套）。</p>
        <ul className="guide-list">
          <li>打开设置弹窗后，选「选词填空」或「翻译题」，会出现<b>真题套次</b>：默认随机一套，也可以按年份 + 套次指定。</li>
          <li>选词填空 10 个空、15 个候选词，提交后显示<b>答案对照</b>。</li>
          <li>翻译题的参考译文与点拨按年份取自解析原文：2026「翻译点拨」、2025「译点精析」、2024.12「难点注释」。</li>
        </ul>
      </Section>

      <Section id="notebook" title="生词本与统计">
        <ul className="guide-list">
          <li>任何答错的词会自动进入<b>生词本</b>，按错次排序；可以标记为已掌握，或发起只含生词的复习。</li>
          <li>复习模式下答对一次错次 −1，答错 +1，减到 0 自动移出生词本。</li>
          <li><b>学习统计</b>包含累计测验、综合正确率、近 7 天节奏与每一次测验的详细报告。</li>
          <li>「我的词库」每行的 ▶ 可以从该词开始顺序练习，退出时会记住进度。</li>
        </ul>
      </Section>

      <Section id="daily" title="每日一词">
        <p>学习概览右下角每天轮换一个词（从 60 个激励向的四级词里取），并配一句励志短句；首页插画上的「WORD OF THE DAY」与它是同一个词。当天固定，次日自动更换。</p>
      </Section>

      <Section id="account" title="账号与云同步">
        <ul className="guide-list">
          <li>点右上角<b>头像 + 昵称</b>打开「账号与资料」：可换 12 个内置头像、改昵称、改密码；未登录也能改，只存在本机。</li>
          <li>第一次使用点<b>注册</b>（邮箱 + 密码，至少 6 位），注册成功后直接登录。</li>
          <li>登录同一账号的设备会自动同步：登录时拉取、每完成一局自动上传；也可以在面板里点「立即同步」。</li>
          <li>两边都有对方没有的记录时，会弹窗让你选：<b>合并两边</b> / 用云端覆盖本地 / 用本地覆盖云端。内容完全相同时不会打扰你。</li>
          <li>「清空学习记录」会同时清空本机与云端的记录。</li>
        </ul>
      </Section>

      <Section id="links" title="链接与分享">
        <p>每个词库、板块、练习方式都有独立网址，直接打开即可定位：</p>
        <ul className="guide-list guide-links">
          <li><code>/cet4/</code>、<code>/cet4/high/</code>——四级全部 / 高频</li>
          <li><code>/book/u1/episode-1/</code>——课本第 1 单元 Episode 1</li>
          <li><code>/translation/中国历史/</code>——翻译词汇的某个主题</li>
          <li><code>/cet4/cloze/</code>——直接打开选词填空的设置</li>
          <li><code>/cet4/cloze/2025-12-2/</code>——并预选某一套真题</li>
        </ul>
        <p className="guide-note">旧版的 <code>#/cet4/high</code> 链接会自动跳转到新地址。</p>
      </Section>

      <Section id="data" title="数据与备份">
        <ul className="guide-list">
          <li>学习记录默认保存在浏览器本地（localStorage），不上传服务器；登录后才会同步到你的账号。</li>
          <li>「偏好设置 → 学习记录备份」可以导出 JSON 备份，换设备时导入；合并导入按测验去重，覆盖导入会替换本机记录。</li>
          <li>清理浏览器数据会丢失未备份的记录，动手前先导出。</li>
          <li>浏览器给本站的本地存储约 5MB（约等于 7000 份测验记录）。接近上限时会自动清理最旧的记录并提示；真的写满时会提示「本次记录未能保存」，此时先导出备份再清理。</li>
        </ul>
      </Section>

      <Section id="faq" title="常见问题">
        <dl className="guide-faq">
          <dt>换了设备，记录不见了？</dt>
          <dd>右上角登录同一账号会自动拉取；没有账号就用导出 / 导入。</dd>
          <dt>同步时弹出「云端已有学习记录」？</dt>
          <dd>说明两台设备的记录不完全一样，按需要选合并或覆盖；内容相同时不会弹。</dd>
          <dt>忘记密码怎么办？</dt>
          <dd>账号不绑定邮箱，暂时无法自助找回；可以重新注册，旧数据用导出的 JSON 导入。</dd>
          <dt>为什么同一个词在不同词库都出现？</dt>
          <dd>三个词库独立维护，四级大纲词与课本词可能重合，但记录互不影响。</dd>
          <dt>测验中途退出会怎样？</dt>
          <dd>未完成的测验不计入统计，已判定的错题仍会保留在生词本。</dd>
        </dl>
      </Section>

      <p className="guide-foot">词汇实验室 · 慢慢学，牢牢记。</p>
    </div>
  )
}
