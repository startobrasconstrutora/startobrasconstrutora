import React, { useState } from 'react';
import * as S from './Addobras.styles.jsx';
import { supabase } from '../supabaseClient';
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  showError,
} from '../utils/alert.js';

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddMateria({ onCadastrar }) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [dataPublicacao, setDataPublicacao] = useState(hojeISO());
  const [imagem, setImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  function selecionarImagem(file) {
    if (!file) return;
    const LIMITE_MB = 5;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      toastError(`A imagem deve ter no máximo ${LIMITE_MB}MB`);
      return;
    }
    setImagem(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removerImagem() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImagem(null);
    setPreviewUrl(null);
  }

  async function handleCadastrar() {
    if (!titulo.trim()) {
      toastError('Preencha o título da matéria');
      return;
    }

    if (!texto.trim()) {
      toastError('Preencha o texto da matéria');
      return;
    }

    if (!imagem) {
      toastError('Adicione uma imagem de capa');
      return;
    }

    setCadastrando(true);
    showLoading('Cadastrando matéria...');

    try {
      const extensao = imagem.name.split('.').pop();
      const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;
      const caminho = `materias/${nomeArquivo}`;

      const { error: erroUpload } = await supabase.storage
        .from('obras')
        .upload(caminho, imagem);

      if (erroUpload) throw erroUpload;

      const { data: urlData } = supabase.storage
        .from('obras')
        .getPublicUrl(caminho);

      const { error: erroInsert } = await supabase
        .from('materias')
        .insert({
          titulo: titulo.trim(),
          texto: texto.trim(),
          imagem: urlData.publicUrl,
          data_publicacao: dataPublicacao,
        });

      if (erroInsert) throw erroInsert;

      hideLoading();
      toastSuccess('Matéria cadastrada com sucesso!');

      onCadastrar?.();

      setTitulo('');
      setTexto('');
      setDataPublicacao(hojeISO());
      removerImagem();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao cadastrar matéria:', erro);
      showError('Erro ao cadastrar', 'Verifique o console para detalhes');
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <S.Painel>
      <S.TituloPainel>MATÉRIA</S.TituloPainel>

      <S.Formulario onSubmit={(e) => e.preventDefault()}>
        <S.Secao>
          <S.TituloSecao>Conteúdo</S.TituloSecao>
          <S.Campo>
            <S.Label htmlFor="tituloMateria">Título</S.Label>
            <S.Input
              id="tituloMateria"
              type="text"
              placeholder="Título da matéria"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </S.Campo>

          <S.Campo>
            <S.Label htmlFor="dataMateria">Data de Publicação</S.Label>
            <S.Input
              id="dataMateria"
              type="date"
              value={dataPublicacao}
              onChange={(e) => setDataPublicacao(e.target.value)}
            />
          </S.Campo>

          <S.Campo>
            <S.ContadorTexto>{texto.length}/3000</S.ContadorTexto>
            <S.Label htmlFor="textoMateria">Texto</S.Label>
            <S.TextArea
              id="textoMateria"
              maxLength={3000}
              rows={10}
              placeholder="Escreva o conteúdo da matéria"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </S.Campo>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Imagem de Capa</S.TituloSecao>
          {previewUrl ? (
            <div style={{ position: 'relative', width: 220, height: 140 }}>
              <img
                src={previewUrl}
                alt="Prévia"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
              />
              <button
                type="button"
                onClick={removerImagem}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(30, 30, 30, 0.7)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <label
              style={{
                width: 220,
                height: 140,
                borderRadius: 8,
                border: '1px dashed #d9d6cf',
                background: '#f3f1eb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer',
                color: '#6e7178',
                fontSize: 12,
                fontWeight: 600,
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 22 }}>＋</span>
              Adicionar Imagem
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  selecionarImagem(e.target.files[0]);
                  e.target.value = '';
                }}
                style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0 }}
              />
            </label>
          )}
        </S.Secao>

        <S.BotaoEnviar type="button" onClick={handleCadastrar} disabled={cadastrando}>
          {cadastrando ? 'Cadastrando...' : 'Cadastrar Matéria'}
        </S.BotaoEnviar>
      </S.Formulario>
    </S.Painel>
  );
}