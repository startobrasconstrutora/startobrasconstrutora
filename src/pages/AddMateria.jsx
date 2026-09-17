import React, { useState, useRef } from 'react';
import * as S from './Addobras.styles.jsx';
import { supabase } from '../supabaseClient';

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
  const [notificacao, setNotificacao] = useState(null);
  const notificacaoTimeoutRef = useRef(null);

  function selecionarImagem(file) {
    if (!file) return;
    const LIMITE_MB = 5;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      alert(`A imagem deve ter no máximo ${LIMITE_MB}MB.`);
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
      alert('Preencha o título da matéria.');
      return;
    }
    if (!texto.trim()) {
      alert('Preencha o texto da matéria.');
      return;
    }
    if (!imagem) {
      alert('Adicione uma imagem de capa.');
      return;
    }

    setCadastrando(true);
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

      setNotificacao('Matéria cadastrada!');
      window.clearTimeout(notificacaoTimeoutRef.current);
      notificacaoTimeoutRef.current = window.setTimeout(() => setNotificacao(null), 5000);

      onCadastrar?.();

      setTitulo('');
      setTexto('');
      setDataPublicacao(hojeISO());
      removerImagem();
    } catch (erro) {
      console.error('Erro ao cadastrar matéria:', erro);
      alert('Erro ao cadastrar matéria. Veja o console para detalhes.');
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <S.Painel>
      {notificacao && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            background: '#1e1e1e',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>✅</span>
          <strong style={{ fontSize: 14 }}>{notificacao}</strong>
          <button
            type="button"
            onClick={() => setNotificacao(null)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

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