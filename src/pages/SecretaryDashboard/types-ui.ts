export type TabKey = "new" | "evaluated" | "forwarded" | "uid" | "certificate";

export type ViewMode = "table" | "grid";

export type SortKey = "date_desc" | "date_asc" | "id_asc" | "id_desc" | "name_asc";

export interface FilterState {
  search: string;
  formCodes: string[];
  categories: string[];
  dateRange: "7" | "30" | "90" | "all";
  sort: SortKey;
  view: ViewMode;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  formCodes: [],
  categories: [],
  dateRange: "all",
  sort: "date_desc",
  view: "table",
};
