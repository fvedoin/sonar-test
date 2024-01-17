import {
  generateRandomQueryParams,
  makeid,
  updateQueryStringParameter,
} from '../utils';

describe('generateRandomQueryParams functions', () => {
  describe('generateRandomQueryParams', () => {
    it('deve gerar parâmetros de consulta aleatórios', () => {
      const url = 'http://example.com';
      const result = generateRandomQueryParams(url);

      expect(result.startsWith(url)).toBe(true);
      const queryParamsPart = result.substring(url.length);
      expect(queryParamsPart).toMatch(/[a-zA-Z0-9]+/);
    });

    it('deve gerar parâmetros de consulta aleatórios', () => {
      const url = 'http://example.com?foo=bar';
      const result = generateRandomQueryParams(url);

      expect(result.startsWith(url)).toBe(true);
      const queryParamsPart = result.substring(url.length);
      expect(queryParamsPart).toMatch(/[a-zA-Z0-9]+/);
    });

    it('deve gerar parâmetros de consulta aleatórios', () => {
      const baseUrl = 'http://example.com?foo=bar';
      let result = generateRandomQueryParams(baseUrl);
      result = generateRandomQueryParams(result);

      expect(typeof result).toBe('string');
      expect(result.startsWith(baseUrl)).toBe(true);

      const queryParamsPart = result.substring(baseUrl.length + 1);

      const queryParamsArray = queryParamsPart.split('&');
      const queryParamsRegex = /^[a-zA-Z0-9]+=[a-zA-Z0-9]+$/;
      queryParamsArray.forEach((queryParam) => {
        expect(queryParam).toMatch(queryParamsRegex);
      });

      expect(result).toContain('?');
    });
  });

  it('deve gerar parâmetros de consulta aleatórios', () => {
    const baseUrl = 'http://example.com?foo=bar&searchText=';
    let result = generateRandomQueryParams(baseUrl);
    result = generateRandomQueryParams(result);

    expect(typeof result).toBe('string');
    expect(result.startsWith(baseUrl)).toBe(true);

    const queryParamsPart = result.substring(baseUrl.length + 1);

    const queryParamsArray = queryParamsPart.split('&');
    const queryParamsRegex = /^[a-zA-Z0-9]+=[a-zA-Z0-9]+$/;
    queryParamsArray.forEach((queryParam) => {
      expect(queryParam).toMatch(queryParamsRegex);
    });

    expect(result).toContain('?');
  });

  describe('updateQueryStringParameter', () => {
    it('deve atualizar corretamente o parâmetro de consulta', () => {
      const uri = 'http://example.com?foo=bar';
      const key = 'baz';
      const value = 'qux';

      const result = updateQueryStringParameter(uri, key, value);

      expect(result).toContain(`${uri}&${key}=${value}`);
    });

    it('deve adicionar corretamente o parâmetro de consulta se não existir', () => {
      const uri = 'http://example.com';
      const key = 'foo';
      const value = 'bar';

      const result = updateQueryStringParameter(uri, key, value);

      expect(result).toContain(`?${key}=${value}`);
    });
  });

  describe('makeid function', () => {
    test('should generate a string of the specified length', () => {
      const length = 5;
      const result = makeid(length);

      // Check if the result is a string
      expect(typeof result).toBe('string');

      // Check if the length of the generated string is equal to the specified length
      expect(result.length).toBe(length);
    });

    test('should generate a string of the specified length (example with length 10)', () => {
      const length = 10;
      const result = makeid(length);

      // Check if the result is a string
      expect(typeof result).toBe('string');

      // Check if the length of the generated string is equal to the specified length
      expect(result.length).toBe(length);
    });

    test('deve gerar uma string de comprimento especificado contendo apenas letras', () => {
      const length = 5;
      const result = makeid(length);

      expect(typeof result).toBe('string');
      expect(result.length).toBe(length);
      expect(result).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });
});
