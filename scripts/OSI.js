import { gerarObjetoAplicacao, processarApresentacao } from "./application.js";

const reqBtn = document.querySelector('.request-btn');
const selectTipo = document.querySelector('#tipo-req');
const inputTexto = document.querySelector('#text-input');
const inputArquivo = document.querySelector('#arquivo');
const protocolName = document.querySelector('.protocol-name');
const emailForm = document.querySelector('#email-form');

// Lógica para exibir o botão de arquivo EXCLUSIVAMENTE na opção 'arquivo'
// e exibir o formulário de e-mail EXCLUSIVAMENTE na opção 'email'
if (selectTipo && inputArquivo && inputTexto) {
  // Estado inicial padrão: Como o select começa em 'chat', ocultamos o input de arquivo
  inputArquivo.style.display = 'none';

  selectTipo.addEventListener('change', function() {
    if (selectTipo.value === 'arquivo') {
      inputArquivo.style.display = 'inline-block'; // Exibe o botão de arquivo
      inputTexto.style.display = 'none';           // Oculta o campo de texto comum para limpar o visual
      if (emailForm) emailForm.style.display = 'none'; // Oculta o formulário de e-mail
    } else if (selectTipo.value === 'email') {
      inputArquivo.style.display = 'none';         // Oculta o botão de arquivo
      inputTexto.style.display = 'none';           // Oculta o campo de texto comum
      if (emailForm) emailForm.style.display = 'block'; // Exibe o formulário de e-mail
    } else {
      inputArquivo.style.display = 'none';         // Oculta o botão de arquivo para as outras opções
      inputTexto.style.display = 'inline-block';   // Exibe o campo de texto para chat e site
      if (emailForm) emailForm.style.display = 'none'; // Oculta o formulário de e-mail
    }
  });
}

if (reqBtn) {
  reqBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    
    const tipo = selectTipo.value;
    const texto = inputTexto.value;
    
    // Captura os campos do formulário de e-mail, se existirem
    const dadosEmail = {
      remetente: document.querySelector('#email-remetente')?.value || '',
      destinatario: document.querySelector('#email-destinatario')?.value || '',
      assunto: document.querySelector('#email-assunto')?.value || '',
      corpo: document.querySelector('#email-corpo')?.value || ''
    };
    
    // 1. CAMADA DE APLICAÇÃO: Executa a formatação e as validações dos ifs
    const objetoAplicacao = gerarObjetoAplicacao(tipo, texto, inputArquivo, dadosEmail);
    
    // Se o retorno for null significa que o if barrou a execução (formato errado)
    if (!objetoAplicacao) {
      return; 
    }
    
    // Atualiza o nome do protocolo na tela
    protocolName.textContent = objetoAplicacao.protocolo;
    
    // Logs de verificação no Console do Desenvolvedor (F12)
    console.log("=== 1. CAMADA DE APLICAÇÃO (Dados Originais) ===");
    console.log(objetoAplicacao);
    
    // 2. CAMADA DE APRESENTAÇÃO: Gera o Token JWT com os dados validados
    const tokenJWT = await processarApresentacao(objetoAplicacao);
    
    console.log("=== 2. CAMADA DE APRESENTAÇÃO (Token JWT Gerado) ===");
    console.log(tokenJWT);
    
    // Salva os dados no localStorage e redireciona para a página de resultado
    localStorage.setItem('osi_payload', JSON.stringify(objetoAplicacao));
    localStorage.setItem('osi_token', tokenJWT);
    
    window.location.href = 'resultado.html';
  });
}