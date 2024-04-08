import { ReactNode } from "react";

interface props {
  children: ReactNode;
  tooltip?: String;
}

const ToolTip: React.FC<props> = ({ children, tooltip }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <span
        className="invisible group-hover:visible opacity:0
        group-hover:opacity-100 transition bg-black text-white p-1
        rounded absolute bottom-full right-1 text-[8px] whitespace-nowrap mt-2"
      >
        {tooltip}
      </span>
    </div>
  );
};

export default ToolTip;
