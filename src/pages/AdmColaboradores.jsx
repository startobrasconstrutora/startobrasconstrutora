import React, { useState, useEffect } from 'react';
import * as S from './AddColaboradores.styles.jsx';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone } from './mascaras';
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  confirmDelete,
  showError,
} from '../utils/alert.js';

const FUNCOES_DISPONÍVEIS = [
  { id: 1, nome: 'Pedreiro' },
  { id: 2, nome: 'Servente' },
  { id: 3, nome: 'Pintor' },
  { id: 4, nome: 'Carpinteiro' },
  { id: 5, nome: 'Engenheiro' },
  { id: 6, nome: 'Arquiteto' },
  { id: 7, nome: 'Mestre de Obras' },
  { id: 8, nome: 'Técnico' },
  { id: 9, nome: 'Eletricista' },
  { id: 10, nome: 'Encanador' },
  { id: 11, nome: 'Outros' },
];

export default function AdmColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [selecionados, setSelecionados] = useState([]);

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [funcoesSelecionadas, setFuncoesSelecionadas] = useState([]);

  const [atualizando, setAtualizando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarColaboradores();
  }, []);

  async function carregarColaboradores() {
    try {
      setCarregando(true);

      const { data, error } = await supabase
        .from('colaboradores')
        .select(`
          id,
          nome_completo,
          cpf,
          telefone,
          email,
          data_nascimento,
          data_cadastro,
          colaborador_funcoes (
            funcao_id
          )
        `)
        .order('data_cadastro', { ascending: false });

      if (error) throw error;

      const dadosProcessados = data.map(colab => ({
        ...colab,
        colaborador_funcoes: colab.colaborador_funcoes.map(cf => {
          const funcaoEncontrada = FUNCOES_DISPONÍVEIS.find(f => f.id === cf.funcao_id);
          return {
            funcao_id: cf.funcao_id,
            funcoes: funcaoEncontrada ? { id: funcaoEncontrada.id, nome: funcaoEncontrada.nome } : null
          };
        })
      }));

      console.log('✅ Dados processados com funções:', dadosProcessados);
      setColaboradores(dadosProcessados);
    } catch (erro) {
      console.error('Erro ao carregar colaboradores:', erro);
      showError('Erro ao carregar', 'Não foi possível carregar os colaboradores');
    } finally {
      setCarregando(false);
    }
  }

  function iniciarEdicao(colaborador) {
    setEditando(colaborador.id);
    setNomeCompleto(colaborador.nome_completo);
    setCpf(colaborador.cpf);
    setTelefone(colaborador.telefone);
    setEmail(colaborador.email || '');
    setDataNascimento(colaborador.data_nascimento || '');
    setFuncoesSelecionadas(
      colaborador.colaborador_funcoes.map((cf) => cf.funcao_id)
    );
  }

  function cancelarEdicao() {
    setEditando(null);
    limparFormulario();
  }

  function limparFormulario() {
    setNomeCompleto('');
    setCpf('');
    setTelefone('');
    setEmail('');
    setDataNascimento('');
    setFuncoesSelecionadas([]);
  }

  function toggleFuncao(funcaoId) {
    setFuncoesSelecionadas((prev) =>
      prev.includes(funcaoId)
        ? prev.filter((id) => id !== funcaoId)
        : [...prev, funcaoId]
    );
  }

  function toggleSelecionado(id) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleAtualizar() {
    if (!nomeCompleto.trim()) {
      toastError('Preencha o nome completo');
      return;
    }

    if (funcoesSelecionadas.length === 0) {
      toastError('Selecione pelo menos uma função');
      return;
    }

    setAtualizando(true);
    showLoading('Atualizando colaborador...');

    try {
      const { error: erroUpdate } = await supabase
        .from('colaboradores')
        .update({
          nome_completo: nomeCompleto,
          cpf,
          telefone,
          email: email || null,
          data_nascimento: dataNascimento || null,
        })
        .eq('id', editando);

      if (erroUpdate) throw erroUpdate;

      const { error: erroDelete } = await supabase
        .from('colaborador_funcoes')
        .delete()
        .eq('colaborador_id', editando);

      if (erroDelete) throw erroDelete;

      const funcoes_para_inserir = funcoesSelecionadas.map((funcaoId) => ({
        colaborador_id: editando,
        funcao_id: funcaoId,
      }));

      const { error: erroInsert } = await supabase
        .from('colaborador_funcoes')
        .insert(funcoes_para_inserir);

      if (erroInsert) throw erroInsert;

      hideLoading();
      toastSuccess('Colaborador atualizado com sucesso!');
      await carregarColaboradores();
      cancelarEdicao();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao atualizar:', erro);
      showError('Erro ao atualizar', 'Verifique o console para detalhes');
    } finally {
      setAtualizando(false);
    }
  }

  async function handleExcluir(id, nome) {
    const result = await confirmDelete(nome);
    
    if (!result.isConfirmed) {
      return;
    }

    setExcluindo(true);
    showLoading('Excluindo colaborador...');

    try {
      const { error } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      hideLoading();
      toastSuccess('Colaborador excluído com sucesso!');
      await carregarColaboradores();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao excluir:', erro);
      showError('Erro ao excluir', 'Verifique o console para detalhes');
    } finally {
      setExcluindo(false);
    }
  }

  async function handleExcluirSelecionados() {
    if (selecionados.length === 0) {
      toastError('Selecione pelo menos um colaborador');
      return;
    }

    const result = await confirmDelete(`${selecionados.length} colaborador(es)`);
    
    if (!result.isConfirmed) {
      return;
    }

    setExcluindo(true);
    showLoading('Excluindo colaboradores...');

    try {
      const { error } = await supabase
        .from('colaboradores')
        .delete()
        .in('id', selecionados);

      if (error) throw error;

      hideLoading();
      toastSuccess(`${selecionados.length} colaborador(es) excluído(s) com sucesso!`);
      setSelecionados([]);
      await carregarColaboradores();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao excluir:', erro);
      showError('Erro ao excluir', 'Verifique o console para detalhes');
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <S.Painel>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Carregando colaboradores...</p>
        </div>
      </S.Painel>
    );
  }

  const colaboradorEditando = colaboradores.find((c) => c.id === editando);

  return (
    <S.Painel>
      <S.TopoAcoes>
        <S.BotaoAcao type="button" onClick={carregarColaboradores}>
          🔄 Atualizar Lista
        </S.BotaoAcao>
        {selecionados.length > 0 && (
          <S.BotaoAcao 
            type="button" 
            onClick={handleExcluirSelecionados}
            disabled={excluindo}
          >
            🗑️ Excluir Seleção ({selecionados.length})
          </S.BotaoAcao>
        )}
      </S.TopoAcoes>

      <S.TituloPainel>GERENCIAR COLABORADORES</S.TituloPainel>

      {editando && colaboradorEditando ? (
        <S.Formulario>
          <S.Secao>
            <S.TituloSecao>Editando: {colaboradorEditando.nome_completo}</S.TituloSecao>
            
            <S.Info>
              <S.Camponomeobra>
                <S.Label>Nome Completo</S.Label>
                <S.Input
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                />
              </S.Camponomeobra>

              <S.Campo>
                <S.Label>CPF</S.Label>
                <S.Input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                  disabled
                />
              </S.Campo>

              <S.Campo>
                <S.Label>Telefone</S.Label>
                <S.Input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                />
              </S.Campo>

              <S.Camponomeobra>
                <S.Label>Email <span style={{ color: '#a7a49c', fontWeight: 400 }}>(opcional)</span></S.Label>
                <S.Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </S.Camponomeobra>

              <S.Campo>
                <S.Label>Data de Nascimento <span style={{ color: '#a7a49c', fontWeight: 400 }}>(opcional)</span></S.Label>
                <S.Input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </S.Campo>
            </S.Info>

            <div style={{ marginTop: 20 }}>
              <S.Label style={{ display: 'block', marginBottom: 12 }}>Funções</S.Label>
              <S.GridFuncoes>
                {FUNCOES_DISPONÍVEIS.map((funcao) => (
                  <S.LabelCheckbox key={funcao.id}>
                    <input
                      type="checkbox"
                      checked={funcoesSelecionadas.includes(funcao.id)}
                      onChange={() => toggleFuncao(funcao.id)}
                    />
                    {funcao.nome}
                  </S.LabelCheckbox>
                ))}
              </S.GridFuncoes>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <S.BotaoEnviar
                type="button"
                onClick={handleAtualizar}
                disabled={atualizando}
              >
                {atualizando ? 'Atualizando...' : '💾 Salvar Alterações'}
              </S.BotaoEnviar>
              <button
                type="button"
                onClick={cancelarEdicao}
                style={{
                  background: '#fff',
                  color: '#23262b',
                  border: '1px solid #d9d6cf',
                  borderRadius: 7,
                  padding: '12px 26px',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 600,
                  transition: 'background 0.15s ease',
                }}
              >
                ✕ Cancelar
              </button>
            </div>
          </S.Secao>
        </S.Formulario>
      ) : (
        <div style={{ marginTop: 24 }}>
          {colaboradores.length === 0 ? (
            <S.Secao>
              <p style={{ textAlign: 'center', color: '#a7a49c' }}>
                Nenhum colaborador cadastrado ainda.
              </p>
            </S.Secao>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {colaboradores.map((colaborador) => (
                <S.Secao key={colaborador.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <S.LabelCheckbox style={{ margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={selecionados.includes(colaborador.id)}
                            onChange={() => toggleSelecionado(colaborador.id)}
                          />
                        </S.LabelCheckbox>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                          {colaborador.nome_completo}
                        </h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 13, color: '#6e7178' }}>
                        <div>
                          <strong style={{ color: '#4b4e54' }}>CPF:</strong> {colaborador.cpf}
                        </div>
                        <div>
                          <strong style={{ color: '#4b4e54' }}>Telefone:</strong> {colaborador.telefone}
                        </div>
                        <div>
                          <strong style={{ color: '#4b4e54' }}>Email:</strong> {colaborador.email || '—'}
                        </div>
                        <div>
                          <strong style={{ color: '#4b4e54' }}>Data de Nascimento:</strong>{' '}
                          {colaborador.data_nascimento
                            ? new Date(colaborador.data_nascimento).toLocaleDateString('pt-BR')
                            : '—'}
                        </div>
                      </div>

                      {colaborador.colaborador_funcoes && 
                       Array.isArray(colaborador.colaborador_funcoes) && 
                       colaborador.colaborador_funcoes.length > 0 && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e4e1db' }}>
                          <strong style={{ fontSize: 12, color: '#4b4e54', display: 'block', marginBottom: 6 }}>
                            Funções:
                          </strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {colaborador.colaborador_funcoes && 
                             Array.isArray(colaborador.colaborador_funcoes) &&
                             colaborador.colaborador_funcoes.length > 0
                              ? colaborador.colaborador_funcoes
                                  .filter(cf => cf && cf.funcoes && cf.funcoes.nome)
                                  .map((cf) => (
                                  <span
                                    key={cf.funcao_id}
                                    style={{
                                      background: '#e8871e',
                                      color: '#fff',
                                      padding: '4px 10px',
                                      borderRadius: 4,
                                      fontSize: 12,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {cf.funcoes.nome}
                                  </span>
                                ))
                              : (
                                <span style={{ fontSize: 12, color: '#a7a49c', fontStyle: 'italic' }}>
                                  Nenhuma função associada
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(colaborador)}
                        title="Editar"
                        style={{
                          background: '#fff',
                          color: '#23262b',
                          border: '1px solid #d9d6cf',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 500,
                          transition: 'border-color 0.15s ease',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluir(colaborador.id, colaborador.nome_completo)}
                        disabled={excluindo}
                        title="Excluir"
                        style={{
                          background: '#fff',
                          color: '#c1473c',
                          border: '1px solid #ecd4d1',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 500,
                          transition: 'border-color 0.15s ease',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </S.Secao>
              ))}
            </div>
          )}
        </div>
      )}
    </S.Painel>
  );
}