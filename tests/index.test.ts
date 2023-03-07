import path from 'path';
import makeCombined from '../src/index';

describe('combine', () => {
  it('should return a combined images\' location string', async () => {
    makeCombined(path.join(process.cwd(), 'pp.jpeg'), path.join(process.cwd(), 'pp.jpeg'), path.join(process.cwd(), 'pp.jpeg'))
      .then((res) => expect(typeof res).toBe('string'));
  });
});