import React, { useState } from 'react';
import { redimensionarEComprimirImagem } from '../utils/imageUtils.js';
import { showLoading, hideLoading, toastError } from '../utils/alert.js';

export default function ImageUploader({ fotos = [], onFotosChange, maxFotos = 10 }) {
  const [processando, setProcessando] = useState(false);

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (fotos.length + files.length > maxFotos) {
      toastError(`Você pode enviar no máximo ${maxFotos} fotos.`);
      return;
    }

    setProcessando(true);
    showLoading('Otimizando imagem...');

    try {
      const novasFotosOtimizadas = [];

      for (const file of files) {
        // Aplica as regras: máx 2000px e máx 1MB
        const fileOtimizado = await redimensionarEComprimirImagem(file, 2000, 1 * 1024 * 1024);
        
        novasFotosOtimizadas.push({
          id: crypto.randomUUID(),
          arquivo: fileOtimizado,
          previewUrl: URL.createObjectURL(fileOtimizado),
        });
      }

      onFotosChange([...fotos, ...novasFotosOtimizadas]);
    } catch (err) {
      console.error('Erro ao otimizar foto:', err);
      toastError('Erro ao processar imagem.');
    } finally {
      hideLoading();
      setProcessando(false);
      e.target.value = ''; // Limpa o input
    }
  }

  function handleRemoveFoto(idFoto) {
    const fotoParaRemover = fotos.find((f) => f.id === idFoto);
    if (fotoParaRemover) {
      URL.revokeObjectURL(fotoParaRemover.previewUrl);
    }
    onFotosChange(fotos.filter((f) => f.id !== idFoto));
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
      {fotos.map((foto) => (
        <div
          key={foto.id}
          style={{
            position: 'relative',
            width: 110,
            height: 110,
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid #d9d6cf',
          }}
        >
          <img
            src={foto.previewUrl}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            type="button"
            onClick={() => handleRemoveFoto(foto.id)}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: 'rgba(0, 0, 0, 0.65)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 22,
              height: 22,
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {fotos.length < maxFotos && (
        <label
          style={{
            width: 110,
            height: 110,
            borderRadius: 8,
            border: '2px dashed #d9d6cf',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: processando ? 'wait' : 'pointer',
            background: '#fff',
            fontSize: 12,
            color: '#6e7178',
            gap: 4,
            opacity: processando ? 0.6 : 1,
          }}
        >
          <span style={{ fontSize: 20 }}>📷</span>
          <span>{processando ? 'Otimizando...' : 'Adicionar'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={processando}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </label>
      )}
    </div>
  );
}