"use client";

import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Moon, Sun, Palette, Check, Gem, Droplets, Flame, Zap, Flower2 } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const isRTL = locale === 'ar';

  const getThemeIcon = (currentTheme) => {
    switch (currentTheme) {
      case themes.dark:
        return <Moon className="h-4 w-4" />;
      case themes.blue:
        return <Palette className="h-4 w-4" />;
      case themes.blueNew:
        return <Droplets className="h-4 w-4" />;
      case themes.green:
        return <Flower2 className="h-4 w-4" />;
      case themes.orange:
        return <Flame className="h-4 w-4" />;
      case themes.orangeGold:
        return <Gem className="h-4 w-4" />;
      case themes.violet:
        return <Zap className="h-4 w-4" />;
      case themes.yellow:
        return <Sun className="h-4 w-4 fill-current" />;
      case themes.rose:
        return <Flower2 className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (currentTheme) => {
    switch (currentTheme) {
      case themes.dark:
        return t("theme.dark") || "Dark";
      case themes.blue:
        return t("theme.blue") || "Blue";
      case themes.blueNew:
        return t("theme.blueNew") || "Blue New";
      case themes.green:
        return t("theme.green") || "Green";
      case themes.orange:
        return t("theme.orange") || "Orange";
      case themes.orangeGold:
        return t("theme.orangeGold") || "Orange Gold";
      case themes.violet:
        return t("theme.violet") || "Violet";
      case themes.yellow:
        return t("theme.yellow") || "Yellow";
      case themes.rose:
        return t("theme.rose") || "Rose";
      default:
        return t("theme.light") || "Light";
    }
  };

  return (
    <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative cursor-pointer flex items-center gap-2 h-9 px-3 bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {getThemeIcon(theme)}
          <span className="hidden sm:inline-block text-sm">
            {getThemeLabel(theme)}
          </span>
          <span className="sr-only">{t("theme.switchTheme") || "Switch theme"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] bg-popover border-border">
        <DropdownMenuItem 
          onClick={() => setTheme(themes.light)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="h-4 w-4" />
          <span className="flex-1">{t("theme.light") || "Light"}</span>
          {theme === themes.light && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.dark)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Moon className="h-4 w-4" />
          <span className="flex-1">{t("theme.dark") || "Dark"}</span>
          {theme === themes.dark && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.blue)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Palette className="h-4 w-4" />
          <span className="flex-1">{t("theme.blue") || "Blue"}</span>
          {theme === themes.blue && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.blueNew)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Droplets className="h-4 w-4" />
          <span className="flex-1">{t("theme.blueNew") || "Blue New"}</span>
          {theme === themes.blueNew && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.green)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Flower2 className="h-4 w-4" />
          <span className="flex-1">{t("theme.green") || "Green"}</span>
          {theme === themes.green && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.orange)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Flame className="h-4 w-4" />
          <span className="flex-1">{t("theme.orange") || "Orange"}</span>
          {theme === themes.orange && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.orangeGold)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Gem className="h-4 w-4" />
          <span className="flex-1">{t("theme.orangeGold") || "Orange Gold"}</span>
          {theme === themes.orangeGold && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.violet)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Zap className="h-4 w-4" />
          <span className="flex-1">{t("theme.violet") || "Violet"}</span>
          {theme === themes.violet && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.yellow)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Sun className="h-4 w-4 fill-current" />
          <span className="flex-1">{t("theme.yellow") || "Yellow"}</span>
          {theme === themes.yellow && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.rose)}
          className="flex items-center gap-3 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Flower2 className="h-4 w-4" />
          <span className="flex-1">{t("theme.rose") || "Rose"}</span>
          {theme === themes.rose && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
