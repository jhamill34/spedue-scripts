import 'jest'

// For use in gatsby rather than forcing
// the client to handle it
const localGlobal = global as any
localGlobal.___loader = {
  enqueue: jest.fn(),
}
