const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/UserModel');
const BudgetTable = require("./models/BudgetModel");
const ExpenseTable = require("./models/ExpenseModel");

// Get list of categories
exports.getListCategories = async (req, res) => {
  try {
    const categories = [
      "Entertainment",
      "Shopping",
      "Groceries",
      "Lease",
      "Travel",
      "Pet-Care",
      "Insurance",
      "Protien"
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User sign up
exports.signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1m' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate new token
exports.newToken = async (req, res) => {
  try {
    const token = req.body.token;
    const username = req.body.username;
    const user = await User.findOne({ username });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, 'secret', (err) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      const newToken = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1m' });
      res.json({ token: newToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User logout
exports.logout = async (req, res) => {
  res.send({ message: "success" });
};

// Add a budget
exports.addB = async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    const newBudget = new BudgetTable({ category, amount, month, userId: req.user.userId });
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get budgets
exports.getB = async (req, res) => {
  try {
    const budgets = await BudgetTable.find({ userId: req.user.userId });
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update budget
exports.updateB = async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    const updatedBudget = await BudgetTable.findByIdAndUpdate(req.params.id, { category, amount, month }, { new: true });
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(updatedBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete budget
exports.deleteB = async (req, res) => {
  try {
    const deletedBudget = await BudgetTable.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add an expense
exports.addE = async (req, res) => {
  try {
    const { month, category, amount } = req.body;
    const newExpense = new ExpenseTable({ amount, month, userId: req.user.userId, category });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get expenses
exports.getE = async (req, res) => {
  try {
    const expenses = await ExpenseTable.find({ userId: req.user.userId });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update expense
exports.updateE = async (req, res) => {
  try {
    const { month, category, amount } = req.body;
    const updatedExpense = await ExpenseTable.findByIdAndUpdate(req.params.id, { month, category, amount }, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get monthly expenses
exports.monthly = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userExpenses = await ExpenseTable.find({ userId });
    const monthlyExpenses = userExpenses.reduce((acc, expense) => {
      const { month, category, amount } = expense;
      if (!acc[month]) {
        acc[month] = {};
      }
      if (!acc[month][category]) {
        acc[month][category] = 0;
      }
      acc[month][category] += amount;
      return acc;
    }, {});
    res.json(monthlyExpenses);
  } catch (error) {
    console.error('Error fetching monthly expenses for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete expense
exports.deleteE = async (req, res) => {
  try {
    const deletedExpense = await ExpenseTable.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
