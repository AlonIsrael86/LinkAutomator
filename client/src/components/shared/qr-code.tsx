interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCode({ value, size = 80, className = "" }: QRCodeProps) {
  // Generate a simple QR-code-like pattern using CSS
  // In a real implementation, you'd use a QR code library
  const qrStyle = {
    width: `${size}px`,
    height: `${size}px`,
    background: `
      radial-gradient(circle at 20% 20%, #000 2px, transparent 2px),
      radial-gradient(circle at 40% 20%, #000 2px, transparent 2px),
      radial-gradient(circle at 60% 20%, #000 2px, transparent 2px),
      radial-gradient(circle at 80% 20%, #000 2px, transparent 2px),
      radial-gradient(circle at 20% 40%, #000 2px, transparent 2px),
      radial-gradient(circle at 60% 40%, #000 2px, transparent 2px),
      radial-gradient(circle at 80% 40%, #000 2px, transparent 2px),
      radial-gradient(circle at 20% 60%, #000 2px, transparent 2px),
      radial-gradient(circle at 40% 60%, #000 2px, transparent 2px),
      radial-gradient(circle at 80% 60%, #000 2px, transparent 2px),
      radial-gradient(circle at 20% 80%, #000 2px, transparent 2px),
      radial-gradient(circle at 40% 80%, #000 2px, transparent 2px),
      radial-gradient(circle at 60% 80%, #000 2px, transparent 2px),
      radial-gradient(circle at 80% 80%, #000 2px, transparent 2px),
      white
    `,
    backgroundSize: '20px 20px',
  };

  return (
    <div 
      style={qrStyle}
      className={`border border-border rounded ${className}`}
      title={`QR Code for ${value}`}
      data-testid="qr-code"
    />
  );
}
