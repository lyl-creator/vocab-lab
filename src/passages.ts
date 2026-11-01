export type Passage = {
  id: string
  unit: number
  section: string
  title: string
  source: string
  paragraphs: string[]
}

// 文章正文转录自教材（Unit 1 / Unit 2 的 Episode 1、Episode 2、Text A、Text B）
export const passages: Passage[] = [
  {
    id: 'u1-episode-1',
    unit: 1,
    section: 'Episode 1',
    title: 'What are emojis?',
    source: 'Unit 1 · Episode 1',
    paragraphs: [
      `According to the Oxford dictionary an emoji is "a small digital image used to express an idea or emotion". They were first developed in Japan, and the word "emoji" comes from the Japanese word "えもじ", which means picture character or letter. Some have commented that from the hieroglyphics of ancient Egypt to the emojis we use today, human communication has come full circle!`,
      `Emojis have been one of the biggest communication breakthroughs since text messaging became available to the public. The first emojis were launched in the late 1990s in Japan, but they didn't become a global phenomenon until the 2010s. Now, there are over 3,000 emojis. Emojis have become so popular on social media that in 2015 the "face with tears of joy" emoji was chosen as the Oxford Word of the Year!`,
      `Emojis are usually classified into eight categories: smileys and people, such as 😄 👫; animals and nature, such as 🐱 🌸; food and drink, such as 🍔 ☕; activities, such as ⚽ 🥊; travel and places, such as ✈️ 🌆; objects, such as 💡 ⏰; symbols, such as 🎵 💗; and flags, such as 🏁 🚩.`,
      `What are the meanings of some popular emojis?`,
      `😂 A yellow face with a big grin, raised eyebrows, and smiling eyes, shedding tears of laughter. It is widely used to show something is funny.`,
      `😍 A yellow face with smiling eyes, a closed smile, rosy cheeks, and several hearts floating around it. It is used to express a range of happy feelings…`,
      `✔️ A thick, filled-in check mark. It shows approval or that something has been green-lit to move on to the next step of a process.`,
    ],
  },
  {
    id: 'u1-episode-2',
    unit: 1,
    section: 'Episode 2',
    title: '"Very happy" or "ready to fight": How clear is the message?',
    source: 'Unit 1 · Episode 2',
    paragraphs: [
      `It is estimated that emojis are used, to varying degrees, by 90 percent of the world's online population. But are we all clear on what they mean?`,
      `Emojis can be interpreted differently by different people. A study conducted at the University of Minnesota found that respondents disagreed 25 percent of the time on whether an emoji's meaning was positive, negative, or neutral. The researchers rightly maintain that while words have a dictionary definition, emojis are trickier and are often open to interpretation. Even the popular "face with tears of joy" emoji is often misunderstood as a sad crying face by some users.`,
      `This ambiguity increases with the fact that emoji designs are not standardized across all devices, or "platforms", being used. Some of these designs are more ambiguous than others. Take the "grinning face with smiling eyes" emoji, pictured below, for example. On Samsung devices, it is perceived by readers as "very happy", because of its broad and open smile. However, the exact same emoji displayed on Apple devices is a clenched-teeth smile, and is often perceived as "ready to fight". As we can see from this example, it is important for designers to be really clear about what they want their emoji to communicate, and make sure that it cannot be too easily misinterpreted.`,
      `There is also a cultural dimension to how we interpret and use emojis. For example, in many countries, the "sign of the horns" emoji is seen as a lucky sign, but in Brazil, Greece and Spain, if it is directed at a specific person it means that their partner has cheated on them! The "thumbs-up" emoji is seen as a positive symbol in most of the world, but in Iran, Iraq and Nigeria it is interpreted negatively. In most countries the "fire" emoji has the literal meaning of heat, but in Trinidad and Tobago and the U.K. it is often used to mean attraction.`,
      `Sign of the horns: Lucky or cheating? Thumbs-up: Positive or negative? Fire: Heat or hot?`,
      `So next time we send a message, remember that our reader may interpret our emojis differently from what we intended. As emojis are a relatively new form of communication, the way they are used and understood is still evolving. Hopefully, as time passes, the design of emojis will become more standardized and their interpretations will be consistent, so that fewer or no communication challenges arise.`,
    ],
  },
  {
    id: 'u1-text-a',
    unit: 1,
    section: 'Text A',
    title: 'Is the Internet destroying our social norms?',
    source: 'Unit 1 · Text A',
    paragraphs: [
      `1 For any athlete, failing to win a gold medal at the Olympics can be a great disappointment. However, for British Olympic diver Tom Daley, failure to win gold at the 2012 London Olympics was even worse, thanks to malicious online abuse he suffered as a result. His father had recently died of cancer, and Tom was bullied online by a teenager, who said that he had "let his father down". Tom called this person out, but the attacks persisted, both on Tom and those who defended him online. The bully was later arrested and given a warning for harassment. Of course, there are many positive benefits that online communication can bring us, such as being able to keep in touch with family and friends all around the world, but Tom Daley's story is just one of the many examples that remind us of this technology's dark side.`,
      `2 Anyone will tell you that communication online is often a much less civil affair than traditional forms of communication, especially face-to-face interactions. When interacting with people we actually know in real life, most people communicate according to socially accepted rules of politeness. However, in more public forums, such as on social media, these rules just seem to disappear. There are many who post offensive comments just for the purpose of starting arguments. These people are known as "trolls", and they seem to be increasing in number as the norms of acceptable behavior online become increasingly blurry.`,
      `3 So, why is this happening?`,
      `4 When communicating online, even when we use our real identities, we feel detached from the people we are interacting with. This is because we often don't know them personally, and feel we are unlikely ever to meet them face to face. Sometimes this distance is positive, because it makes it easier for people to be more "open" online. However, not looking into people's faces or hearing their voices also makes it easier for us to forget that they are real people, with real feelings that can be hurt.`,
      `5 It also seems that we get "positive reinforcement" from the attention that bad behavior can give us online, and this can inflate our sense of self and lead to online bullying. In interviews after his arrest, Tom Daley's troll said that he was proud of how his cruel messages had become so notorious on the Internet and in the media. It seems as if the whole thing was just a game for him. Of course, this kind of negative behavior is only carried out by a small proportion of "netizens", but it has an impact on the whole tone of online communication, and can easily spread if not kept in check.`,
      `6 This problem is not going away, so action needs to be taken to control it. Obviously, the Internet service providers have a responsibility to police the most extreme types of online abuse, as do the authorities. However, a better solution would be to try and deal with the problem in a preventative way, through education. Now that the Internet is such a big part of our lives, parents and schools need to teach children about politeness and acceptable norms of behavior. So far the education system has been slow to act, but thanks to several high-profile cases of cyberbullying, this is now beginning to change. Schools are now increasingly giving children guidance on online behavior and teaching them how to stay safe.`,
      `7 Our society is currently going through a period of transition in relation to online communication, and we are only just coming to terms with some of the challenges it presents. Hopefully, we can now start work on finding the solutions, since many of the problems have been identified. Then, we can ensure that everyone has the chance to enjoy the amazing benefits that the Internet can bring.`,
    ],
  },
  {
    id: 'u1-text-b',
    unit: 1,
    section: 'Text B',
    title: 'Switch off? How difficult!',
    source: 'Unit 1 · Text B',
    paragraphs: [
      `Nicky: Help! I think I'm addicted to social media and need to break out of it. I can't help checking my social media accounts and spending hours chatting with friends online. It feels like my "real" life has been stolen from me. If you've got experience of controlling a similar online addiction, please share any tips or advice here. Thanks in advance.`,
      `Mr. Helpful: Don't you see the irony of asking for help this online? Log off already!`,
      `NetWizard: That wasn't very helpful, was it?`,
      `Max (Reformed Internet Addict): Hi Nicky. Ignore the trolls! I had a similar problem and I've managed to cut my screen time down by more than half! Can I ask you some questions first to find out more about your online habits?`,
      `• How much time do you spend online each day?`,
      `• Which social media platforms do you use most?`,
      `• When do you spend most time online?`,
      `• How did you spend your free time before?`,
      `Nicky: Sure, I spend about 4—5 hours a day online on average, mostly on Facebook, Instagram and Twitter. I check all my accounts first thing in the morning and even wake up sometimes in the night and check my phone. I am checking them all throughout the day at college, and in lectures, and spend lots of time online in the evening watching videos. It just sucks me in! I used to read quite a bit and do yoga most evenings. Hoping you can help me achieve what you've done!`,
      `Max (Reformed Internet Addict): So … the first thing I did was to set myself a limit on my screen time, and then I used an app to help monitor and control it. Setting realistic targets helped reduce my screen time gradually week by week. The app also helped me monitor how I was spending my time online, and made me realize that I was actually looking at the same things over and over again on social media. So I decided to limit myself and only check my accounts three times a day. Once in the morning, once around lunchtime and then one more time in the evening. Another thing that helped me was turning off the notification alerts so that my phone wasn't "pinging" all the time. This REALLY helped me break the habit of constant checking!`,
      `Without interruptions from your phone you'll probably get back into reading and yoga. That will help calm your mind for sure. Good Luck!`,
      `Nicky: Thanks for the tips, Max! I'll give your suggestions a go!`,
      `Alison: Great ideas! Another thing I've done is change a setting on my phone so that it isn't constantly connected to the Internet. This limits my screen time, especially when I'm out, and it also saves money!`,
      `Wilderness Addict: Going offline is the answer! Not forever, of course, but taking real breaks from it makes you realize how you can live without the Internet. Go away somewhere offline. A weekend away camping is the perfect way to reconnect with nature and break your Internet addiction at the same time. Then it will be easier to do the things Max suggests.`,
      `Nicky: Thanks, Wilderness Addict. I think that might be the answer. I used to really love walking and camping when I was a kid. I'd love to pack a good book and my yoga mat and leave my phone at home!`,
      `Paul: Delete some of the social network apps from your phone. I did this and now only use 2 social media networks, down from 5. It really helped me limit the time I spend checking updates.`,
      `Christina: Don't forget to use some of the time you save to strengthen your relationships with your friends and family. Arrange to see them more often — keep your phone in your bag and enjoy quality time with the people you love!`,
      `Nicky: Thanks everyone for the great advice. I'm logging off now!`,
    ],
  },
  {
    id: 'u2-episode-1',
    unit: 2,
    section: 'Episode 1',
    title: 'Three entrepreneurs',
    source: 'Unit 2 · Episode 1',
    paragraphs: [
      `Gou Yingda · Yenong Youpin — "Internet Plus" and problem solving`,
      `Growing up with the Internet, Gou Yingda understood the value that it could bring to people's lives. At a young age, he also understood the commercial value that it could bring to traditional industries. He set his sights on agriculture, and could see the huge business potential if the industry could embrace information technology. He identified that the key problem with the industry was the growing concern over food safety. So he developed a clear picture of what he could do to increase the transparency of agricultural operations and build people's trust in agricultural products. He started an Internet company named Yenong Youpin. The company sets up cameras on its farmland and provides real-time updates via live streams, so urban consumers can check on the plants with mobile phones. In this way, the company links farmers with consumers while guaranteeing green and organic produce.`,
      `Richard Ludlow · Academic Earth — Entrepreneurial ideas inspired by one's own experiences`,
      `While studying at Yale University, Richard supplemented his studies with online video-based resources from other famous universities, such as MIT. He had the idea of creating an online platform to provide access to high-quality learning materials from a variety of disciplines free of charge to students around the world. At the age of 22, he co-founded Academic Earth with Chris Bruner and Liam Pisano. Their website was launched the following year. The site took off thanks to word-of-mouth praise by bloggers and sharing on social media. Later on, Academic Earth was acquired by an education technology company, and continued to provide free online college courses as well as original videos.`,
      `Fraser Doherty · SuperJam — From Granny's kitchen to the supermarket shelves and beyond`,
      `Who would have thought that Grandma's jam recipe could become the basis for a successful business? Fraser Doherty did! When Fraser Doherty was 14, he learned to make many different jams from his grandmother. At first, he made jams in his parents' kitchen and sold the jam he made around his neighborhood and at the farmers' market. Later, he wanted to turn this into a career. He started to do some research and found that jam sales had been falling because people considered jam to be unhealthy, containing a lot of sugar and additives. He decided, therefore, to make healthier jams. Based on his grandmother's recipe, he successfully devised a way of producing jam using just 100 percent fruit and started his own small company, SuperJam. Two years later, his product was picked up by the supermarket chain Waitrose, and Fraser became the youngest ever supplier to a U.K. supermarket.`,
    ],
  },
  {
    id: 'u2-episode-2',
    unit: 2,
    section: 'Episode 2',
    title: 'Market research methods',
    source: 'Unit 2 · Episode 2',
    paragraphs: [
      `Surveys are designed to help researchers gain an understanding of people's behaviors or opinions. Sampling, or selecting a specific group of people to take a survey, allows researchers to infer information about a population based on the survey results, without having to investigate every individual. To create a representative sample, researchers need to make sure that the sample group reflects the characteristics of the target social group in terms of age, gender, education, etc. There are two main types of survey research: questionnaires and interviews.`,
      `Questionnaires which participants complete themselves can be easily administered to large groups. However, the number of people who respond can be low and it's not easy to control who actually complete them. Interviews are conducted face to face, or by telephone, with interviewers directly asking the questions and recording the answers. They are more personal, and if necessary, the interviewer can ask follow-up questions for clarification. Interview studies are often used to collect information about respondents' opinions, but they can be time-consuming and costly.`,
      `Broadly speaking, the two main types of questions included in surveys are "closed" and "open" questions. Closed questions have fixed responses and lend themselves well to statistical analysis. For example: How often do you purchase X? Once a week / Once a month / Once a year / Rarely or never. How much do you enjoy using X? 0 (not at all)—4 (very much). Would you purchase X again? Yes / No / Undecided.`,
      `On the other hand, open questions allow respondents to answer more freely and in greater detail, but are more time-consuming and can be difficult to analyze. For example: Why did you choose to purchase X? What do you think could be improved about X?`,
      `Well-constructed surveys can provide researchers with useful data to help them understand people's behaviors and opinions.`,
    ],
  },
  {
    id: 'u2-text-a',
    unit: 2,
    section: 'Text A',
    title: 'The rise of the gig economy',
    source: 'Unit 2 · Text A',
    paragraphs: [
      `1 The term "gig economy" is one that we hear increasingly often these days. It refers to a way of working that is based on people working in flexible, task-based employment. In the gig economy, people are paid for specific jobs that they do without the benefits and security of full-time employment. The number of people involved in the gig economy is rising rapidly, with an increase in the U.S. from around 10 percent of the workforce to almost 16 percent in the last decade. More than 10 percent of workers in China are self-employed. "The desire for autonomy is strongest in China, especially among young people," reads a report by PwC, one of the leading accounting firms. This indicates "a generational shift toward greater freedom, entrepreneurship, and specialist skills in this rapidly evolving economy".`,
      `2 The rise of this global phenomenon has largely been driven by technological advances that allow people to manage their work through computers and smartphones. Online platforms connect consumers and suppliers easily and disrupt traditional ways of doing business. Advancements in technology also mean that people can be employed remotely, even in other countries, and there is a new breed of people opting to travel and work online in various locations around the world, who are known as "digital nomads".`,
      `3 However, even though technology is often considered the primary driving force behind the gig economy, it is by no means the only one.`,
      `4 To begin with, attitudes to work are changing, as younger people embrace the independence and flexibility that the gig economy offers, allowing them to break free of traditional work routines. Shaun, a delivery driver, says, "The flexibility suits me well. I work when I want to and enjoy the work-life balance. I'm my own boss."`,
      `5 Furthermore, employers often favor a more flexible approach to employing workers, as and when they need them. This allows them to cut costs and reduce the bureaucracy necessary when offering permanent employment. Becky, a manager at the delivery firm that Shaun works for, states, "We have a large pool of people working for us. We give them work when we have it, but we only pay them for the work they do. It's a win-win situation."`,
      `6 Employers are also aware that the world of work is changing rapidly, and with it, so are many of the skills that they require. It can be difficult, and expensive, for companies to attract employees with the wide skill set that they require. The flexibility offered by the gig economy can make finding the right people for each job much easier and much cheaper.`,
      `7 Despite offering certain benefits to employers and employees, many observers feel that the gig economy leaves employees worse off. The flexibility may be good, but it is often paid for with a lack of job security and benefits. When workers have plenty of work, things are generally fine, but what about when a worker falls ill and cannot work? Do they still receive sick pay? And how about holiday pay? Moreover, in conventional jobs there are often paths for career progression within a company, moving up the ladder. However, such opportunities are not so easy when one works freelance. These may not be the first things that young people in the workplace consider, but they may have serious implications in the future.`,
      `8 Even with the potential downside, it seems that the gig economy is here to stay. Many of the driving forces behind the trend, such as changes in technology and people's attitudes to work, are showing no sign of easing. China Daily reported that the gig economy in China is predicted to grow by 30 percent per year over the next few years, and that it is likely to become even more important in areas such as agriculture, health care and education. There are likely to be winners and losers on all sides, but it is important for society to recognize these issues and ensure that people working in the gig economy are treated fairly.`,
    ],
  },
  {
    id: 'u2-text-b',
    unit: 2,
    section: 'Text B',
    title: 'Will artificial intelligence create mass unemployment?',
    source: 'Unit 2 · Text B',
    paragraphs: [
      `1 Aura and Ausca are workers at the M Social hotel in Singapore. Aura's job is mostly delivering items like bottled water and towels to rooms, while Ausca is responsible for cooking eggs for the restaurant in the morning. Aura and Ausca are available for work 24 hours a day, 7 days a week, and work for a fraction of the cost of most other employees. This is because they are robots. As time goes on, it seems inevitable that more and more robots like Aura and Ausca will populate such service roles. And while this may be great for the bank accounts of the companies that use them, many are concerned about what this means for the future of the human workers who cannot compete with their robot equivalents.`,
      `2 Artificial intelligence (AI) and robotics are regular news items these days, and the main focus seems to be the fear that these technologies will ultimately replace humans. A study by the McKinsey Global Institute has estimated that AI and automation could threaten 15%–30% of human jobs by 2030, meaning that anywhere from 400 million to 800 million jobs could be lost. This could eliminate whole areas of employment, leaving people's existing workplace skills and knowledge redundant. Low-skilled and low-paid workers would be influenced most significantly, and their jobs are likely to be the first to go. As the study suggests, the jobs AI will first impact are those characterized by predictable or repetitive tasks, whether physical or mental, in such areas as manufacturing, office administration, and food production.`,
      `3 There is concern by many that the increased unemployment may cause social problems and political unrest if measures are not taken. However, there are also many who believe that overall, AI will make positive impacts on society. Some are seeing it as another revolution in the economy along the lines of the industrial revolution that took place in Europe and America in the 18th and 19th centuries. During that time, the steam engine revolutionized society and led to great advances in transportation, the beginning of mass production of goods in factories, and rapid urbanization. In the past, humans managed to adapt to such major changes in society, and it is argued that AI can be viewed as the next big development.`,
      `4 While innovations in AI will impact certain types of work, it is hoped that it will also give rise to whole new areas of business. For example, there are likely to be major developments in health care thanks to AI, and it could also allow people to transition from ordinary and routine jobs to more meaningful careers. It is also believed that AI has the potential to bring global economic prosperity at a time when we face the challenges of falling birth rates, an aging population and slowing productivity in many countries.`,
      `5 The reality of the situation is that economies will certainly be transformed by AI, and employment opportunities will change dramatically. There will be less demand for manual and basic thinking skills in the workplace and an increased requirement for social and technological skills. Inevitably, some people will need to change their jobs and there will be a need for many people currently in the workforce to retrain. Those newly entering the workforce will also need flexible skill sets to match the changes in our economies. In the future, employers will look for higher-order thinking skills as well as sophisticated social and technological skills.`,
      `6 The McKinsey Global Institute concludes, "There is work for everyone today and there will be work for everyone tomorrow, even in a future with automation. Yet that work will be different, requiring new skills, and a far greater adaptability of the workforce than we have seen. Training and retraining both mid-career workers and new generations for the coming challenges will be an imperative."`,
    ],
  },
]

export const passageById = (id: string) => passages.find(p => p.id === id)
export const passagesOf = (unit: number, section: string) =>
  passages.filter(p => (!unit || p.unit === unit) && (!section || p.section === section))
