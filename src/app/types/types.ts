export interface TemplateMeta {
  name: string;
  image: string;
  preview?: string;
  initialsX: number;
  initialsY: number;
  initialsFontSize: string;
  initialsColor: string;
  recipientX: number;
  recipientY: number;
  recipientFontSize: string;
  recipientColor: string;
}

export interface Template {
  name: string;
  preview: string;
  fullImage: string;
  initialsX: number;
  initialsY: number;
  initialsFontSize: string;
  initialsColor: string;
  recipientX: number;
  recipientY: number;
  recipientFontSize: string;
  recipientColor: string;
}
