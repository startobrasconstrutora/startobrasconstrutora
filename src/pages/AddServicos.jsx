import React, { useState, useEffect } from 'react';
import * as S from './AddColaboradores.styles.jsx';
import { supabase } from '../supabaseClient';
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  showError,
  toastWarning,
} from '../utils/alert.js';

export default function AddServicos() {
  const [colaboradores, setColaboradores] = useState([]);
  const [obras, setObras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [colaboradorId, setColaboradorId] = useState('');
  const [obraId, setObraId] = useState('');
  const [descricaoServico, setDescricaoServico] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [cadastrando, setCadastrando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);

      const { data: colabData, error: colabError } = await supabase
        .from('colaboradores')
        .select('id, nome_completo')
        .order('nome_completo', { ascending: true });

      if (colabError) throw colabError;

      const { data: obrasData, error: obrasError } = await supabase
        .from('obras')
        .select('id, codigo_obra, nome_obra')
        .order('nome_obra', { ascending: true });

      if (obrasError) throw obrasError;

      setColaboradores(colabData || []);
      setObras(obrasData || []);
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
      showError('Erro ao carregar', 'Não foi possível carregar os dados');
    } finally {
      setCarregando(false);
    }
  }

  function calcularDias() {
    if (!dataInicio || !dataFim) return 0;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diff = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }

  useEffect(() => {
    if (valorDiaria && dataInicio && dataFim) {
      const dias = calcularDias();
      const total = (parseFloat(valorDiaria) * dias).toFixed(2);
      setValorTotal(total);
    }
  }, [valorDiaria, dataInicio, dataFim]);

  async function handleCadastrar() {
    if (!colaboradorId) {
      toastError('Selecione um colaborador');
      return;
    }

    if (!obraId) {
      toastError('Selecione uma obra');
      return;
    }

    if (!descricaoServico.trim()) {
      toastError('Preencha a descrição do serviço');
      return;
    }

    if (!dataInicio || !dataFim) {
      toastError('Preencha as datas');
      return;
    }

    if (new Date(dataFim) < new Date(dataInicio)) {
      toastError('A data final não pode ser anterior à data inicial');
      return;
    }

    setCadastrando(true);
    showLoading('Registrando serviço...');

    try {
      const { data, error } = await supabase
        .from('servicos_colaborador')
        .insert({
          colaborador_id: colaboradorId,
          obra_id: obraId,
          descricao_servico: descricaoServico,
          data_inicio: dataInicio,
          data_fim: dataFim,
          valor_diaria: valorDiaria ? parseFloat(valorDiaria) : null,
          valor_total: valorTotal ? parseFloat(valorTotal) : null,
          observacoes: observacoes.trim() || null,
        })
        .select();

      if (error) throw error;

      hideLoading();
      toastSuccess('Serviço registrado com sucesso!');

      setColaboradorId('');
      setObraId('');
      setDescricaoServico('');
      setDataInicio('');
      setDataFim('');
      setValorDiaria('');
      setValorTotal('');
      setObservacoes('');
    } catch (erro) {
      hideLoading();
      console.error('Erro ao registrar serviço:', erro);
      showError('Erro ao registrar', 'Verifique o console para detalhes');
    } finally {
      setCadastrando(false);
    }
  }

  if (carregando) {
    return (
      <S.Painel>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Carregando dados...</p>
        </div>
      </S.Painel>
    );
  }

  const dias = calcularDias();

  return (
    <S.Painel>
      <S.TituloPainel>REGISTRAR SERVIÇO</S.TituloPainel>

      <S.Formulario onSubmit={(e) => e.preventDefault()}>
        <S.Secao>
          <S.TituloSecao>Seleção</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="colaborador">Colaborador</S.Label>
              <select
                id="colaborador"
                value={colaboradorId}
                onChange={(e) => setColaboradorId(e.target.value)}
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
                <option value="">Selecione um colaborador...</option>
                {colaboradores.map((colab) => (
                  <option key={colab.id} value={colab.id}>
                    {colab.nome_completo}
                  </option>
                ))}
              </select>
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="obra">Obra</S.Label>
              <select
                id="obra"
                value={obraId}
                onChange={(e) => setObraId(e.target.value)}
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
                <option value="">Selecione uma obra...</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.codigo_obra} - {obra.nome_obra}
                  </option>
                ))}
              </select>
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Descrição do Serviço</S.TituloSecao>
          <S.Campo>
            <S.Label htmlFor="descricao">O que foi feito?</S.Label>
            <S.TextArea
              id="descricao"
              rows={3}
              maxLength={500}
              placeholder="Ex: Alvenaria da parede sul, reboco da fachada..."
              value={descricaoServico}
              onChange={(e) => setDescricaoServico(e.target.value)}
            />
          </S.Campo>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Período de Trabalho</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="dataInicio">Data de Início</S.Label>
              <S.Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="dataFim">Data de Término</S.Label>
              <S.Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </S.Campo>

            {dias > 0 && (
              <div
                style={{
                  gridColumn: 'span 2',
                  background: '#edf7ed',
                  border: '1px solid #c8e6c9',
                  borderRadius: 6,
                  padding: 12,
                  fontSize: 13,
                  color: '#2e7d32',
                  fontWeight: 600,
                }}
              >
                📅 Total de dias: {dias}
              </div>
            )}
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Valores</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="valorDiaria">Valor da Diária (R$)</S.Label>
              <S.Input
                id="valorDiaria"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={valorDiaria}
                onChange={(e) => setValorDiaria(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="valorTotal">Valor Total (R$)</S.Label>
              <S.Input
                id="valorTotal"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={valorTotal}
                onChange={(e) => setValorTotal(e.target.value)}
                disabled
                title="Calculado automaticamente (diária × dias)"
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Observações (opcional)</S.TituloSecao>
          <S.Campo>
            <S.Label htmlFor="observacoes">Notas adicionais</S.Label>
            <S.TextArea
              id="observacoes"
              rows={2}
              maxLength={300}
              placeholder="Ex: Trabalho realizado conforme planejado, sem atrasos..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </S.Campo>
        </S.Secao>

        <S.BotaoEnviar 
          type="button" 
          onClick={handleCadastrar} 
          disabled={cadastrando}
        >
          {cadastrando ? 'Registrando...' : '✅ Registrar Serviço'}
        </S.BotaoEnviar>
      </S.Formulario>
    </S.Painel>
  );
}