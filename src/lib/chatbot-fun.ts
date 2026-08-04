type FunQuestion = {
  questions: string[];
  answers: string[];
};

const FUN_QUESTIONS: FunQuestion[] = [
  {
    questions: ["今天適合上班嗎"],
    answers: [
      "沒錢都適合上班唷。",
      "適合，公會任務不會自己清空。",
      "不適合，乞丐都會看天氣了，你幹嘛風雨無阻。",
    ],
  },
  {
    questions: ["今天可以下班了嗎"],
    answers: [
      "先確認最後一個 test case 沒有偷偷變紅。",
      "可以適當的選擇傷害明天的自己。",
    ],
  },
  {
    questions: ["bug會自己好嗎", "bug 會自己好嗎"],
    answers: [
      "偶爾會，但通常也會在 Demo 前自己回來。",
      "它可能只是暫時躲進另一個環境。",
    ],
  },
  {
    questions: ["今天適合寫測試嗎"],
    answers: ["適合，替明天少準備一個驚喜。", "寫得好那就可以。"],
  },
  {
    questions: ["史萊姆會測試嗎"],
    answers: ["會，我專門負責黏著性測試。", "會，而且每個邊界條件都要戳一下。"],
  },
  {
    questions: ["可以不要 regression 嗎", "可以不要做 regression 嗎"],
    answers: [
      "可以先問問昨天改動的 code 答不答應。",
      "傳送門可以略過，風險通常不會。",
    ],
  },
];

function normalizeFunQuestion(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("zh-Hant")
    .replace(/[\s？?！!。．，,、]+/g, "")
    .trim();
}

const FUN_QUESTION_LOOKUP = new Map(
  FUN_QUESTIONS.flatMap((entry) =>
    entry.questions.map(
      (question) => [normalizeFunQuestion(question), entry.answers] as const,
    ),
  ),
);

export function getFunResponse(
  question: string,
  random: () => number = Math.random,
) {
  const answers = FUN_QUESTION_LOOKUP.get(normalizeFunQuestion(question));
  if (!answers?.length) return null;
  const randomValue = Math.min(Math.max(random(), 0), 0.999999999);
  return answers[Math.floor(randomValue * answers.length)];
}
