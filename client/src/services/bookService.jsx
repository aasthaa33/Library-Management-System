import api from "../api";

export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const addBook = async (bookData) => {
  const response = await api.post("/books", bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const borrowBook = async (bookId) => {
  const response = await api.post("/borrow", { bookId });
  return response.data;
};

export const returnBook = async (bookId) => {
  const response = await api.post("/borrow/return", { bookId });
  return response.data;
};

export const getUserBorrows = async () => {
  const response = await api.get("/borrow/my");
  return response.data;
};

export const getAllBorrows = async () => {
  const response = await api.get("/borrow/all");
  return response.data;
};