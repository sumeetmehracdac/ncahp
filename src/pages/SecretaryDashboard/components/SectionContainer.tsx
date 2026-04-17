import { useMemo, useState } from "react";
import { Application } from "../types";
import { DEFAULT_FILTERS, FilterState } from "../types-ui";
import { FilterToolbar } from "./FilterToolbar";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationCard } from "./ApplicationCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Inbox, ChevronDown, Eye, Play, UploadCloud, FileText, Download } from "lucide-react";
import { ReactNode } from "react";
import { FORM_META } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  apps: Application[];
  renderAction: (app: Application) => ReactNode;
  selectable?: boolean;
  bulkBar?: (selected: string[], clear: () => void) => ReactNode;
  showStatus?: boolean;
  showUID?: boolean;
  showCertificate?: boolean;
  showForwardedAt?: boolean;
  emptyHint?: string;
}

const PAGE_SIZE = 10;

export function SectionContainer({
  apps,
  renderAction,
  selectable = true,
  bulkBar,
  showStatus,
  showUID,
  showCertificate,
  showForwardedAt,
  emptyHint = "No applications match your filters.",
}: Props) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    let out = apps.filter((a) => {
      if (q) {
        const hay = [a.applicationId, a.applicantName, a.uid, a.certificateNo, a.formCode]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.formCodes.length && !filters.formCodes.includes(a.formCode)) return false;
      if (filters.categories.length) {
        const cat = FORM_META[a.formCode].category;
        if (!filters.categories.includes(cat)) return false;
      }
      if (filters.dateRange !== "all") {
        const days = parseInt(filters.dateRange, 10);
        const cutoff = Date.now() - days * 86400000;
        if (new Date(a.submittedAt).getTime() < cutoff) return false;
      }
      return true;
    });

    out = [...out].sort((a, b) => {
      switch (filters.sort) {
        case "date_asc":
          return +new Date(a.submittedAt) - +new Date(b.submittedAt);
        case "id_asc":
          return a.applicationId.localeCompare(b.applicationId);
        case "id_desc":
          return b.applicationId.localeCompare(a.applicationId);
        case "name_asc":
          return a.applicantName.localeCompare(b.applicantName);
        default:
          return +new Date(b.submittedAt) - +new Date(a.submittedAt);
      }
    });
    return out;
  }, [apps, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageApps = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSelect = (id: string, isRadio?: boolean) => {
    if (isRadio) {
      setSelected([id]);
    } else {
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    }
  };
  const clearSelection = () => setSelected([]);

  // Drop selections that are no longer visible
  const validSelected = selected.filter((id) => filtered.some((a) => a.applicationId === id));
  const selectedApp = validSelected.length > 0 ? apps.find((a) => a.applicationId === validSelected[0]) : null;

  return (
    <div className="space-y-4">
      <FilterToolbar
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        totalShown={filtered.length}
        totalAll={apps.length}
      />

      {filters.view === "table" && (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center justify-between gap-2 rounded-sm border px-3 py-1.5 focus:outline-none hover:bg-[#ff9d23] hover:text-white transition-colors min-w-[120px]"
              >
                <div className="flex items-center gap-1.5 font-medium"><Eye className="h-4 w-4" /> View</div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem disabled={!selectedApp}>Proceeding</DropdownMenuItem>
              <DropdownMenuItem disabled={!selectedApp}>Document</DropdownMenuItem>
              <DropdownMenuItem disabled={!selectedApp}>Meeting Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="flex items-center justify-between gap-2 rounded-sm border px-3 py-1.5 focus:outline-none bg-[#004269] text-white hover:bg-[#003152] min-w-[120px]"
              >
                <div className="flex items-center gap-1.5 font-medium"><Play className="h-4 w-4" /> Action</div>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              {selectedApp ? (
                <div className="p-1 flex flex-col gap-1 overflow-hidden [&>button]:w-full [&>button]:justify-start">
                  {renderAction(selectedApp)}
                </div>
              ) : (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  Select an application first
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center justify-between gap-2 rounded-sm border px-3 py-1.5 focus:outline-none hover:bg-muted/50 min-w-[120px]"
              >
                <div className="flex items-center gap-1.5 font-medium"><UploadCloud className="h-4 w-4" /> Load</div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem disabled={!selectedApp}>Load Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center justify-between gap-2 rounded-sm border px-3 py-1.5 focus:outline-none hover:bg-muted/50 min-w-[120px]"
              >
                <div className="flex items-center gap-1.5 font-medium"><FileText className="h-4 w-4" /> Letters</div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem disabled={!selectedApp}>Generate Letter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center justify-between gap-2 rounded-sm border px-3 py-1.5 focus:outline-none hover:bg-muted/50 min-w-[120px]"
              >
                <div className="flex items-center gap-1.5 font-medium"><Download className="h-4 w-4" /> Download</div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem disabled={!selectedApp}>Download PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {selectable && bulkBar && validSelected.length > 0 && filters.view !== "table" && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 shadow-sm">
          <div className="text-sm">
            <span className="font-semibold text-primary">{validSelected.length}</span> selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
            {bulkBar(validSelected, clearSelection)}
          </div>
        </div>
      )}

      {pageApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold">No results</div>
            <div className="text-xs text-muted-foreground">{emptyHint}</div>
          </div>
        </div>
      ) : filters.view === "table" ? (
        <ApplicationTable
          apps={pageApps}
          selected={validSelected}
          onToggleSelect={toggleSelect}
          selectable={selectable}
          showStatus={showStatus}
          showUID={showUID}
          showCertificate={showCertificate}
          showForwardedAt={showForwardedAt}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pageApps.map((app) => (
            <ApplicationCard
              key={app.applicationId}
              app={app}
              selected={validSelected.includes(app.applicationId)}
              onToggleSelect={toggleSelect}
              selectable={selectable}
              renderAction={renderAction}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={safePage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
