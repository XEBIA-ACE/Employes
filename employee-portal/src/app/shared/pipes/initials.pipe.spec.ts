import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  const pipe = new InitialsPipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return initials for full name', () => {
    expect(pipe.transform('John Doe')).toBe('JD');
  });

  it('should handle single name', () => {
    expect(pipe.transform('Alice')).toBe('A');
  });

  it('should handle three names (only take first two)', () => {
    expect(pipe.transform('John Paul Doe')).toBe('JP');
  });

  it('should uppercase initials', () => {
    expect(pipe.transform('john doe')).toBe('JD');
  });

  it('should return ? for empty string', () => {
    expect(pipe.transform('')).toBe('?');
  });

  it('should return ? for whitespace-only string', () => {
    expect(pipe.transform('   ')).toBe('?');
  });
});
