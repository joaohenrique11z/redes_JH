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

// Detecta automaticamente o tipo de requisição com base no texto digitado
export function gerarObjetoAplicacao(inputText, fileInput, dadosEmail) {
  const timestamp = new Date().toISOString();
  let objeto = {};

  if (inputText.includes('@')) {
    // --- E-MAIL: identificado pelo '@' no texto ---
    // Validação: precisa conter '@' e '.com'
    if (!inputText.includes('.com')) {
      alert('Erro na Camada de Aplicação: O e-mail precisa conter "@" e ".com" (ex: teste@gmail.com).');
      return null;
    }

    objeto = {
      tipo: 'email',
      remetente: USER_NAME,
      destinatario: inputText,
      assunto: dadosEmail?.assunto || 'Sem assunto',
      corpo: dadosEmail?.corpo || 'Sem corpo',
      protocolo: 'SMTP/POP',
      timestamp: timestamp
    };

  } else if (inputText.includes('www') && inputText.includes('.com')) {
    // --- HTTP: identificado por 'www' e '.com' ---
    objeto = {
      tipo: 'http_request',
      metodo: 'GET',
      hostIP: inputText,
      protocolo: 'HTTP/HTTPS',
      usuario: USER_NAME,
      timestamp: timestamp
    };

  } else if (fileInput && fileInput.files && fileInput.files.length > 0) {
    // --- ARQUIVO: identificado pela presença de um arquivo selecionado ---
    const file = fileInput.files[0];
    objeto = {
      nomeArquivo: file.name,
      formato: file.type || file.name.split('.').pop(),
      remetente: USER_NAME,
      protocolo: 'FTP/HTTP',
      timestamp: timestamp
    };

  } else if (inputText.trim() !== '') {
    // --- CHAT/WEBSOCKET: qualquer texto que não se encaixe nos anteriores ---
    objeto = {
      tipo: 'chat',
      usuario: USER_NAME,
      mensagem: inputText,
      protocolo: 'WEBSOCKET',
      timestamp: timestamp
    };

  } else {
    // Nenhum dado válido foi fornecido
    alert('Por favor, insira um texto, URL, e-mail ou selecione um arquivo antes de enviar!');
    return null;
  }

  return objeto;
}