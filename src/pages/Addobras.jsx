import React, { useState } from 'react';
import * as S from './Addobras.styles.jsx';

// Formata como CPF: 222.222.222-22
function mascaraCPF(valor) {
  const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);
  return somenteNumeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Formata como telefone: (99) 99999-9999 ou (99) 9999-9999
function mascaraTelefone(valor) {
  const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);
  if (somenteNumeros.length <= 10) {
    return somenteNumeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return somenteNumeros
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export default function PainelProdutos({
  onAtualizarLista,
  onExcluirSelecionados,
  onFechar,
  onCadastrar,
  itens = [],
}) {
  const [ocultarPrecos, setOcultarPrecos] = useState(false);

  const [nomeObra, setNomeObra] = useState('');
  const [tipoObra, setTipoObra] = useState('construcao');
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [cpfProprietario, setCpfProprietario] = useState('');
  const [telefoneProprietario, setTelefoneProprietario] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [descricao, setDescricao] = useState('');
  const [imagens, setImagens] = useState([null, null, null, null, null]);
  const [selecionados, setSelecionados] = useState([]);

  function validarTamanhoImagem(index, file) {
    if (!file) return;
    const LIMITE_MB = 5;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      alert(`A imagem deve ter no máximo ${LIMITE_MB}MB.`);
      return;
    }
    const novasImagens = [...imagens];
    novasImagens[index] = file;
    setImagens(novasImagens);
  }

  function toggleSelecionado(id) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleCadastrar() {
    onCadastrar?.({
      nomeObra,
      tipoObra,
      nomeProprietario,
      cpfProprietario,
      telefoneProprietario,
      endereco,
      bairro,
      cidade,
      descricao,
      imagens,
    });
  }

  return (
    <S.Painel>
      <S.TopoAcoes>
        <S.BotaoAcao type="button" onClick={onAtualizarLista}>
          🔄 Atualizar Lista
        </S.BotaoAcao>
        <S.BotaoAcao type="button" onClick={() => onExcluirSelecionados?.(selecionados)}>
          🗑️ Excluir Seleção ({selecionados.length})
        </S.BotaoAcao>
      </S.TopoAcoes>

      <S.TituloPainel>OBRA</S.TituloPainel>

      <S.BlocoConfiguracoes>
        <strong>Configurações gerais:</strong>
        <S.LabelCheckbox>
          <input
            type="checkbox"
            checked={ocultarPrecos}
            onChange={(e) => setOcultarPrecos(e.target.checked)}
          />
          Ocultar obra da página principal
        </S.LabelCheckbox>
      </S.BlocoConfiguracoes>

      <S.Formulario onSubmit={(e) => e.preventDefault()}>
        <S.Secao>
          <S.TituloSecao>Identificação</S.TituloSecao>
          <S.Info>
            <S.Camponomeobra>
              <S.Label htmlFor="nomeObra">Nome da Obra</S.Label>
              <S.Input
                id="nomeObra"
                type="text"
                placeholder="Nome da Obra"
                value={nomeObra}
                onChange={(e) => setNomeObra(e.target.value)}
              />
            </S.Camponomeobra>

            <S.Campo>
              <S.Label>Tipo</S.Label>
              <S.LinhaOpcoes>
                <S.LabelCheckbox>
                  <input
                    type="radio"
                    name="tipoObra"
                    checked={tipoObra === 'construcao'}
                    onChange={() => setTipoObra('construcao')}
                  />
                  Construção
                </S.LabelCheckbox>
                <S.LabelCheckbox>
                  <input
                    type="radio"
                    name="tipoObra"
                    checked={tipoObra === 'reforma'}
                    onChange={() => setTipoObra('reforma')}
                  />
                  Reforma
                </S.LabelCheckbox>
              </S.LinhaOpcoes>
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Proprietário</S.TituloSecao>
          <S.Info>
            <S.Campo>
              <S.Label htmlFor="nomeProprietario">Nome do Proprietário</S.Label>
              <S.Input
                id="nomeProprietario"
                type="text"
                placeholder="Nome do Proprietário"
                value={nomeProprietario}
                onChange={(e) => setNomeProprietario(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="cpfProprietario">CPF do Proprietário</S.Label>
              <S.Input
                id="cpfProprietario"
                type="text"
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                value={cpfProprietario}
                onChange={(e) => setCpfProprietario(mascaraCPF(e.target.value))}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="telefoneProprietario">Telefone de Contato</S.Label>
              <S.Input
                id="telefoneProprietario"
                type="text"
                placeholder="(00) 00000-0000"
                inputMode="numeric"
                maxLength={15}
                value={telefoneProprietario}
                onChange={(e) => setTelefoneProprietario(mascaraTelefone(e.target.value))}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Localização</S.TituloSecao>
          <S.Info>
            <S.Camponomeobra>
              <S.Label htmlFor="endereco">Endereço</S.Label>
              <S.Input
                id="endereco"
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </S.Camponomeobra>

            <S.Campo>
              <S.Label htmlFor="bairro">Bairro</S.Label>
              <S.Input
                id="bairro"
                type="text"
                placeholder="Bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </S.Campo>

            <S.Campo>
              <S.Label htmlFor="cidade">Cidade</S.Label>
              <S.Input
                id="cidade"
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </S.Campo>
          </S.Info>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Descrição</S.TituloSecao>
          <S.Campo>
            <S.ContadorTexto>{descricao.length}/2000</S.ContadorTexto>
            <S.TextArea
              id="descricao"
              maxLength={2000}
              rows={6}
              placeholder="Descrição detalhada"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </S.Campo>
        </S.Secao>

        <S.Secao>
          <S.TituloSecao>Imagens (máx. 5 — a primeira será a principal)</S.TituloSecao>
          <S.DicaImagem>Proporção recomendada 1:1 (quadrado) min: 500px x 500px</S.DicaImagem>
          <S.BlocoImagens>
            {imagens.map((_, index) => (
              <S.LinhaImagem key={index}>
                <S.Label>
                  📷 Imagem {index + 1}
                  {index === 0 ? ' (principal)' : ''}
                </S.Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => validarTamanhoImagem(index, e.target.files[0])}
                />
              </S.LinhaImagem>
            ))}
          </S.BlocoImagens>
        </S.Secao>

        <S.BotaoEnviar type="button" onClick={handleCadastrar}>
          Cadastrar Obra
        </S.BotaoEnviar>
      </S.Formulario>

      <S.ContainerLista>
        {itens.map((item) => (
          <S.LabelCheckbox key={item.id}>
            <input
              type="checkbox"
              checked={selecionados.includes(item.id)}
              onChange={() => toggleSelecionado(item.id)}
            />
            {item.nome}
          </S.LabelCheckbox>
        ))}
      </S.ContainerLista>
    </S.Painel>
  );
}