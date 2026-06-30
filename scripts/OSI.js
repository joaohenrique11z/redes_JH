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
const siteForm = document.querySelector('#site-form');

if (inputTexto) {
  inputTexto.addEventListener('input', function() {
    const valor = inputTexto.value.toLowerCase();
    if (valor.includes('@')) {
      if (emailForm) emailForm.style.display = 'block';
      if (siteForm) siteForm.style.display = 'none';
    } else if (valor.includes('www') || valor.startsWith('http') || valor.includes('.com')) {
      if (siteForm) siteForm.style.display = 'block';
      if (emailForm) emailForm.style.display = 'none';
    } else {
      if (emailForm) emailForm.style.display = 'none';
      if (siteForm) siteForm.style.display = 'none';
    }
  });
}

if (reqBtn && inputTexto) {
  reqBtn.addEventListener('click', async function(event) {
    event.preventDefault();

    const texto = inputTexto.value.trim();

    if (!texto) {
      alert("Por favor, digite uma mensagem.");
      return;
    }

    let conteudoFinal = texto;
    let protocolo = "HTTP"; // Padrão

    if (emailForm && emailForm.style.display === 'block') {
      const remetente = document.querySelector('#email-remetente')?.value || '';
      const destinatario = document.querySelector('#email-destinatario')?.value || '';
      const assunto = document.querySelector('#email-assunto')?.value || '';
      const corpo = document.querySelector('#email-corpo')?.value || '';

      if (!remetente || !destinatario || !assunto || !corpo) {
        alert('Por favor, preencha todos os campos do e-mail antes de enviar.');
        return;
      }

      conteudoFinal += `\n[Remetente: ${remetente}]\n[Destinatário: ${destinatario}]\n[Assunto: ${assunto}]\n[Corpo: ${corpo}]`;
      protocolo = "SMTP";
    } else if (siteForm && siteForm.style.display === 'block') {
      const metodo = document.querySelector('#site-metodo')?.value || 'GET';
      conteudoFinal += `\n[Método HTTP: ${metodo}]`;

      if (texto.startsWith('wss://') || texto.startsWith('ws://')) {
        protocolo = "WEBSOCKET";
      } else if (texto.startsWith('https://')) {
        protocolo = "HTTPS";
      }
    } else if (inputArquivo && inputArquivo.files.length > 0) {
      const fileName = inputArquivo.files[0].name;
      conteudoFinal += `\n[Arquivo anexo: ${fileName}]`;
      protocolo = "FTP";
    }

    const payloadAplicacao = {
      dados: conteudoFinal,
      protocolo: protocolo,
      dominioOriginal: texto
    };

    // 6. Camada de Apresentação (L6)
    const objApresentacao = await camadaApresentacao(payloadAplicacao);

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