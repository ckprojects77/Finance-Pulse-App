import { useState } from 'react'
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate, cn } from '../../lib/utils'
import { TransactionModal } from './TransactionModal'

const ITEMS_PER_PAGE = 10

export function TransactionTable() {
  const { filteredTransactions, deleteTransaction, isAdmin } = useApp()
  const [currentPage, setCurrentPage] = useState(1)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    deleteTransaction(id)
    toast.success('Transaction deleted')
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTransaction(null)
  }

  if (filteredTransactions.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <p className="text-muted-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Try adjusting your filters or add a new transaction
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Description
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Type
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Amount
                </th>
                {isAdmin && (
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={cn(
                    'border-b border-border transition-colors hover:bg-muted/30',
                    index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                  )}
                >
                  <td className="p-4 text-sm text-foreground">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="p-4 text-sm text-foreground font-medium">
                    {transaction.description}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                        transaction.type === 'income'
                          ? 'bg-[var(--success)]/10 text-[var(--success)]'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td
                    className={cn(
                      'p-4 text-sm font-semibold text-right',
                      transaction.type === 'income'
                        ? 'text-[var(--success)]'
                        : 'text-destructive'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredTransactions.length)}{' '}
              of {filteredTransactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <TransactionModal
        open={modalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
      />
    </>
  )
}
