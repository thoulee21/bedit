export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  marginBottom?: string;
  lineHeight?: number;
  borderLeft?: string;
  paddingLeft?: string;
  marginLeft?: string;
  fontStyle?: string;
}

export interface StyleTemplate {
  id: string;
  name: string;
  styles: {
    [key: string]: ElementStyle;
  };
} 