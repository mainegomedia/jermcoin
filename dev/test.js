const Blockchain = require("./blockchain");
const jermcoin = new Blockchain();

const previousBlockHash = '1EIRIUE23943802J3R399384';
const currentBlockData = [
    {
        amount: 101,
        sender: '234897584795498EWJEWOQAJEW',
        recipient: 'EUORIEQWPUR38740324294893'
    },
    {
        amount: 1150,
        sender: '234897584795498EWJEWOQAJEW',
        recipient: 'EUORIEQWPUR38740324294893'
    },
    {
        amount: 1548,
        sender: '234897584795498EWJEWOQAJEW',
        recipient: 'EUORIEQWPUR38740324294893'
    },
]

console.log(jermcoin);