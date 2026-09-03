import { describe, it, expect } from 'vitest';
import { parseCommand, findSystem } from '@/lib/shell/commands';
import { projects } from '@/lib/data/projects';

describe('parseCommand', () => {
  it('ignores blank input', () => {
    expect(parseCommand('   ')).toEqual({ action: 'none' });
  });

  it('reads the listing commands', () => {
    expect(parseCommand('ls')).toEqual({ action: 'list' });
    expect(parseCommand('ls systems')).toEqual({ action: 'list' });
  });

  it('reads open with a name fragment', () => {
    expect(parseCommand('open hris')).toEqual({ action: 'open', query: 'hris' });
    expect(parseCommand('OPEN  RME ')).toEqual({ action: 'open', query: 'rme' });
  });

  it('reads a filter with or without the word filter', () => {
    expect(parseCommand('filter client:bpn')).toEqual({
      action: 'filter', key: 'client', value: 'bpn',
    });
    expect(parseCommand('client:bpn')).toEqual({
      action: 'filter', key: 'client', value: 'bpn',
    });
  });

  it('refuses a filter key it does not know', () => {
    expect(parseCommand('colour:amber')).toEqual({ action: 'unknown', input: 'colour:amber' });
  });

  it('reads reset, view, lang, contact and help', () => {
    expect(parseCommand('reset')).toEqual({ action: 'reset' });
    expect(parseCommand('view flat')).toEqual({ action: 'view', view: 'list' });
    expect(parseCommand('flat')).toEqual({ action: 'view', view: 'list' });
    expect(parseCommand('view iso')).toEqual({ action: 'view', view: 'map' });
    expect(parseCommand('map')).toEqual({ action: 'view', view: 'map' });
    expect(parseCommand('lang en')).toEqual({ action: 'lang', lang: 'en' });
    expect(parseCommand('lang id')).toEqual({ action: 'lang', lang: 'id' });
    expect(parseCommand('contact')).toEqual({ action: 'contact' });
    expect(parseCommand('cv')).toEqual({ action: 'contact' });
    expect(parseCommand('help')).toEqual({ action: 'help' });
  });

  it('reports anything else as unknown, keeping what was typed', () => {
    expect(parseCommand('sudo rm -rf')).toEqual({ action: 'unknown', input: 'sudo rm -rf' });
  });

  it('has no rare command — that marker was removed from the design', () => {
    expect(parseCommand('--rare').action).toBe('unknown');
  });
});

describe('findSystem', () => {
  it('finds a system by slug prefix, short name or title', () => {
    expect(findSystem(projects, 'hris').slug).toBe('hris-nirwana');
    expect(findSystem(projects, 'rme').slug).toBe('rme');
    expect(findSystem(projects, 'ocr').slug).toBe('rsu-nirwana-web');
  });

  it('returns null when nothing matches', () => {
    expect(findSystem(projects, 'kubernetes')).toBe(null);
  });
});
