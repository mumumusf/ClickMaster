let points = 0;
let clickValue = 1;
let upgradeCost = 10;
let stamina = 1000;
let maxStamina = 1000;
let autoClickerCost = 10000;
let hasAutoClicker = false;
let walletAddress = '';

const pointsEl = document.getElementById('points');
const clickValueEl = document.getElementById('clickValue');
const upgradeCostEl = document.getElementById('upgradeCost');
const inviteLinkEl = document.getElementById('inviteLink');
const staminaEl = document.getElementById('stamina');
const walletAddressEl = document.getElementById('walletAddress');

function updateDisplay() {
  pointsEl.innerText = `积分: ${points}`;
  clickValueEl.innerText = `每次点击: ${clickValue} 分`;
  upgradeCostEl.innerText = `升级所需积分: ${upgradeCost}`;
  staminaEl.innerText = `体力: ${stamina}`;
  walletAddressEl.innerText = `钱包地址: ${walletAddress ? walletAddress : '未连接'}`;
}

function clickHandler() {
  if (stamina > 0) {
    points += clickValue;
    stamina--;
    updateDisplay();
  } else {
    alert('体力不足，请稍后再试。');
  }
}

function upgradeHandler() {
  if (points >= upgradeCost) {
    points -= upgradeCost;
    clickValue++;
    upgradeCost *= 2;
    updateDisplay();
  } else {
    alert('积分不足，无法升级。');
  }
}

function autoClickerHandler() {
  if (points >= autoClickerCost && !hasAutoClicker) {
    points -= autoClickerCost;
    hasAutoClicker = true;
    setInterval(clickHandler, 1000);
    updateDisplay();
  } else {
    alert('积分不足，无法购买自动点击器。');
  }
}

function connectWallet() {
  const web3Modal = new Web3Modal.default();
  web3Modal.connect().then(provider => {
    const web3 = new Web3(provider);
    web3.eth.getAccounts().then(accounts => {
      walletAddress = accounts[0];
      updateDisplay();
    });
  }).catch(error => {
    console.error(error);
  });
}

function generateInviteLink() {
  const url = new URL(window.location.href);
  url.searchParams.set('ref', walletAddress);
  inviteLinkEl.innerText = url.href;
}

document.getElementById('clickButton').addEventListener('click', clickHandler);
document.getElementById('upgradeButton').addEventListener('click', upgradeHandler);
document.getElementById('connectWalletButton').addEventListener('click', connectWallet);
document.getElementById('autoClickerButton').addEventListener('click', autoClickerHandler);

if (new URLSearchParams(window.location.search).has('ref')) {
  const ref = new URLSearchParams(window.location.search).get('ref');
  console.log(`被邀请的用户地址: ${ref}`);
}

setInterval(() => {
  if (stamina < maxStamina) {
    stamina++;
    updateDisplay();
  }
}, 60000);

updateDisplay();
