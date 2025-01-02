# models/book.py
# from datetime import datetime
from typing import List
# book class for the structure of storing a book
class Book:
    def __init__(self, bookId: int, title: str, author: str, totalCopies: int):
        self.bookId = bookId
        self.title = title
        self.author = author
        self.totalCopies = totalCopies # total copies 
        self.availableCopies = totalCopies # available copies initialized to total number
        self.borrowedBy: List[int] = [] # how many people borrowed this book

    def __str__(self):
        return f"{self.title} by {self.author} ({self.availableCopies}/{self.totalCopies} available)"


book1 = Book(1, "The Great Gatsby", "F. Scott Fitzgerald", 5)