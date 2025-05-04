import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface CustomHeaderProps {}

export interface PollCardType {
  id: string;
  title: string;
  greetingMessage: string;
  category?: Category;
  poster?: string;
  cardType: "POLL" | "ANSWER";
  setIsModalOpen?: (open: boolean) => void;
  setCurrentId?: (id: string) => void;
  onDelete?: (id: string) => void;
  pushToId?: (id: string) => void;
  setReqUrl?: (id: string) => void;
  hasAnswers?: boolean;
  published?: boolean;
  endDate?: string | null;
  pollsterNumber?: number | null;
  submittedUserNumber?: number;
  pollstersLength?: number;
  createdAt?: string;
  answeredAt?: string;
  questionLength?: number;
}

export interface FormItemProps {
  itemType?: string;
  span?: number;
  label?: string;
  labeltext?: string;
  name?: string;
  required?: boolean;
  rules?: any;
  hidePasswordSuggest?: boolean;
  onChange?: any;
  className?: string;
  value?: string;
  placeholder?: string;
  onPressEnter?: any;
}

export interface CustomInputType {
  itemType?: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
  value?: string;
  onChange?: any;
  tooltipText?: string;
  tooltipPlacement?: "top" | "left" | "right" | "bottom";
  label?: string;
  defaultValue?: string;
  required?: boolean;
  hidePasswordSuggest?: boolean;
  showPasswordProgress?: boolean;
  onFocus?: any;
  onBlur?: any;
  status?: "" | "warning" | "error" | undefined;
  suffix?: any;
  onPressEnter?: any;
}

export interface CustomButtonType {
  disabled?: boolean;
  title?: React.ReactNode;
  onClick?: any;
  className?: string;
  titleClassname?: string;
  htmlType?: "submit" | "reset" | "button" | undefined;
  suffixIcon?: any;
  suffixIconHover?: boolean;
  prefixIcon?: any;
  prefixIconHover?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
}

export interface CustomAlertType {
  message?: string;
  type?: "success" | "info" | "warning" | "error" | undefined;
  className?: string;
  onClose?: Function;
  closable?: boolean;
  icon?: any;
  duration?: number;
}

export interface SurveyProps {
  name: string;
  status: "PUBLISHED" | "CREATED" | "CLOSED";
  passcodeProtected?: boolean;
  id: string;
}

export type QuestionTypes =
  | "MULTI_CHOICE"
  | "SINGLE_CHOICE"
  | "RATING"
  | "YES_NO"
  | "TEXT"
  | "DROPDOWN"
  | "MULTIPLE_CHOICE_GRID"
  | "TICK_BOX_GRID"
  | "LINEAR_SCALE"
  | "DATE"
  | "TIME"
  | "RANKING";

export interface QuestionTypeProps {
  icon: any;
  title: string;
  questionType: QuestionTypes;
}
interface SettingsPageProps {
  isShowUser: boolean;
  isHasEnterCode: boolean;
  isAccessLevel: boolean;
  isTimeSelected: boolean;
  isDuration: boolean;
  isPollsterNumber: boolean;
  enterCode: number | null;
  startDate: string;
  endDate: string;
  duration: number | null;
  pollsterNumber: number | null;
  pollsters: Array<{ username: string }>;
  selectedSettingItem: "ACCESS_LEVEL" | "POLLSTER_NUMBER" | "";
  published: boolean;
}

export const useCategoryTrans = () => {
  const { t } = useTranslation();

  const categoryTrans: { [key in Exclude<Category, null>]: string } = {
    EDUCATION: t("category.education"),
    HEALTH: t("category.health"),
    POLITICS: t("category.politics"),
    ECONOMY: t("category.economy"),
    SOCIETY: t("category.society"),
    TECHNOLOGY: t("category.technology"),
    ENVIRONMENT: t("category.environment"),
    CULTURE: t("category.culture"),
    SPORTS: t("category.sports"),
    OTHER: t("category.other"),
  };

  return categoryTrans;
};

export type Category =
  | "EDUCATION"
  | "HEALTH"
  | "POLITICS"
  | "ECONOMY"
  | "SOCIETY"
  | "TECHNOLOGY"
  | "ENVIRONMENT"
  | "CULTURE"
  | "SPORTS"
  | "OTHER"
  | null;

interface StartPageProps {
  title: string;
  greetingMessage: string;
  btnLabel: string;
  poster?: string | null;
  category?: Category;
}

export interface SettingsEditorProps {
  id: string;
  showUrlModal: Function;
  settingsPage: SettingsPageProps;
  setSettingsPage: Dispatch<SetStateAction<SettingsPageProps>>;
}

export interface SettingsDisplayProps {
  settingsPage: SettingsPageProps;
  setSettingsPage: Dispatch<SetStateAction<SettingsPageProps>>;
}

export interface MakeTempCardProps {
  settingsPage: SettingsPageProps;
  setSettingsPage: Dispatch<SetStateAction<SettingsPageProps>>;
}

export interface StartShapeEditorProps {
  id: string;
  themeId: number;
  setThemeId: Function;
  startPage: StartPageProps;
  setStartPage: Dispatch<SetStateAction<StartPageProps>>;
}

export interface OptionProps {
  content: string;
  order: number;
  poster?: string | null;
  points: number;
  isCorrect: boolean;
  nextQuestionOrder?: number | null;
  rowIndex: number | null;
  columnIndex: number | null;
}

export interface QuestionProps {
  content: string;
  options?: OptionProps[];
  questionType: QuestionTypes | null;
  minAnswerCount?: number;
  order: number;
  rateNumber?: number;
  rateType?: "STAR" | "NUMBER";
  id?: number;
  required: boolean;
  poster?: string | null;
  isPointBased: boolean;
  hasCorrectAnswer: boolean;
  gridRows: string[];
  gridColumns: string[];
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
}

type ChosenTypeProps = QuestionTypes | null;

export interface QuestionTextEditorProps {
  id: string;
  setChosenType: Dispatch<SetStateAction<ChosenTypeProps>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  newQuestions: QuestionProps[];
  setNewQuestions: Dispatch<SetStateAction<Array<QuestionProps>>>;
  currentPage: number;
  currentQuestion: QuestionProps;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionProps>>;
}

export interface StartDisplayProps {
  startPage: StartPageProps;
  dualColors: string[][];
  themeId: number;
}

export interface QuestionDisplayProps {
  chosenType: ChosenTypeProps;
  setChosenType: Dispatch<SetStateAction<ChosenTypeProps>>;
  dualColors: string[][];
  themeId: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentQuestion: QuestionProps;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: Dispatch<SetStateAction<Array<QuestionProps>>>;
}

interface endPageProps {
  endTitle: string;
  thankYouMessage: string;
}

export interface EndDisplayProps {
  endPage: endPageProps;
  dualColors: string[][];
  themeId: number;
}

export interface StartEditorProps {
  id: string;
  endPage: endPageProps;
  setEndPage: Dispatch<SetStateAction<endPageProps>>;
  handleCreatPoll: Function;
}

interface QuestionSettingsProps {
  currentQuestion: QuestionProps | undefined;
  setCurrentQuestion: React.Dispatch<
    React.SetStateAction<QuestionProps | undefined>
  >;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

export interface DeleteQuestionButtonProps {
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  setChosenType: React.Dispatch<React.SetStateAction<QuestionTypes | null>>;
}
