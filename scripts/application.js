const USER_NAME = 'JH';

const user = document.querySelector('.user');
if (user) user.textContent = `Usuário: ${USER_NAME}`;

export function aplicarCifraDeCesar(texto, deslocamento = 3) {
  if (typeof texto !== 'string' || !texto) return texto;
  
  return texto.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = (code >= 65 && code <= 90) ? 65 : 97;
      return String.fromCharCode(((code - base + deslocamento) % 26) + base);
    }
    return char; 
  }).join('');
}

export function processarApresentacao(objetoAplicacao) {
  const objetoCriptografado = { ...objetoAplicacao }; 

  if (objetoCriptografado.mensagem) objetoCriptografado.mensagem = aplicarCifraDeCesar(objetoCriptografado.mensagem);
  if (objetoCriptografado.corpo) objetoCriptografado.corpo = aplicarCifraDeCesar(objetoCriptografado.corpo);
  if (objetoCriptografado.hostIP) objetoCriptografado.hostIP = aplicarCifraDeCesar(objetoCriptografado.hostIP);
  if (objetoCriptografado.nomeArquivo) objetoCriptografado.nomeArquivo = aplicarCifraDeCesar(objetoCriptografado.nomeArquivo);

  return objetoCriptografado;
}

export function gerarObjetoAplicacao(tipo, inputText, fileInput) {
  const timestamp = new Date().toISOString();
  let objeto = {};

  switch(tipo) {
    case 'chat':
      objeto = {
        tipo: 'chat',
        usuario: USER_NAME,
        mensagem: inputText || 'Mensagem vazia',
        protocolo: 'WEBSOCKET',
        timestamp: timestamp
      };
      break;
      
    case 'site':
      // Validação: Precisa conter obrigatoriamente 'www' e '.com'
      if (!inputText.includes('www') || !inputText.includes('.com')) {
        alert('Erro na Camada de Aplicação: O site inserido precisa conter "www" e ".com" (ex: www.exemplo.com).');
        return null; // Retorna null para sinalizar que a validação falhou
      }
      
      objeto = {
        tipo: 'http_request',
        metodo: 'GET',
        hostIP: inputText,
        protocolo: 'HTTP/HTTPS',
        usuario: USER_NAME,
        timestamp: timestamp
      };
      break;
      
    case 'email':
      // Validação: Precisa conter obrigatoriamente '@' e '.com'
      if (!inputText.includes('@') || !inputText.includes('.com')) {
        alert('Erro na Camada de Aplicação: O e-mail inserido precisa conter "@" e ".com" (ex: teste@gmail.com).');
        return null; // Retorna null para sinalizar que a validação falhou
      }
      
      objeto = {
        remetente: USER_NAME,
        destinatario: inputText,
        assunto: 'Requisição de E-mail',
        corpo: 'Corpo da mensagem simulada',
        protocolo: 'SMTP/POP',
        timestamp: timestamp
      };
      break;
      
    case 'arquivo':
      let nomeArquivo = 'arquivo_padrao.txt';
      let formato = 'txt';
      
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        nomeArquivo = file.name;
        formato = file.type || file.name.split('.').pop();
      } else {
        alert('Por favor, selecione um arquivo válido antes de enviar!');
        return null;
      }
      
      objeto = {
        nomeArquivo: nomeArquivo,
        formato: formato,
        remetente: USER_NAME,
        protocolo: 'FTP/HTTP',
        timestamp: timestamp
      };
      break;
  }
  
  return objeto;
}