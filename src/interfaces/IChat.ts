export enum chatType {
  csvUpload = "CSV_UPLOAD",
  query = "QUERY",
  chart = "CHART",
  loading = "LOADING",
}

export enum roleTYPE {
  ASSISTANT = "ASSITANT",
  HUMAN = "HUMAN",
}
export enum feedbackAction {
  LIKED = "LIKED",
  FEEDBACK = "FEEDBACK",
}
export interface IChat {
  time: string;
  uuid: string;
  liked: number;
  feedback: string;
  type: chatType;
  role: roleTYPE;
  content: any;
}

export interface IChatBlock {
  uuid: string;
  date: string;
  thread: IChat[];
}

export default interface IChatList {
  id: string;
  cid: string;
  csv: string;
  history: IChatBlock[];
}

export interface IChatMenu {
  id: string;
  uid?: string;
  title?: string;
}
