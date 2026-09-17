import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Secao = styled.div`
  width: 100%;
  padding: 20px 10% 60px;

  h2 {
    color: var(--principaldarker);
    padding-bottom: 24px;
    font-size: 1.6rem;
  }

  @media (max-width: 768px) {
    padding: 20px 6% 40px;

    h2 {
      font-size: 1.3rem;
    }
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`

export const CardImg = styled.div`
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
`

export const CardCorpo = styled.div`
  padding: 18px 20px 22px;

  h3 {
    font-size: 1.1rem;
    color: #24231F;
    margin: 6px 0 0;
  }
`

export const Data = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: #F0A23A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`