// From https://texteditor.com/multiline-text-art/ (Blackie)
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
				hello I am testing the file system :)
			`,
			'hello.exe'(args) {
				this.echo('hi. you passed these arguments:')
				args.forEach(arg => this.echo(`- ${arg}`))
			},
			test: {
				'test.txt': `
					please ignore me, I am shy (///∇///)
				`,
			},
		},

		commands: {
			calc(args) {
				if (args.length < 1) {
					this.echo('expected at least 1 argument')
					return
				}
				const full = args.join(' ')
				try {
					const result = eval(full)
					this.echo(`result: ${result}`)
				} catch (err) {
					this.echo(`${err}`)
				}
			},

			echo(args) {
				this.echo(args.join(' '))
			},

			enter(args) {
				if (args.length !== 1) {
					this.echo('expected exactly 1 argument')
					return
				}
				const file = this.hereFile(args[0])
				if (file === undefined) {
					this.echo('directory not found')
					return
				}
				if (typeof file !== 'object' || file._special !== undefined) {
					this.echo('not a directory')
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

			list(args) {
				const dir = this.here()
				const files = []
				for (const key in dir) {
					if (Object.hasOwnProperty.call(dir, key)) {
						files.push(key)
					}
				}
				files.sort()
				files.forEach(file => this.echo(file))
			},

			logo(args) {
				this.echo(logo)
				this.echo('welcome to termlewd v1.02.501 · lewd/OS 22 · lewdum inc')
				// this.echo('copyright 2022 @lewdum@tech.lgbt · all rights reserved')
			},

			loop(args) {
				if (args.length < 2) {
					this.echo('expected at least 2 arguments')
					return
				}
				const head = args[0]
				const headCount = parseInt(head, 10)
				if (Number.isNaN(headCount)) {
					this.echo('invalid iterator')
					return
				}
				if (headCount > 100) {
					this.echo('loop count too high')
					return
				}
				if (args[1] === 'loop') {
					this.echo('invalid command')
					return
				}
				for (let i = 0; i < headCount; i++) {
					this.runCommand(args[1], args.slice(2))
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

		completions() {
			const clean = this.input.trim()
			if (clean === '') {
				// FIXME: So the browser doesn't show completions immediately.
				return []
			}
			const parts = clean.split(/\s+/)
			const endsInSpace = this.input.at(-1) === ' '
			if (parts.length <= 1 && !endsInSpace) {
				const partial = parts[0]
				return Object
					.keys(this.commands)
					.filter(cmd => cmd.startsWith(partial))
					.map(cmd => `${cmd} `)
			}
			let prefix = this.input
			let partial = ''
			if (!endsInSpace) {
				prefix = parts.slice(0, parts.length - 1).join(' ') + ' '  // TODO
				partial = parts.at(-1)
			}
			const valid = Object
				.keys(this.here())
				.filter(file => file.startsWith(partial))
			return valid.map(file => `${prefix}${file} `)
		},

		run() {
			const clean = this.input.trim()
			this.echo(`$ ${clean}`)
			if (clean !== '') {
				const parts = clean.split(/\s+/)
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
