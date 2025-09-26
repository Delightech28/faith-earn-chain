declare module 'qrcode.react' {
  import * as React from 'react';

  export interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    renderAs?: 'canvas' | 'svg';
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
    [key: string]: any; // For additional props if needed
  }

  const QRCode: React.ComponentType<QRCodeProps>;
  export default QRCode;
}
