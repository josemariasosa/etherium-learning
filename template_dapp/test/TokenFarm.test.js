const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
    
    // Transfer all Dapp Tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to investor, insert who is calling the function
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock DAI deployement', async () => {
    it('has a name', async () => {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe('Dapp Token deployement', async () => {
    it('has a name', async () => {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token');
    })
  })

  describe('Token Farm deployement', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm');
    })

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming Tokens', async () => {
    it('rewards investor for staking mDai tokens', async () => {
      let result;

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor mDai wallet balance correct before staking');

      // Stake mDai tokens
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
      await tokenFarm.stakeTokens(tokens('100'), { from: investor });

      // Check staking results
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('0'), 'investor mDai wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('100'), 'token farm mDai balance correct after staking');

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking');

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking');

      // Issue tokens
      await tokenFarm.issueTokens({ from: owner });

      // Check balance after issuance
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor dapp token balance correct after issuance');

      // Ensure that only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake the tokens
      await tokenFarm.unstakeTokens({ from: investor });

      // Check results after unstaking
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor mDai wallet balance correct after unstaking');

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('0'), 'token farm balance correct after unstaking');

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after unstaking');

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})