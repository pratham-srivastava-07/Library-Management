from typing import List, Dict, Optional
from datetime import datetime
from .book import Book
from .member import Member
from .transaction import Transaction

class LibrarySystem:
  def __init__(self):
    self.books: Dict[int, Book] = {}
    self.members: Dict[int, Member] = {}
    self.transactions: List[Transaction] = []
    self.fineRate = 1.0 # fine rate when exceeded 1 day extra
  # func to add a book to library 
  def addBook(self, bookId: int, title: str, author: str, totalCopies: int) -> Book:
    bookId = len(self.books)+1
    book = Book(bookId, title, author, totalCopies)
    self.books[bookId] = book
    return book
  #func to add a member in the library
  def addMember(self, name: str, email:str) -> Member:
    memberId = len(self.members)+1
    member = Member(memberId, name, email)
    self.members[memberId] = member
    return member
  #function to borrow a book
  def borrowBook(self, bookId: int, memberId: int) -> bool:
    #chk if book is available and not assigned to a memberId 
    if bookId not in self.books or memberId not in self.members:
      return False
    # map over the book and check if it is available
    book = self.books[bookId]
    member = self.members[memberId]
    # availableCpoies shouldnot be 0 and member should have atmost 3 books borrowed
    if (book.availableCopies == 0 or len(member.borrowedBooks) >= 3 or bookId in member.borrowedBooks):
      return False
    # if book is available and not assigned to a memberId, then assign the book to the member
    book.availableCopies -= 1
    book.borrowedBy.append(memberId)
    member.borrowedBooks.append(bookId)
    # make a transaction with the book and member
    transaction = Transaction(bookId, "borrow", memberId, datetime.now())
    self.transactions.append(transaction)
    # if book is borrowed then return true
    return True

  # function to return a book
  def returnBook(self, bookId: int, memberId: int) -> float:
    # if either book or member is not registered in library
    if  bookId not in self.books or memberId not in self.members: 
      return -1.0
      
    # extract book by id and member by id 
    book = self.books[bookId]
    member = self.members[memberId]
    
    # if book is not borrowed by the member then return -1
    if bookId not in member.borrowedBooks:
      return -1.0
      
    # logic for fineAmount
    fine = self.calculateFine(bookId, memberId)
    
    # if book is being returned by member after the given time period 
    book.availableCopies += 1
    member.borrowedBooks.remove(bookId)
    member.fineAmount += fine
   
    # if book is borrowed and is returned during the time period, then no fine amount 
    if book.availableCopies < book.totalCopies:
      book.availableCopies += 1
      book.borrowedBy.remove(memberId)
      member.borrowedBooks.remove(bookId)
      transaction = Transaction(bookId, "return", memberId, datetime.now())
      self.transactions.append(transaction)
      return 0.0
    return 0.0
      
  def calculateFine(self, bookId: int, memberId: int) -> float:
    # overdueBooks = []
    for transaction in self.transactions:
      if(transaction.bookId == bookId and transaction.memberId == memberId and transaction.transactionType == "borrow"):
        if transaction.isOverdue and transaction.dueDate:
          daysOverdue = (datetime.now() - transaction.dueDate).days
          return max(0, daysOverdue * self.fineRate)
        break
    return 0.0