import { main } from '@/index';

describe('main', () => {
  it('run console.log', () => {
    const spyOfLog = jest.spyOn(console, 'log').mockImplementation();
    main();
    expect(spyOfLog).toBeCalled();
  });
});
