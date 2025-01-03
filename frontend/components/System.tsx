"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, PlusCircle, ArrowLeftRight, Book } from 'lucide-react';

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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [transactionType, setTransactionType] = useState<'borrow' | 'return' | null>(null);

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
    try {
      await borrowBook(bookId, memberId);
      const [updatedBooks, updatedMembers] = await Promise.all([fetchBooks(), fetchMembers()]);
      setBooks(updatedBooks);
      setMembers(updatedMembers);
      setSelectedBook(null);
      setSelectedMember(null);
      setTransactionType(null);
    } catch (error) {
      console.error('Error borrowing book:', error);
      setError('Failed to borrow book. Please try again.');
    }
  };

  const handleReturn = async (bookId: number, memberId: number) => {
    try {
      const result = await returnBook(bookId, memberId);
      const [updatedBooks, updatedMembers] = await Promise.all([fetchBooks(), fetchMembers()]);
      setBooks(updatedBooks);
      setMembers(updatedMembers);
      setSelectedBook(null);
      setSelectedMember(null);
      setTransactionType(null);
      if (result.fineAmount > 0) {
        setError(`Book returned successfully. Fine amount: $${result.fineAmount}`);
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setError('Failed to return book. Please try again.');
    }
  };

  const BookTransaction: React.FC = () => {
    if (!selectedBook || !transactionType) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {transactionType === 'borrow' ? 'Borrow Book' : 'Return Book'}
          </h3>
        </CardHeader>
        <CardContent>
          <p>Selected Book: {selectedBook.title}</p>
          <select
            className="mt-2 w-full p-2 border rounded"
            value={selectedMember ? selectedMember.id : ''}
            onChange={(e) => {
              const member = members.find(m => m.id === parseInt(e.target.value));
              setSelectedMember(member || null);
            }}
          >
            <option value="">Select a member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              if (selectedMember) {
                if (transactionType === 'borrow') {
                  handleBorrow(selectedBook.book_id, selectedMember.id);
                } else {
                  handleReturn(selectedBook.book_id, selectedMember.id);
                }
              }
            }}
            disabled={!selectedMember}
          >
            {transactionType === 'borrow' ? 'Confirm Borrow' : 'Confirm Return'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold flex items-center">
            <Book className="mr-2" /> Library Management System
            {/* <Book /> */}
          </h1>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-6 p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="books" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                <TabsTrigger value="books" className="flex items-center"><BookOpen className="mr-2" /> Books</TabsTrigger>
                <TabsTrigger value="members" className="flex items-center"><Users className="mr-2" /> Members</TabsTrigger>
              </TabsList>

              <TabsContent value="books" className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center"><PlusCircle className="mr-2" /> Add New Book</h2>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddBook} className="space-y-4">
                      <Input
                        placeholder="Title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      />
                      <Input
                        placeholder="Author"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Total Copies"
                        value={newBook.total_copies}
                        onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })}
                      />
                      <Button type="submit" className="w-full">Add Book</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center"><BookOpen className="mr-2" /> Book Inventory</h2>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {books.map((book) => (
                          <Card key={book.book_id} className="p-4">
                            <h3 className="font-semibold text-lg">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">Author: {book.author}</p>
                            <div className="flex justify-between items-center mt-2">
                              <Badge variant={book.available_copies > 0 ? "outline" : "destructive"}>
                                Available: {book.available_copies}/{book.total_copies}
                              </Badge>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mr-2"
                                  onClick={() => {
                                    setSelectedBook(book);
                                    setTransactionType('borrow');
                                  }}
                                  disabled={book.available_copies === 0}
                                >
                                  Borrow
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBook(book);
                                    setTransactionType('return');
                                  }}
                                  disabled={book.available_copies === book.total_copies}
                                >
                                  Return
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <BookTransaction />
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center"><PlusCircle className="mr-2" /> Add New Member</h2>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddMember} className="space-y-4">
                      <Input
                        placeholder="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      />
                      <Button type="submit" className="w-full">Add Member</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center"><Users className="mr-2" /> Member List</h2>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {members.map((member) => (
                          <Card key={member.id} className="p-4">
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">Email: {member.email}</p>
                            <div className="flex justify-between items-center mt-2">
                              <Badge variant={member.fine_amount > 0 ? "destructive" : "secondary"}>
                                Fine: ${member.fine_amount.toFixed(2)}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <h4 className="font-semibold">Borrowed Books:</h4>
                              <ul className="list-disc list-inside">
                                {member.borrowed_books.map((bookId) => {
                                  const book = books.find(b => b.book_id === bookId);
                                  return book ? <li key={bookId}>{book.title}</li> : null;
                                })}
                              </ul>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryManagement;