#include <iostream>
#include <string>
using namespace std;

int getNum()
{
  int num;
  cout << "Please provide a number between 100 and 120: ";
  cin >> num;
  return num;
}

int main()
{
  string instructor, name, food, adjective, color, animal;
  int number = 0;

  cout << "Please provide your instructor's first or last name: ";
  cin >> instructor;

  cout << "Please provide your name: ";
  cin >> name;

  cout << "Please provide a food item: ";
  cin >> food;

  cout << "Please provide an adjective: ";
  cin >> adjective;

  cout << "Please provide a color: ";
  cin >> color;

  cout << "Please provide an animal: ";
  cin >> animal;
  
  number = getNum();
  
  while (100 > number || number > 120) {
    cout << "Number provided outside of specified range. Please try again." << endl;
    number = getNum();
  }

  cout << "Dear Instructor " << instructor << endl << endl << "I am sorry that I am unable to turn in my homework at this time.  First, I ate a rotten " << food << " , which made me turn " << color << " and extremely ill.  I came down with a fever of " << number << ".  Next, my " << adjective << " pet " << animal << " must have smelled the remains of the " << food << " on my homework, because he ate it.  I am currently rewriting my homework and hope you will accept it late." << endl << endl << "Sincerely," << endl << endl << name << endl;

  return 0;
}
