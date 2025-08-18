import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Generic types for the table component

// Table column interface
interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

// Table pagination interface
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

// App table props interface
interface AppTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  description?: string;
  pagination?: TablePaginationProps;
  selectable?: boolean;
  selectedItems?: Set<string>;
  onSelectAll?: (checked: boolean) => void;
  onSelectItem?: (itemId: string, checked: boolean) => void;
  getItemId: (item: T) => string;
  expandableRows?: {
    expandedItem: string | null;
    onToggle: (itemId: string) => void;
    renderExpandedContent: (item: T) => React.ReactNode;
  };
  emptyState?: React.ReactNode;
  className?: string;
}

// App table component
function AppTable<T>({
  data,
  columns,
  title,
  description,
  pagination,
  selectable = false,
  selectedItems = new Set(),
  onSelectAll,
  onSelectItem,
  getItemId,
  expandableRows,
  emptyState,
  className,
}: AppTableProps<T>) {
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage : 0;
  const endIndex = pagination ? startIndex + pagination.itemsPerPage : data.length;
  const currentData = pagination ? data.slice(startIndex, endIndex) : data;

  const isAllSelected = currentData.length > 0 && selectedItems.size === currentData.length;

  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
      <p className="text-lg font-medium">No data found</p>
    </div>
  );

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {/* Pagination info */}
        {pagination && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, pagination.totalItems)} of{" "}
              {pagination.totalItems} items
            </div>
            {selectedItems.size > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected || selectedItems.size > 0}
                      onCheckedChange={onSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.width}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={selectable ? columns.length + 1 : columns.length}
                    className="h-24 text-center"
                  >
                    {emptyState || defaultEmptyState}
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item, index) => (
                  <React.Fragment key={getItemId(item)}>
                    <TableRow>
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.has(getItemId(item))}
                            onCheckedChange={(checked: boolean) =>
                              onSelectItem?.(getItemId(item), checked)
                            }
                            aria-label={`Select item ${index + 1}`}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render
                            ? column.render(item, index)
                            : String((item as Record<string, unknown>)[column.key] || "")}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandableRows && expandableRows.expandedItem === getItemId(item) && (
                      <TableRow>
                        <TableCell
                          colSpan={selectable ? columns.length + 1 : columns.length}
                          className="bg-muted/50"
                        >
                          <div className="py-4">{expandableRows.renderExpandedContent(item)}</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        {pagination && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pagination.itemsPerPage}`}
                onValueChange={(value) => pagination.onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {(pagination.pageSizeOptions || [5, 10, 20, 30, 40, 50]).map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onPageChange(
                    Math.min(pagination.totalPages, pagination.currentPage + 1)
                  )
                }
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { AppTable, type TableColumn, type TablePaginationProps, type AppTableProps };
