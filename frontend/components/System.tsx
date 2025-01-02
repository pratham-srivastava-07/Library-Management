"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TypeScript interfaces
interface Book {
  book_id: number;
  title: string;
  author: string;
  total_copies: number;
  available_copies: number;
  borrowed_by: number[];
}

interface Member {
  id: number;
  name: string;
  email: string;
  borrowed_books: number[];
  fine_amount: number;
}

interface BookData {
  title: string;
  author: string;
  total_copies: number;
}

interface MemberData {
  name: string;
  email: string;
}

// API client functions
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-replit-backend-url.repl.co'  // Replace with your actual Replit URL
  : 'http://localhost:8000';

const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}/books/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

const fetchMembers = async (): Promise<Member[]> => {
  try {
    const response = await fetch(`${API_URL}/members/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

const addBook = async (bookData: BookData): Promise<Book> => {
  const response = await fetch(`${API_URL}/books/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  return response.json();
};

const addMember = async (memberData: MemberData): Promise<Member> => {
  const response = await fetch(`${API_URL}/members/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  return response.json();
};

const borrowBook = async (bookId: number, memberId: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/books/${bookId}/borrow/${memberId}`, {
    method: 'POST',
  });
  return response.json();
};

const returnBook = async (bookId: number, memberId: number): Promise<{ message: string; fineAmount: number }> => {
  const response = await fetch(`${API_URL}/books/${bookId}/return/${memberId}`, {
    method: 'POST',
  });
  return response.json();
};

const LibraryManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newBook, setNewBook] = useState<BookData>({ title: '', author: '', total_copies: 1 });
  const [newMember, setNewMember] = useState<MemberData>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const [booksData, membersData] = await Promise.all([
          fetchBooks(),
          fetchMembers(),
        ]);
        setBooks(booksData);
        setMembers(membersData);
      } catch (err) {
        setError('Failed to load data. Please ensure the backend server is running.');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const book = await addBook(newBook);
    setBooks([...books, book]);
    setNewBook({ title: '', author: '', total_copies: 1 });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const member = await addMember(newMember);
    setMembers([...members, member]);
    setNewMember({ name: '', email: '' });
  };

  const handleBorrow = async (bookId: number, memberId: number) => {
    await borrowBook(bookId, memberId);
    const updatedBooks = await fetchBooks();
    setBooks(updatedBooks);
  };

  const handleReturn = async (bookId: number, memberId: number) => {
    await returnBook(bookId, memberId);
    const updatedBooks = await fetchBooks();
    setBooks(updatedBooks);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Library Management System</h1>
      
      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Add New Book</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBook} className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={newBook.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewBook({ ...newBook, title: e.target.value })}
                  />
                  <Input
                    placeholder="Author"
                    value={newBook.author}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewBook({ ...newBook, author: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Total Copies"
                    value={newBook.total_copies}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })}
                  />
                  <Button type="submit">Add Book</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Add New Member</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <Input
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewMember({ ...newMember, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newMember.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setNewMember({ ...newMember, email: e.target.value })}
                  />
                  <Button type="submit">Add Member</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Books</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {books.map((book) => (
                    <div key={book.book_id} className="p-4 border rounded">
                      <h3 className="font-semibold">{book.title}</h3>
                      <p>Author: {book.author}</p>
                      <p>Available: {book.available_copies}/{book.total_copies}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Members</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="p-4 border rounded">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p>Email: {member.email}</p>
                      <p>Fine Amount: ${member.fine_amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default LibraryManagement;

