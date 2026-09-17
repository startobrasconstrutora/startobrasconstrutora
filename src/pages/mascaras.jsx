export function mascaraCPF(valor) {
  const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);
  return somenteNumeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}


export function mascaraTelefone(valor) {
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


export function caminhoDoStorage(url) {
  if (!url || typeof url !== 'string') return null;

  const marcador = '/obras/';
  const indice = url.indexOf(marcador);
  if (indice === -1) return null;

  const caminho = url.slice(indice + marcador.length);
  return caminho || null;
}

// ------------------------------------------------------------------
// Código público da obra: #AAMMNNN
//   AA  = 2 últimos dígitos do ano do cadastro (2026 -> 26)
//   MM  = mês do cadastro (01 a 12)
//   NNN = sequencial do ano inteiro, não reinicia por mês (001 a 999+)
//
// Os campos ano_obra, mes_obra e numero_obra são preenchidos
// automaticamente pelo Supabase (trigger) quando a obra é criada.
// ------------------------------------------------------------------

// Recebe o objeto da obra (precisa ter ano_obra, mes_obra, numero_obra)
// e devolve o código formatado, ex: "#2606001"
export function formatarCodigoObra(obra) {
  if (!obra || obra.ano_obra == null || obra.mes_obra == null || obra.numero_obra == null) {
    return '----';
  }
  const anoDoisDigitos = String(obra.ano_obra % 100).padStart(2, '0');
  const mes = String(obra.mes_obra).padStart(2, '0');
  const numero = String(obra.numero_obra).padStart(3, '0');
  return `#${anoDoisDigitos}${mes}${numero}`;
}

// Aplica a máscara enquanto a pessoa digita no campo de busca:
// só números, sempre com # na frente, limitado a 7 dígitos (AAMMNNN)
export function mascaraCodigoObra(valor) {
  const digitos = String(valor || '').replace(/\D/g, '').slice(0, 7);
  return digitos ? `#${digitos}` : '';
}

// Extrai { anoCompleto, mes, numero, digitos } a partir de um texto
// digitado (com ou sem #, com ou sem espaços). Retorna null se não
// tiver exatamente 7 dígitos.
export function extrairComponentesDoCodigo(valor) {
  const digitos = String(valor || '').replace(/\D/g, '');
  if (digitos.length !== 7) return null;

  const anoDoisDigitos = parseInt(digitos.slice(0, 2), 10);
  const mes = parseInt(digitos.slice(2, 4), 10);
  const numero = parseInt(digitos.slice(4, 7), 10);

  return {
    anoCompleto: 2000 + anoDoisDigitos,
    mes,
    numero,
    digitos,
  };
}