// Importa a biblioteca jose via CDN (skypack) para gerar Token JWT
import * as jose from 'https://cdn.skypack.dev/jose';

const USER_NAME = 'JH';

const user = document.querySelector('.user');
if (user) user.textContent = `Usuário: ${USER_NAME}`;

// Chave secreta usada para assinar o JWT (HS256)
const JWT_SECRET = new TextEncoder().encode('segredo-osi-redes-2024');

export async function processarApresentacao(objetoAplicacao) {
  // Gera um Token JWT assinado com o payload dos dados da Camada de Aplicação
  const token = await new jose.SignJWT({ ...objetoAplicacao })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET);

  return token;
}

export function gerarObjetoAplicacao(tipo, inputText, fileInput, dadosEmail) {
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
      // Pega os dados do formulário de e-mail específico
      const remetente = dadosEmail?.remetente || '';
      const destinatario = dadosEmail?.destinatario || '';
      const assunto = dadosEmail?.assunto || '';
      const corpo = dadosEmail?.corpo || '';

      // Validação: remetente e destinatário precisam conter '@' e '.com'
      if (!remetente.includes('@') || !remetente.includes('.com')) {
        alert('Erro na Camada de Aplicação: O e-mail do remetente precisa conter "@" e ".com".');
        return null;
      }
      if (!destinatario.includes('@') || !destinatario.includes('.com')) {
        alert('Erro na Camada de Aplicação: O e-mail do destinatário precisa conter "@" e ".com".');
        return null;
      }
      
      objeto = {
        tipo: 'email',
        remetente: remetente,
        destinatario: destinatario,
        assunto: assunto || 'Sem assunto',
        corpo: corpo || 'Sem corpo',
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