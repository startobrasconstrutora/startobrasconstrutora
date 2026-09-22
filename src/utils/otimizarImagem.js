import imageCompression from 'browser-image-compression';

export async function otimizarArquivo(file) {
  // Se não for imagem (ex: GIF ou PDF), retorna o arquivo original
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const opcoes = {
    maxSizeMB: 1.5,          // Tamanho máximo do arquivo final em MB
    maxWidthOrHeight: 1920,  // Redimensiona mantendo a proporção (Full HD)
    useWebWorker: true,      // Processa em segundo plano sem travar a interface
    fileType: 'image/jpeg',  // Converte WebP/PNG para JPEG otimizado
  };

  try {
    const arquivoComprimido = await imageCompression(file, opcoes);
    
    // Mantém o nome original do arquivo no Blob retornado
    return new File([arquivoComprimido], file.name, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Erro ao otimizar imagem, usando arquivo original:', error);
    return file; // Em caso de falha, retorna o arquivo original com segurança
  }
}