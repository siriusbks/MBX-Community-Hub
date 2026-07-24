import React from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@ui/select";

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '/media/flags/us.svg' },
  { code: 'fr', label: 'Français', flag: '/media/flags/fr.svg' },
  //{ code: 'es', label: 'Español', flag: '/media/flags/es.svg' },
  //{ code: 'pl', label: 'Polski', flag: '/media/flags/pl.svg' }
  // temporarily disabled
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const currentLang = React.useMemo(() => {
    const code = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
    return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  }, [i18n.resolvedLanguage, i18n.language]);

  const currentLangCode = currentLang.code;

  return (
    <Select value={currentLangCode} onValueChange={(val) => i18n.changeLanguage(val)}>
      <SelectTrigger className="w-fit h-9 bg-transparent border-none shadow-none hover:bg-secondary/50 focus:ring-0 gap-2 font-medium ml-1">
        <span className="flex items-center gap-2">
          <img src={currentLang.flag} alt={currentLang.label} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
        </span>
      </SelectTrigger>
      <SelectContent position="popper" align="end" sideOffset={8}>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
            <div className="flex items-center gap-3">
              <img src={lang.flag} alt={lang.label} className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm" />
              <span className="font-medium w-20 text-left">{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
