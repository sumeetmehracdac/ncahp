import { Search, LayoutGrid, List, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ALL_CATEGORIES, ALL_FORM_CODES, FORM_META } from "../types";
import { FilterState } from "../types-ui";
import { cn } from "@/lib/utils";

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  totalShown: number;
  totalAll: number;
}

export function FilterToolbar({ filters, onChange, totalShown, totalAll }: Props) {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  const toggleFormCode = (code: string) => {
    const exists = filters.formCodes.includes(code);
    update({
      formCodes: exists
        ? filters.formCodes.filter((c) => c !== code)
        : [...filters.formCodes, code],
    });
  };

  const toggleCategory = (cat: string) => {
    const exists = filters.categories.includes(cat);
    update({
      categories: exists
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });
  };

  const activeFilterCount =
    filters.formCodes.length +
    filters.categories.length +
    (filters.dateRange !== "all" ? 1 : 0) +
    (filters.search ? 1 : 0);

  const clearAll = () =>
    update({ search: "", formCodes: [], categories: [], dateRange: "all" });

  return (
    <div className="sticky top-0 z-20 -mx-2 rounded-xl border border-border bg-background/85 px-2 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search by Application ID, applicant name, UID…"
            className="h-10 pl-9"
          />
        </div>

        {/* Form Type multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Form Type
              {filters.formCodes.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.formCodes.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2">
            <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Filter by Form
            </div>
            <div className="max-h-72 overflow-y-auto">
              {ALL_FORM_CODES.map((code) => {
                const meta = FORM_META[code];
                const checked = filters.formCodes.includes(code);
                return (
                  <label
                    key={code}
                    className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 hover:bg-muted"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleFormCode(code)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {meta.formLabel} · {meta.category}
                      </div>
                      <div className="text-xs text-muted-foreground">{meta.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Category multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              Category
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2">
            {ALL_CATEGORIES.map((cat) => {
              const checked = filters.categories.includes(cat);
              return (
                <label
                  key={cat}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-muted"
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleCategory(cat)} />
                  <span className="text-sm">{cat}</span>
                </label>
              );
            })}
          </PopoverContent>
        </Popover>

        {/* Date Range */}
        <Select
          value={filters.dateRange}
          onValueChange={(v) => update({ dateRange: v as FilterState["dateRange"] })}
        >
          <SelectTrigger className="h-10 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(v) => update({ sort: v as FilterState["sort"] })}
        >
          <SelectTrigger className="h-10 w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest first</SelectItem>
            <SelectItem value="date_asc">Oldest first</SelectItem>
            <SelectItem value="id_asc">App ID ↑</SelectItem>
            <SelectItem value="id_desc">App ID ↓</SelectItem>
            <SelectItem value="name_asc">Name A→Z</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border p-0.5">
          <button
            onClick={() => update({ view: "table" })}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors",
              filters.view === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <List className="h-3.5 w-3.5" /> Table
          </button>
          <button
            onClick={() => update({ view: "grid" })}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors",
              filters.view === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Cards
          </button>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{totalShown}</span> of{" "}
            {totalAll}
          </span>
          {filters.formCodes.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => toggleFormCode(c)}
            >
              {FORM_META[c as keyof typeof FORM_META]?.formLabel || c}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.categories.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => toggleCategory(c)}
            >
              {c}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <button
            onClick={clearAll}
            className="ml-auto text-primary underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
