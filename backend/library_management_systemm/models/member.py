from typing import List
# member to store a member
class Member:
  def __init__(self, id: int, name: str, email: str):
    self.id = id
    self.name = name
    self.email = email
    self.borrowedBooks: List[int] = []
    self.fineAmount: float = 0.0

  def __str__(self):
    return f"{self.name} ({self.email})"

  # def heloFun(self):
    # print("Hello from member")