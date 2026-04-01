import AdminModal from './AdminModal'

export default function DeleteConfirmModal({ open, onClose, onConfirm, itemName }) {
  return (
    <AdminModal open={open} onClose={onClose} title="Confirm Delete">
      <p className="text-white/70 mb-6">
        Are you sure you want to delete <span className="text-white font-semibold">{itemName}</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-white/10 text-white/70 hover:bg-white/20 text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </AdminModal>
  )
}
