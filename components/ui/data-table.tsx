'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CenterUnderline from '@/components/fancy/text/underline-center'
import { motion } from 'motion/react'

export type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  align?: 'left' | 'center' | 'right'
  highlight?: boolean
}

interface DataTableProps<TData, TValue> {
  columns: ExtendedColumnDef<TData, TValue>[]
  data: TData[]
  enableRowSelection?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableRowSelection = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <div className="bg-table overflow-x-auto rounded-lg shadow-none">
      <Table className="table-fixed">
        <TableHeader className="bg-sidebar">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const columnSize = header.column.columnDef.size
                const width =
                  typeof columnSize === 'number' ? `${columnSize}px` : columnSize || 'auto'
                const align =
                  (header.column.columnDef as ExtendedColumnDef<TData, TValue>).align || 'left'
                const alignClass =
                  align === 'center'
                    ? 'text-center'
                    : align === 'right'
                      ? 'text-right'
                      : 'text-left'
                return (
                  <TableHead
                    key={header.id}
                    style={{ width }}
                    className={`wrap-break-words top-0 ${alignClass}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="group border-b last:border-b"
              >
                {row.getVisibleCells().map(cell => {
                  const columnSize = cell.column.columnDef.size
                  const width =
                    typeof columnSize === 'number' ? `${columnSize}px` : columnSize || 'auto'
                  const align =
                    (cell.column.columnDef as ExtendedColumnDef<TData, TValue>).align || 'left'
                  const alignClass =
                    align === 'center'
                      ? 'text-center'
                      : align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  const highlight =
                    (cell.column.columnDef as ExtendedColumnDef<TData, TValue>).highlight !== false
                  const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext())
                  return (
                    <TableCell
                      key={cell.id}
                      style={{ width }}
                      className={`wrap-break-words whitespace-normal ${alignClass}`}
                    >
                      {highlight ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                          <CenterUnderline underlineHeightRatio={0.15} underlinePaddingRatio={0.15}>
                            {cellContent}
                          </CenterUnderline>
                        </motion.div>
                      ) : (
                        cellContent
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
