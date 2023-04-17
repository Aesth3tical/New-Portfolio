#include <string>
#include <iostream>

/*
  Dan Perkins
  January 17th, 2023
  Program to manage members of a book store, including their name, ID, books bought, and amount spent on books
*/

class memberType {
    private:
        std::string firstName;
        std::string lastName;
        int memberID;
        int booksBought;
        double amountSpent;

    public:
        // Constructors
        memberType() {
            firstName = "";
            lastName = "";
            memberID = 0;
            booksBought = 0;
            amountSpent = 0.0;
        }

        memberType(std::string first, std::string last, int id, int books, double amount) {
            firstName = first;
            lastName = last;
            memberID = id;
            booksBought = books;
            amountSpent = amount;
        }

        // Getters
        std::string getFirstName() const {
            return firstName;
        }

        std::string getLastName() const {
            return lastName;
        }

        int getMemberID() const {
            return memberID;
        }

        int getBooksBought() const {
            return booksBought;
        }

        double getAmountSpent() const {
            return amountSpent;
        }

        // Setters
        void setFirstName(std::string first) {
            firstName = first;
        }

        void setLastName(std::string last) {
            lastName = last;
        }

        void setMemberID(int id) {
            memberID = id;
        }

        void setBooksBought(int books) {
            booksBought = books;
        }

        void setAmountSpent(double amount) {
            amountSpent = amount;
        }

        // Operations
        void modifyName(std::string fName, std::string lName) {
            firstName = fName;
            lastName = lName;
        }

        void modifyBooksBought(int books) {
            booksBought = books;
        }

        void modifyAmountSpent(double amount) {
            amountSpent = amount;
        }

        void showInfo() const {
            std::cout << "First Name: " << firstName << std::endl;
            std::cout << "Last Name: " << lastName << std::endl;
            std::cout << "Member ID: " << memberID << std::endl;
            std::cout << "Books Bought: " << booksBought << std::endl;
            std::cout << "Amount Spent: " << amountSpent << std::endl;
        }
};

int main() {
    memberType members[10];

    for (int i = 0; i < 10; i++) {
        members[i].setFirstName("John");
        members[i].setLastName("Doe");
        members[i].setMemberID(i+1);
        members[i].setBooksBought(i);
        members[i].setAmountSpent(100.0 * (i+1));
        members[i].showInfo();
    }

    for (int i = 0; i < 10; i++) {
        std::cout << "Member " << i << ":" << std::endl;
        members[i].showInfo();
        std::cout << std::endl;
    }

    return 0;
}