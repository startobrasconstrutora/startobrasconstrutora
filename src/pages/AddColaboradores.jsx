import React, { useState, useRef, useEffect } from 'react';
import * as S from './AddColaboradores.styles.jsx';
import { supabase } from '../supabaseClient';
import { mascaraCPF, mascaraTelefone } from './mascaras';

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
  
  const [notificacao, setNotificacao] = useState(null);
  const notificacaoTimeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(notificacaoTimeoutRef.current);
  }, []);

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
    // Remove máscara
    const cpfLimpo = cpfFormatado.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return false;
    }
    
    // Verifica se não é sequência repetida
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return false;
    }
    
    return true;
  }

  async function handleCadastrar() {
    if (!nomeCompleto.trim()) {
      alert('Preencha o nome completo.');
      return;
    }

    if (!cpf.trim() || cpf.length < 14) {
      alert('CPF inválido.');
      return;
    }

    if (!validarCPF(cpf)) {
      alert('CPF inválido. Verifique o formato.');
      return;
    }

    if (!telefone.trim() || telefone.length < 14) {
      alert('Telefone inválido.');
      return;
    }

    // Email agora é opcional, mas se preenchido deve ser válido
    if (email.trim() && !email.includes('@')) {
      alert('Email inválido.');
      return;
    }

    if (funcoesSelecionadas.length === 0) {
      alert('Selecione pelo menos uma função.');
      return;
    }

    // Data de nascimento agora é opcional

    setCadastrando(true);
    try {
      // Verificar se CPF já existe
      const { data: cpfExistente, error: erroVerificacao } = await supabase
        .from('colaboradores')
        .select('id')
        .eq('cpf', cpf)
        .single();

      if (!erroVerificacao && cpfExistente) {
        alert('⚠️ Este CPF já está cadastrado no sistema.');
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
          email,
          data_nascimento: dataNascimento,
        })
        .select();

      if (erroInsert) {
        if (erroInsert.code === '23505') {
          alert('⚠️ Este CPF já está cadastrado no sistema.');
        } else {
          throw erroInsert;
        }
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

      if (erroFuncoes) throw erroFuncoes;

      // Mostrar notificação de sucesso
      setNotificacao(nomeCompleto);
      window.clearTimeout(notificacaoTimeoutRef.current);
      notificacaoTimeoutRef.current = window.setTimeout(() => {
        setNotificacao(null);
      }, 6000);

      onCadastrar?.(colaboradorData);

      // Limpar formulário
      setNomeCompleto('');
      setCpf('');
      setTelefone('');
      setEmail('');
      setDataNascimento('');
      setFuncoesSelecionadas([]);
    } catch (erro) {
      console.error('Erro ao cadastrar colaborador:', erro);
      alert('Erro ao cadastrar colaborador. Veja o console para detalhes.');
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
            maxWidth: 340,
          }}
        >
          <span style={{ fontSize: 20 }}>✅</span>
          <div style={{ fontSize: 14, lineHeight: 1.4 }}>
            <strong>{notificacao} cadastrado!</strong>
            <br />
            Pode ser gerenciado na sessão de admin.
          </div>
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