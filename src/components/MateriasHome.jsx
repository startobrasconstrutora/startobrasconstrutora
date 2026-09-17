import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import * as S from './MateriasHome.styles.jsx';

function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

export default function MateriasHome() {
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarMaterias() {
      const { data, error } = await supabase
        .from('materias')
        .select('*')
        .order('data_publicacao', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Erro ao buscar matérias:', error);
      } else {
        setMaterias(data || []);
      }
      setCarregando(false);
    }
    buscarMaterias();
  }, []);

  if (carregando || materias.length === 0) return null;

  return (
    <S.Secao>
      <h2>Notícias e Novidades</h2>
      <S.Grid>
        {materias.map((materia) => (
          <S.CardLink key={materia.id} to={`/materia/${materia.id}`}>
            <S.CardImg style={{ backgroundImage: `url(${materia.imagem})` }} />
            <S.CardCorpo>
              <S.Data>{formatarData(materia.data_publicacao)}</S.Data>
              <h3>{materia.titulo}</h3>
            </S.CardCorpo>
          </S.CardLink>
        ))}
      </S.Grid>
    </S.Secao>
  );
}