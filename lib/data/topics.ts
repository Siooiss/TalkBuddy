export interface Topic {
  id: string
  category: string
  text: string
}

// ─── 52 topics: ~26 life scenarios + ~26 academic ────────────────────────────

export const TOPICS: Topic[] = [
  // ── Life scenarios ──────────────────────────────────────────────────────────
  { id: "l01", category: "生活场景", text: "如何拒绝朋友的借钱请求，既保住友谊又不伤感情？" },
  { id: "l02", category: "生活场景", text: "描述一次对你影响深远的旅行经历，以及它改变了你什么。" },
  { id: "l03", category: "生活场景", text: "如果你需要向父母说明一个他们不赞成的重要决定，你会怎么沟通？" },
  { id: "l04", category: "生活场景", text: "描述你最喜欢的一道家乡菜，并讲讲它背后的故事或记忆。" },
  { id: "l05", category: "生活场景", text: "如何在不显得无礼的情况下，优雅地结束一段令人不舒服的谈话？" },
  { id: "l06", category: "生活场景", text: "你会如何向一个十岁的孩子解释什么是「失败」？" },
  { id: "l07", category: "生活场景", text: "描述一件让你感到最骄傲的个人成就，以及背后的艰辛。" },
  { id: "l08", category: "生活场景", text: "如果可以重来一次，你会改变人生中的哪个选择？请说明原因。" },
  { id: "l09", category: "生活场景", text: "描述你心目中理想的一天应该是什么样的，从早到晚。" },
  { id: "l10", category: "生活场景", text: "如何向一个刚认识的人介绍你自己，让对方在30秒内记住你？" },
  { id: "l11", category: "生活场景", text: "你如何定义真正的友谊？请用一个具体的故事来说明。" },
  { id: "l12", category: "生活场景", text: "描述一次让你彻底改变了某个观点的对话或阅读经历。" },
  { id: "l13", category: "生活场景", text: "面对他人不公正的批评，你通常如何保持冷静并回应？" },
  { id: "l14", category: "生活场景", text: "描述一个你尊敬的人，以及你从他/她身上学到了什么最重要的东西。" },
  { id: "l15", category: "生活场景", text: "如果只能保留生命中的三样东西，你会选择什么？请为每项说明理由。" },
  { id: "l16", category: "生活场景", text: "你会如何向朋友推荐一本真正改变了你的书？" },
  { id: "l17", category: "生活场景", text: "描述一次你清晰地感受到自己成长了的时刻。" },
  { id: "l18", category: "生活场景", text: "当你感到极度焦虑或压力爆表时，你通常如何调节自己的状态？" },
  { id: "l19", category: "生活场景", text: "描述你最喜欢的季节，说说是什么让它对你如此特别。" },
  { id: "l20", category: "生活场景", text: "如何处理工作中与同事的意见冲突，而不影响团队合作？" },
  { id: "l21", category: "生活场景", text: "描述一次令你后悔的决定，以及这次经历教会了你什么。" },
  { id: "l22", category: "生活场景", text: "如果可以和历史上任何一个人共进晚餐，你会选谁？你最想问他什么？" },
  { id: "l23", category: "生活场景", text: "你认为一座城市应该具备哪些特质，才算真正有「性格」？" },
  { id: "l24", category: "生活场景", text: "描述你对十年后的自己有什么最真实的期待。" },
  { id: "l25", category: "生活场景", text: "如何拒绝一个你不感兴趣的邀请，同时不让对方觉得被轻视？" },
  { id: "l26", category: "生活场景", text: "讲述一次与陌生人的相遇，如何意外地对你产生了影响。" },

  // ── Academic / complex ───────────────────────────────────────────────────────
  { id: "a01", category: "科技", text: "人工智能是否会取代创意工作？请阐明你的观点。" },
  { id: "a02", category: "社会", text: "社交媒体究竟是连接人与人的桥梁，还是孤立个体的围墙？" },
  { id: "a03", category: "教育", text: "大学教育是否仍是年轻人成功的必要路径？" },
  { id: "a04", category: "职场", text: "远程办公是未来工作的主流模式，还是效率的隐形杀手？" },
  { id: "a05", category: "哲学", text: "追求稳定与追求激情，哪种人生更值得过？" },
  { id: "a06", category: "环境", text: "个人行为能否真正影响气候变化？还是应由企业和政府主导？" },
  { id: "a07", category: "文化", text: "在全球化时代，坚守传统文化是保护根基还是阻碍进步？" },
  { id: "a08", category: "科技", text: "当算法越来越了解我们，我们还拥有真正的自主选择权吗？" },
  { id: "a09", category: "教育", text: "失败经历是人生最好的老师，还是我们高估了它的价值？" },
  { id: "a10", category: "社会", text: "城市化进程中，我们是否正在失去某些不可挽回的东西？" },
  { id: "a11", category: "职场", text: "「佛系」心态究竟是一种智慧，还是对个人潜力的放弃？" },
  { id: "a12", category: "科技", text: "短视频的流行是在降低我们的专注力和深度思考能力吗？" },
  { id: "a13", category: "伦理", text: "当个人隐私与公共安全发生冲突，应如何权衡？" },
  { id: "a14", category: "心理", text: "共情能力是天生的还是后天可以培养的？有何依据？" },
  { id: "a15", category: "经济", text: "经济增长与环境保护是否必然相互矛盾？请提出你的解决思路。" },
  { id: "a16", category: "社会", text: "网络匿名性对社会是利大于弊还是弊大于利？" },
  { id: "a17", category: "教育", text: "批判性思维课程是否应该成为中学的必修科目？" },
  { id: "a18", category: "教育", text: "家庭教育与学校教育，哪个对人格塑造的影响更根本？" },
  { id: "a19", category: "社会", text: "当代城市年轻人面临的最大精神困境是什么？如何突破？" },
  { id: "a20", category: "社会", text: "为什么越来越多受过高等教育的人选择独居？这预示着什么？" },
  { id: "a21", category: "语言", text: "学习一门外语，是为了提升沟通能力还是为了拓展思维边界？" },
  { id: "a22", category: "哲学", text: "幸福感是否真的与物质财富水平正相关？请说明你的判断依据。" },
  { id: "a23", category: "教育", text: "精英教育是在培养人才，还是在固化社会阶层？" },
  { id: "a24", category: "科技", text: "面对人工智能的崛起，人类最核心的不可替代竞争力是什么？" },
  { id: "a25", category: "哲学", text: "年龄增长带来的究竟是智慧还是局限？二者如何共存？" },
  { id: "a26", category: "心理", text: "为什么有些人能在逆境中越挫越勇，这种韧性是如何形成的？" },
]

export function getRandomTopic(exclude?: string): Topic {
  const pool = exclude ? TOPICS.filter((t) => t.id !== exclude) : TOPICS
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Mock AI (expression) ─────────────────────────────────────────────────────

export interface ExpressionMockResult {
  transcript: string
  issues: string[]
  improved: string
}

/**
 * Produce rich, multi-dimensional AI feedback based on the actual transcript.
 * userTranscript comes from Web Speech API recognition.
 */
export function getMockExpressionResult(
  topicText: string,
  userTranscript?: string,
): ExpressionMockResult {
  const FALLBACK =
    "那个，我觉得这个问题非常有意思。那个，从我个人的角度来说，我认为这是个很重要的话题。然后，我们可以从多个方面来分析。那个，首先，确实存在很多不同的声音。然后要解决这些问题，需要我们共同努力。"

  const transcript = userTranscript?.trim() || FALLBACK

  const issues: string[] = []

  // ── Section 1: Content depth ──────────────────────────────────────────────
  if (transcript.length < 30) {
    issues.push(
      "【内容完整度】本次表达篇幅较短，论述尚未展开。建议至少包含：一个核心观点 + 一个具体例子或数据支撑 + 一句总结，让表达形成完整的逻辑闭环。",
    )
  } else if (transcript.length < 80) {
    issues.push(
      "【内容完整度】表达有一定内容，但深度仍有提升空间。可以尝试追问自己「为什么」和「怎么做」，将核心论点从陈述延伸为有说服力的论证。",
    )
  } else {
    issues.push(
      "【内容完整度】本次表达篇幅充足，观点得到了一定展开。可以进一步打磨逻辑链条，确保每一句话都在为核心论点服务，避免偏题或重复。",
    )
  }

  // ── Section 2: Filler words ───────────────────────────────────────────────
  const fillerDefs = [
    { word: "那个", pattern: /那个/g },
    { word: "然后", pattern: /然后/g },
    { word: "嗯", pattern: /嗯+/g },
    { word: "就是", pattern: /就是/g },
    { word: "对对对", pattern: /对对对/g },
    { word: "这个", pattern: /这个/g },
  ]

  const found = fillerDefs
    .map(({ word, pattern }) => ({
      word,
      count: (transcript.match(pattern) ?? []).length,
    }))
    .filter((f) => f.count > 0)

  if (found.length === 0) {
    issues.push(
      "【语言习惯】本次未检测到明显口头语，语言习惯良好！请保持这种清晰干净的表达风格，在正式场合这会让你显得更加自信专业。",
    )
  } else {
    const detail = found.map((f) => `「${f.word}」×${f.count}`).join("、")
    issues.push(
      `【语言习惯】检测到口头语：${detail}。口头语会分散听者注意力、削弱表达力度。替代方案：用短暂停顿代替「嗯/那个」，用「此外/同时/因此」代替「然后」，用「具体而言」代替「就是」。`,
    )
  }

  // ── Section 3: Structure ──────────────────────────────────────────────────
  const hasStructure = /(首先|第一|一方面|因为|所以|因此|总结|综上|其次|然后|接着|最后)/.test(transcript)
  if (!hasStructure && transcript.length > 40) {
    issues.push(
      "【逻辑结构】本次表达缺乏清晰的结构标记，听者难以跟上逻辑脉络。推荐使用「三段式」框架：①明确立场（我认为…）②展开理由（首先…其次…）③归纳总结（因此…），这种结构能大幅提升说服力。",
    )
  } else {
    issues.push(
      "【逻辑结构】表达中有一定的结构意识，逻辑框架初具雏形。进一步建议：每个分论点之间用「过渡句」连接，例如「在此基础上」「换个角度来看」，让表达更有层次感和流动性。",
    )
  }

  // ── Section 4: Specific improvement tip ──────────────────────────────────
  issues.push(
    `【提升建议】针对「${topicText.slice(0, 20)}…」这类话题，可提前准备「个人经历 + 数据/研究 + 类比」三种论据类型各一条，做到随时调用。另外，练习将每次表达控制在90秒内说清楚核心，这是最实用的说话效率训练。`,
  )

  // ── Improved version ──────────────────────────────────────────────────────
  const improved = `针对「${topicText.slice(0, 16)}」，我的核心观点是：${topicText.length > 20 ? "这一问题的答案并非非此即彼" : "我们需要从根本上重新审视"}。首先，从实证角度来看，大量研究表明这一现象背后存在深层的结构性原因，而非简单的个人选择问题。其次，若我们仅聚焦于表面现象，便容易忽视真正的影响机制。因此，我认为解决之道在于建立多元视角——既正视其挑战，也挖掘其中蕴含的机遇。总而言之，唯有跳出非此即彼的思维框架，才能形成真正经得起推敲的判断。`

  return { transcript, issues, improved }
}

// ─── Punctuation inference ────────────────────────────────────────────────────

/**
 * Add basic punctuation to raw Speech API output.
 * Inserts commas before structural connectors and adds a final period.
 */
export function inferPunctuation(text: string): string {
  if (!text.trim()) return text
  let result = text
  // Insert comma before major connectors (only when not already preceded by punctuation)
  result = result.replace(
    /(?<![，。！？、；])(首先|其次|此外|然后|接着|因此|所以|但是|不过|然而|另外|总结|综上|总而言之|总的来说)/g,
    "，$1",
  )
  // Remove any leading comma
  result = result.replace(/^，/, "")
  // Add period at end if no terminal punctuation
  if (result && !/[。！？]$/.test(result)) {
    result += "。"
  }
  return result
}
