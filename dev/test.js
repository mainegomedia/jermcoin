const Blockchain = require("./blockchain");

const jermcoin = new Blockchain();

jermcoin.createNewBlock(9461113, "2403UJEIFJKFDFLK", "DKFJALF849U8JEJAF")
jermcoin.createNewTransaction(100, "BOB8490TEIRGIJGKALGJ","I35980EFSODFAJLKDKF")
jermcoin.createNewBlock(9448953, "2403UJEIFJghffdfdh", "DKFJALF84TYRUJGHHG")

jermcoin.createNewTransaction(50, "BOB8490TEIRGIJGKALGJ","I35980EFSODFAJLKDKF")
jermcoin.createNewTransaction(1135, "BOB8490TEIRGIJGKALGJ","I35980EFSODFAJLKDKF")
jermcoin.createNewTransaction(26, "BOB8490TEIRGIJGKALGJ","I35980EFSODFAJLKDKF")

jermcoin.createNewBlock(9448953, "2403UJEIFJghffdfdh", "DKFJALF84TYRUJGHHG")








console.log(jermcoin);