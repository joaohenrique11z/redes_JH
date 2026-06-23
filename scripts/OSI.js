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

    const mockSegmentos = [{ sequencia: 1, dados: conteudoFinal }];

    // 2. Camada de Enlace (L2)
    const objEnlace = camadaEnlace(mockSegmentos);

    // 1. Camada Física (L1)
    const objFisica = camadaFisica(objEnlace);

    // Objeto unificado com as informações simplificadas
    const osiSimplificado = {
      textoOriginal: conteudoFinal,
      enlace: objEnlace,
      fisica: objFisica
    };

    // Salva os dados no localStorage e redireciona para a página de resultado
    localStorage.setItem('osi_payload', JSON.stringify(osiSimplificado));

    window.location.href = 'resultado.html';
  });
}