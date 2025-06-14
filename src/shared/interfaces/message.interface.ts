export interface Message {
  text?: string;
  image?: {
    data: string;
    mimeType: string;
    size: number;
  };
  from: string;
  timestamp: number;
}
