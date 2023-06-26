const form = document.getElementById('transaction-form');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactions');
const balanceAmount = document.getElementById('balance-amount');

let transactions = [];

// Function to add a new transaction
function addTransaction(event) {
  event.preventDefault();

  const type = typeInput.value;
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount)) {
    alert('Please enter a valid amount.');
    return;
  }

  const transaction = {
    id: Date.now(),
    type,
    description,
    amount
  };

  transactions.push(transaction);
  updateTransactionsList();
  updateBalance();

  // Clear input fields
  descriptionInput.value = '';
  amountInput.value = '';
}

// Function to delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateTransactionsList();
  updateBalance();
}

// Function to update the transactions list
function updateTransactionsList() {
  transactionsList.innerHTML = '';

  transactions.forEach(transaction => {
    const listItem = document.createElement('li');
    listItem.classList.add(transaction.type);
    listItem.innerHTML = `
      <span>${transaction.description}</span>
      <span>${transaction.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
    `;

    transactionsList.appendChild(listItem);
  });
}

// Function to update the balance
function updateBalance() {
  const income = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income - expenses;
  balanceAmount.textContent = balance.toFixed(2);
}

// Load transactions from storage if available
if (localStorage.getItem('transactions')) {
  transactions = JSON.parse(localStorage.getItem('transactions'));
  updateTransactionsList();
  updateBalance();
}

// Add event listener to the form
form.addEventListener('submit', addTransaction);

// Save transactions to storage when the page is unloaded
window.addEventListener('beforeunload', () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
});
