import { gerarObjetoAplicacao, processarApresentacao } from "./application.js";

const reqBtn = document.querySelector('.request-btn');
const selectTipo = document.querySelector('#tipo-req');
const inputTexto = document.querySelector('#text-input');
const inputArquivo = document.querySelector('#arquivo');
const protocolName = document.querySelector('.protocol-name');

// Lógica para exibir o botão de arquivo EXCLUSIVAMENTE na opção 'arquivo'
if (selectTipo && inputArquivo && inputTexto) {
  // Estado inicial padrão: Como o select começa em 'chat', ocultamos o input de arquivo
  inputArquivo.style.display = 'none';

  selectTipo.addEventListener('change', function() {
    if (selectTipo.value === 'arquivo') {
      inputArquivo.style.display = 'inline-block'; // Exibe o botão de arquivo
      inputTexto.style.display = 'none';           // Oculta o campo de texto comum para limpar o visual
    } else {
      inputArquivo.style.display = 'none';         // Oculta o botão de arquivo para as outras opções
      inputTexto.style.display = 'inline-block';   // Exibe o campo de texto para chat, site e e-mail
    }
  });
}

if (reqBtn) {
  reqBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    const tipo = selectTipo.value;
    const texto = inputTexto.value;
    
    // 1. CAMADA DE APLICAÇÃO: Executa a formatação e as validações dos ifs
    const objetoAplicacao = gerarObjetoAplicacao(tipo, texto, inputArquivo);
    
    // Se o retorno for null significa que o if barrou a execução (formato errado)
    if (!objetoAplicacao) {
      return; 
    }
    
    // Atualiza o nome do protocolo na tela
    protocolName.textContent = objetoAplicacao.protocolo;
    
    // 2. CAMADA DE APRESENTAÇÃO: Aplica a Cifra de César nos dados validados
    const objetoCriptografado = processarApresentacao(objetoAplicacao);
    
    // Logs de verificação no Console do Desenvolvedor (F12)
    console.log("=== 1. CAMADA DE APLICAÇÃO (Dados Originais) ===");
    console.log(objetoAplicacao);
    
    console.log("=== 2. CAMADA DE APRESENTAÇÃO (Cifra de César Aplicada) ===");
    console.log(objetoCriptografado);
    
    // Exibe o resultado final com sucesso
    alert(`Requisição Aceita e Processada!\n\nProtocolo: ${objetoCriptografado.protocolo}\n\nPayload:\n${JSON.stringify(objetoCriptografado, null, 2)}`);
    
    // Limpa o campo de texto para a próxima interação
    inputTexto.value = '';
  });
}