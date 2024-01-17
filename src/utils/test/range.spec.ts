import { range } from '../range';

describe('range function', () => {
  it('Should has a length 5', () => {
    expect(range(5)).toHaveLength(5);
  });

  it('Should has a length 10', () => {
    expect(range(10)).toHaveLength(10);
  });
});
