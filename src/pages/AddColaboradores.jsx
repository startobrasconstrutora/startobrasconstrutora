import React, { useState, useRef, useEffect } from 'react';
import * as S from './AddColaboradores.styles.jsx';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone } from './mascaras';
import {
  toastSuccess,
  toastError,
  toastWarning,
  showError,
  showLoading,
  hideLoading,
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

export default function AddColaboradores({
  onAtualizarLista,
  onCadastrar,
  itens = [],
}) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  
  const [funcoesSelecionadas, setFuncoesSelecionadas] = useState([]);
  
  const [selecionados, setSelecionados] = useState([]);
  const [cadastrando, setCadastrando] = useState(false);

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

  // Validar formato básico de CPF
 function validarCPF(cpfFormatado) {
  const cpfLimpo = cpfFormatado.replace(/\D/g, '');
  return cpfLimpo.length === 11;
}

  async function handleCadastrar() {
    // ============ VALIDAÇÕES ============
    if (!nomeCompleto.trim()) {
      toastError('Preencha o nome completo');
      return;
    }

    if (!cpf.trim() || cpf.length < 14) {
      toastError('CPF inválido');
      return;
    }

    if (!validarCPF(cpf)) {
      toastError('CPF inválido. Verifique o formato');
      return;
    }

    if (!telefone.trim() || telefone.length < 14) {
      toastError('Telefone inválido');
      return;
    }

    if (funcoesSelecionadas.length === 0) {
      toastWarning('Selecione pelo menos uma função');
      return;
    }

    // ============ CADASTRO ============
    setCadastrando(true);
    showLoading('Cadastrando colaborador...');

    try {
  // Verificar se CPF já existe
const { data: cpfExistente, error: erroVerificacao } = await supabase
  .from('colaboradores')
  .select('id')
  .eq('cpf', cpf)
  .maybeSingle();

if (erroVerificacao) {
  console.error('Erro ao verificar CPF:', erroVerificacao);
  hideLoading();
  toastError('Não foi possível verificar o CPF.');
  setCadastrando(false);
  return;
}

if (cpfExistente) {
  hideLoading();
  toastError('Este CPF já está cadastrado no sistema');
  setCadastrando(false);
  return;
}

      // Inserir colaborador
      const { data: colaboradorData, error: erroInsert } = await supabase
        .from('colaboradores')
        .insert({
          nome_completo: nomeCompleto,
          cpf,
          telefone,
          email: email.trim() || null,
          data_nascimento: dataNascimento || null,
        })
        .select();

      if (erroInsert) {
        hideLoading();
      if (erroInsert.code === '23505') {
  console.error('ERRO DE DUPLICIDADE:', {
    code: erroInsert.code,
    message: erroInsert.message,
    details: erroInsert.details,
    hint: erroInsert.hint,
  });

  toastError('Já existe um registro com um dos dados informados.');
} else {
  showError('Erro ao cadastrar', 'Verifique o console para detalhes');
  console.error('Erro ao inserir colaborador:', erroInsert);
}
        setCadastrando(false);
        return;
      }

      const colaboradorId = colaboradorData[0].id;

      // Inserir as funções selecionadas
      const funcoes_para_inserir = funcoesSelecionadas.map((funcaoId) => ({
        colaborador_id: colaboradorId,
        funcao_id: funcaoId,
      }));

      const { error: erroFuncoes } = await supabase
        .from('colaborador_funcoes')
        .insert(funcoes_para_inserir);

      if (erroFuncoes) {
        hideLoading();
        showError('Erro ao cadastrar', 'Não foi possível adicionar as funções');
        console.error('Erro ao inserir funções:', erroFuncoes);
        setCadastrando(false);
        return;
      }

      hideLoading();
      toastSuccess(`${nomeCompleto} cadastrado com sucesso!`);

      onCadastrar?.(colaboradorData);

      // Limpar formulário
      setNomeCompleto('');
      setCpf('');
      setTelefone('');
      setEmail('');
      setDataNascimento('');
      setFuncoesSelecionadas([]);
    } catch (erro) {
      hideLoading();
      console.error('Erro ao cadastrar colaborador:', erro);
      showError('Erro inesperado', 'Verifique o console para detalhes');
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <S.Painel>
      <S.TopoAcoes>
        <S.BotaoAcao type="button" onClick={onAtualizarLista}>
          🔄 Atualizar Lista
        </S.BotaoAcao>
      </S.TopoAcoes>

      <S.TituloPainel>COLABORADOR</S.TituloPainel>

      <S.Formulario onSubmit={(e) => e.preventDefault()}>
        <S.Secao>
          <S.TituloSecao>Dados Pessoais</S.TituloSecao>
          <S.Info>
            <S.Camponomeobra>
              <S.Label htmlFor="nomeCompleto">Nome Completo</S.Label>
              <S.Input
                id="nomeCompleto"
                type="text"
                placeholder="Nome Completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </S.Camponomeobra>

            <S.Campo>
              <S.Label htmlFor="cpf">CPF</S.Label>
              <S.Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                value={cpf}
                onChange={(e) => setCpf(mascaraCPF(e.target.value))}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="dataNascimento">Data de Nascimento <span style={{ color: '#a7a49c', fontWeight: 400 }}>(opcional)</span></S.Label>
              <S.Input
                id="dataNascimento"
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Contato</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="telefone">Telefone</S.Label>
              <S.Input
                id="telefone"
                type="text"
                placeholder="(00) 00000-0000"
                inputMode="numeric"
                maxLength={15}
                value={telefone}
                onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
              />
            </S.Campo>

            <S.Camponomeobra>
              <S.Label htmlFor="email">Email <span style={{ color: '#a7a49c', fontWeight: 400 }}>(opcional)</span></S.Label>
              <S.Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </S.Camponomeobra>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Funções</S.TituloSecao>
          <S.DicaImagem>
            Selecione uma ou mais funções para este colaborador.
          </S.DicaImagem>
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
        </S.Secao>

        <S.BotaoEnviar 
          type="button" 
          onClick={handleCadastrar} 
          disabled={cadastrando}
        >
          {cadastrando ? 'Cadastrando...' : 'Cadastrar Colaborador'}
        </S.BotaoEnviar>
      </S.Formulario>

      <S.ContainerLista>
        {itens.length > 0 && (
          <>
            <h3 style={{ fontSize: 14, color: '#6e7178', marginBottom: 12 }}>
              Colaboradores Cadastrados
            </h3>
            {itens.map((item) => (
              <S.LabelCheckbox key={item.id}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(item.id)}
                  onChange={() => toggleSelecionado(item.id)}
                />
                {item.nome_completo}
              </S.LabelCheckbox>
            ))}
          </>
        )}
      </S.ContainerLista>
    </S.Painel>
  );
}