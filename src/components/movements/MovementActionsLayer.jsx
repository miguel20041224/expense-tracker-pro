import { EditMovementModal } from './EditMovementModal'
import { DeleteMovementDialog } from './DeleteMovementDialog'

export function MovementActionsLayer({
  editingTransaction,
  deletingTransaction,
  onCloseEdit,
  onCloseDelete,
  onSaveEdit,
  onConfirmDelete,
}) {
  return (
    <>
      <EditMovementModal
        transaction={editingTransaction}
        open={Boolean(editingTransaction)}
        onClose={onCloseEdit}
        onSave={onSaveEdit}
      />
      <DeleteMovementDialog
        transaction={deletingTransaction}
        open={Boolean(deletingTransaction)}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
