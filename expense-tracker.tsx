import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ExpenseTracker = () => {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment'
  ]);

  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const addIncome = () => {
    if (newIncome.source && newIncome.amount) {
      setIncome([
        ...income, 
        { 
          ...newIncome, 
          amount: parseFloat(newIncome.amount),
          id: Date.now() 
        }
      ]);
      setNewIncome({ source: '', amount: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const addExpense = () => {
    if (newExpense.category && newExpense.amount) {
      setExpenses([
        ...expenses, 
        { 
          ...newExpense, 
          amount: parseFloat(newExpense.amount),
          id: Date.now() 
        }
      ]);
      setNewExpense({ 
        category: '', 
        amount: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0] 
      });
    }
  };

  const calculateTotalIncome = () => 
    income.reduce((total, item) => total + item.amount, 0);

  const calculateTotalExpenses = () => 
    expenses.reduce((total, item) => total + item.amount, 0);

  const getCategoryExpenses = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      
      {/* Income Section */}
      <Card>
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input 
              placeholder="Income Source" 
              value={newIncome.source}
              onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
            />
            <Input 
              type="number" 
              placeholder="Amount" 
              value={newIncome.amount}
              onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
            />
            <Input 
              type="date" 
              value={newIncome.date}
              onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
            />
            <Button onClick={addIncome}>Add Income</Button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Source</th>
                <th className="border p-2 text-left">Amount</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {income.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">{item.source}</td>
                  <td className="border p-2">${item.amount.toFixed(2)}</td>
                  <td className="border p-2">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Select 
              value={newExpense.category}
              onValueChange={(value) => setNewExpense({...newExpense, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              placeholder="Amount" 
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            />
            <Input 
              placeholder="Description" 
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
            <Input 
              type="date" 
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
            />
            <Button onClick={addExpense}>Add Expense</Button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Amount</th>
                <th className="border p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">${item.amount.toFixed(2)}</td>
                  <td className="border p-2">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold">Total Income</h3>
                <p className="text-2xl">${calculateTotalIncome().toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-2xl">${calculateTotalExpenses().toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold">Net Balance</h3>
                <p className="text-2xl">
                  ${(calculateTotalIncome() - calculateTotalExpenses()).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Expense Category Chart */}
          <div className="mt-4" style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getCategoryExpenses()}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add New Category</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input 
                id="category" 
                className="col-span-3" 
                placeholder="Enter category name"
                value={categories[categories.length - 1]}
                onChange={(e) => {
                  const newCategories = [...categories];
                  newCategories[newCategories.length - 1] = e.target.value;
                  setCategories(newCategories);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;
