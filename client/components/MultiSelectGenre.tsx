import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MultiSelectGenreProps {
  genres: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelectGenre({
  genres,
  selected,
  onChange,
}: MultiSelectGenreProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (genre: string) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((g) => g !== genre));
    } else {
      onChange([...selected, genre]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[140px] flex justify-between items-center"
        >
          {selected.length === 0
            ? "All Genres"
            : selected.length <= 2
            ? selected.join(", ")
            : `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {genres.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(genre)}
                onCheckedChange={() => handleToggle(genre)}
                id={`genre-${genre}`}
              />
              <span className="text-sm">{genre}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
