const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '94184daf0a5a4005bed6f2dd7bddbbfa' // 用你的Infura项目ID替换这里
    }
  }
};

let points = 0;
let clickValue = 1;
let upgradeCost = 10;
let stamina = 1000;
let staminaRecoveryRate = 1;
let walletAddress = '';

async function connectWallet() {
  const provider = new Web3Modal({
    cacheProvider: false,
    providerOptions
  });

  try {
    const instance = await provider.connect();
    const web3 = new Web3(instance);

    // 获取用户地址
    const accounts = await web3.eth.getAccounts();
    walletAddress = accounts[0];

    document.getElementById('walletAddress').innerText = `钱包地址: ${walletAddress}`;

    // 加载用户数据
    loadUserData(walletAddress);
  } catch (error) {
    console.error('连接钱包失败:', error);
  }
}

async function loadUserData(walletAddress) {
  // 在这里实现加载用户数据的逻辑，例如从后端服务器获取用户的积分等
  // 假设从服务器返回的数据如下：
  const userData = await fetchUserData(walletAddress);
  if (userData) {
    points = userData.points;
    updatePointsDisplay();
  }
}

async function fetchUserData(walletAddress) {
  // 模拟从服务器获取用户数据
  return {
    points: 1000, // 示例数据
  };
}

function updatePointsDisplay() {
  document.getElementById('points').innerText = `积分: ${points}`;
  document.getElementById('clickValue').innerText = `每次点击: ${clickValue} 分`;
  document.getElementById('upgradeCost').innerText = `升级所需积分: ${upgradeCost}`;
}

document.getElementById('clickButton').addEventListener('click', () => {
  if (stamina > 0) {
    points += clickValue;
    stamina--;
    updatePointsDisplay();
    updateStaminaDisplay();
  } else {
    alert('体力不足！');
  }
});

document.getElementById('upgradeButton').addEventListener('click', () => {
  if (points >= upgradeCost) {
    points -= upgradeCost;
    clickValue *= 2;
    upgradeCost *= 2;
    updatePointsDisplay();
  } else {
    alert('积分不足！');
  }
});

document.getElementById('signInButton').addEventListener('click', () => {
  // 每日签到逻辑
  points += 100;
  updatePointsDisplay();
  document.getElementById('signInMessage').innerText = '签到成功！';
});

function updateStaminaDisplay() {
  document.getElementById('stamina').innerText = `体力: ${stamina}`;
}

function recoverStamina() {
  stamina += staminaRecoveryRate;
  if (stamina > 1000) stamina = 1000; // 最大体力限制
  updateStaminaDisplay();
}

// 每2秒恢复1点体力
setInterval(recoverStamina, 2000);

document.getElementById('connectWalletButton').addEventListener('click', connectWallet);

// 页面加载时初始化
updatePointsDisplay();
updateStaminaDisplay();
