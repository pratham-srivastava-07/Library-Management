from datetime import datetime, timedelta
from time import sleep
# store a transaction on the reception 
class Transaction:
  def __init__(self, bookId: int, transactionType: str, memberId: int, borrowDate: datetime):
    self.bookId = bookId
    self.memberId = memberId
    self.borrowDate = borrowDate
    self.returnDate = None
    self.transactionType = transactionType
    self.transactionDate = datetime.now()
    self.dueDate = self.transactionDate + timedelta(days=14) if transactionType == "borrow" else None

  def isOverdue(self) -> bool:
    if self.transactionType == "borrow" and self.dueDate:
        return datetime.now() > self.dueDate
    return True    