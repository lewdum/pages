const defaultBgColor = '#008080'

document.addEventListener('alpine:init', () => {
	Alpine.store('global', {
		bgColor: defaultBgColor,
	})
})

document.addEventListener('alpine:initialized', () => {
	Alpine.store('global', {
		bgColor: Alpine.$persist(defaultBgColor).as('bgColor'),
	})
})
