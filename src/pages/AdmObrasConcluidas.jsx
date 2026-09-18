import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Wrapper,
  CabecalhoLista,
  TituloLista,
  AcoesLista,
  Aviso,
  Grid,
  Card,
  Thumb,
  SeloTipo,
  CaixaSelecao,
  CardCorpo,
  NomeObra,
  LinhaSecundaria,
  CardRodape,
  BotaoPequeno,
  PainelEdicao,
  GridImagensExistentes,
  MiniaturaExistente,
  AlcaArrastar,
  BotaoRemoverImagem,
  EtiquetaPrincipal,
  LinhaBotoesEdicao,
  BotaoSalvar,
  BotaoCancelar,
  VazioLista
} from './admobras.styles';

export default function AdmObrasConcluidas() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });
  const [selecionadas, setSelecionadas] = useState([]);
  
  const [obraEmEdicao, setObraEmEdicao] = useState(null);
  const [novosArquivos, setNovosArquivos] = useState([]);
  const [imagensParaRemover, setImagensParaRemover] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const [arrastandoIndex, setArrastandoIndex] = useState(null);
  const [sobreIndex, setSobreIndex] = useState(null);

  useEffect(() => {
    buscarObrasConcluidas();
  }, []);

  const buscarObrasConcluidas = async () => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('obras_concluidas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setObras(data || []);
    } catch (err) {
      setMensagem({ texto: 'Erro ao carregar obras concluídas: ' + err.message, erro: true });
    } finally {
      setCarregando(false);
    }
  };

  const toggleSelecionar = (id) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelecionarTodas = () => {
    if (selecionadas.length === obras.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(obras.map((o) => o.id));
    }
  };

  const deletarObras = async (idsParaDeletar) => {
    if (!window.confirm(`Deseja realmente excluir ${idsParaDeletar.length} obra(s) concluída(s)?`)) return;

    try {
      const { error } = await supabase
        .from('obras_concluidas')
        .delete()
        .in('id', idsParaDeletar);

      if (error) throw error;

      setMensagem({ texto: 'Obra(s) concluída(s) removida(s) com sucesso!', erro: false });
      setSelecionadas([]);
      buscarObrasConcluidas();
    } catch (err) {
      setMensagem({ texto: 'Erro ao deletar: ' + err.message, erro: true });
    }
  };

  const iniciarEdicao = (obra) => {
    setObraEmEdicao({ ...obra });
    setImagensParaRemover([]);
    setNovosArquivos([]);
  };

  const marcarParaRemoverImagem = (url) => {
    if (imagensParaRemover.includes(url)) {
      setImagensParaRemover((prev) => prev.filter((item) => item !== url));
    } else {
      setImagensParaRemover((prev) => [...prev, url]);
    }
  };

  const handleDragStart = (index) => setArrastandoIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setSobreIndex(index);
  };
  const handleDrop = (index) => {
    if (arrastandoIndex === null || arrastandoIndex === index) return;
    
    const fotosAtualizadas = [...obraEmEdicao.fotos];
    const [itemRemovido] = fotosAtualizadas.splice(arrastandoIndex, 1);
    fotosAtualizadas.splice(index, 0, itemRemovido);

    setObraEmEdicao({ ...obraEmEdicao, fotos: fotosAtualizadas });
    setArrastandoIndex(null);
    setSobreIndex(null);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem({ texto: '', erro: false });

    try {
      let fotosFinais = (obraEmEdicao.fotos || []).filter(
        (url) => !imagensParaRemover.includes(url)
      );

      if (novosArquivos.length > 0) {
        for (const file of novosArquivos) {
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

          fotosFinais.push(publicUrlData.publicUrl);
        }
      }

      const { error: updateError } = await supabase
        .from('obras_concluidas')
        .update({
          titulo: obraEmEdicao.titulo,
          descricao: obraEmEdicao.descricao,
          categoria: obraEmEdicao.categoria,
          localizacao: obraEmEdicao.localizacao,
          fotos: fotosFinais,
          capa: fotosFinais[0] || null
        })
        .eq('id', obraEmEdicao.id);

      if (updateError) throw updateError;

      setMensagem({ texto: 'Obra concluída atualizada com sucesso!', erro: false });
      setObraEmEdicao(null);
      buscarObrasConcluidas();
    } catch (err) {
      setMensagem({ texto: 'Erro ao salvar alterações: ' + err.message, erro: true });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Wrapper>
      <CabecalhoLista>
        <TituloLista>Gerenciar Obras Concluídas ({obras.length})</TituloLista>
        <AcoesLista>
          {obras.length > 0 && (
            <BotaoPequeno type="button" onClick={toggleSelecionarTodas}>
              {selecionadas.length === obras.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
            </BotaoPequeno>
          )}
          {selecionadas.length > 0 && (
            <BotaoPequeno $perigo type="button" onClick={() => deletarObras(selecionadas)}>
              Excluir Selecionadas ({selecionadas.length})
            </BotaoPequeno>
          )}
        </AcoesLista>
      </CabecalhoLista>

      {mensagem.texto && <Aviso $erro={mensagem.erro}>{mensagem.texto}</Aviso>}

      {carregando ? (
        <VazioLista>Carregando obras concluídas...</VazioLista>
      ) : obras.length === 0 ? (
        <VazioLista>Nenhuma obra concluída cadastrada até o momento.</VazioLista>
      ) : (
        <Grid>
          {obras.map((obra) => {
            const isEditing = obraEmEdicao?.id === obra.id;
            const capaUrl = obra.capa || (obra.fotos && obra.fotos[0]) || '';

            if (isEditing) {
              return (
                <PainelEdicao key={obra.id}>
                  <h3>Editando: {obra.titulo}</h3>

                  <label>
                    <strong>Título da Obra:</strong>
                    <input
                      type="text"
                      value={obraEmEdicao.titulo || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, titulo: e.target.value })
                      }
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #d9d6cf' }}
                    />
                  </label>

                  <label>
                    <strong>Categoria:</strong>
                    <input
                      type="text"
                      value={obraEmEdicao.categoria || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, categoria: e.target.value })
                      }
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #d9d6cf' }}
                    />
                  </label>

                  <label>
                    <strong>Localização:</strong>
                    <input
                      type="text"
                      value={obraEmEdicao.localizacao || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, localizacao: e.target.value })
                      }
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #d9d6cf' }}
                    />
                  </label>

                  <label>
                    <strong>Descrição:</strong>
                    <textarea
                      rows={4}
                      value={obraEmEdicao.descricao || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, descricao: e.target.value })
                      }
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #d9d6cf' }}
                    />
                  </label>

                  <div>
                    <strong>Organizar Imagens Existentes (Arraste para reordenar):</strong>
                    <GridImagensExistentes style={{ marginTop: '10px' }}>
                      {obraEmEdicao.fotos?.map((url, idx) => {
                        const marcada = imagensParaRemover.includes(url);
                        return (
                          <MiniaturaExistente
                            key={url}
                            $src={url}
                            $marcada={marcada}
                            $sobre={sobreIndex === idx}
                            $arrastando={arrastandoIndex === idx}
                            draggable={!marcada}
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={() => handleDrop(idx)}
                          >
                            <AlcaArrastar>⋮⋮</AlcaArrastar>
                            {idx === 0 && !marcada && <EtiquetaPrincipal>Capa</EtiquetaPrincipal>}
                            <BotaoRemoverImagem
                              type="button"
                              $marcada={marcada}
                              onClick={() => marcarParaRemoverImagem(url)}
                            >
                              {marcada ? 'Restaurar' : 'Remover'}
                            </BotaoRemoverImagem>
                          </MiniaturaExistente>
                        );
                      })}
                    </GridImagensExistentes>
                  </div>

                  <label>
                    <strong>Adicionar Novas Fotos:</strong>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setNovosArquivos(Array.from(e.target.files))}
                      style={{ display: 'block', marginTop: '6px' }}
                    />
                  </label>

                  <LinhaBotoesEdicao>
                    <BotaoCancelar type="button" onClick={() => setObraEmEdicao(null)}>
                      Cancelar
                    </BotaoCancelar>
                    <BotaoSalvar type="button" onClick={salvarEdicao} disabled={salvando}>
                      {salvando ? 'Salvando...' : 'Salvar Alterações'}
                    </BotaoSalvar>
                  </LinhaBotoesEdicao>
                </PainelEdicao>
              );
            }

            return (
              <Card key={obra.id}>
                <Thumb $src={capaUrl}>
                  {obra.categoria && <SeloTipo>{obra.categoria}</SeloTipo>}
                  <CaixaSelecao>
                    <input
                      type="checkbox"
                      checked={selecionadas.includes(obra.id)}
                      onChange={() => toggleSelecionar(obra.id)}
                    />
                  </CaixaSelecao>
                  {!capaUrl && 'Sem Foto'}
                </Thumb>

                <CardCorpo>
                  <NomeObra>{obra.titulo}</NomeObra>
                  {obra.localizacao && <LinhaSecundaria>{obra.localizacao}</LinhaSecundaria>}
                  <LinhaSecundaria>{obra.fotos?.length || 0} foto(s) cadastrada(s)</LinhaSecundaria>
                </CardCorpo>

                <CardRodape>
                  <BotaoPequeno type="button" onClick={() => iniciarEdicao(obra)}>
                    Editar
                  </BotaoPequeno>
                  <BotaoPequeno $perigo type="button" onClick={() => deletarObras([obra.id])}>
                    Excluir
                  </BotaoPequeno>
                </CardRodape>
              </Card>
            );
          })}
        </Grid>
      )}
    </Wrapper>
  );
}