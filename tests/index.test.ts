import path from 'path';
import makeCombined from '../src/index';

describe('combine', () => {
  it('should return a combined images\' location string', async () => {
    makeCombined(path.join(process.cwd(), 'images', '1.png'), path.join(process.cwd(), 'images', '2.png'), path.join(process.cwd(), 'images', '3.png'))
      .then((res) => expect(typeof res).toBe('string'));
  });
});