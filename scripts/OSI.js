import { gerarObjetoAplicacao, processarApresentacao } from "./application.js";
import { camadaSessao } from "./sessao.js";
import { camadaTransporte } from "./transporte.js";
import { camadaEnlace } from "./enlace.js";
import { camadaFisica } from "./fisica.js";

const reqBtn = document.querySelector('.request-btn');
const inputTexto = document.querySelector('#text-input');
const inputArquivo = document.querySelector('#arquivo');
const protocolName = document.querySelector('.protocol-name');
const emailForm = document.querySelector('#email-form');

// O input de arquivo agora ficará sempre visível

// Reconhecimento automático do tipo de requisição com base no que o usuário digita
if (inputTexto) {
  inputTexto.addEventListener('input', function() {
    const valor = inputTexto.value;

    if (valor.includes('@')) {
      // Identificado como e-mail: exibe os campos extras
      if (emailForm) emailForm.style.display = 'block';
    } else {
      // Não é e-mail: oculta os campos extras
      if (emailForm) emailForm.style.display = 'none';
    }
  });
}

if (reqBtn) {
  reqBtn.addEventListener('click', async function(event) {
    event.preventDefault();

    const texto = inputTexto.value;

    // Captura os campos extras do formulário de e-mail (se visíveis)
    const dadosEmail = {
      assunto: document.querySelector('#email-assunto')?.value || '',
      corpo: document.querySelector('#email-corpo')?.value || ''
    };

    // 1. CAMADA DE APLICAÇÃO: detecta o tipo pelo conteúdo e monta o objeto
    const objetoAplicacao = gerarObjetoAplicacao(texto, inputArquivo, dadosEmail);

    // Se retornou null, a validação falhou — para a execução
    if (!objetoAplicacao) {
      return;
    }

    // Atualiza o nome do protocolo na tela
    protocolName.textContent = objetoAplicacao.protocolo;

    // Logs de verificação no Console do Desenvolvedor (F12)
    console.log("=== 1. CAMADA DE APLICAÇÃO (Dados Originais) ===");
    console.log(objetoAplicacao);

    // 2. CAMADA DE APRESENTAÇÃO: gera o Token JWT com os dados validados
    const tokenJWT = await processarApresentacao(objetoAplicacao);

    console.log("=== 2. CAMADA DE APRESENTAÇÃO (Token JWT Gerado) ===");
    console.log(tokenJWT);

    // 3. CAMADA DE SESSÃO
    const objSessao = camadaSessao(tokenJWT);

    // 4. CAMADA DE TRANSPORTE
    const objTransporte = camadaTransporte(objSessao);

    // 5. CAMADA DE ENLACE (Note que a de Rede será na próxima página)
    const objEnlace = camadaEnlace(objTransporte);

    // 6. CAMADA FÍSICA
    const objFisica = camadaFisica(objEnlace);

    // Objeto unificado
    const osiCompleto = {
      aplicacao: objetoAplicacao,
      apresentacao: tokenJWT,
      sessao: objSessao,
      transporte: objTransporte,
      enlace: objEnlace,
      fisica: objFisica
    };

    // Salva os dados no localStorage e redireciona para a página de resultado
    localStorage.setItem('osi_payload', JSON.stringify(osiCompleto));
    localStorage.setItem('osi_token', tokenJWT);

    window.location.href = 'resultado.html';
  });
}