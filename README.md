# etherium-learning

Learning Etherium.

## Install dependencies

Requirements:

- node.js
- truffle
- ganache (https://www.trufflesuite.com/ganache)

```bash
npm install --g truffle@5.1.39

npm install -g truffle
```

If an error in the `truffle` installation occurs, try:

```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

Set-up Repository

```bash
git clone -b starter-code https://github.com/dappuniversity/defi_tutorial.git defi_tutorial

git checkout -b master

npm install
```

## Creating a Dapp `/template_dapp`

```bash
truffle compile
```

When contracts are compiled, a `.json` version of the contract goes to `./src/abis`, check the `contracts_build_directory` variable in the `truffle-config.js` file.

```bash
truffle migrate

truffle migrate --reset
```

Whenever you put contracts on the blockchain, you have to create a transaction and pay gas fee for it. Open the truffle console to interact with the smart contract in the blockchain.

```bash
truffle console


truffle(development)> tokenFarm = await TokenFarm.deployed();
undefined
truffle(development)> tokenFarm
TruffleContract {
    ...
}
truffle(development)> tokenFarm.address
'0x9d1F98f1Ee6a3Df0ddfd6a42Ad073Dc0d753b3F8'

truffle(development)> name = await tokenFarm.name()
undefined
truffle(development)> name
'Dapp Token Farm'
```

Remember, users have addresses but contracts, like `tokenFarm`, also have addresses.

```bash
truffle(development)> mDai = await DaiToken.deployed();
undefined
truffle(development)> mDai
TruffleContract {
    ...
}

truffle(development)> accounts = await web3.eth.getAccounts();
undefined
truffle(development)> accounts[1]
'0xaD9f59e267794135303d2343dd74D072C064a96d'

truffle(development)> balance = await mDai.balanceOf(accounts[1]);
undefined
truffle(development)> balance
BN {
  negative: 0,
  words: [ 51380224, 30903128, 22204, <1 empty item> ],
  length: 3,
  red: null
}
truffle(development)> balance.toString();
'100000000000000000000'

truffle(development)> formattedBalance = web3.utils.fromWei(balance);
'100'
truffle(development)> formattedBalance
'100'

truffle(development)> web3.utils.toWei('1.5', 'Ether')
'1500000000000000000'
```

Test are very important when you're creating a smart contract. You can't change the code, so you want to make sure is correct before deploying it to the blockchain.

In the `/test/TokenFarm.test.js` directory you can find the following code:

```js
const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', (accounts) => {
  describe('Mock DAI deployement', async () => {
    it('has a name', async () => {
      let daiToken = await DaiToken.new();
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })
})
```

In order to test your contracts, run:

```bash
truffle test
```

Truffle allow you to run scripts.

```bash
truffle exec scripts/issue-tokens.js
```

Now, let's build the client side of our Dapp. First, make sure that the server is running.

```bash
npm run start
```

That's going to start a server and open a tab in the web browser. Then, we will create a **React** component. This is where all the code `./scr/components/App.js` is.

How to connect with Metamask

1. Connect to a new RPC network.
2. Give the network a new name.
3. RPC SERVER HTTP://127.0.0.1:7545 (for Ganache).
4. Use the ChainId NETWORK ID 5777 (for Ganache).
5. Import the new Account using the private key.