import { Command, flags } from '@oclif/command'
import { validate } from '@oneci/core'
import getStdin = require('get-stdin')
import { getFileContents } from '../common'

export default class Validate extends Command {
  static description = 'validate an oneci configuration'

  static examples = [
    `$ oneci validate
$ oneci validate .oneci.json
$ oneci validate .oneci.yaml
$ echo "..." | oneci validate
`
  ]

  static flags = {
    help: flags.help({ char: 'h' })
  }

  static args = [
    {
      name: 'file',
      description:
        'if not provided, will autodetect .oneci.{yml,yaml,json} files in the working directory'
    }
  ]

  async run () {
    const { args } = this.parse(Validate)

    const input = await getStdin()

    if (input && args.file) {
      throw new Error('Both stdin and FILE argument are provided')
    }

    try {
      if (input) {
        validate(JSON.parse(input))
      } else {
        validate(getFileContents(args.file))
      }
    } catch (error) {
      this.error(error.message)
      this.exit(1)
    }
  }
}
