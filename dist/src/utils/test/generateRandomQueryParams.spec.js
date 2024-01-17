"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('generateRandomQueryParams functions', () => {
    describe('generateRandomQueryParams', () => {
        it('deve gerar parâmetros de consulta aleatórios', () => {
            const url = 'http://example.com';
            const result = (0, utils_1.generateRandomQueryParams)(url);
            expect(result.startsWith(url)).toBe(true);
            const queryParamsPart = result.substring(url.length);
            expect(queryParamsPart).toMatch(/[a-zA-Z0-9]+/);
        });
        it('deve gerar parâmetros de consulta aleatórios', () => {
            const url = 'http://example.com?foo=bar';
            const result = (0, utils_1.generateRandomQueryParams)(url);
            expect(result.startsWith(url)).toBe(true);
            const queryParamsPart = result.substring(url.length);
            expect(queryParamsPart).toMatch(/[a-zA-Z0-9]+/);
        });
        it('deve gerar parâmetros de consulta aleatórios', () => {
            const baseUrl = 'http://example.com?foo=bar';
            let result = (0, utils_1.generateRandomQueryParams)(baseUrl);
            result = (0, utils_1.generateRandomQueryParams)(result);
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
        let result = (0, utils_1.generateRandomQueryParams)(baseUrl);
        result = (0, utils_1.generateRandomQueryParams)(result);
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
            const result = (0, utils_1.updateQueryStringParameter)(uri, key, value);
            expect(result).toContain(`${uri}&${key}=${value}`);
        });
        it('deve adicionar corretamente o parâmetro de consulta se não existir', () => {
            const uri = 'http://example.com';
            const key = 'foo';
            const value = 'bar';
            const result = (0, utils_1.updateQueryStringParameter)(uri, key, value);
            expect(result).toContain(`?${key}=${value}`);
        });
    });
    describe('makeid function', () => {
        test('should generate a string of the specified length', () => {
            const length = 5;
            const result = (0, utils_1.makeid)(length);
            expect(typeof result).toBe('string');
            expect(result.length).toBe(length);
        });
        test('should generate a string of the specified length (example with length 10)', () => {
            const length = 10;
            const result = (0, utils_1.makeid)(length);
            expect(typeof result).toBe('string');
            expect(result.length).toBe(length);
        });
        test('deve gerar uma string de comprimento especificado contendo apenas letras', () => {
            const length = 5;
            const result = (0, utils_1.makeid)(length);
            expect(typeof result).toBe('string');
            expect(result.length).toBe(length);
            expect(result).toMatch(/^[a-zA-Z0-9]+$/);
        });
    });
});
//# sourceMappingURL=generateRandomQueryParams.spec.js.map