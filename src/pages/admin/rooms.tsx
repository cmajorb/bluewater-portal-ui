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
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, CreateButton, useDataGrid } from "@refinedev/mui";
import { useCreate, useDelete, useUpdate } from "@refinedev/core";
import type { Room } from "../../types";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const floors = ["1st", "2nd"];
const bedSizes = [
  "King",
  "Queen",
  "Double",
  "Twin",
  "Bunk",
  "Other",
  "Double Double",
];

export default function RoomsAdmin() {
  const { dataGridProps } = useDataGrid<Room>({ resource: "rooms", hasPagination: false });

  const { mutate: createRoom } = useCreate();
  const { mutate: deleteRoom } = useDelete();
  const { mutate: updateRoom } = useUpdate();

  const [notesOpen, setNotesOpen] = useState<{
    open: boolean;
    text: string;
  }>({ open: false, text: "" });

  const [createOpen, setCreateOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    floor: "1st",
    bed_size: "Queen",
    min_people: "",
    max_people: "",
    notes: "",
  });

  const [editOpen, setEditOpen] = useState<{
    open: boolean;
    record?: Room;
  }>({ open: false });

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id?: number;
    name?: string;
    loading?: boolean;
  }>({ open: false });

  const handleCreate = () => {
    if (!newRoom.name) return;
    createRoom(
      {
        resource: "rooms",
        values: {
          ...newRoom,
          min_people: Number(newRoom.min_people),
          max_people: Number(newRoom.max_people),
        },
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setNewRoom({
            name: "",
            floor: "1st",
            bed_size: "Queen",
            min_people: "",
            max_people: "",
            notes: "",
          });
          // cache invalidation will refresh the grid automatically
        },
      },
    );
  };

  const handleUpdate = () => {
    if (!editOpen.record) return;
    const r = editOpen.record;
    updateRoom(
      {
        resource: "rooms",
        id: r.id,
        values: r,
      },
      {
        onSuccess: () => {
          setEditOpen({ open: false, record: undefined });
        },
      },
    );
  };

  const handleDelete = (id: number, name: string) => {
    setConfirmDelete({ open: true, id, name, loading: false });
  };

  const columns: GridColDef<Room>[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "floor", headerName: "Floor", flex: 0.5, minWidth: 100 },
    { field: "bed_size", headerName: "Bed Size", flex: 0.8, minWidth: 120 },
    {
      field: "occupant_range",
      headerName: "Occupant Range",
      flex: 0.8,
      minWidth: 150,
      valueGetter: (_value, row) => {
        const min = (row as Room).min_people;
        const max = (row as Room).max_people;
        return `${min} - ${max}`;
      },
      sortComparator: (v1, v2) => {
        const [aMinRaw, aMaxRaw] = String(v1).split(" - ");
        const [bMinRaw, bMaxRaw] = String(v2).split(" - ");
        const aMin = Number(aMinRaw ?? 0);
        const bMin = Number(bMinRaw ?? 0);
        if (aMin === bMin) {
          const aMax = Number(aMaxRaw ?? 0);
          const bMax = Number(bMaxRaw ?? 0);
          return aMax - bMax;
        }
        return aMin - bMin;
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      align: "center",
      headerAlign: "center",
      sortable: true,
      filterable: false,
      minWidth: 100,
      renderCell: (params) => {
        const text: string | undefined = (params.row as Room).notes;
        const disabled = !text || text.trim().length === 0;
        return (
          <IconButton
            size="small"
            disabled={disabled}
            onClick={() =>
              setNotesOpen({ open: true, text: text || "" })
            }
          >
            <VisibilityIcon />
          </IconButton>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      renderCell: (params) => (
        <Stack height={'100%'} direction="row" spacing={1} alignItems="center" justifyContent="center">
          <IconButton
            size="small"
            onClick={() =>
              setEditOpen({ open: true, record: { ...(params.row as Room) } })
            }
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              const r = params.row as Room;
              handleDelete(r.id, r.name);
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <List
      title={<Typography variant="h5">Manage Rooms</Typography>}
      headerButtons={
        <CreateButton onClick={() => setCreateOpen(true)} />
      }
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        paginationMode="client"
        sortingMode="client"
        slotProps={{
          baseButton: { size: "small" },
        }}
        hideFooterSelectedRowCount
        hideFooterPagination
        // Hide pagination UI to show all
        slots={{}}
        sx={{
          '& .MuiDataGrid-columnHeaders': { fontWeight: 600 },
        }}
      />

      {/* Notes dialog */}
      <Dialog open={notesOpen.open} onClose={() => setNotesOpen({ open: false, text: "" })} maxWidth="sm" fullWidth>
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <Typography whiteSpace="pre-wrap">{notesOpen.text}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesOpen({ open: false, text: "" })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              size="small"
              fullWidth
            />
            <Select
              fullWidth
              size="small"
              value={newRoom.floor}
              onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value as string })}
            >
              {floors.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </Select>
            <Select
              fullWidth
              size="small"
              value={newRoom.bed_size}
              onChange={(e) => setNewRoom({ ...newRoom, bed_size: e.target.value as string })}
            >
              {bedSizes.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min People"
                type="number"
                value={newRoom.min_people}
                onChange={(e) => setNewRoom({ ...newRoom, min_people: e.target.value })}
                size="small"
                fullWidth
              />
              <TextField
                label="Max People"
                type="number"
                value={newRoom.max_people}
                onChange={(e) => setNewRoom({ ...newRoom, max_people: e.target.value })}
                size="small"
                fullWidth
              />
            </Stack>
            <TextField
              label="Notes"
              value={newRoom.notes}
              onChange={(e) => setNewRoom({ ...newRoom, notes: e.target.value })}
              size="small"
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen.open} onClose={() => setEditOpen({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Room Name"
              value={editOpen.record?.name ?? ""}
              onChange={(e) => setEditOpen((prev) => ({
                open: true,
                record: { ...(prev.record as Room), name: e.target.value },
              }))}
              size="small"
              fullWidth
            />
            <Select
              fullWidth
              size="small"
              value={editOpen.record?.floor ?? "1st"}
              onChange={(e) => setEditOpen((prev) => ({
                open: true,
                record: { ...(prev.record as Room), floor: e.target.value as string },
              }))}
            >
              {floors.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </Select>
            <Select
              fullWidth
              size="small"
              value={editOpen.record?.bed_size ?? "Queen"}
              onChange={(e) => setEditOpen((prev) => ({
                open: true,
                record: { ...(prev.record as Room), bed_size: e.target.value as string },
              }))}
            >
              {bedSizes.map((b) => (
                <MenuItem key={b} value={b}>{b}</MenuItem>
              ))}
            </Select>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Min People"
                type="number"
                value={editOpen.record?.min_people ?? 0}
                onChange={(e) => setEditOpen((prev) => ({
                  open: true,
                  record: { ...(prev.record as Room), min_people: Number(e.target.value) },
                }))}
                size="small"
                fullWidth
              />
              <TextField
                label="Max People"
                type="number"
                value={editOpen.record?.max_people ?? 0}
                onChange={(e) => setEditOpen((prev) => ({
                  open: true,
                  record: { ...(prev.record as Room), max_people: Number(e.target.value) },
                }))}
                size="small"
                fullWidth
              />
            </Stack>
            <TextField
              label="Notes"
              value={editOpen.record?.notes ?? ""}
              onChange={(e) => setEditOpen((prev) => ({
                open: true,
                record: { ...(prev.record as Room), notes: e.target.value },
              }))}
              size="small"
              fullWidth
              multiline
              minRows={3}
            />
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
        title="Delete Room"
        description={
          <>
            Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        confirmColor="error"
        loading={!!confirmDelete.loading}
        onClose={() => setConfirmDelete({ open: false })}
        onConfirm={() => {
          if (!confirmDelete.id) return;
          setConfirmDelete((p) => ({ ...p, loading: true }));
          deleteRoom(
            { resource: "rooms", id: confirmDelete.id },
            {
              onSettled: () => setConfirmDelete({ open: false }),
            },
          );
        }}
      />
    </List>
  );
}
