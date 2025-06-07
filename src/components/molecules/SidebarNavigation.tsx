import { LucideIcon } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface NavigationSection {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavigationProps {
  sections: NavigationSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function SidebarNavigation({
  sections,
  activeSection,
  onSectionChange,
}: SidebarNavigationProps) {
  return (
    <nav className="flex flex-wrap gap-2 lg:flex-col lg:space-y-1 lg:gap-0">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "default" : "ghost"}
          className="justify-start w-full text-sm lg:text-base whitespace-nowrap lg:whitespace-normal"
          onClick={() => onSectionChange(section.id)}
        >
          <section.icon className="flex-shrink-0 w-4 h-4 mr-2" />
          <span className="text-left">{section.label}</span>
        </Button>
      ))}
    </nav>
  );
}
