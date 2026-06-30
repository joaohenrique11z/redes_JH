import * as jose from 'https://esm.sh/jose@6';

async function getDNS(domain) {
    try {
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '').split('/')[0];
        if (cleanDomain.includes('@') || cleanDomain.trim() === '') return "8.8.8.8"; 
        const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}`);
        const data = await response.json();
        if (data.Answer && data.Answer.length > 0) {
            return data.Answer[0].data;
        }
        return "192.168.1.1";
    } catch (e) {
        return "192.168.1.1";
    }
}

async function getEncryptionKey() {
    let rawKey = localStorage.getItem('aesKey');
    if (!rawKey) {
        const key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const exported = await crypto.subtle.exportKey("jwk", key);
        localStorage.setItem('aesKey', JSON.stringify(exported));
        return key;
    } else {
        const jwk = JSON.parse(rawKey);
        return await crypto.subtle.importKey(
            "jwk",
            jwk,
            { name: "AES-GCM" },
            true,
            ["encrypt", "decrypt"]
        );
    }
}

async function encryptData(text, key) {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(text)
    );
    const encryptedArray = Array.from(new Uint8Array(encrypted));
    const ivArray = Array.from(iv);
    return {
        cipherText: btoa(String.fromCharCode(...encryptedArray)),
        iv: btoa(String.fromCharCode(...ivArray))
    };
}

export async function camadaApresentacao(payloadAplicacao) {
    const ipResolvido = await getDNS(payloadAplicacao.dominioOriginal);
    const key = await getEncryptionKey();
    const encrypted = await encryptData(payloadAplicacao.dados, key);
    
    const secret = new TextEncoder().encode('minha-chave-secreta-osi');
    const jwt = await new jose.SignJWT({ protocol: payloadAplicacao.protocolo })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

    const payload = {
        protocolo: payloadAplicacao.protocolo,
        textoOriginal: payloadAplicacao.dados,
        ipResolvido: ipResolvido,
        jwtToken: jwt,
        dadosCriptografados: encrypted
    };

    console.log("CAMADA DE APRESENTAÇÃO", payload);
    return payload;
}
