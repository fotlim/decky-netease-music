declare module "qrcode-generator" {
  interface QRCode {
    addData(data: string): void;
    make(): void;
    createSvgTag(opts?: { cellSize?: number; margin?: number; scalable?: boolean; alt?: string }): string;
    createDataURL(cellSize?: number, margin?: number): string;
    createImgTag(cellSize?: number, margin?: number, alt?: string): string;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
  }
  export default function qrcode(typeNumber: number, errorCorrectionLevel: string): QRCode;
}
