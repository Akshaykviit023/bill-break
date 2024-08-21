class Pair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class AscCmp {
  compare(p1, p2) {
    return p1.value - p2.value;
  }
}

class DscCmp {
  compare(p1, p2) {
    return p2.value - p1.value;
  }
}

class Solution {
  constructor() {
    this.minQ = [];
    this.maxQ = [];
    this.transactions = [];
  }

  constructMinMaxQ(amount) {
    for (let i = 0; i < amount.length; ++i) {
      if (amount[i] === 0) continue;
      if (amount[i] > 0) {
        this.maxQ.push(new Pair(i, amount[i]));
      } else {
        this.minQ.push(new Pair(i, amount[i]));
      }
    }
    this.minQ.sort(new DscCmp().compare);
    this.maxQ.sort(new AscCmp().compare);
  }

  solveTransaction() {
    const n = this.minQ.length + this.maxQ.length;
    const simplifiedGraph = Array.from({ length: n }, () => Array(n).fill(0));

    while (this.minQ.length > 0 && this.maxQ.length > 0) {
      const maxCreditEntry = this.maxQ.pop();
      const maxDebitEntry = this.minQ.pop();

      const transaction_val = maxCreditEntry.value + maxDebitEntry.value;

      let debtor = maxDebitEntry.key;
      let creditor = maxCreditEntry.key;
      let owed_amount;

      if (transaction_val === 0) {
        owed_amount = maxCreditEntry.value;
      } else if (transaction_val < 0) {
        owed_amount = maxCreditEntry.value;
        maxDebitEntry.value = transaction_val;
        this.minQ.push(maxDebitEntry);
        this.minQ.sort(new DscCmp().compare);
      } else {
        owed_amount = -maxDebitEntry.value;
        maxCreditEntry.value = transaction_val;
        this.maxQ.push(maxCreditEntry);
        this.maxQ.sort(new AscCmp().compare);
      }

      // Update the simplified graph
      simplifiedGraph[debtor][creditor] += owed_amount;
    }

    return simplifiedGraph;
  }

  minCashFlow(graph) {
    const n = graph.length;
    const amount = new Array(n).fill(0);
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        const diff = graph[j][i] - graph[i][j];
        amount[i] += diff;
      }
    }
    this.constructMinMaxQ(amount);
    return this.solveTransaction();
  }
}

const simplifyDebt = (graph) => {
  const solution = new Solution();
  return solution.minCashFlow(graph);
};

export default simplifyDebt;
