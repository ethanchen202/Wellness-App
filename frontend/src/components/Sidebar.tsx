import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  icon: LucideIcon;
  name: string;
};

export type SidebarProps = {
  items: SidebarItem[];
  currentIdx: number;
  onChange?: (newIdx: number) => void;
};

export default function Sidebar({ items, currentIdx, onChange }: SidebarProps) {
  return (
    <div className="w-[310px] gap-5 h-screen flex flex-col items-center bg-gradient-to-t from-[#FCFCFD] to-axial-100 p-4 rounded-tr-[30px]">
      <div className="h-[200px]"></div>
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isSelected = idx === currentIdx;

        return (
          <div
            key={idx}
            className="w-[272px] h-[66px] flex cursor-pointer"
            onClick={() => onChange?.(idx)}
          >
            <div
              className={`w-full h-full flex items-center px-[38px] rounded-full transition-all duration-200 ${
                isSelected
                  ? "bg-[#FFFFFF80] shadow-[0_0_90px_6px_var(--color-gray-200)] "
                  : "bg-transparent hover:bg-gray-100"
              }`}
            >
              <Icon className="w-6 h-6 mr-[30px] text-axial-400" />
              <span className="text-axial-400 text-heading-2 leading-none">
                {item.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
