import React from 'react';
import { ShieldCheck, Award, Zap, Clock, CheckCircle } from 'lucide-react';

interface BadgeProps {
  type: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, size = 'md' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (type) {
    case 'NID Verified':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <ShieldCheck className={isSm ? "w-3 h-3 text-emerald-600" : "w-3.5 h-3.5 text-emerald-600"} />
          NID Verified
        </span>
      );
    case 'Police Clearance':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          <CheckCircle className={isSm ? "w-3 h-3 text-blue-600" : "w-3.5 h-3.5 text-blue-600"} />
          Police Cleared
        </span>
      );
    case 'Top Rated':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <Award className={isSm ? "w-3 h-3 text-amber-600" : "w-3.5 h-3.5 text-amber-600"} />
          Top Rated Pro
        </span>
      );
    case '7-Day Warranty':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses}`}>
          <Award className={isSm ? "w-3 h-3 text-teal-600" : "w-3.5 h-3.5 text-teal-600"} />
          7-Day Warranty
        </span>
      );
    case 'Emergency Ready':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 ${sizeClasses}`}>
          <Zap className={isSm ? "w-3 h-3 text-red-600" : "w-3.5 h-3.5 text-red-600"} />
          24/7 Emergency
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <Clock className="w-3 h-3" />
          {type}
        </span>
      );
  }
};
