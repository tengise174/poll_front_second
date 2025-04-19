import { QuestionTypeProps } from "./componentTypes";

export const manualStatusTag = ({ status }: { status: string }) => {
  switch (status) {
    case "CREATED":
      return (
        <div
          className={`text-[8px] h-4 font-medium text-[#1E1E1E] px-[6px] bg-[#D4E7FF] rounded inline-flex justify-center items-center`}
        >
          Үүссэн
        </div>
      );
    case "PUBLISHED":
      return (
        <div
          className={`text-[8px] h-4 font-medium px-[6px] text-[#1E1E1E] bg-[#D4E7FF] rounded inline-flex justify-center items-center`}
        >
          Нийтэлсэн
        </div>
      );
    case "CLOSED":
      return (
        <div
          className={`text-[8px] text-[#FDFDFD] h-4 font-medium px-[6px] bg-[#5A5A5A] rounded inline-flex justify-center items-center`}
        >
          Дууссан
        </div>
      );
    default:
      return <div>Тодорхойгүй</div>;
  }
};

export const questionTypes: QuestionTypeProps[] = [
  {
    icon: <div>📝</div>, 
    title: "Олон сонголттой",
    questionType: "MULTI_CHOICE",
  },
  {
    icon: <div>🔘</div>, 
    title: "Нэг сонголттой",
    questionType: "SINGLE_CHOICE",
  },
  {
    icon: <div>⭐</div>, 
    title: "Үнэлгээ",
    questionType: "RATING",
  },
  {
    icon: <div>✅</div>, 
    title: "Тийм/Үгүй",
    questionType: "YES_NO",
  },
  {
    icon: <div>📜</div>, 
    title: "Текст",
    questionType: "TEXT",
  },
];

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

export const dualColors = [
  ["#FDFDFD", "#2C2C2C"],
  ["#071522", "#4AD2FF"],
  ["#1E1E1E", "#FFC043"],
  ["#988750", "#FFFFFF"],
  ["#ED6E33", "#2C2C2C"],
  ["#5A7274", "#FFA500"],
];

export const onboardingData = {
  CORPORATE: [
    {
      title: "Байгууллагын мэдээлэл",
      options: [
        {
          input: true,
          name: "name",
          text: "Байгууллагын нэр /Заавал/",
        },
        {
          input: true,
          name: "regNum",
          text: "Байгууллагын регистр /Заавал биш/",
        },
      ],
    },
    {
      title: "Танай байгууллага хэдэн ажилтантай вэ?",
      name: "employees",
      options: [
        {
          val: "COUNT_1_20",
          text: "1-20",
        },
        {
          val: "COUNT_21_50",
          text: "21-50",
        },
        {
          val: "COUNT_51_100",
          text: "51-100",
        },
        {
          val: "COUNT_100",
          text: "100<",
        },
      ],
    },
    {
      title: "Үйл ажиллагаа явуулдаг салбар сонгох",
      name: "operation",
      options: [
        {
          val: "FINANCE",
          text: "Банк, Санхүү",
        },
        {
          val: "MINING",
          text: "Уул уурхай",
        },
        {
          val: "TRADE",
          text: "Худалдаа үйлчилгээ",
        },
        {
          val: "CONSTRUCTION",
          text: "Барилга, Үл хөдлөх",
        },
        {
          val: "TECHNOLOGY",
          text: "Технологи, Харилцаа холбоо",
        },
        {
          val: "EDUCATION",
          text: "Боловсрол",
        },
        {
          val: "MEDICAL",
          text: "Эрүүл мэнд",
        },
        {
          val: "OTHER",
          text: "Бусад",
        },
      ],
    },
  ],
  INDIVIDUAL: [
    {
      title: "Та ямар ажил эрхэлдэг вэ?",
      name: "work",
      options: [
        {
          val: "RESEARCHER",
          text: "Судлаач",
        },
        {
          val: "STUDENT",
          text: "Оюутан",
        },
        {
          val: "HR",
          text: "Хүний нөөц",
        },
        {
          val: "EDUCATOR",
          text: "Боловсрол салбарын мэргэжилтэн",
        },
        {
          val: "PSYCHOLOGIST",
          text: "Сэтгэл судлаач",
        },
        {
          val: "OTHER",
          text: "Бусад",
        },
      ],
    },
    {
      title: "Та ямар зорилгоор ашиглах вэ?",
      name: "use",
      options: [
        {
          val: "COLLECT",
          text: "Судалгааны дата цуглуулах",
        },
        {
          val: "RESEARCH",
          text: "Байгууллагын судалгаа хийх",
        },
        {
          val: "OTHER",
          text: "Бусад",
        },
      ],
    },
  ],
};

export const formatAmount = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
  })
    .format(num)
    .replace(/,/g, "'");
};

export function formatNumberWithApostrophes(number: number) {
  const roundedNumber = number.toFixed();
  return roundedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
}
