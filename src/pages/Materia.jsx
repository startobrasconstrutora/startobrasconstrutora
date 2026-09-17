import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import heroImg from "../assets/img/capacete.png";
import * as S from './Materia.styles.jsx';

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

export default function Materia() {
  const { id } = useParams();
  const [materia, setMateria] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarMateria() {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from('materias')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        setErro('Não encontramos essa matéria.');
        console.error('Erro ao buscar matéria:', error);
      } else {
        setMateria(data);
      }
      setCarregando(false);
    }
    buscarMateria();
  }, [id]);

  return (
    <S.Pagina>
      <S.HeroWrapper>
        <S.HeroImage>
          <img src={materia?.imagem || heroImg} alt={materia?.titulo || 'Notícia Start Obras'} />
        </S.HeroImage>
        <S.HeroBadge>NOTÍCIA</S.HeroBadge>
      </S.HeroWrapper>

      <S.Container>
        <S.BotaoVoltar to="/">← Voltar para a Home</S.BotaoVoltar>

        {carregando && <S.Mensagem>Carregando...</S.Mensagem>}

        {!carregando && (erro || !materia) && (
          <S.Mensagem>{erro || 'Matéria não encontrada.'}</S.Mensagem>
        )}

        {!carregando && materia && (
          <S.Quadro>
            <S.Data>{formatarData(materia.data_publicacao)}</S.Data>
            <S.Titulo>{materia.titulo}</S.Titulo>
            <S.Texto>
              {materia.texto.split('\n').map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
              ))}
            </S.Texto>
          </S.Quadro>
        )}
      </S.Container>
    </S.Pagina>
  );
}