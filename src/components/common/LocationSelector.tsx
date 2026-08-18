import React, { useState } from 'react';
import { MapPin, ChevronDown, Check, Navigation, X } from 'lucide-react';
import { BANGLADESH_LOCATIONS } from '../../data/bangladeshLocations';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';

interface LocationSelectorProps {
  compact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ compact = false }) => {
  const { selectedLocation, setSelectedLocation } = useMarketplace();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const [activeDivision, setActiveDivision] = useState(selectedLocation.division);
  const [activeDistrict, setActiveDistrict] = useState(selectedLocation.district);
  const [activeThana, setActiveThana] = useState(selectedLocation.thana);
  const [activeArea, setActiveArea] = useState(selectedLocation.area);

  const isBn = language === 'bn';

  // Find active nodes
  const divisionNode = BANGLADESH_LOCATIONS.find(d => d.division === activeDivision) || BANGLADESH_LOCATIONS[0];
  const districtNode = divisionNode.districts.find(d => d.name === activeDistrict) || divisionNode.districts[0];
  const thanaNode = districtNode.thanas.find(t => t.name === activeThana) || districtNode.thanas[0];

  const handleApply = () => {
    setSelectedLocation({
      division: activeDivision,
      district: activeDistrict,
      thana: activeThana,
      area: activeArea || thanaNode.areas[0] || activeThana
    });
    setIsOpen(false);
  };

  const handleUseGPS = () => {
    // Simulated GPS Detection in Dhaka
    setActiveDivision('Dhaka');
    setActiveDistrict('Dhaka');
    setActiveThana('Mirpur');
    setActiveArea('Mirpur-2');
    setSelectedLocation({
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Mirpur',
      area: 'Mirpur-2'
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-left ${
          compact ? 'text-xs' : 'text-sm'
        }`}
      >
        <MapPin className="w-4 h-4 text-redaccent-500 shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">
            {isBn ? 'লোকেশন' : 'Location'}
          </span>
          <span className="font-semibold text-slate-800 truncate max-w-[130px] md:max-w-[180px]">
            {selectedLocation.thana}, {selectedLocation.district}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isBn ? 'আপনার সার্ভিস এলাকা নির্বাচন করুন' : 'Select Your Service Location'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'বিভাগ ➔ জেলা ➔ থানা ➔ এলাকা' : 'Division ➔ District ➔ Thana ➔ Area'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS shortcut */}
            <div className="px-4 py-2.5 bg-brand-50/70 border-b border-brand-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-brand-900 font-medium">
                <Navigation className="w-4 h-4 text-brand-600 animate-pulse" />
                <span>{isBn ? 'স্বয়ংক্রিয় জিপিএস অবস্থান সনাক্ত করুন' : 'Detect your current GPS location'}</span>
              </div>
              <button
                onClick={handleUseGPS}
                className="text-xs font-bold text-brand-700 bg-white border border-brand-200 px-3 py-1 rounded-lg hover:bg-brand-600 hover:text-white transition-all shadow-xs"
              >
                {isBn ? 'জিপিএস দিয়ে দিন' : 'Auto Detect (Dhaka)'}
              </button>
            </div>

            {/* Selector Cascades */}
            <div className="p-5 overflow-y-auto space-y-4 text-sm">
              {/* 1. Division */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isBn ? '১. বিভাগ নির্বাচন' : '1. Select Division'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BANGLADESH_LOCATIONS.map(d => {
                    const isSelected = d.division === activeDivision;
                    return (
                      <button
                        key={d.division}
                        type="button"
                        onClick={() => {
                          setActiveDivision(d.division);
                          setActiveDistrict(d.districts[0].name);
                          setActiveThana(d.districts[0].thanas[0].name);
                          setActiveArea(d.districts[0].thanas[0].areas[0] || d.districts[0].thanas[0].name);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isBn ? d.divisionBn : d.division}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isBn ? '২. জেলা নির্বাচন' : '2. Select District'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {divisionNode.districts.map(dist => {
                    const isSelected = dist.name === activeDistrict;
                    return (
                      <button
                        key={dist.name}
                        type="button"
                        onClick={() => {
                          setActiveDistrict(dist.name);
                          setActiveThana(dist.thanas[0].name);
                          setActiveArea(dist.thanas[0].areas[0] || dist.thanas[0].name);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isBn ? dist.nameBn : dist.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Thana / Upazila */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isBn ? '৩. থানা / উপজেলা' : '3. Thana / Upazila'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {districtNode.thanas.map(th => {
                    const isSelected = th.name === activeThana;
                    return (
                      <button
                        key={th.name}
                        type="button"
                        onClick={() => {
                          setActiveThana(th.name);
                          setActiveArea(th.areas[0] || th.name);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-brand-50 text-brand-900 border-brand-400 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{isBn ? th.nameBn : th.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Specific Area */}
              {thanaNode.areas.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {isBn ? '৪. সুনির্দিষ্ট এলাকা / রোড' : '4. Specific Neighborhood / Road'}
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {thanaNode.areas.map(area => {
                      const isSelected = area === activeArea;
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setActiveArea(area)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-600 font-medium truncate max-w-[260px]">
                {isBn ? 'নির্বাচিত:' : 'Selected:'}{' '}
                <span className="font-bold text-brand-700">
                  {activeArea || activeThana}, {activeThana}, {activeDistrict}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isBn ? 'এই লোকেশন ব্যবহার করুন' : 'Confirm Location'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
