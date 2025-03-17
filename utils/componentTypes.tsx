import { Dispatch, SetStateAction } from "react";

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

export interface UserManualProps {
  title: string;
  desc: string;
  dialog?: string;
  image?: any;
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
  questionType:
    | "MULTI_CHOICE"
    | "SINGLE_CHOICE"
    | "STAR_RATING"
    | "NUMBER_RATING"
    | "YES_NO"
    | "TEXT"
    | null;
}

export interface StartShapeEditorProps {
  id: string;
  activeColor: number;
  setActiveColor: Dispatch<SetStateAction<number>>;
  uploadedImage: string | null;
  setUploadedImage: Dispatch<SetStateAction<string | null>>;
  themePage:
    | {
        logoPosition: string;
        showWaterMark: boolean;
        themeId: number;
      }
    | undefined;
  hideMark: boolean;
  setHideMark: Dispatch<SetStateAction<boolean>>;
  logoPosition: string;
  setLogoPosition: Dispatch<SetStateAction<string>>;
}

interface StartPageProps {
  title: string;
  greetingMessage: string;
  btnLabel: string;
}

export interface StartTextEditorProps {
  id: string;
  startPage: StartPageProps;
  setStartPage: Dispatch<SetStateAction<StartPageProps>>;
}

interface QuestionProps {
  content: string;
  options?: Array<any>;
  questionType:
    | "MULTI_CHOICE"
    | "SINGLE_CHOICE"
    | "STAR_RATING"
    | "NUMBER_RATING"
    | "YES_NO"
    | "TEXT"
    | null;
  minAnswerCount?: number;
  order: number;
  id?: number;
}

type ChosenTypeProps =
  | "MULTI_CHOICE"
  | "SINGLE_CHOICE"
  | "STAR_RATING"
  | "NUMBER_RATING"
  | "YES_NO"
  | "TEXT"
  | null;

export interface QuestionSquareEditorProps {
  id: string;
  newQuestions: QuestionProps[];
  setNewQuestions: Dispatch<SetStateAction<Array<QuestionProps>>>;
  setChosenType: Dispatch<SetStateAction<ChosenTypeProps>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  templateQuestions: {
    id: string;
    options: Array<any>;
    content: string;
  }[];
}

export interface QuestionTextEditorProps {
  newQuestions: QuestionProps[];
  setNewQuestions: Dispatch<SetStateAction<Array<QuestionProps>>>;
  currentPage: number;
  currentQuestion: QuestionProps | undefined;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionProps | undefined>>;
}

export interface StartDisplayProps {
  startPage: StartPageProps;
  dualColors: string[][];
  activeColor: number;
  logoPosition: string;
  uploadedImage: string | null;
  hideMark: boolean;
}

export interface QuestionDisplayProps {
  chosenType: ChosenTypeProps;
  setChosenType: Dispatch<SetStateAction<ChosenTypeProps>>;
  dualColors: string[][];
  activeColor: number;
  setActiveLayout: Dispatch<SetStateAction<"shape" | "text" | "square">>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentQuestion: QuestionProps | undefined;
  setCurrentQuestion: Dispatch<SetStateAction<QuestionProps | undefined>>;
  newQuestions: QuestionProps[];
  setNewQuestions: Dispatch<SetStateAction<Array<QuestionProps>>>;
  customQuestionLimit: number | undefined;
}

interface endPageProps {
  endTitle: string;
  thankYouMessage: string;
}

export interface EndDisplayProps {
  endPage: endPageProps;
  dualColors: string[][];
  activeColor: number;
  logoPosition: string;
  uploadedImage: string | null;
  hideMark: boolean;
}

export interface StartEditorProps {
  id: string;
  endPage: endPageProps;
  setEndPage: Dispatch<SetStateAction<endPageProps>>;
}

export type CorporateType = {
  name: string;
  regNum: string;
  employees: string;
  operation: string;
} | null;

export type IndividualType = {
  work: string;
  use: string;
} | null;

export interface CorporatePageProps {
  step: number;
  setShowButton: Dispatch<SetStateAction<{ [step: number]: boolean }>>;
  data: CorporateType | null;
  setData: Dispatch<SetStateAction<CorporateType | null>>;
}

export interface IndividualPageProps {
  step: number;
  setShowButton: Dispatch<SetStateAction<{ [step: number]: boolean }>>;
  data: IndividualType | null;
  setData: Dispatch<SetStateAction<IndividualType | null>>;
}

export interface OnboardingPageProps {
  step: number;
  setShowButton: Dispatch<SetStateAction<{ [step: number]: boolean }>>;
  data: CorporateType | IndividualType;
  setData: Dispatch<SetStateAction<CorporateType | IndividualType>>;
}
