"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <Select value={locale} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[140px] bg-background border-border text-foreground">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        <SelectItem value="en" className="text-foreground hover:bg-accent hover:text-accent-foreground">English</SelectItem>
        <SelectItem value="ar" className="text-foreground hover:bg-accent hover:text-accent-foreground">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}
