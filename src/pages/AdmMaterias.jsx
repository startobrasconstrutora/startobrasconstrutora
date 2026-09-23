import React, { useEffect, useState } from 'react';
import * as S from './admobras.styles.jsx';
import { supabase } from '../supabaseClient';
import { caminhoDoStorage } from './mascaras';
import {
  toastSuccess,
  toastError,
  showLoading,
  hideLoading,
  confirmDelete,
  showError,
} from '../utils/alert.js';

const CAMPOS_VAZIOS = {
  titulo: '',
  texto: '',
  imagem: '',
  data_publicacao: '',
};

export default function AdmMaterias() {
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [selecionados, setSelecionados] = useState([]);
  const [excluindoSelecao, setExcluindoSelecao] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState(CAMPOS_VAZIOS);
  const [novaImagem, setNovaImagem] = useState(null);
  const [novaImagemPreview, setNovaImagemPreview] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarMaterias();
  }, []);

  async function buscarMaterias() {
    setCarregando(true);
    setErro(null);
    const { data, error } = await supabase
      .from('materias')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setErro('Não foi possível carregar as matérias. Tente atualizar a lista.');
      console.error('Erro ao buscar matérias:', error);
    } else {
      setMaterias(data || []);
    }
    setCarregando(false);
  }

  function toggleSelecionado(id) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function iniciarEdicao(materia) {
    setEditandoId(materia.id);
    setFormEdicao({ ...CAMPOS_VAZIOS, ...materia });
    setNovaImagem(null);
    setNovaImagemPreview(null);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdicao(CAMPOS_VAZIOS);
    if (novaImagemPreview) URL.revokeObjectURL(novaImagemPreview);
    setNovaImagem(null);
    setNovaImagemPreview(null);
  }

  function atualizarCampo(campo, valor) {
    setFormEdicao((prev) => ({ ...prev, [campo]: valor }));
  }

  function selecionarNovaImagem(file) {
    if (!file) return;
    const LIMITE_MB = 5;
    if (file.size / (1024 * 1024) > LIMITE_MB) {
      toastError(`A imagem deve ter no máximo ${LIMITE_MB}MB`);
      return;
    }
    if (novaImagemPreview) URL.revokeObjectURL(novaImagemPreview);
    setNovaImagem(file);
    setNovaImagemPreview(URL.createObjectURL(file));
  }

  async function salvarEdicao(id) {
    setSalvando(true);
    showLoading('Salvando alterações...');

    try {
      let urlImagemFinal = formEdicao.imagem;

      if (novaImagem) {
        const extensao = novaImagem.name.split('.').pop();
        const nomeArquivo = `${crypto.randomUUID()}.${extensao}`;
        const caminho = `materias/${nomeArquivo}`;

        const { error: erroUpload } = await supabase.storage
          .from('obras')
          .upload(caminho, novaImagem);
        if (erroUpload) throw erroUpload;

        const { data: urlData } = supabase.storage
          .from('obras')
          .getPublicUrl(caminho);
        urlImagemFinal = urlData.publicUrl;

        const caminhoAntigo = caminhoDoStorage(formEdicao.imagem);
        if (caminhoAntigo) {
          const { error: erroRemocao } = await supabase.storage
            .from('obras')
            .remove([caminhoAntigo]);
          if (erroRemocao) console.error('Erro ao remover imagem antiga:', erroRemocao);
        }
      }

      const { error: erroUpdate } = await supabase
        .from('materias')
        .update({
          titulo: formEdicao.titulo,
          texto: formEdicao.texto,
          imagem: urlImagemFinal,
          data_publicacao: formEdicao.data_publicacao,
        })
        .eq('id', id);

      if (erroUpdate) throw erroUpdate;

      hideLoading();
      toastSuccess('Matéria atualizada com sucesso!');
      await buscarMaterias();
      cancelarEdicao();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao salvar matéria:', erro);
      showError('Erro ao salvar', 'Verifique o console para detalhes');
    } finally {
      setSalvando(false);
    }
  }

  async function excluirMateria(materia) {
    const result = await confirmDelete(`a matéria "${materia.titulo}"`);

    if (!result.isConfirmed) {
      return;
    }

    showLoading('Excluindo matéria...');

    try {
      const caminho = caminhoDoStorage(materia.imagem);
      if (caminho) {
        const { error: erroRemocao } = await supabase.storage
          .from('obras')
          .remove([caminho]);
        if (erroRemocao) console.error('Erro ao remover imagem:', erroRemocao);
      }

      const { error } = await supabase.from('materias').delete().eq('id', materia.id);
      if (error) throw error;

      hideLoading();
      toastSuccess('Matéria excluída com sucesso!');
      await buscarMaterias();
      setSelecionados((prev) => prev.filter((id) => id !== materia.id));
    } catch (erro) {
      hideLoading();
      console.error('Erro ao excluir matéria:', erro);
      showError('Erro ao excluir', 'Verifique o console para detalhes');
    }
  }

  async function excluirSelecionados() {
    if (selecionados.length === 0) return;

    const result = await confirmDelete(`${selecionados.length} matéria(s)`);

    if (!result.isConfirmed) {
      return;
    }

    setExcluindoSelecao(true);
    showLoading('Excluindo matérias...');

    try {
      const materiasSelecionadas = materias.filter((m) => selecionados.includes(m.id));
      const caminhos = materiasSelecionadas
        .map((m) => caminhoDoStorage(m.imagem))
        .filter(Boolean);

      if (caminhos.length > 0) {
        const { error: erroRemocao } = await supabase.storage
          .from('obras')
          .remove(caminhos);
        if (erroRemocao) console.error('Erro ao remover imagens:', erroRemocao);
      }

      const { error } = await supabase
        .from('materias')
        .delete()
        .in('id', selecionados);
      if (error) throw error;

      hideLoading();
      toastSuccess(`${selecionados.length} matéria(s) excluída(s) com sucesso!`);
      setSelecionados([]);
      await buscarMaterias();
    } catch (erro) {
      hideLoading();
      console.error('Erro ao excluir selecionados:', erro);
      showError('Erro ao excluir', 'Verifique o console para detalhes');
    } finally {
      setExcluindoSelecao(false);
    }
  }

  return (
    <S.Wrapper>
      <S.CabecalhoLista>
        <S.TituloLista>Gerenciar Matérias</S.TituloLista>
        <S.AcoesLista>
          <S.BotaoPequeno as="button" onClick={buscarMaterias} style={{ flex: 'none' }}>
            🔄 Atualizar
          </S.BotaoPequeno>
          <S.BotaoPequeno
            $perigo
            as="button"
            style={{ flex: 'none' }}
            disabled={selecionados.length === 0 || excluindoSelecao}
            onClick={excluirSelecionados}
          >
            🗑️ Excluir Itens Selecionados ({selecionados.length})
          </S.BotaoPequeno>
        </S.AcoesLista>
      </S.CabecalhoLista>

      {erro && <S.Aviso $erro>{erro}</S.Aviso>}
      {carregando && <S.Aviso>Carregando matérias...</S.Aviso>}

      {!carregando && materias.length === 0 && !erro && (
        <S.VazioLista>Nenhuma matéria cadastrada ainda.</S.VazioLista>
      )}

      <S.Grid>
        {materias.map((materia) =>
          editandoId === materia.id ? (
            <div
              key={materia.id}
              style={{
                gridColumn: '1 / -1',
                border: '1px solid #e4e1db',
                borderRadius: 10,
                padding: 20,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <strong style={{ fontSize: 16 }}>Editando: {materia.titulo}</strong>

              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>Título</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={formEdicao.titulo}
                  onChange={(e) => atualizarCampo('titulo', e.target.value)}
                />
              </div>

              <div style={{ width: 200 }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
                  Data de Publicação
                </label>
                <input
                  style={inputStyle}
                  type="date"
                  value={formEdicao.data_publicacao}
                  onChange={(e) => atualizarCampo('data_publicacao', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>Texto</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  rows={8}
                  maxLength={3000}
                  value={formEdicao.texto}
                  onChange={(e) => atualizarCampo('texto', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#4b4e54' }}>
                  Imagem de Capa
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                  <img
                    src={novaImagemPreview || formEdicao.imagem}
                    alt="Capa"
                    style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      selecionarNovaImagem(e.target.files[0]);
                      e.target.value = '';
                    }}
                  />
                </div>
              </div>

              <S.LinhaBotoesEdicao>
                <S.BotaoCancelar type="button" onClick={cancelarEdicao} disabled={salvando}>
                  Cancelar
                </S.BotaoCancelar>
                <S.BotaoSalvar type="button" onClick={() => salvarEdicao(materia.id)} disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar alterações'}
                </S.BotaoSalvar>
              </S.LinhaBotoesEdicao>
            </div>
          ) : (
            <S.Card key={materia.id}>
              <S.Thumb $src={materia.imagem}>
                {!materia.imagem && 'Sem imagem'}
                <S.CaixaSelecao>
                  <input
                    type="checkbox"
                    checked={selecionados.includes(materia.id)}
                    onChange={() => toggleSelecionado(materia.id)}
                  />
                </S.CaixaSelecao>
              </S.Thumb>
              <S.CardCorpo>
                <S.NomeObra>{materia.titulo}</S.NomeObra>
                <S.LinhaSecundaria>{materia.data_publicacao}</S.LinhaSecundaria>
                <S.LinhaSecundaria>
                  {(materia.texto || '').slice(0, 80)}
                  {(materia.texto || '').length > 80 ? '...' : ''}
                </S.LinhaSecundaria>
              </S.CardCorpo>
              <S.CardRodape>
                <S.BotaoPequeno onClick={() => iniciarEdicao(materia)}>Editar</S.BotaoPequeno>
                <S.BotaoPequeno $perigo onClick={() => excluirMateria(materia)}>
                  Excluir
                </S.BotaoPequeno>
              </S.CardRodape>
            </S.Card>
          )
        )}
      </S.Grid>
    </S.Wrapper>
  );
}

const inputStyle = {
  background: '#fbfaf8',
  color: '#23262b',
  border: '1px solid #d9d6cf',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
  marginTop: 6,
};