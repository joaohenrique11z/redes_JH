import { createNetwork, network } from "./network.js";
import { randomFailures } from "./failures.js";
import { dijkstra } from "./pathfinder.js";
import { drawNetwork, drawRoute, animatePacket } from "./animation.js";

const USER_NAME = 'JH';

const user = document.querySelector('.user');
if (user) user.textContent = `Usuário: ${USER_NAME}`;

// Pega os dados salvos no localStorage pelo OSI.js
const payloadStr = localStorage.getItem('osi_payload');
const token = localStorage.getItem('osi_token');

const payloadDisplay = document.querySelector('#payload-display');
const tokenDisplay = document.querySelector('#token-display');
const sessaoDisplay = document.querySelector('#sessao-display');
const transporteDisplay = document.querySelector('#transporte-display');
const enlaceDisplay = document.querySelector('#enlace-display');
const fisicaDisplay = document.querySelector('#fisica-display');
const redeInfo = document.querySelector('#rede-info');

if (payloadStr && payloadDisplay) {
  try {
    const osiCompleto = JSON.parse(payloadStr);
    
    // Exibe os blocos
    payloadDisplay.textContent = JSON.stringify(osiCompleto.aplicacao, null, 2);
    
    if (sessaoDisplay) sessaoDisplay.textContent = JSON.stringify(osiCompleto.sessao, null, 2);
    if (transporteDisplay) transporteDisplay.textContent = JSON.stringify(osiCompleto.transporte, null, 2);
    if (enlaceDisplay) enlaceDisplay.textContent = JSON.stringify(osiCompleto.enlace, null, 2);
    if (fisicaDisplay) fisicaDisplay.textContent = osiCompleto.fisica || "Erro ao carregar dados físicos";

    // ------------------------------------
    // ACIONAR A CAMADA DE REDE (3)
    // ------------------------------------
    createNetwork();
    randomFailures(15);
    
    const ativos = network.filter(router => router.active);

    if (ativos.length >= 2) {
      const origem = ativos[Math.floor(Math.random() * ativos.length)].id;
      let destino = ativos[Math.floor(Math.random() * ativos.length)].id;
      
      while (origem === destino) {
        destino = ativos[Math.floor(Math.random() * ativos.length)].id;
      }
      
      const resultadoRota = dijkstra(network, origem, destino);
      
      drawNetwork();
      
      if (resultadoRota.path && resultadoRota.path.length > 1) {
        drawRoute(resultadoRota.path, origem, destino);
        
        if (redeInfo) {
          redeInfo.innerHTML = `
            <div class="payload-box">
              <p><strong>Origem:</strong> R${origem}</p>
              <p><strong>Destino:</strong> R${destino}</p>
              <p><strong>Custo Total:</strong> ${resultadoRota.distance}</p>
              <p><strong>Caminho:</strong> ${resultadoRota.path.join(" ➜ ")}</p>
            </div>
          `;
        }
        
        animatePacket(resultadoRota.path, origem, destino);
      } else {
        if (redeInfo) redeInfo.innerHTML = '<div class="payload-box"><p>Nenhuma rota encontrada.</p></div>';
      }
    }

  } catch (e) {
    payloadDisplay.textContent = 'Erro ao ler os dados da requisição.';
    console.error(e);
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
