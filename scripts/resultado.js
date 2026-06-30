import { createNetwork, network } from "./network.js";
import { randomFailures } from "./failures.js";
import { dijkstra } from "./pathfinder.js";
import { drawNetwork, drawRoute, animatePacket } from "./animation.js";

const USER_NAME = 'JH';

const user = document.querySelector('.user');
if (user) user.textContent = `Usuário: ${USER_NAME}`;

// Pega os dados salvos no localStorage pelo OSI.js
const payloadStr = localStorage.getItem('osi_payload');

const apresentacaoDisplay = document.querySelector('#apresentacao-display');
const sessaoDisplay = document.querySelector('#sessao-display');
const transporteDisplay = document.querySelector('#transporte-display');
const enlaceDisplay = document.querySelector('#enlace-display');
const fisicaDisplay = document.querySelector('#fisica-display');
const redeInfo = document.querySelector('#rede-info');

if (payloadStr) {
  try {
    const osiSimplificado = JSON.parse(payloadStr);
    
    // Exibe os blocos das camadas
    if (apresentacaoDisplay) apresentacaoDisplay.textContent = JSON.stringify(osiSimplificado.apresentacao, null, 2);
    if (sessaoDisplay) sessaoDisplay.textContent = JSON.stringify(osiSimplificado.sessao, null, 2);
    if (transporteDisplay) transporteDisplay.textContent = JSON.stringify(osiSimplificado.transporte, null, 2);
    if (enlaceDisplay) enlaceDisplay.textContent = JSON.stringify(osiSimplificado.enlace, null, 2);
    
    if (fisicaDisplay && Array.isArray(osiSimplificado.fisica)) {
      let fisicaTexto = "";
      osiSimplificado.fisica.forEach((res, i) => {
        fisicaTexto += `[Quadro ${i+1}] Validação CRC: ${res.status}\n\n`;
        fisicaTexto += `Objeto Transmitido:\n${JSON.stringify(res.dadosOriginais, null, 2)}\n\n`;
        fisicaTexto += `Representação Binária:\n${res.binario}\n\n`;
        fisicaTexto += `--------------------------------------------------\n\n`;
      });
      fisicaDisplay.textContent = fisicaTexto.trim();
    } else if (fisicaDisplay) {
      fisicaDisplay.textContent = "Erro ao carregar dados físicos";
    }

    // ------------------------------------
    // LER E EXIBIR A ROTA CALCULADA NA CAMADA DE REDE
    // ------------------------------------
    createNetwork();
    
    if (osiSimplificado.rede && osiSimplificado.rede.length > 0) {
      const pacoteRede = osiSimplificado.rede[0];
      const rota = pacoteRede.rotaCalculada;
      
      drawNetwork();
      
      if (rota && rota.caminho && rota.caminho.length > 1) {
        drawRoute(rota.caminho, rota.origem, rota.destino);
        
        if (redeInfo) {
          redeInfo.innerHTML = `
            <div class="payload-box">
              <p><strong>JWT Token (L6):</strong> ${osiSimplificado.apresentacao.jwtToken}</p>
              <p><strong>IP DNS Resolvido (L6):</strong> ${osiSimplificado.apresentacao.ipResolvido}</p>
              <p><strong>Porta Destino (L4):</strong> ${osiSimplificado.transporte[0].portaDestino}</p>
              <hr style="border: 0; border-top: 1px solid #f5be58; margin: 10px 0;">
              <p><strong>Origem (L3):</strong> R${rota.origem}</p>
              <p><strong>Destino (L3):</strong> R${rota.destino}</p>
              <p><strong>Custo Total:</strong> ${rota.custo}</p>
              <p><strong>Caminho:</strong> ${rota.caminho.join(" ➜ ")}</p>
            </div>
          `;
        }
        
        animatePacket(rota.caminho, rota.origem, rota.destino);
      } else {
        if (redeInfo) redeInfo.innerHTML = '<div class="payload-box"><p>Nenhuma rota encontrada.</p></div>';
      }
    }

  } catch (e) {
    if (enlaceDisplay) enlaceDisplay.textContent = 'Erro ao ler os dados da requisição.';
    console.error(e);
  }
} else {
  if (enlaceDisplay) enlaceDisplay.textContent = 'Nenhum dado encontrado. Volte e realize uma requisição.';
}

// Limpa o localStorage após exibir (boa prática)
localStorage.removeItem('osi_payload');
