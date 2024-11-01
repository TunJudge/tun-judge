import { ClipboardListIcon, EditIcon, PlusIcon, RefreshCcw, Trash2Icon } from 'lucide-react';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  useLayoutContext,
} from 'tw-react-components';

import { Problem } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { useDeleteProblem, useFindManyProblem } from '@core/queries';

import { ProblemForm } from './ProblemForm';

export const ProblemsList: React.FC = observer(() => {
  const navigate = useNavigate();
  const { showIds } = useLayoutContext();
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [problem, setProblem] = useState<Partial<Problem>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { orderBy, sorting, setSorting } = useSorting<Problem>();

  const { data: problems = [], isLoading, refetch } = useFindManyProblem({ orderBy });
  const { mutateAsync: deleteProblem } = useDeleteProblem();

  const columns: DataTableColumn<Problem>[] = [
    {
      header: '#',
      field: 'id',
      hide: !showIds,
    },
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Limits',
      field: 'timeLimit',
      render: (problem) => `${problem.timeLimit} s`,
    },
    {
      header: 'Memory Limit',
      field: 'memoryLimit',
      render: (problem) => `${problem.memoryLimit} Kb`,
    },
    {
      header: 'Output Limit',
      field: 'outputLimit',
      render: (problem) => `${problem.outputLimit} Kb`,
    },
  ];

  return (
    <PageTemplate
      icon={ClipboardListIcon}
      title="Problems"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button
            prefixIcon={PlusIcon}
            onClick={() => setProblem({ memoryLimit: 2097152, outputLimit: 8192 })}
          />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={problems}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        onRowClick={(item) => navigate(`/problems/${item.id}`)}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setProblem,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteProblem({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete Problem"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this problem?
      </ConfirmDialog>
      <ProblemForm
        problem={problem}
        onSubmit={() => setProblem(undefined)}
        onClose={() => setProblem(undefined)}
      />
    </PageTemplate>
  );
});
