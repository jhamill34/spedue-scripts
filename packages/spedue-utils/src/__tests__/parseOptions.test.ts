import { parseOptions } from '../parseOptions'

describe('parseOptions', () => {
  it('should parse just positional args', () => {
    const result = parseOptions(['one', 'two'])

    expect(Object.entries(result.keys)).toHaveLength(0)
    expect(result.positional).toHaveLength(2)
  })

  it('should parse flags with equal signs (e.g. --template=react)', () => {
    const result = parseOptions(['one', '--template=react'])

    expect(result.positional).toHaveLength(1)
    expect(result.keys['template']).toEqual('react')
  })

  it('should parse flags without the equal sign (e.g. --template react)', () => {
    const result = parseOptions(['one', '--template', 'react'])

    expect(result.positional).toHaveLength(1)
    expect(result.keys['template']).toEqual('react')
  })

  it('should parse back-to-back flags as booleans', () => {
    const result = parseOptions(['one', '--template', '--noEmit'])

    expect(result.positional).toHaveLength(1)
    expect(result.keys['template']).toEqual(true)
    expect(result.keys['noEmit']).toEqual(true)
  })
})
