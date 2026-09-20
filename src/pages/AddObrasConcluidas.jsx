import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
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
  Aviso
} from './Addobras.styles';

export default function AddObraConcluida() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');

  const [arquivos, setArquivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });

  const handleFotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const novosArquivos = [...arquivos, ...files];
    setArquivos(novosArquivos);

    const novosPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...novosPreviews]);
  };

  const removerFoto = (index) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setMensagem({ texto: 'Por favor, preencha ao menos o título da obra.', erro: true });
      return;
    }

    setEnviando(true);
    setMensagem({ texto: '', erro: false });

    try {
      const fotosUrls = [];

      for (const file of arquivos) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
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

      // Mapeamento para os nomes reais das colunas da tabela obras_concluidas.
      // numero_obra é coluna identity (auto-incremento) e não deve ser enviado.
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

      setMensagem({ texto: 'Obra concluída cadastrada com sucesso!', erro: false });

      setTitulo('');
      setCategoria('');
      setLocalizacao('');
      setDescricao('');
      setArquivos([]);
      setPreviews([]);
    } catch (err) {
      setMensagem({ texto: 'Erro ao cadastrar obra: ' + err.message, erro: true });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Wrapper>
      <h2>Cadastrar Obra Concluída</h2>

      {mensagem.texto && <Aviso $erro={mensagem.erro}>{mensagem.texto}</Aviso>}

      <Formulario onSubmit={handleSubmit}>
        <GrupoInput>
          <Rotulo>Título da Obra *</Rotulo>
          <InputText
            type="text"
            placeholder="Ex: Residência Villa Lobos"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </GrupoInput>

        <GrupoInput>
          <Rotulo>Categoria *</Rotulo>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
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
