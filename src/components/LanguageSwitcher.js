"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <Select value={locale} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}
