import 'dotenv/config';
import mongoose from 'mongoose';
import { TransactionModel } from '../../src/transactions/schemas/transaction.schema';

async function populateTransactions() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);

    const transactions = [];

    for (let i = 0; i < 100; i++) {
      const transaction = {
        date: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ).toISOString(), // Asegúrate de que date sea un string ISO
        concept: `Transaction ${i + 1}`,
        amountInCents: Math.floor(Math.random() * 100000),
        category: ['Food', 'Transport', 'Entertainment'][
          Math.floor(Math.random() * 3)
        ],
        subcategory: ['Groceries', 'Fuel', 'Movies'][
          Math.floor(Math.random() * 3)
        ],
        type: ['payment', 'income'][Math.floor(Math.random() * 2)],
      };
      transactions.push(transaction);
    }

    await TransactionModel.insertMany(transactions);
    console.log('Database populated with 100 transactions');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.connection.close();
  }
}

populateTransactions();
