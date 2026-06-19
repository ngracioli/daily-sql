import { Badge } from "@/shared/ui";

export interface ProblemDescriptionProps {
  title: string;
  database: string;
  description: string;
}

export function ProblemDescription({
  title,
  database,
  description,
}: ProblemDescriptionProps) {
  return (
    <>
      <div className="flex flex-col gap-sm">
        <h1 className="text-headline-md font-headline-md font-[600] tracking-[-0.04em] text-[#171717]">
          {title}
        </h1>
        <div className="flex items-center gap-sm">
          <Badge variant="outline">{database}</Badge>
        </div>
      </div>
      <p className="text-body-md font-body-md text-on-surface-variant">
        {description}
      </p>
    </>
  );
}
