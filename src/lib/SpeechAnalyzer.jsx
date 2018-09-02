const library = {
  intent: {
    'find me': 'request',
    'help me': 'request',
    'can you': 'request',
    'i': 'statement',
    'where': 'request',
    'did you know': 'query',
    'do you know': 'query',
    'what': 'query',
    'what\'s': 'query'
  },
  context: {
    'my': 'phil',
    'mom\'s': 'mother',
    'mother\'s': 'mother',
    'today': new Date(),
    'tomorrow': getTomorrow(),
  }
}
