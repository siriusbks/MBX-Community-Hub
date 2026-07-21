import React from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@ui/select";

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  //{ code: 'es', label: 'Español', flag: '🇪🇸' },
  //{ code: 'pl', label: 'Polski', flag: '🇵🇱' }
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
          <span className="text-base leading-none drop-shadow-sm">{currentLang.flag}</span>
        </span>
      </SelectTrigger>
      <SelectContent position="popper" align="end" sideOffset={8}>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none drop-shadow-sm">{lang.flag}</span>
              <span className="font-medium w-20 text-left">{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
