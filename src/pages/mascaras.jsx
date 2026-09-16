// Formata como CPF: 222.222.222-22
export function mascaraCPF(valor) {
  const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);
  return somenteNumeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Formata como telefone: (99) 99999-9999 ou (99) 9999-9999
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

// Extrai o caminho relativo dentro do bucket 'obras' a partir de uma URL pública
// do Supabase Storage, para poder usar em supabase.storage.from('obras').remove([...]).
//
// Exemplo de URL pública:
// https://xxxx.supabase.co/storage/v1/object/public/obras/obrasandamento/nome-do-arquivo.jpg
//
// Retorna: 'obrasandamento/nome-do-arquivo.jpg'
export function caminhoDoStorage(url) {
  if (!url || typeof url !== 'string') return null;

  const marcador = '/obras/';
  const indice = url.indexOf(marcador);
  if (indice === -1) return null;

  const caminho = url.slice(indice + marcador.length);
  return caminho || null;
}