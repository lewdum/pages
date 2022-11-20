const logo = `
                                          ▄▄
▀████▀                                  ▀███
  ██                                      ██
  ██       ▄▄█▀██▀██▀    ▄█    ▀██▀  ▄█▀▀███ ▀███  ▀███ ▀████████▄█████▄
  ██      ▄█▀   ██ ██   ▄███   ▄█  ▄██    ██   ██    ██   ██    ██    ██
  ██     ▄██▀▀▀▀▀▀  ██ ▄█  ██ ▄█   ███    ██   ██    ██   ██    ██    ██
  ██    ▄███▄    ▄   ███    ███    ▀██    ██   ██    ██   ██    ██    ██
██████████ ▀█████▀    █      █      ▀████▀███▄ ▀████▀███▄████  ████  ███

`

document.addEventListener('alpine:init', () => {
	Alpine.store('terminal', {
		input: '',
		output: [],
		history: [],
		current: [],

		tree: {
			'hello.txt': `
				hello I am testing the file system
			`,
			'hello.exe'(args) {
				this.echo('hi. you passed these arguments:')
				args.forEach(arg => this.echo(`- ${arg}`))
			},
		},

		commands: {
			enter(args) {
				if (args.length !== 1) {
					this.echo('expected exactly 1 argument')
					return
				}
				this.current = [...this.current, args[0]]
				this.runCommand('here')
			},

			help(args) {
				this.echo('available commands:')

				const all = Object.keys(this.commands)
				all.sort()
				all.forEach(cmd => this.echo(`- ${cmd}`))
			},

			here(args) {
				this.echo(`we are at: ${this.herePath()}`)
			},

			leave(args) {
				if (this.current.length === 0) {
					this.echo('cannot leave root')
					return
				}
				this.current.pop()
				this.runCommand('here')
			},

			logo(args) {
				this.echo(logo)
				this.echo('welcome to termlewd v1.02.501 · lewd/OS 22 · lewdum inc')
				// this.echo('copyright 2022 @lewdum@tech.lgbt · all rights reserved')
			},

			list(args) {
				const dir = this.here()
				for (const key in dir) {
					if (Object.hasOwnProperty.call(dir, key)) {
						this.echo(key)
					}
				}
			},

			print(args) {
				if (args.length !== 1) {
					this.echo('expected exactly 1 argument')
					return
				}
				const file = this.hereFile(args[0])
				if (file === undefined) {
					this.echo('file not found')
					return
				}
				if (typeof file !== 'string') {
					this.echo('not a text file')
					return
				}
				const clean = file.trim()  // TODO: Remove indentation.
				const lines = clean.split('\n')
				lines.forEach(line => this.echo(line))
			},

			run(args) {
				if (args.length < 1) {
					this.echo('expected at least 1 argument')
					return
				}
				const file = this.hereFile(args[0])
				if (file === undefined) {
					this.echo('file not found')
					return
				}
				if (typeof file !== 'function') {
					this.echo('not a runnable file')
					return
				}
				file.apply(this, [args.slice(1)])
			},
		},

		run() {
			const clean = this.input.trim()
			this.echo(`$ ${clean}`)
			if (clean !== '') {
				const parts = this.input.split(/\s+/)
				if (parts.length > 0) {
					const [cmd, ...args] = parts
					this.runCommand(cmd, args)
					this.history.push(clean)
				}
			}
			this.echo()
			this.input = ''
		},

		runCommand(cmd, args = []) {
			const handler = this.commands[cmd]
			if (handler === undefined) {
				this.echo('unknown command')
				this.echo('type `help` for a list')
				return
			}
			if (typeof handler === 'string') {
				this.echo(handler)
			} else if (typeof handler === 'function') {
				handler.apply(this, [args])
			} else {
				console.error('bad command handler', handler)
			}
		},

		echo(message = '') {
			let kind = 'normal'
			if (message.startsWith('$ ')) {
				kind = 'command'
			} else if (message === '') {
				kind = 'separator'
			} else if (message.startsWith('\n')) {
				kind = 'banner'
			}
			this.output.push({
				text: message,
				kind,
			})
		},

		herePath() {
			return '/' + this.current.join('/')
		},

		here() {
			let dir = this.tree
			this.current.forEach(part => dir = dir[part])
			return dir
		},

		hereFile(name) {
			const dir = this.here()
			if (Object.hasOwnProperty.call(dir, name)) {
				return dir[name]
			}
		},

		init() {
			this.runCommand('logo', [])
			this.echo()
		}
	})
})
