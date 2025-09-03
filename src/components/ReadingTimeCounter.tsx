import { Clock } from "lucide-react";
import { useReadingTimeTracker } from "@/hooks/useReadingTimeTracker";

const ReadingTimeCounter = () => {
  const { currentSessionSeconds, formatSessionTime } = useReadingTimeTracker();

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-sm">
      <Clock className="w-4 h-4 text-primary" />
      <span className="text-sm font-mono font-medium text-foreground">
        {formatSessionTime(currentSessionSeconds)}
      </span>
    </div>
  );
};

export default ReadingTimeCounter;