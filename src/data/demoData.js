export const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Salary',
  'Investment',
  'Freelance',
  'Other',
]

export const incomeCategories = ['Salary', 'Investment', 'Freelance', 'Other']
export const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other',
]

export const generateDemoTransactions = () => {
  const transactions = []
  const now = new Date()
  
  const descriptions = {
    'Food & Dining': ['Starbucks Coffee', 'Chipotle', 'Whole Foods', 'DoorDash', 'Restaurant Bill'],
    'Transportation': ['Uber Ride', 'Gas Station', 'Metro Pass', 'Parking Fee', 'Car Wash'],
    'Shopping': ['Amazon Purchase', 'Target', 'Best Buy', 'Nike Store', 'Apple Store'],
    'Entertainment': ['Netflix Subscription', 'Spotify Premium', 'Movie Tickets', 'Concert Tickets', 'Gaming'],
    'Bills & Utilities': ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Rent Payment'],
    'Healthcare': ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Health Insurance', 'Dental Checkup'],
    'Travel': ['Flight Booking', 'Hotel Stay', 'Airbnb', 'Travel Insurance', 'Vacation Package'],
    'Education': ['Online Course', 'Books', 'Tuition Fee', 'Workshop', 'Certification'],
    'Salary': ['Monthly Salary', 'Bonus Payment', 'Commission'],
    'Investment': ['Dividend Income', 'Stock Sale', 'Interest Income', 'Rental Income'],
    'Freelance': ['Client Payment', 'Contract Work', 'Consulting Fee', 'Project Payment'],
    'Other': ['Refund', 'Gift Received', 'Miscellaneous'],
  }
  
  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.7
    const categoryList = isIncome ? incomeCategories : expenseCategories
    const category = categoryList[Math.floor(Math.random() * categoryList.length)]
    const descList = descriptions[category] || ['Transaction']
    const description = descList[Math.floor(Math.random() * descList.length)]
    
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    
    const amount = isIncome 
      ? Math.floor(Math.random() * 5000) + 500
      : Math.floor(Math.random() * 500) + 10
    
    transactions.push({
      id: `txn-${i + 1}`,
      date: date.toISOString().split('T')[0],
      description,
      category,
      type: isIncome ? 'income' : 'expense',
      amount,
    })
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const defaultTransactions = generateDemoTransactions()
