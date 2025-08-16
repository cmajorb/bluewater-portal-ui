import { useState } from "react";
import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, CreateButton, useDataGrid } from "@refinedev/mui";
import { useCreate, useDelete, useUpdate, useCustomMutation } from "@refinedev/core";
import type { Profile } from "../../types";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export default function ProfilesAdmin() {
  const { dataGridProps } = useDataGrid<Profile>({ resource: "profiles", hasPagination: true, initialPageSize: 50 });

  const { mutate: createProfile } = useCreate();
  const { mutate: updateProfile } = useUpdate();
  const { mutate: deleteProfile } = useDelete();
  const { mutate: toggleAdminMutate } = useCustomMutation();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<{ open: boolean; record?: Profile }>({ open: false });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id?: number; name?: string; loading?: boolean }>({ open: false });

  const [newProfile, setNewProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    is_adult: true,
    is_admin: false,
  });

  const handleCreate = () => {
    if (!newProfile.email || !newProfile.first_name || !newProfile.last_name) return;
    createProfile(
      {
        resource: "profiles/create-profile",
        values: newProfile,
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setNewProfile({ email: "", first_name: "", last_name: "", is_adult: true, is_admin: false });
        },
      },
    );
  };

  const handleUpdate = () => {
    if (!editOpen.record) return;
    const r = editOpen.record;
    updateProfile(
      {
        resource: "profiles",
        id: r.id,
        values: r,
      },
      {
        onSuccess: () => setEditOpen({ open: false, record: undefined }),
      },
    );
  };

  const handleRequestDelete = (p: Profile) => setConfirmDelete({ open: true, id: p.id, name: `${p.first_name} ${p.last_name}`, loading: false });

  const handleToggleAdmin = (profileId: number) => {
    toggleAdminMutate(
      {
        method: "patch",
        url: `/profiles/toggle-admin/${profileId}`,
        values: {},
      },
    );
  };

  const columns: GridColDef<Profile>[] = [
    { field: "first_name", headerName: "First Name", flex: 0.8, minWidth: 140 },
    { field: "last_name", headerName: "Last Name", flex: 0.8, minWidth: 140 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 200 },
    {
      field: "is_adult",
      headerName: "Adult",
      type: "boolean",
      flex: 0.5,
      minWidth: 100,
      valueGetter: (_v, row) => Boolean((row as Profile).is_adult),
    },
    {
      field: "is_admin",
      headerName: "Admin",
      type: "boolean",
      flex: 0.5,
      minWidth: 100,
      valueGetter: (_v, row) => Boolean((row as Profile).is_admin),
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
        const p = params.row as Profile;
        return (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" height={'100%'}>
            <IconButton size="small" onClick={() => setEditOpen({ open: true, record: { ...p } })}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => handleRequestDelete(p)}>
              <DeleteIcon color="error" />
            </IconButton>
            <IconButton size="small" onClick={() => handleToggleAdmin(p.id)} title={p.is_admin ? "Revoke admin" : "Make admin"}>
              <AdminPanelSettingsIcon color={p.is_admin ? "primary" : "disabled"} />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <List
      title={<Typography variant="h5">Profile Management</Typography>}
      headerButtons={<CreateButton onClick={() => setCreateOpen(true)} />}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        paginationMode="server"
        sortingMode="server"
        hideFooterSelectedRowCount
      />

      {/* Create profile dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="First Name" value={newProfile.first_name} onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })} size="small" fullWidth />
            <TextField label="Last Name" value={newProfile.last_name} onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })} size="small" fullWidth />
            <TextField label="Email" value={newProfile.email} onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })} size="small" fullWidth />
            <FormControlLabel control={<Checkbox checked={newProfile.is_adult} onChange={(e) => setNewProfile({ ...newProfile, is_adult: e.target.checked })} />} label="Is Adult" />
            <FormControlLabel control={<Checkbox checked={newProfile.is_admin} onChange={(e) => setNewProfile({ ...newProfile, is_admin: e.target.checked })} />} label="Is Admin" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit profile dialog */}
      <Dialog open={editOpen.open} onClose={() => setEditOpen({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="First Name" value={editOpen.record?.first_name ?? ""} onChange={(e) => setEditOpen((prev) => ({ open: true, record: { ...(prev.record as Profile), first_name: e.target.value } }))} size="small" fullWidth />
            <TextField label="Last Name" value={editOpen.record?.last_name ?? ""} onChange={(e) => setEditOpen((prev) => ({ open: true, record: { ...(prev.record as Profile), last_name: e.target.value } }))} size="small" fullWidth />
            <TextField label="Email" value={editOpen.record?.email ?? ""} onChange={(e) => setEditOpen((prev) => ({ open: true, record: { ...(prev.record as Profile), email: e.target.value } }))} size="small" fullWidth />
            <FormControlLabel control={<Checkbox checked={editOpen.record?.is_adult ?? true} onChange={(e) => setEditOpen((prev) => ({ open: true, record: { ...(prev.record as Profile), is_adult: e.target.checked } }))} />} label="Is Adult" />
            <FormControlLabel control={<Checkbox checked={editOpen.record?.is_admin ?? false} onChange={(e) => setEditOpen((prev) => ({ open: true, record: { ...(prev.record as Profile), is_admin: e.target.checked } }))} />} label="Is Admin" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen({ open: false, record: undefined })}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete Profile"
        description={<>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</>}
        confirmText="Delete"
        confirmColor="error"
        loading={!!confirmDelete.loading}
        onClose={() => setConfirmDelete({ open: false })}
        onConfirm={() => {
          if (!confirmDelete.id) return;
          setConfirmDelete((p) => ({ ...p, loading: true }));
          deleteProfile(
            { resource: "profiles", id: confirmDelete.id },
            { onSettled: () => setConfirmDelete({ open: false }) },
          );
        }}
      />
    </List>
  );
}
