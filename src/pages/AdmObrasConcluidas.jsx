import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { redimensionarEComprimirImagem } from '../utils/imageUtils.js';
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
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  confirmDelete,
  showError,
} from '../utils/alert.js';

export default function AdmObrasConcluidas() {
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);
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
      showError('Erro ao carregar', 'Não foi possível carregar as obras concluídas');
      console.error('Erro:', err);
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
    const result = await confirmDelete(`${idsParaDeletar.length} obra(s) concluída(s)`);
    
    if (!result.isConfirmed) {
      return;
    }

    showLoading('Excluindo obras...');

    try {
      const { error } = await supabase
        .from('obras_concluidas')
        .delete()
        .in('id', idsParaDeletar);

      if (error) throw error;

      hideLoading();
      toastSuccess('Obra(s) concluída(s) removida(s) com sucesso!');
      setSelecionadas([]);
      buscarObrasConcluidas();
    } catch (err) {
      hideLoading();
      console.error('Erro ao deletar:', err);
      showError('Erro ao deletar', 'Verifique o console para detalhes');
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

  const handleNovasFotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    showLoading('Otimizando imagem(ns)...');

    try {
      const fotosOtimizadas = [];
      for (const file of files) {
        // Redimensiona (max 2000px) e comprime (max 1MB)
        const fileOtimizado = await redimensionarEComprimirImagem(file, 2000, 1024 * 1024);
        fotosOtimizadas.push(fileOtimizado);
      }
      setNovosArquivos((prev) => [...prev, ...fotosOtimizadas]);
    } catch (err) {
      console.error('Erro ao otimizar foto:', err);
      toastError('Erro ao processar as imagens.');
    } finally {
      hideLoading();
      e.target.value = '';
    }
  };

  const handleDragStart = (index) => setArrastandoIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setSobreIndex(index);
  };
  const handleDrop = (index) => {
    if (arrastandoIndex === null || arrastandoIndex === index) return;

    const fotosAtualizadas = [...obraEmEdicao.galeria_fotos];
    const [itemRemovido] = fotosAtualizadas.splice(arrastandoIndex, 1);
    fotosAtualizadas.splice(index, 0, itemRemovido);

    setObraEmEdicao({ ...obraEmEdicao, galeria_fotos: fotosAtualizadas });
    setArrastandoIndex(null);
    setSobreIndex(null);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    setSalvando(true);
    showLoading('Salvando alterações...');

    try {
      let fotosFinais = (obraEmEdicao.galeria_fotos || []).filter(
        (url) => !imagensParaRemover.includes(url)
      );

      if (novosArquivos.length > 0) {
        for (const file of novosArquivos) {
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
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
          nome_obra: obraEmEdicao.nome_obra,
          descricao: obraEmEdicao.descricao,
          tipo_obra: obraEmEdicao.tipo_obra,
          cidade: obraEmEdicao.cidade,
          galeria_fotos: fotosFinais,
          foto_capa: fotosFinais[0] || null
        })
        .eq('id', obraEmEdicao.id);

      if (updateError) throw updateError;

      hideLoading();
      toastSuccess('Obra concluída atualizada com sucesso!');
      setObraEmEdicao(null);
      buscarObrasConcluidas();
    } catch (err) {
      hideLoading();
      console.error('Erro ao salvar:', err);
      showError('Erro ao salvar', 'Verifique o console para detalhes');
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

      {carregando ? (
        <VazioLista>Carregando obras concluídas...</VazioLista>
      ) : obras.length === 0 ? (
        <VazioLista>Nenhuma obra concluída cadastrada até o momento.</VazioLista>
      ) : (
        <Grid>
          {obras.map((obra) => {
            const isEditing = obraEmEdicao?.id === obra.id;
            const capaUrl = obra.foto_capa || (obra.galeria_fotos && obra.galeria_fotos[0]) || '';

            if (isEditing) {
              return (
                <PainelEdicao key={obra.id}>
                  <h3>Editando: {obra.nome_obra}</h3>

                  <label>
                    <strong>Título da Obra:</strong>
                    <input
                      type="text"
                      value={obraEmEdicao.nome_obra || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, nome_obra: e.target.value })
                      }
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #d9d6cf' }}
                    />
                  </label>

                  <label>
                    <strong>Categoria:</strong>
                    <select
                      value={obraEmEdicao.tipo_obra || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, tipo_obra: e.target.value })
                      }
                      style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #d9d6cf' }}
                    >
                      <option value="">Selecione...</option>
                      <option value="construcao">Construção</option>
                      <option value="reforma">Reforma</option>
                    </select>
                  </label>

                  <label>
                    <strong>Localização:</strong>
                    <input
                      type="text"
                      value={obraEmEdicao.cidade || ''}
                      onChange={(e) =>
                        setObraEmEdicao({ ...obraEmEdicao, cidade: e.target.value })
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
                      {obraEmEdicao.galeria_fotos?.map((url, idx) => {
                        const marcada = imagensParaRemover.includes(url);
                        return (
                          <MiniaturaExistente
                            key={url}
                            $src={url}$marcada={marcada}
                            $sobre={sobreIndex === idx}$arrastando={arrastandoIndex === idx}
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
                      onChange={handleNovasFotosChange}
                      style={{ display: 'block', marginTop: '6px' }}
                    />
                    {novosArquivos.length > 0 && (
                      <span style={{ fontSize: '12px', color: '#2e7d32', marginTop: '4px', display: 'block' }}>
                        ✓ {novosArquivos.length} foto(s) otimizada(s) pronta(s) para envio.
                      </span>
                    )}
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
                  {obra.tipo_obra && <SeloTipo>{obra.tipo_obra}</SeloTipo>}
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
                  <NomeObra>{obra.nome_obra}</NomeObra>
                  {obra.cidade && <LinhaSecundaria>{obra.cidade}</LinhaSecundaria>}
                  <LinhaSecundaria>{obra.galeria_fotos?.length || 0} foto(s) cadastrada(s)</LinhaSecundaria>
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