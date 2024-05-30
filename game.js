// game.js
let points = 0;
let clickValue = 1;
let upgradeCost = 10;
let lastSignInDate = null;
let web3;
let userAccount;

function click() {
  points += clickValue;
  animatePoints();
  updateUI();
}

function upgradeTool() {
  if (points >= upgradeCost) {
    points -= upgradeCost;
    clickValue += 1;
    upgradeCost *= 2;
    updateUI();
  } else {
    alert("积分不足！");
  }
}

function signIn() {
  const today = new Date().toDateString();
  if (lastSignInDate === today) {
    document.getElementById("signInMessage").innerText = "今天已经签到过了！";
  } else {
    lastSignInDate = today;
    points += 50; // 每日签到奖励积分
    updateUI();
    document.getElementById("signInMessage").innerText = "签到成功，获得50积分！";
  }
}

function updateUI() {
  const pointsElement = document.getElementById("points");
  pointsElement.innerText = `积分: ${points}`;
  document.getElementById("clickValue").innerText = `每次点击: ${clickValue} 分`;
  document.getElementById("upgradeCost").innerText = `升级所需积分: ${upgradeCost}`;
}

function animatePoints() {
  const pointsElement = document.getElementById("points");
  pointsElement.style.animation = 'none';
  pointsElement.offsetHeight; // 触发重新渲染
  pointsElement.style.animation = 'pointAnimation 0.5s';
}

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // 请求用户授权
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = accounts[0];
      document.getElementById("walletAddress").innerText = `钱包地址: ${userAccount}`;
    } catch (error) {
      console.error("用户拒绝了连接请求", error);
    }
  } else {
    alert("请安装MetaMask！");
  }
}

document.getElementById("clickButton").addEventListener("click", click);
document.getElementById("upgradeButton").addEventListener("click", upgradeTool);
document.getElementById("signInButton").addEventListener("click", signIn);
document.getElementById("connectWalletButton").addEventListener("click", connectWallet);
