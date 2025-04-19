"use client";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((p) => {
    // Always show first and last page
    if (p === 1 || p === totalPages) return true;
    // Show pages around current page
    return Math.abs(p - page) <= 2;
  });

  // Add ellipsis indicators
  const paginationItems: (number | "ellipsis")[] = [];
  visiblePages.forEach((p, i) => {
    if (i > 0) {
      const prev = visiblePages[i - 1];
      if (p - prev > 1) {
        paginationItems.push("ellipsis");
      }
    }
    paginationItems.push(p);
  });

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onChange(page - 1);
            }}
          />
        </PaginationItem>

        {paginationItems.map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={page === item}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
