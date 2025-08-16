import React from "react";
import { Stack, Tooltip, IconButton, TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDelete, usePermissions, useNavigation } from "@refinedev/core";
import type { Task, Tag } from "../../types";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, CreateButton, useDataGrid } from "@refinedev/mui";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { TagSelector } from "../../components/selectors/TagSelector";

export default function TasksPage() {
  const { dataGridProps, setFilters } = useDataGrid<Task>({ resource: "tasks", hasPagination: false });
  const { data: permissionsData } = usePermissions();
  const permissions = (permissionsData as string[]) ?? [];
  const isAdmin = permissions.includes("admin");
  const { show, edit } = useNavigation();
  const { mutate: deleteTask } = useDelete();

  const [confirmDelete, setConfirmDelete] = React.useState<{ open: boolean; id?: number; name?: string; loading?: boolean }>({ open: false });
  const [search, setSearch] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState<Tag[] | undefined>(undefined);

  // Debounced client-side filter for title only
  React.useEffect(() => {
    const t = setTimeout(() => {
      const items: any[] = [];
      if (search) items.push({ field: "title", operator: "contains", value: search });
      const model = { items, linkOperator: "and" } as any;
      dataGridProps.onFilterModelChange?.(model);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Server-side filter for tag_ids as list of ints
  React.useEffect(() => {
    const ids = (tagFilter || []).map((t) => t.id);
    if (ids.length > 0) {
      setFilters?.([
        { field: "tag_ids", operator: "in", value: ids },
      ]);
    } else {
      // clear server-side filters when no tag selected
      setFilters?.([]);
    }
  }, [tagFilter]);

  const columns: GridColDef<Task>[] = [
    { field: "title", headerName: "Title", flex: 1.2, minWidth: 200 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      minWidth: 120,
      valueFormatter: (value) => String(value ?? "")
        .split("_")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" "),
    },
    { field: "start_date", headerName: "Start", flex: 0.6, minWidth: 120 },
    { field: "due_date", headerName: "Due", flex: 0.6, minWidth: 120 },
    { field: "is_public", headerName: "Public", type: "boolean", flex: 0.4, minWidth: 100 },
    {
      field: "profilesCount",
      headerName: "Assignees",
      flex: 0.5,
      minWidth: 120,
      valueGetter: (_v, row) => (row.profiles ? row.profiles.length : 0),
      sortComparator: (a, b) => Number(a) - Number(b),
    },
    {
      field: "tagsCount",
      headerName: "Tags",
      flex: 0.4,
      minWidth: 80,
      valueGetter: (_v, row) => (row.tags ? row.tags.length : 0),
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
        const r = params.row as Task;
        return (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" height={"100%"}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => show("tasks", r.id)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => edit("tasks", r.id)}>
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
      title="Task List"
      headerButtons={isAdmin ? <CreateButton /> : undefined}
    >
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} spacing={1} sx={{ mb: 1 }}>
        <TextField
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { sm: "100%", md: "50%" }, ml: { sm: "auto" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <TagSelector value={tagFilter || []} onChange={setTagFilter} addNewDisabled={true} />
        </Box>
      </Stack>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        paginationMode="client"
        sortingMode="client"
        hideFooterSelectedRowCount
        columnVisibilityModel={{ tagsText: false }}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Task"
        description={<>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</>}
        confirmText="Delete"
        confirmColor="error"
        loading={!!confirmDelete.loading}
        onClose={() => setConfirmDelete({ open: false })}
        onConfirm={() => {
          if (!confirmDelete.id) return;
          setConfirmDelete((p) => ({ ...p, loading: true }));
          deleteTask(
            { resource: "tasks", id: confirmDelete.id },
            { onSettled: () => setConfirmDelete({ open: false }) },
          );
        }}
      />
    </List>
  );
}
