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
// Código público da obra: código livre, definido manualmente pelo
// admin (4 a 10 dígitos numéricos). Armazenado em obras.codigo_obra
// como string de dígitos, sem o "#".
// ------------------------------------------------------------------

// Recebe o objeto da obra e devolve o código formatado para exibição,
// ex: "#1234567890"
export function formatarCodigoObra(obra) {
  if (!obra || !obra.codigo_obra) return '----';
  return obra.codigo_obra;
}

// Aplica a máscara enquanto a pessoa digita no campo de busca:
// só números, sempre com # na frente, limitado a 10 dígitos
export function mascaraCodigoObra(valor) {
  const digitos = String(valor || '').replace(/\D/g, '').slice(0, 10);
  return digitos ? `#${digitos}` : '';
}

// Extrai só os dígitos de um texto digitado (com ou sem #, espaços etc).
// Retorna null se não tiver entre 4 e 10 dígitos.
export function extrairDigitosDoCodigo(valor) {
  const digitos = String(valor || '').replace(/\D/g, '');
  if (digitos.length < 4 || digitos.length > 10) return null;
  return digitos;
}