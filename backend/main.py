# import time

# class Calculator: 
#   a = 20
#   b = 30
#   def __init__(self):
#     print("This is a constructor")
#     self.x = self.a
#     self.y =  self.b

#   def add(self):
#     return (self.a or self.x) + (self.b or self.y)

#   def sub(self):
#     return (self.a or self.x) - (self.b or self.y)

#   def mul(self):
#     return (self.a or self.x) * (self.b or self.y)

#   def div(self):
#     return (self.a or self.x) / (self.b or self.y)

#   def __repr__(self):
#     return "Calculator is a class"

#   def swapVariables(self): 
#      self.x, self.y = self.y, self.x
#      print(self.x, self.y)
#      return "Values have been swapped"

#   def getDefaults(self):
#     return self.a, self.b

#   def resetDefaults(self):
#     self.a = 10
#     self.b = 20
#     return "Default values have been reset"

# # class Calculator2(Calculator):
# #   def __init__(self):
# #    super().__init__()
# #    print("This is a second constructor")


# calc = Calculator()
# # clac2 = Calculator2()
# # print(motapa)
# if type(calc) is Calculator:
#   print("yes this is calculator object")

# str1 = "Welcome Pythoneers"
# print(str1.istitle())

# tup = (1, 2, 4, "Yahoo", True, 8.90, "Hello")
# tip2 = tup[0:3]

# print(tup)
# print(tip2)

# while True:
#   print("\nChoose an operation:")
#   print("1. Addition")
#   print("2. Subtraction")
#   print("3. Multiplication")
#   print("4. Division")
#   print("5. Exit")

#   choice = input("Enter your choice (1-5): ")

#   if choice == "5" or choice ==  "6":
#       print("Exiting the calculator. Goodbye!")
#       break

#   # Take input for a and b and logic for exit the calculator
#   calc.a = int(input("Enter value for a: "))
#   calc.b = int(input("Enter value for b: "))

#   if choice == "1":
#       print(f"Result: {calc.add()}")
#   elif choice == "2":
#       print(f"Result: {calc.sub()}")
#   elif choice == "3":
#       print(f"Result: {calc.mul()}")
#   elif choice == "4":
#       print(f"Result: {calc.div()}")
#   else:
#       print("Invalid choice. Please select a valid operation.")

# from library_management_system.models import LibrarySystem
          
# def main():
#   library = LibrarySystem()
#   book1 = library.addBook(1, "The Great Gatsby", "F. Scott Fitzgerald", 5)
#   print(book1)
#   member1 = library.addMember("John Doe", "tugrp@example.com")
#   print(member1)
#   print(library.borrowBook(1, 1))
#   # print(library.borrowBook(1, 1))
#   print(library.returnBook(1, 1))

# if __name__ == "__main__":
#   main()


# # exception handling in python 

# a = input("Enter a number: ")

# print(f"Multiplication table of {a} is: ")
# try:
#   for i in range(1, 11):
#     print(f"{int(a)} X {i} = {int(a)*i}")

# except Exception as e:
#   print("Invalid Input!", e)

# print("End of program")

# try:
#   num = input("Enter a number: ")
#   a = [6, 3]
#   print(a[int(num)])

# except ValueError:
#   print("Number entered is not an integer.") 

# except IndexError:
#   print("Index Error")

# finally:
#   print("ye wala chalega hi")

# # raising errors using oops 
# class EmpError(Exception):
#   def __init__(self, message):
#     super().__init__(f"employee cant be dead: {message}")
    
# class InsufficientAmountError(Exception):
#   def  __init__(self,balance,  amount):
#     super().__init__(f"Amount cannot be negative:  {balance - amount}")


# class NegitiveError(Exception):
#     def __init__(self, amount):
#       super().__init__(f"Negative value entered{amount}")

# class BankAccount:
#   def __init__(self, bName, bAccountNumber, initialAmount =0):
#     self.bName = bName 
#     self.bAccountNumber = bAccountNumber
#     self.bBalance = initialAmount

#   def deposit(self, amount):
#     if amount < 0:
#         raise NegitiveError(amount)
#     self.bBalance += amount
#     print(f"Deposited {amount}. New balance is {self.bBalance}.")

#   def withdraw(self, amount):
#     if amount < 0:
#       raise NegitiveError(amount)
#     if amount > self.bBalance:
#       raise InsufficientAmountError(self.bBalance, amount)
#     self.bBalance -= amount
#     print(f"Withdrew {amount}. New balance is {self.bBalance}.")

# # create an instance of BankAccount

# bank = BankAccount("XYZ Bank", "1234567890", 1000)
# # deposit money
# bank.deposit(500)
# # withdraw money
# bank.withdraw(200)
# bank.withdraw(400)
# # bank.withdraw(1000)


# # shorthand if else statements 
# a = 330
# b = 3302
# print("A") if a > b else print("=") if a == b else print("B")

# # map, filter and reduce functions in python

# # map function
# def cube(x):
#   return x*x*x

# print(cube(2))

# l = [1, 2, 4, 6, 4, 3]

# newList = list(map(cube, l))
# print(newList)

# # filter function
# def filter_function(a):
#   return a>2

# newnewList = list(filter(filter_function, l))
# print(newnewList)

# # reduce function
# from functools import reduce
# numbers = [1, 2, 3, 4, 5]
# def mysum(x, y):
#   return x + y

# sum = reduce(mysum, numbers)
# print(sum)


# # dunder methods in python
# class Employee:
#   def __init__(self, name):
#     self.name = name

#   def __len__(self):
#     i = 0
#     for c in self.name:
#       i = i + 1
#     return i

#   def displayEmployee(self, message):
#     if(self.name == "Harry"):
#       raise EmpError(message)
      

#   def __str__(self):
#     return f"The name of the employee is {self.name}"

#   def __repr__(self):
#     return f"The name of the employee is {self.name} repr"

#   def __call__(self):
#     print("This is a call method")


# e = Employee("Harry1")
# print(e.displayEmployee(message="This is a message"))
# print(e.name)
# print(e)


# #walrus operator 
# a = True

# print(a:=False)

# foods = list()

# while (food := input("What food do you like?: ") != "quit"):
#   foods.append(food)



import uvicorn
from library_management_systemm.api import app

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)