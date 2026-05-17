import { EditMovementModal } from './EditMovementModal'
import { DeleteMovementDialog } from './DeleteMovementDialog'

export function MovementActionsLayer({
  editingTransaction,
  deletingTransaction,
  onCloseEdit,
  onCloseDelete,
  onSaveEdit,
  onConfirmDelete,
  creditCards = [],
}) {
  return (
    <>
      <EditMovementModal
        transaction={editingTransaction}
        open={Boolean(editingTransaction)}
        onClose={onCloseEdit}
        onSave={onSaveEdit}
        creditCards={creditCards}
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
