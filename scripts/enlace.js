import md5 from 'https://esm.sh/md5@2';

function generateMAC() {
    return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
        return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
    });
}

function getMacOrigem() {
    let mac = localStorage.getItem('macOrigem');
    if (!mac) {
        mac = generateMAC();
        localStorage.setItem('macOrigem', mac);
    }
    return mac;
}

export function camadaEnlace(pacotes) {
    let idCounter = 1;
    const quadros = pacotes.map(pacote => {
        const quadroBase = {
            frameId: `F${String(idCounter++).padStart(3, '0')}`,
            macOrigem: getMacOrigem(),
            macDestino: generateMAC(),
            tipo: "IPv4",
            dados: pacote
        };
        
        const crc = md5(JSON.stringify(quadroBase));
        
        return {
            ...quadroBase,
            crc: crc
        };
    });

    console.log("CAMADA DE ENLACE", quadros);
    return quadros;
}
