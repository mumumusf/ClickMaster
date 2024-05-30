let points = 0;
let clickValue = 1;
let upgradeCost = 10;
let stamina = 1000;
let maxStamina = 1000;
let autoClickerCost = 10000;
let staminaUpgradeCost = 500;
let hasAutoClicker = false;
let walletAddress = '';
let signedIn = false;

const pointsEl = document.getElementById('points');
const clickValueEl = document.getElementById('clickValue');
const upgradeCostEl = document.getElementById('upgradeCost');
const inviteLinkEl = document.getElementById('inviteLink');
const staminaEl = document.getElementById('stamina');
const walletAddressEl = document.getElementById('walletAddress');
const signInMessageEl = document.getElementById('signInMessage');
const autoClickerCostEl = document.getElementById('autoClickerCost');
const staminaUpgradeCostEl = document.getElementById('staminaUpgradeCost');

function updateDisplay() {
  pointsEl.innerText = `积分: ${points}`;
  clickValueEl.innerText = `每次点击: ${clickValue} 分`;
  upgradeCostEl.innerText = `升级所需积分: ${upgradeCost}`;
  staminaEl.innerText = `体力: ${stamina}`;
  autoClickerCostEl.innerText = `自动点击器所需积分: ${autoClickerCost}`;
  staminaUpgradeCostEl.innerText = `升级体力所需积分: ${staminaUpgradeCost}`;
  walletAddressEl.innerText = `钱包地址: ${walletAddress ? walletAddress : '未连接'}`;
}

function clickHandler() {
  if (stamina > 0) {
    points += clickValue;
    stamina--;
    updateDisplay();
    saveGameState();
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
    saveGameState();
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
    saveGameState();
  } else {
    alert('积分不足，无法购买自动点击器。');
  }
}

function upgradeStaminaHandler() {
  if (points >= staminaUpgradeCost) {
    points -= staminaUpgradeCost;
    maxStamina += 500;
    stamina += 500;
    staminaUpgradeCost *= 2;
    updateDisplay();
    saveGameState();
  } else {
    alert('积分不足，无法升级体力。');
  }
}

async function connectWallet() {
  const Web3Modal = window.Web3Modal.default;
  const WalletConnectProvider = window.WalletConnectProvider.default;

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: 'INFURA_ID' // Replace with your Infura ID
      }
    }
  };

  const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions
  });

  try {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    walletAddress = accounts[0];
    loadGameState();
    updateDisplay();
    generateInviteLink();
  } catch (error) {
    console.error('Could not connect to wallet:', error);
  }
}

function generateInviteLink() {
  const url = new URL(window.location.href);
  url.searchParams.set('ref', walletAddress);
  inviteLinkEl.innerText = url.href;
}

function saveGameState() {
  if (walletAddress) {
    localStorage.setItem(walletAddress, JSON.stringify({
      points,
      clickValue,
      upgradeCost,
      stamina,
      maxStamina,
      hasAutoClicker
    }));
  }
}

function loadGameState() {
  if (walletAddress) {
    const savedState = JSON.parse(localStorage.getItem(walletAddress));
    if (savedState) {
      points = savedState.points;
      clickValue = savedState.clickValue;
      upgradeCost = savedState.upgradeCost;
      stamina = savedState.stamina;
      maxStamina = savedState.maxStamina;
      hasAutoClicker = savedState.hasAutoClicker;
      updateDisplay();
    }
  }
}

function dailySignIn() {
  if (!signedIn) {
    points += 100; // 每日签到奖励100积分
    signedIn = true;
    signInMessageEl.innerText = '已签到，明天再来吧！';
    saveGameState();
    updateDisplay();
  } else {
    signInMessageEl.innerText = '今天已经签到过了，请明天再来。';
  }
}

document.getElementById('clickButton').addEventListener('click', clickHandler);
document.getElementById('upgradeButton').addEventListener('click', upgradeHandler);
document.getElementById('connectWalletButton').addEventListener('click', connectWallet);
document.getElementById('autoClickerButton').addEventListener('click', autoClickerHandler);
document.getElementById('upgradeStaminaButton').addEventListener('click', upgradeStaminaHandler);
document.getElementById('signInButton').addEventListener('click', dailySignIn);

if (new URLSearchParams(window.location.search).has('ref')) {
  const ref = new URLSearchParams(window.location.search).get('ref');
  console.log(`被邀请的用户地址: ${ref}`);
}

setInterval(() => {
  if (stamina < maxStamina) {
    stamina++;
    updateDisplay();
  }
}, 2000);

updateDisplay();
