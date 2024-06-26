import { Bird, Plus } from 'lucide-react';
import { type Key, useEffect, useState } from 'react';
import { type RenderRowProps, Row, type SortColumn } from 'react-data-grid';
import { useTranslation } from 'react-i18next';
import ContentPlaceholder from '~/modules/common/content-placeholder';
import { DataTable } from '~/modules/common/data-table';
import { type Task, useElectric } from '~/modules/common/electric/electrify';
import { useWorkspaceContext } from '~/modules/workspaces/workspace-context';
import { TaskProvider } from '../task/task-context';
import { useColumns } from './columns';
import { FilterBarActions, FilterBarContent, TableFilterBar } from '~/modules/common/data-table/table-filter-bar';
import { Button } from '~/modules/ui/button';
import { useUserStore } from '~/store/user';
import SelectStatus from './status';

const renderRow = (key: Key, props: RenderRowProps<Task>) => {
  return (
    <TaskProvider key={key} task={props.row}>
      <Row {...props} />
    </TaskProvider>
  );
};

const LIMIT = 100;

export default function TasksTable() {
  const { t } = useTranslation();
  const { user } = useUserStore(({ user }) => ({ user }));
  const { searchQuery, selectedTasks, setSelectedTasks, projects, setSearchQuery } = useWorkspaceContext(
    ({ searchQuery, selectedTasks, setSelectedTasks, projects, setSearchQuery }) => ({
      searchQuery,
      selectedTasks,
      setSelectedTasks,
      projects,
      setSearchQuery,
    }),
  );
  const [columns] = useColumns();
  const [rows, setRows] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [sortColumns, setSortColumns] = useState<SortColumn[]>([{ columnKey: 'created_at', direction: 'DESC' }]);

  const sort = sortColumns[0]?.columnKey;
  const order = sortColumns[0]?.direction.toLowerCase();

  const isFiltered = !!searchQuery || selectedStatuses.length > 0;

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const electric = useElectric()!;

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const newOffset = 0;
      setOffset(newOffset);
      const results = await electric.db.tasks.findMany({
        where: {
          project_id: {
            in: projects.map((project) => project.id),
          },
          ...(selectedStatuses.length > 0 && {
            status: {
              in: selectedStatuses,
            },
          }),
          OR: [
            {
              summary: {
                contains: searchQuery,
              },
            },
            {
              markdown: {
                contains: searchQuery,
              },
            },
          ],
        },
        take: LIMIT,
        skip: newOffset,
        orderBy: {
          [sort]: order,
        },
      });
      setTasks(results as Task[]);
      setIsFetching(false);
    })();
  }, [projects, sort, order, searchQuery, selectedStatuses]);

  // const filteredTasks = useMemo(() => {
  //   if (!tasks) return;
  //   if (!searchQuery) return tasks;
  //   return tasks.filter(
  //     (task) =>
  //       task.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       task.markdown?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       task.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  //   );
  // }, [tasks, searchQuery]);

  const fetchMore = async () => {
    setIsFetching(true);
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    const results = await electric.db.tasks.findMany({
      where: {
        project_id: {
          in: projects.map((project) => project.id),
        },
        ...(selectedStatuses.length > 0 && {
          status: {
            in: selectedStatuses,
          },
        }),
        OR: [
          {
            summary: {
              contains: searchQuery,
            },
          },
          {
            markdown: {
              contains: searchQuery,
            },
          },
        ],
      },
      take: LIMIT,
      skip: newOffset,
      orderBy: {
        [sort]: order,
      },
    });
    setTasks((prevTasks) => [...prevTasks, ...(results as Task[])]);
    setIsFetching(false);
  };

  const onResetFilters = () => {
    setSearchQuery('');
    setSelectedTasks([]);
    setSelectedStatuses([]);
  };

  const onRowsChange = (changedRows: Task[]) => {
    setRows(changedRows);
  };

  const handleSelectedRowsChange = (selectedRows: Set<string>) => {
    setSelectedTasks(Array.from(selectedRows));
  };

  useEffect(() => {
    if (tasks) setRows(tasks);
  }, [tasks]);

  return (
    <div className="space-y-4 h-full">
      <div className={'flex items-center max-sm:justify-between md:gap-2'}>
        <TableFilterBar onResetFilters={onResetFilters} isFiltered={isFiltered}>
          <FilterBarActions>
            {selectedTasks.length > 0 ? (
              <>
                {/* <Button variant="destructive" className="relative" onClick={openDeleteDialog}>
                  <Badge className="py-0 px-1 absolute -right-2 min-w-5 flex justify-center -top-2">{selectedOrganizations.length}</Badge>
                  <Trash size={16} />
                  <span className="ml-1 max-lg:hidden">{t('common:remove')}</span>
                </Button>
                <Button variant="ghost" onClick={() => setSelectedRows(new Set<string>())}>
                  <XSquare size={16} />
                  <span className="ml-1">{t('common:clear')}</span>
                </Button> */}
              </>
            ) : (
              !isFiltered &&
              user.role === 'ADMIN' && (
                <Button
                // onClick={() => {
                //   dialog(<CreateOrganizationForm callback={(organization) => callback([organization], 'create')} dialog />, {
                //     className: 'md:max-w-2xl',
                //     id: 'create-organization',
                //     title: t('common:create_resource', { resource: t('common:organization').toLowerCase() }),
                //   });
                // }}
                >
                  <Plus size={16} />
                  <span className="ml-1">{t('common:create')}</span>
                </Button>
              )
            )}
            {/* {selectedTasks.length === 0 && (
              <TableCount count={totalCount} type="organization" isFiltered={isFiltered} onResetFilters={onResetFilters} />
            )} */}
          </FilterBarActions>

          <div className="sm:grow" />

          <FilterBarContent>
            <SelectStatus selectedStatuses={selectedStatuses} setSelectedStatuses={setSelectedStatuses} />
            {/* <TableSearch value={query} setQuery={onSearch} /> */}
          </FilterBarContent>
        </TableFilterBar>
        {/* <ColumnsView className="max-lg:hidden" columns={columns} setColumns={setColumns} /> */}
        {/* <Export
          className="max-lg:hidden"
          filename={`${config.slug}-organizations`}
          columns={columns}
          selectedRows={selectedOrganizations}
          fetchRows={async (limit) => {
            const { items } = await getOrganizations({ limit, q: query, sort, order });
            return items;
          }}
        />
        <FocusView iconOnly /> */}
      </div>
      <DataTable<Task>
        {...{
          columns: columns.filter((column) => column.visible),
          rows,
          limit: 10,
          rowHeight: 42,
          onRowsChange,
          isLoading: tasks === undefined,
          isFetching,
          renderRow,
          isFiltered: !!searchQuery,
          selectedRows: new Set<string>(selectedTasks),
          onSelectedRowsChange: handleSelectedRowsChange,
          fetchMore,
          rowKeyGetter: (row) => row.id,
          enableVirtualization: false,
          sortColumns,
          onSortColumnsChange: setSortColumns,
          NoRowsComponent: <ContentPlaceholder Icon={Bird} title={t('common:no_resource_yet', { resource: t('common:tasks').toLowerCase() })} />,
        }}
      />
    </div>
  );
}
