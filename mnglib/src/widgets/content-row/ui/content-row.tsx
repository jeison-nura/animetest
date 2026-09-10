import { ChevronRightIcon } from "lucide-react";

type ContentRowProps = {
  title: string;
  children: React.ReactNode;
};

function ContentRow({ title, children }: ContentRowProps) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-brand/15 px-4 py-1.5 text-sm font-medium text-brand-light transition-colors duration-200 hover:bg-brand/10"
        >
          Browse All <ChevronRightIcon size={13} />
        </button>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
        {children}
      </div>
    </section>
  );
}

export { ContentRow };
