import React from "react";
import { Stack, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDelete, useNavigation, usePermissions } from "@refinedev/core";
import type { Checklist } from "../../types";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, CreateButton, useDataGrid } from "@refinedev/mui";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export default function ChecklistsPage() {
  const { dataGridProps } = useDataGrid<Checklist>({ resource: "checklists", hasPagination: false });
  const { data: permissionsData } = usePermissions();
  const permissions = (permissionsData as string[]) ?? [];
  const isAdmin = permissions.includes("admin");
  const { show, edit } = useNavigation();
  const { mutate: deleteChecklist } = useDelete();

  const [confirmDelete, setConfirmDelete] = React.useState<{ open: boolean; id?: number; name?: string; loading?: boolean }>({ open: false });

  const columns: GridColDef<Checklist>[] = [
    { field: "title", headerName: "Title", flex: 1.2, minWidth: 180 },
    {
      field: "scope",
      headerName: "Scope",
      flex: 0.6,
      minWidth: 120,
      valueFormatter: (value) => {
        const s = String(value ?? "");
        return s
          .split("_")
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
          .join(" ");
      },
    },
    {
      field: "active",
      headerName: "Active",
      type: "boolean",
      flex: 0.5,
      minWidth: 100
    },
    {
      field: "itemsCount",
      headerName: "Items",
      flex: 0.4,
      minWidth: 100,
      valueGetter: (_v, row) => (row.items ? row.items.length : 0),
      sortComparator: (a, b) => Number(a) - Number(b),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const r = params.row as Checklist;
        return (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" height={"100%"}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => show("checklists", r.id)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => edit("checklists", r.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => setConfirmDelete({ open: true, id: r.id, name: r.title, loading: false })}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <List
      canCreate={isAdmin}
      title="Checklist List"
      headerButtons={isAdmin ? <CreateButton /> : undefined}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        paginationMode="client"
        sortingMode="client"
        hideFooterSelectedRowCount
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Checklist"
        description={<>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</>}
        confirmText="Delete"
        confirmColor="error"
        loading={!!confirmDelete.loading}
        onClose={() => setConfirmDelete({ open: false })}
        onConfirm={() => {
          if (!confirmDelete.id) return;
          setConfirmDelete((p) => ({ ...p, loading: true }));
          deleteChecklist(
            { resource: "checklists", id: confirmDelete.id },
            { onSettled: () => setConfirmDelete({ open: false }) },
          );
        }}
      />
    </List>
  );
}
