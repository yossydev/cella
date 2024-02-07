import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Input } from '~/modules/ui/input';
import { DataTableViewOptions } from './options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filter?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({ table, filter = 'name', children }: DataTableToolbarProps<TData>) {
  const { t } = useTranslation();

  // const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 sm:justify-end">
        {children}
        <DataTableViewOptions table={table} />

        <Input
          placeholder={t('placeholder.search', {
            defaultValue: 'Search ...',
          })}
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(filter)?.setFilterValue(event.target.value)}
          className="h-10 w-[150px] lg:w-[250px]"
        />
        {/* {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {t('action.reset', {
              defaultValue: 'Reset',
            })}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )} */}
      </div>
    </div>
  );
}