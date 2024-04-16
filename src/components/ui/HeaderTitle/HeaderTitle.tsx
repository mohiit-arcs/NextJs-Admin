const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <div className="py-4 flex justify-start pl-5 border-b border-[#DDDDDD]">
      <h1 className="relative text-4xl font-bold text-center text-[#0F172A] after:block after:absolute after:inset-[3.4rem] after:rounded-full after:-inset-x-0 after:w-full after:h-1 after:bg-[#0F172A]">
        {title}
      </h1>
    </div>
  );
};

export default HeaderTitle;
