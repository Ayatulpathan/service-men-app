import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICE_CATEGORIES, SERVICE_ITEMS } from '../../data/serviceCategories';
import {
  Home,
  Tv,
  Laptop,
  Car,
  GraduationCap,
  Sparkles,
  Briefcase,
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
  onSelectService: (serviceId: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Home,
  Tv,
  Laptop,
  Car,
  GraduationCap,
  Sparkles,
  Briefcase
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, onSelectService }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section id="services" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isBn ? 'প্রয়োজনীয় সকল সার্ভিস ক্যাটাগরি' : 'Explore All Service Categories'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {isBn
              ? 'গৃহস্থালি থেকে অফিস ও জরুরি সেবা—এক ছাদের নিচে ৪৩টিরও বেশি সেবা'
              : 'From home repairs to vehicle emergencies & corporate solutions—40+ expert services'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICE_CATEGORIES.map(category => {
            const Icon = ICON_MAP[category.icon] || Home;
            const itemsInCategory = SERVICE_ITEMS.filter(item => item.categoryId === category.id);

            return (
              <div
                key={category.id}
                className="group rounded-2xl p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {category.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        {category.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {isBn ? category.nameBn : category.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {isBn ? category.descriptionBn : category.description}
                  </p>

                  {/* Sub-services list */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5">
                    {itemsInCategory.slice(0, 3).map(srv => (
                      <button
                        key={srv.id}
                        onClick={() => onSelectService(srv.id)}
                        className="w-full flex items-center justify-between text-left text-xs py-1 px-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-brand-700 transition-colors"
                      >
                        <span className="truncate font-medium">{isBn ? srv.nameBn : srv.name}</span>
                        <span className="font-bold text-[11px] text-slate-500 shrink-0 ml-1">
                          ৳{srv.basePrice}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* View All in Category Button */}
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className="mt-4 pt-3 border-t border-slate-200/60 w-full flex items-center justify-between text-xs font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
                >
                  <span>{isBn ? 'সবগুলো দেখুন' : 'Explore Category'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
