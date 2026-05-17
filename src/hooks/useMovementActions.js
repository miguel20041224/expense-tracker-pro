import { useCallback, useState } from 'react'
import { canMutateTransaction } from '../utils/transactionMutations'

export function useMovementActions({ updateTransaction, deleteTransaction }) {
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)

  const openEdit = useCallback((transaction) => {
    if (!canMutateTransaction(transaction)) return
    setDeletingTransaction(null)
    setEditingTransaction(transaction)
  }, [])

  const openDelete = useCallback((transaction) => {
    if (!canMutateTransaction(transaction)) return
    setEditingTransaction(null)
    setDeletingTransaction(transaction)
  }, [])

  const closeEdit = useCallback(() => setEditingTransaction(null), [])
  const closeDelete = useCallback(() => setDeletingTransaction(null), [])

  const handleSaveEdit = useCallback(
    (id, payload) => {
      updateTransaction(id, payload)
      setEditingTransaction(null)
    },
    [updateTransaction],
  )

  const handleConfirmDelete = useCallback(
    (id) => {
      deleteTransaction(id)
      setDeletingTransaction(null)
    },
    [deleteTransaction],
  )

  return {
    editingTransaction,
    deletingTransaction,
    openEdit,
    openDelete,
    closeEdit,
    closeDelete,
    handleSaveEdit,
    handleConfirmDelete,
    movementHandlers: {
      onEdit: openEdit,
      onDelete: openDelete,
    },
  }
}
