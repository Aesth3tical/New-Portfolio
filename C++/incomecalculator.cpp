#include <iostream>
#include <string>
#include <math.h>

/*
  Dan Perkins
  January 17th, 2023
  Program to calculate income, pre and post-tax, as well as spending and investments
*/

using namespace std;

int main()
{
  float
    wage,
    incomeTax = .14,
    clothesFund = .1,
    schoolFund = .01,
    bondsFund = .25,
    parentsBondsFund = .5,
    pretaxIncome,
    posttaxIncome;
  int
    weeks = 5,
    hours;

  cout << "What is your hourly wage? ";
  cin >> wage;

  cout << "How many hours did you work per week? ";
  cin >> hours;

  hours = weeks * hours;

  // Outputs pre-tax income
  pretaxIncome = hours * wage;
  cout << "Pre-tax Income: " << pretaxIncome << "\n";

  // Outputs post-tax income
  posttaxIncome = pretaxIncome - (incomeTax * pretaxIncome);
  cout << "Post-tax Income: " << posttaxIncome << "\n";

  // Calculates amount spent on clothing and school supplies
  clothesFund = posttaxIncome * clothesFund;
  schoolFund = posttaxIncome * schoolFund;
  posttaxIncome = posttaxIncome - (clothesFund + schoolFund);

  cout << "Amount spent on Clothes: " << clothesFund << "\n";
  cout << "Amount spent on School Supplies: " << schoolFund << "\n";
  cout << "Amount remaining: " << posttaxIncome << "\n";

  // Calculates amount you and your parents spend on savings bonds combined
  bondsFund = posttaxIncome * bondsFund;
  parentsBondsFund = floor(bondsFund) * parentsBondsFund;
  posttaxIncome = posttaxIncome - bondsFund;
  
  cout << "Amount YOU spent on Bonds: " << bondsFund << "\n";
  cout << "Amount your PARENTS spent on Bonds: " << parentsBondsFund << "\n\n";

  // Outputs your remaining funds
  cout << "Amount remaining: " << posttaxIncome << "\n";

  return 0;
}
