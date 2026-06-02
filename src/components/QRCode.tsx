"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";

type QRCodeProps = {
  value: string;
  size?: number;
  title?: string;
  className?: string;
};

export function QRCode({ value, size = 184, title = "QR code", className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const renderQr = async () => {
      setError(false);

      try {
        if (cancelled || !canvasRef.current) return;

        await QRCodeLib.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: "#020617",
            light: "#ffffff",
          },
        });
      } catch {
        if (!cancelled) setError(true);
      }
    };

    renderQr();

    return () => {
      cancelled = true;
    };
  }, [size, value]);

  if (error) {
    return (
      <div className={className}>
        <p className="text-xs text-destructive">Không thể tải thư viện QR. Vui lòng dùng manual key.</p>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={title}
      width={size}
      height={size}
      className={className}
    />
  );
}
