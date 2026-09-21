/**
 * Redimensiona e comprime uma imagem no navegador mantendo a proporção.
 * 
 * @param {File} file - Arquivo de imagem do input
 * @param {number} maxDimensao - Limite máximo de largura ou altura (padrão: 2000px)
 * @param {number} limiteBytes - Peso máximo final em bytes (padrão: 1MB)
 * @returns {Promise<File>} Arquivo otimizado em formato JPEG
 */
export function redimensionarEComprimirImagem(
  file,
  maxDimensao = 2000,
  limiteBytes = 1 * 1024 * 1024
) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);

    img.onload = () => {
      let { width, height } = img;

      // Redimensiona mantendo a proporção proporcional
      if (width > maxDimensao || height > maxDimensao) {
        if (width > height) {
          height = Math.round((height * maxDimensao) / width);
          width = maxDimensao;
        } else {
          width = Math.round((width * maxDimensao) / height);
          height = maxDimensao;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      let qualidade = 0.88; // Qualidade inicial de 88%

      const tentarComprimir = (q) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erro ao processar a imagem no Canvas'));
              return;
            }

            // Reduz a qualidade em passos se ainda exceder o limite de 1MB
            if (blob.size > limiteBytes && q > 0.2) {
              tentarComprimir(parseFloat((q - 0.15).toFixed(2)));
            } else {
              const novoNome = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const novoArquivo = new File([blob], novoNome, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(novoArquivo);
            }
          },
          'image/jpeg',
          q
        );
      };

      tentarComprimir(qualidade);
    };

    reader.readAsDataURL(file);
  });
}