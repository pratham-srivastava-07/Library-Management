from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import LibrarySystem
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

    # Pydantic models for request/response validation
class BookCreate(BaseModel):
        title: str
        author: str
        total_copies: int

class MemberCreate(BaseModel):
        name: str
        email: str

class BookResponse(BaseModel):
        book_id: int
        title: str
        author: str
        total_copies: int
        available_copies: int
        borrowed_by: List[int]

class MemberResponse(BaseModel):
        id: int
        name: str
        email: str
        borrowed_books: List[int]
        fine_amount: float

    # Initialize FastAPI and Library System
app = FastAPI()

    # Creating a single instance of LibrarySystem 
library = LibrarySystem()

@app.get("/")
async def root():
    return {
        "message": "Library Management System API",
        "version": "1.0",
        "endpoints": {
            "books": "/books/",
            "members": "/members/",
            "borrow": "/books/{book_id}/borrow/{member_id}",
            "return": "/books/{book_id}/return/{member_id}"
        }
    }
    
    # Add some initial data
@app.on_event("startup")
async def startup_event():
        # Add sample books and members
        library.addBook(1, "The Great Gatsby", "F. Scott Fitzgerald", 5)
        library.addBook(2, "To Kill a Mockingbird", "Harper Lee", 3)
        library.addMember("John Doe", "john@example.com")
        library.addMember("Jane Smith", "jane@example.com")

    # Configure CORS
app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Your Next.js frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rest of your API routes remain the same
@app.post("/books/", response_model=BookResponse)
async def create_book(book: BookCreate):
        new_book = library.addBook(
            bookId=None,  # ID is auto-generated
            title=book.title,
            author=book.author,
            totalCopies=book.total_copies
        )
        return BookResponse(
            book_id=new_book.bookId,
            title=new_book.title,
            author=new_book.author,
            total_copies=new_book.totalCopies,
            available_copies=new_book.availableCopies,
            borrowed_by=new_book.borrowedBy
        )

@app.get("/books/", response_model=List[BookResponse])
async def get_books():
        return [
            BookResponse(
                book_id=book.bookId,
                title=book.title,
                author=book.author,
                total_copies=book.totalCopies,
                available_copies=book.availableCopies,
                borrowed_by=book.borrowedBy
            )
            for book in library.books.values()
        ]

@app.get("/members/", response_model=List[MemberResponse])
async def get_members():
        return [
            MemberResponse(
                id=member.id,
                name=member.name,
                email=member.email,
                borrowed_books=member.borrowedBooks,
                fine_amount=member.fineAmount
            )
            for member in library.members.values()
        ]

@app.post("/members/", response_model=MemberResponse)
async def create_member(member: MemberCreate):
        new_member = library.addMember(
            name=member.name,
            email=member.email
        )
        return MemberResponse(
            id=new_member.id,
            name=new_member.name,
            email=new_member.email,
            borrowed_books=new_member.borrowedBooks,
            fine_amount=new_member.fineAmount
        )

@app.post("/books/{book_id}/borrow/{member_id}")
async def borrow_book(book_id: int, member_id: int):
        success = library.borrowBook(book_id, member_id)
        if not success:
            raise HTTPException(status_code=400, detail="Unable to borrow book")
        return {"message": "Book borrowed successfully"}

@app.post("/books/{book_id}/return/{member_id}")
async def return_book(book_id: int, member_id: int):
        fine = library.returnBook(book_id, member_id)
        if fine < 0:
            raise HTTPException(status_code=400, detail="Unable to return book")
        return {"message": "Book returned successfully", "fine_amount": fine}