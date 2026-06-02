declare module "qrcode" {
  type ToCanvasOptions = {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  };

  const QRCode: {
    toCanvas(canvas: HTMLCanvasElement, value: string, options?: ToCanvasOptions): Promise<void>;
  };

  export default QRCode;
}
