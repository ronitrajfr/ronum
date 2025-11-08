"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorSelect: (color: string) => void;
}

// Soft, eye-friendly color palette
const SOFT_COLORS = [
  { name: "Soft Red", value: "#dc2626" },
  { name: "Soft Orange", value: "#ea580c" },
  { name: "Soft Amber", value: "#d97706" },
  { name: "Soft Yellow", value: "#ca8a04" },
  { name: "Soft Green", value: "#16a34a" },
  { name: "Soft Teal", value: "#0d9488" },
  { name: "Soft Blue", value: "#2563eb" },
  { name: "Soft Indigo", value: "#4f46e5" },
  { name: "Soft Purple", value: "#9333ea" },
  { name: "Soft Pink", value: "#ec4899" },
  { name: "Soft Rose", value: "#e11d48" },
  { name: "Soft Slate", value: "#64748b" },
];

export default function ColorPickerModal({
  isOpen,
  onClose,
  currentColor,
  onColorSelect,
}: ColorPickerModalProps) {
  const [customColor, setCustomColor] = useState(currentColor);

  const handleApply = () => {
    onColorSelect(customColor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Book Color</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset soft colors */}
          <div>
            <p className="mb-3 text-sm font-medium">Soft Color Palette</p>
            <div className="grid grid-cols-4 gap-3">
              {SOFT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomColor(color.value);
                  }}
                  className={`aspect-square w-full rounded-lg border-2 transition-all ${
                    customColor === color.value
                      ? "border-slate-800 shadow-lg"
                      : "border-transparent hover:border-slate-400"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${color.value}40 0%, ${color.value}20 50%, rgba(255,255,255,0.9) 100%)`,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Custom color picker */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Custom Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-12 flex-1 cursor-pointer rounded-lg"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-24 rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
                placeholder="#dc2626"
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="mb-2 text-sm font-medium">Preview</p>
            <div
              className="h-32 w-full rounded-lg border border-slate-200 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${customColor}40 0%, ${customColor}20 50%, rgba(255,255,255,0.9) 100%)`,
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply Color</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
