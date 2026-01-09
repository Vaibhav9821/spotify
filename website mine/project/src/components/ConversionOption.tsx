import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ConversionOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}

export default function ConversionOption({
  icon: Icon,
  title,
  description,
  onClick,
  gradient
}: ConversionOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}
    >
      <div className="text-white">
        <Icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}