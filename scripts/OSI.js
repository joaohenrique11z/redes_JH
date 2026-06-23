import { camadaEnlace } from "./enlace.js";
import { camadaFisica } from "./fisica.js";

const reqBtn = document.querySelector('.request-btn');
const inputTexto = document.querySelector('#text-input');

if (reqBtn && inputTexto) {
  reqBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const texto = inputTexto.value.trim();

    // Validação simples
    if (!texto) {
      alert("Por favor, digite uma mensagem.");
      return;
    }

    // Cria um mock de segmentos baseado no texto para manter a compatibilidade
    // com o map() interno da camada de enlace
    const mockSegmentos = [{ sequencia: 1, dados: texto }];

    // 2. Camada de Enlace (L2)
    const objEnlace = camadaEnlace(mockSegmentos);

    // 1. Camada Física (L1)
    const objFisica = camadaFisica(objEnlace);

    // Objeto unificado com as informações simplificadas
    const osiSimplificado = {
      textoOriginal: texto,
      enlace: objEnlace,
      fisica: objFisica
    };

    // Salva os dados no localStorage e redireciona para a página de resultado
    localStorage.setItem('osi_payload', JSON.stringify(osiSimplificado));

    window.location.href = 'resultado.html';
  });
}