const USER_NAME = 'JH';

const user = document.querySelector('.user');
if (user) user.textContent = `Usuário: ${USER_NAME}`;

// Pega os dados salvos no localStorage pelo OSI.js
const payloadStr = localStorage.getItem('osi_payload');
const token = localStorage.getItem('osi_token');

const payloadDisplay = document.querySelector('#payload-display');
const tokenDisplay = document.querySelector('#token-display');

if (payloadStr && payloadDisplay) {
  try {
    const payload = JSON.parse(payloadStr);
    payloadDisplay.textContent = JSON.stringify(payload, null, 2);
  } catch (e) {
    payloadDisplay.textContent = 'Erro ao ler os dados da requisição.';
  }
} else if (payloadDisplay) {
  payloadDisplay.textContent = 'Nenhum dado encontrado. Volte e realize uma requisição.';
}

if (token && tokenDisplay) {
  tokenDisplay.textContent = token;
} else if (tokenDisplay) {
  tokenDisplay.textContent = 'Nenhum token encontrado.';
}

// Limpa o localStorage após exibir (boa prática)
localStorage.removeItem('osi_payload');
localStorage.removeItem('osi_token');
