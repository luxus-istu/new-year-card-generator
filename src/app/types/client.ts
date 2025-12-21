export interface FormData {
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  noEmail: boolean;
}

export type IndicatorPosition = 
  | 'extra-far-left' 
  | 'far-left' 
  | 'near-left' 
  | 'center' 
  | 'near-right' 
  | 'far-right' 
  | 'extra-far-right';