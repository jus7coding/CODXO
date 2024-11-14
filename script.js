class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.form = document.getElementById('expense-form');
        this.expenseList = document.getElementById('expense-list');
        this.balanceElement = document.getElementById('balance');
        
        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
    }

    addExpense() {
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        const expense = {
            id: Date.now(),
            description,
            amount,
            type,
            date: new Date().toLocaleDateString()
        };

        this.expenses.push(expense);
        this.saveToLocalStorage();
        this.updateUI();
        this.form.reset();
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.saveToLocalStorage();
        this.updateUI();
    }

    calculateBalance() {
        return this.expenses.reduce((total, expense) => {
            return expense.type === 'income' 
                ? total + expense.amount 
                : total - expense.amount;
        }, 0);
    }

    saveToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }

    updateUI() {
        this.expenseList.innerHTML = '';
        this.expenses.forEach(expense => {
            const expenseElement = document.createElement('div');
            expenseElement.className = 'expense-item';
            expenseElement.innerHTML = `
                <div>
                    <strong>${expense.description}</strong>
                    <small>${expense.date}</small>
                </div>
                <div>
                    <span style="color: ${expense.type === 'income' ? '#2ecc71' : '#e74c3c'}">
                        ${expense.type === 'income' ? '+' : '-'}$${Math.abs(expense.amount).toFixed(2)}
                    </span>
                    <button class="delete-btn" onclick="expenseTracker.deleteExpense(${expense.id})">×</button>
                </div>
            `;
            this.expenseList.appendChild(expenseElement);
        });

        const balance = this.calculateBalance();
        this.balanceElement.textContent = `$${balance.toFixed(2)}`;
        this.balanceElement.style.color = balance >= 0 ? '#2ecc71' : '#e74c3c';
    }
}

const expenseTracker = new ExpenseTracker(); 