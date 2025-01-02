# models/__init__.py

# Import main classes to make them available directly from the models package
from .book import Book
from .member import Member
from .transaction import Transaction
from .librarySystem import LibrarySystem
# You can define __all__ to specify what gets imported with "from models import *"
__all__ = ['Book', 'Member', 'Transaction', 'LibrarySystem']

# Optional: Package metadata
__version__ = '1.0.0'
__author__ = 'Your Name'

# Optional: You could add convenience functions
def create_book(book_id: int, title: str, author: str, total_copies: int) -> Book:
    """Convenience function to create a new book"""
    return Book(book_id, title, author, total_copies)

def create_member(member_id: int, name: str, email: str) -> Member:
    """Convenience function to create a new member"""
    return Member(member_id, name, email)