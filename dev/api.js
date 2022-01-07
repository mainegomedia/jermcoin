const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require("uuid");
uuid.v1();
const port = process.argv[2];
const rp = require('request');
const request = require('request');

const nodeAddress = uuid.v1().split("-").join('');

const jermcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
  res.send(jermcoin);
}) 


// Transaction
app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
  const blockIndex = jermcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.`}); 
})


// Transaction and broadcast
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = jermcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	jermcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	jermcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'Transaction created and broadcast successfully.' });
	});
});

app.get('/mine', function (req, res) {
  const lastBlock = jermcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash']
  const currentBlockData = {
    transactions: jermcoin.newPendingTransactions,
    index: lastBlock['index'] + 1
  };
 
  const nonce = jermcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = jermcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  jermcoin.createNewTransaction(12.5, "00", nodeAddress)

  const newBlock = jermcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined successfully",
    block: newBlock
  }); 
})   


//Register and broadcast it to the network
app.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (jermcoin.networkNodes.indexOf(newNodeUrl) == -1) jermcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	jermcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...jermcoin.networkNodes, jermcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});

// register a node with network
app.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;

    const nodeNotAlreadyPresent = jermcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = jermcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) jermcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registerd successfully.'})
  }
)

// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res){
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = jermcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = jermcoin.currentNodeUrl !== networkNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode) jermcoin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: "Bulk Registration Successful."});
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});