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
export function formatarCodigoObra(obra) {
  if (!obra || !obra.codigo_obra) return '----';
  return obra.codigo_obra;
}
export function mascaraCodigoObra(valor) {
  const digitos = String(valor || '').replace(/\D/g, '').slice(0, 10);
  return digitos ? `#${digitos}` : '';
}
export function extrairDigitosDoCodigo(valor) {
  const digitos = String(valor || '').replace(/\D/g, '');
  if (digitos.length < 4 || digitos.length > 10) return null;
  return digitos;
}
