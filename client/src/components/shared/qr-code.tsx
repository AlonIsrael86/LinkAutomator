import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Settings, Palette } from "lucide-react";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

interface QRCodeCustomization {
  foregroundColor: string;
  backgroundColor: string;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  type: 'png' | 'svg';
  width: number;
}

export default function QRCode({ value, size = 80, className = "" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [customization, setCustomization] = useState<QRCodeCustomization>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    margin: 4,
    errorCorrectionLevel: 'M',
    type: 'png',
    width: 512
  });
  const [isCustomizing, setIsCustomizing] = useState(false);

  const generateQRCode = async (canvas: HTMLCanvasElement, options?: Partial<QRCodeCustomization>) => {
    const config = { ...customization, ...options };
    
    try {
      await QRCodeLib.toCanvas(canvas, value, {
        width: size,
        margin: config.margin,
        color: {
          dark: config.foregroundColor,
          light: config.backgroundColor
        },
        errorCorrectionLevel: config.errorCorrectionLevel
      });
    } catch (error) {
      console.error('QR Code generation failed:', error);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      generateQRCode(canvasRef.current);
    }
  }, [value, size]);

  const downloadQRCode = async (format: 'png' | 'svg') => {
    try {
      const config = { ...customization, type: format };
      
      if (format === 'svg') {
        const svgString = await QRCodeLib.toString(value, {
          type: 'svg',
          width: config.width,
          margin: config.margin,
          color: {
            dark: config.foregroundColor,
            light: config.backgroundColor
          },
          errorCorrectionLevel: config.errorCorrectionLevel
        });
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const canvas = document.createElement('canvas');
        await QRCodeLib.toCanvas(canvas, value, {
          width: config.width,
          margin: config.margin,
          color: {
            dark: config.foregroundColor,
            light: config.backgroundColor
          },
          errorCorrectionLevel: config.errorCorrectionLevel
        });
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error('QR Code download failed:', error);
    }
  };

  const updateCustomization = (updates: Partial<QRCodeCustomization>) => {
    const newConfig = { ...customization, ...updates };
    setCustomization(newConfig);
    
    if (canvasRef.current) {
      generateQRCode(canvasRef.current, newConfig);
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <div className="relative group">
        <canvas
          ref={canvasRef}
          className="border border-border rounded"
          data-testid="qr-code"
          title={`QR Code for ${value}`}
        />
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded flex items-center justify-center">
          <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customize QR Code
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Preview */}
                <div className="flex justify-center">
                  <canvas
                    ref={(canvas) => {
                      if (canvas) generateQRCode(canvas, customization);
                    }}
                    className="border border-border rounded"
                    width={150}
                    height={150}
                  />
                </div>
                
                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fg-color">צבע קדמי</Label>
                    <div className="flex gap-2">
                      <Input
                        id="fg-color"
                        type="color"
                        value={customization.foregroundColor}
                        onChange={(e) => updateCustomization({ foregroundColor: e.target.value })}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        type="text"
                        value={customization.foregroundColor}
                        onChange={(e) => updateCustomization({ foregroundColor: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bg-color">צבע רקע</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={customization.backgroundColor}
                        onChange={(e) => updateCustomization({ backgroundColor: e.target.value })}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        type="text"
                        value={customization.backgroundColor}
                        onChange={(e) => updateCustomization({ backgroundColor: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Margin */}
                <div>
                  <Label>שוליים: {customization.margin}</Label>
                  <Slider
                    value={[customization.margin]}
                    onValueChange={([value]) => updateCustomization({ margin: value })}
                    max={10}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                {/* Error Correction */}
                <div>
                  <Label>רמת תיקון שגיאות</Label>
                  <Select
                    value={customization.errorCorrectionLevel}
                    onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                      updateCustomization({ errorCorrectionLevel: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">נמוך (L) - 7%</SelectItem>
                      <SelectItem value="M">בינוני (M) - 15%</SelectItem>
                      <SelectItem value="Q">גבוה (Q) - 25%</SelectItem>
                      <SelectItem value="H">גבוה מאוד (H) - 30%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Export Size */}
                <div>
                  <Label>גודל ייצוא (פיקסלים)</Label>
                  <Input
                    type="number"
                    value={customization.width}
                    onChange={(e) => updateCustomization({ width: parseInt(e.target.value) || 512 })}
                    min={128}
                    max={2048}
                    className="mt-1"
                  />
                </div>
                
                {/* Download buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => downloadQRCode('png')}
                    className="flex-1"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                  <Button 
                    onClick={() => downloadQRCode('svg')}
                    className="flex-1"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    SVG
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
