import { Dispatch, SetStateAction } from "react";

export interface CustomHeaderProps {}

export interface PollCardType {
  id: string;
  title: string;
  greetingMessage: string;
  poster?: string | null;
  cardType: "POLL" | "ANSWER";
  hasAnswers?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  setCurrentId?: Function;
  onDelete?: Function;
  pushToId?: Function;
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

export interface QuestionTypeProps {
  icon: any;
  title: string;
  questionType: "MULTI_CHOICE" | "SINGLE_CHOICE" | "RATING" | "YES_NO" | "TEXT";
}
interface SettingsPageProps {
  isAccessLevel: boolean;
  isTimeSelected: boolean;
  isDuration: boolean;
  isPollsterNumber: boolean;
  startDate: string;
  endDate: string;
  duration: number | null;
  pollsterNumber: number | null;
  pollsters: Array<{ username: string }>;
  selectedSettingItem: "ACCESS_LEVEL" | "POLLSTER_NUMBER" | "";
}

interface StartPageProps {
  title: string;
  greetingMessage: string;
  btnLabel: string;
  poster?: string | null;
}

export interface SettingsEditorProps {
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
}

export interface QuestionProps {
  content: string;
  options?: OptionProps[];
  questionType:
    | "MULTI_CHOICE"
    | "SINGLE_CHOICE"
    | "RATING"
    | "YES_NO"
    | "TEXT"
    | null;
  minAnswerCount?: number;
  order: number;
  rateNumber?: number;
  rateType?: "STAR" | "NUMBER";
  id?: number;
  required: boolean;
  poster?: string | null;
  isPointBased: boolean;
  hasCorrectAnswer: boolean;
}

type ChosenTypeProps =
  | "MULTI_CHOICE"
  | "SINGLE_CHOICE"
  | "RATING"
  | "YES_NO"
  | "TEXT"
  | null;

export interface QuestionTextEditorProps {
  id: string;
  setChosenType: Dispatch<SetStateAction<ChosenTypeProps>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  newQuestions: QuestionProps[];
  setNewQuestions: Dispatch<SetStateAction<Array<QuestionProps>>>;
  currentPage: number;
  currentQuestion: QuestionProps | undefined;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionProps | undefined>>;
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
  currentQuestion: QuestionProps | undefined;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionProps | undefined>>;
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
