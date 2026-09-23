import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { redimensionarEComprimirImagem } from '../utils/imageUtils.js';
import {
  Wrapper,
  Formulario,
  GrupoInput,
  Rotulo,
  InputText,
  TextArea,
  GradeFotos,
  CardFotoPreview,
  BotaoRemoverFoto,
  BotaoSubmit,
} from './Addobras.styles';
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  showError,
} from '../utils/alert.js';

export default function AddObraConcluida() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');

  const [arquivos, setArquivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const handleFotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    showLoading('Otimizando imagem(ns)...');

    try {
      const fotosOtimizadas = [];

      for (const file of files) {
        const fileOtimizado = await redimensionarEComprimirImagem(file, 2000, 1024 * 1024);
        fotosOtimizadas.push(fileOtimizado);
      }

      setArquivos((prev) => [...prev, ...fotosOtimizadas]);

      const novosPreviews = fotosOtimizadas.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...novosPreviews]);
    } catch (err) {
      console.error('Erro ao otimizar foto:', err);
      toastError('Erro ao processar as imagens.');
    } finally {
      hideLoading();
      e.target.value = '';
    }
  };

  const removerFoto = (index) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      toastError('Preencha o título da obra');
      return;
    }

    if (!categoria) {
      toastError('Selecione uma categoria');
      return;
    }

    if (arquivos.length === 0) {
      toastError('Adicione pelo menos uma foto');
      return;
    }

    setEnviando(true);
    showLoading('Cadastrando obra concluída...');

    try {
      const fotosUrls = [];

      for (const file of arquivos) {
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const filePath = `obras_concluidas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('obras')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('obras')
          .getPublicUrl(filePath);

        fotosUrls.push(publicUrlData.publicUrl);
      }

      const { error: insertError } = await supabase
        .from('obras_concluidas')
        .insert([
          {
            nome_obra: titulo,
            tipo_obra: categoria,
            cidade: localizacao,
            descricao,
            galeria_fotos: fotosUrls,
            foto_capa: fotosUrls[0] || null
          }
        ]);

      if (insertError) throw insertError;

      hideLoading();
      toastSuccess('Obra concluída cadastrada com sucesso!');

      setTitulo('');
      setCategoria('');
      setLocalizacao('');
      setDescricao('');
      setArquivos([]);
      setPreviews([]);
    } catch (err) {
      hideLoading();
      console.error('Erro ao cadastrar obra:', err);
      showError('Erro ao cadastrar', 'Verifique o console para detalhes');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Wrapper>
      <h2>Cadastrar Obra Concluída</h2>

      <Formulario onSubmit={handleSubmit}>
        <GrupoInput>
          <Rotulo>Título da Obra *</Rotulo>
          <InputText
            type="text"
            placeholder="Ex: Residência Villa Lobos"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </GrupoInput>

        <GrupoInput>
          <Rotulo>Categoria *</Rotulo>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="">Selecione...</option>
            <option value="construcao">Construção</option>
            <option value="reforma">Reforma</option>
          </select>
        </GrupoInput>

        <GrupoInput>
          <Rotulo>Localização</Rotulo>
          <InputText
            type="text"
            placeholder="Ex: Bauru - SP"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </GrupoInput>

        <GrupoInput>
          <Rotulo>Descrição</Rotulo>
          <TextArea
            rows={4}
            placeholder="Detalhes sobre a entrega, acabamentos, etc."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </GrupoInput>

        <GrupoInput>
          <Rotulo>Fotos da Obra Concluída</Rotulo>
          <div style={{
            border: '2px dashed #ccc',
            borderRadius: '6px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#fafafa'
          }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFotosChange}
              style={{ width: '100%' }}
            />
          </div>
        </GrupoInput>

        {previews.length > 0 && (
          <GradeFotos>
            {previews.map((src, index) => (
              <CardFotoPreview key={index}>
                <img src={src} alt={`Preview ${index + 1}`} />
                <BotaoRemoverFoto type="button" onClick={() => removerFoto(index)}>
                  ✕
                </BotaoRemoverFoto>
              </CardFotoPreview>
            ))}
          </GradeFotos>
        )}

        <BotaoSubmit type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar Obra Concluída'}
        </BotaoSubmit>
      </Formulario>
    </Wrapper>
  );
}