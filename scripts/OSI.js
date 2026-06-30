import { camadaApresentacao } from "./apresentacao.js";
import { camadaSessao } from "./sessao.js";
import { camadaTransporte } from "./transporte.js";
import { camadaRede } from "./rede.js";
import { camadaEnlace } from "./enlace.js";
import { camadaFisica } from "./fisica.js";
const reqBtn = document.querySelector('.request-btn');
const inputTexto = document.querySelector('#text-input');
const inputArquivo = document.querySelector('#arquivo');
const emailForm = document.querySelector('#email-form');

if (inputTexto) {
  inputTexto.addEventListener('input', function() {
    const valor = inputTexto.value;
    if (valor.includes('@')) {
      if (emailForm) emailForm.style.display = 'block';
    } else {
      if (emailForm) emailForm.style.display = 'none';
    }
  });
}

if (reqBtn && inputTexto) {
  reqBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const texto = inputTexto.value.trim();

    if (!texto) {
      alert("Por favor, digite uma mensagem.");
      return;
    }

    let conteudoFinal = texto;

    // Se for um email, adiciona os dados extras
    if (texto.includes('@')) {
      const assunto = document.querySelector('#email-assunto')?.value || '';
      const corpo = document.querySelector('#email-corpo')?.value || '';
      conteudoFinal += `\n[Assunto: ${assunto}]\n[Corpo: ${corpo}]`;
    }

    // Se houver arquivo selecionado
    if (inputArquivo && inputArquivo.files.length > 0) {
      const fileName = inputArquivo.files[0].name;
      conteudoFinal += `\n[Arquivo anexo: ${fileName}]`;
    }

    // 6. Camada de Apresentação (L6)
    const objApresentacao = camadaApresentacao(conteudoFinal);

    // 5. Camada de Sessão (L5)
    const objSessao = camadaSessao(objApresentacao);

    // 4. Camada de Transporte (L4)
    const objTransporte = camadaTransporte(objSessao);

    // 3. Camada de Rede (L3)
    const objRede = camadaRede(objTransporte);

    // 2. Camada de Enlace (L2)
    const objEnlace = camadaEnlace(objRede);

    // 1. Camada Física (L1)
    const objFisica = camadaFisica(objEnlace);

    // Objeto unificado com as informações simplificadas
    const osiSimplificado = {
      textoOriginal: conteudoFinal,
      apresentacao: objApresentacao,
      sessao: objSessao,
      transporte: objTransporte,
      rede: objRede,
      enlace: objEnlace,
      fisica: objFisica
    };

    // Salva os dados no localStorage e redireciona para a página de resultado
    localStorage.setItem('osi_payload', JSON.stringify(osiSimplificado));

    window.location.href = 'resultado.html';
  });
}