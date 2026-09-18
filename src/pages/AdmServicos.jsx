import React, { useState, useEffect, useRef } from 'react';
import * as S from './AddColaboradores.styles.jsx';
import { supabase } from '../supabaseClient';

export default function AdmServicos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'colaborador', 'obra'
  const [filtroValor, setFiltroValor] = useState('');
  const [excluindo, setExcluindo] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const notificacaoTimeoutRef = useRef(null);

  const [colaboradores, setColaboradores] = useState([]);
  const [obras, setObras] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(notificacaoTimeoutRef.current);
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);

      // Carregar serviços com dados relacionados
const { data: servicosData, error: servicosError } = await supabase
  .from('servicos_colaborador')
  .select(`
    id,
    descricao_servico,
    data_inicio,
    data_fim,
    valor_diaria,
    valor_total,
    observacoes,
    data_cadastro,
    colaboradores (
      id,
      nome_completo
    ),
    obras (
      id,
      nome_obra,
      codigo_obra
    )
  `)
  .order('data_cadastro', { ascending: false });

      if (servicosError) throw servicosError;

      // Carregar colaboradores
      const { data: colabData, error: colabError } = await supabase
        .from('colaboradores')
        .select('id, nome_completo')
        .order('nome_completo', { ascending: true });

      if (colabError) throw colabError;

      // Carregar obras
      const { data: obrasData, error: obrasError } = await supabase
        .from('obras')
        .select('id, codigo_obra, nome_obra')
        .order('nome_obra', { ascending: true });

      if (obrasError) throw obrasError;

      setServicos(servicosData || []);
      setColaboradores(colabData || []);
      setObras(obrasData || []);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      alert('Erro ao carregar dados.');
    } finally {
      setCarregando(false);
    }
  }

function filtrarServicos() {
  if (filtro === 'todos') return servicos;
  if (filtro === 'colaborador') {
    return servicos.filter((s) => s.colaboradores?.id === filtroValor);
  }
  if (filtro === 'obra') {
    return servicos.filter((s) => s.obras?.codigo_obra === filtroValor);
  }
  return servicos;
}

  function calcularDias(dataInicio, dataFim) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diff = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }

  function formatarMoeda(valor) {
    if (!valor) return '—';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  async function handleExcluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }

    setExcluindo(true);
    try {
      const { error } = await supabase
        .from('servicos_colaborador')
        .delete()
        .eq('id', id);

      if (error) throw error;

      mostrarNotificacao('Registro excluído com sucesso!');
      carregarDados();
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
      alert('Erro ao excluir registro.');
    } finally {
      setExcluindo(false);
    }
  }

  function mostrarNotificacao(mensagem) {
    setNotificacao(mensagem);
    window.clearTimeout(notificacaoTimeoutRef.current);
    notificacaoTimeoutRef.current = window.setTimeout(() => {
      setNotificacao(null);
    }, 5000);
  }

  const servicosFiltrados = filtrarServicos();
  const totalValor = servicosFiltrados.reduce((sum, s) => sum + (s.valor_total || 0), 0);

  if (carregando) {
    return (
      <S.Painel>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Carregando dados...</p>
        </div>
      </S.Painel>
    );
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
            maxWidth: 340,
          }}
        >
          <span style={{ fontSize: 20 }}>✅</span>
          <div style={{ fontSize: 14, lineHeight: 1.4 }}>{notificacao}</div>
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
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <S.TopoAcoes>
        <S.BotaoAcao type="button" onClick={carregarDados}>
          🔄 Atualizar
        </S.BotaoAcao>
      </S.TopoAcoes>

      <S.TituloPainel>SERVIÇOS REGISTRADOS</S.TituloPainel>

      <S.Secao>
        <S.TituloSecao>Filtros</S.TituloSecao>
        <S.Info>
          <S.Campo>
            <S.Label>Filtrar por:</S.Label>
            <select
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setFiltroValor('');
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #d9d6cf',
                background: '#fbfaf8',
                color: '#23262b',
                fontSize: 14,
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <option value="todos">Todos os serviços</option>
              <option value="colaborador">Por Colaborador</option>
              <option value="obra">Por Obra</option>
            </select>
          </S.Campo>

          {filtro === 'colaborador' && (
            <S.Campo>
              <S.Label>Selecione o colaborador:</S.Label>
              <select
                value={filtroValor}
                onChange={(e) => setFiltroValor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid #d9d6cf',
                  background: '#fbfaf8',
                  color: '#23262b',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Selecione...</option>
                {colaboradores.map((colab) => (
                  <option key={colab.id} value={colab.id}>
                    {colab.nome_completo}
                  </option>
                ))}
              </select>
            </S.Campo>
          )}

          {filtro === 'obra' && (
            <S.Campo>
              <S.Label>Selecione a obra:</S.Label>
              <select
                value={filtroValor}
                onChange={(e) => setFiltroValor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid #d9d6cf',
                  background: '#fbfaf8',
                  color: '#23262b',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Selecione...</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.codigo_obra}>
                    {obra.codigo_obra} - {obra.nome_obra}
                  </option>
                ))}
              </select>
            </S.Campo>
          )}
        </S.Info>
      </S.Secao>

      {servicosFiltrados.length > 0 && (
        <S.Secao style={{ background: '#edf7ed', border: '1px solid #c8e6c9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#2e7d32' }}>
                Total de serviços: {servicosFiltrados.length}
              </strong>
            </div>
            <div>
              <strong style={{ color: '#2e7d32' }}>
                Valor total: {formatarMoeda(totalValor)}
              </strong>
            </div>
          </div>
        </S.Secao>
      )}

      <div style={{ marginTop: 24 }}>
        {servicosFiltrados.length === 0 ? (
          <S.Secao>
            <p style={{ textAlign: 'center', color: '#a7a49c' }}>
              Nenhum serviço registrado.
            </p>
          </S.Secao>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {servicosFiltrados.map((servico) => {
              const dias = calcularDias(servico.data_inicio, servico.data_fim);
              return (
                <S.Secao key={servico.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600 }}>
                        {servico.colaboradores.nome_completo}
                        <span style={{ fontSize: 13, fontWeight: 400, color: '#a7a49c', marginLeft: 8 }}>
                          em {servico.obras.codigo_obra} - {servico.obras.nome_obra}
                        </span>
                      </h4>

                      <div
                        style={{
                          background: '#fbfaf8',
                          borderLeft: '3px solid #e8871e',
                          padding: 12,
                          borderRadius: 4,
                          marginBottom: 12,
                        }}
                      >
                        <p style={{ margin: '0 0 6px', fontSize: 14, color: '#23262b' }}>
                          <strong>Serviço:</strong> {servico.descricao_servico}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: 12,
                          fontSize: 13,
                          color: '#6e7178',
                        }}
                      >
                        <div>
                          <strong style={{ color: '#4b4e54' }}>Período:</strong>
                          <br />
                          {formatarData(servico.data_inicio)} a {formatarData(servico.data_fim)}
                          <br />
                          <span style={{ fontSize: 12, color: '#a7a49c' }}>({dias} dias)</span>
                        </div>

                        <div>
                          <strong style={{ color: '#4b4e54' }}>Valor da Diária:</strong>
                          <br />
                          {formatarMoeda(servico.valor_diaria)}
                        </div>

                        <div>
                          <strong style={{ color: '#4b4e54' }}>Valor Total:</strong>
                          <br />
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#e8871e' }}>
                            {formatarMoeda(servico.valor_total)}
                          </span>
                        </div>
                      </div>

                      {servico.observacoes && (
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: '1px solid #e4e1db',
                          }}
                        >
                          <strong style={{ fontSize: 12, color: '#4b4e54', display: 'block', marginBottom: 4 }}>
                            Observações:
                          </strong>
                          <p style={{ margin: 0, fontSize: 13, color: '#6e7178' }}>
                            {servico.observacoes}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExcluir(servico.id)}
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
                        flexShrink: 0,
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </S.Secao>
              );
            })}
          </div>
        )}
      </div>
    </S.Painel>
  );
}