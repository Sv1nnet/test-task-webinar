export function generateId() {
	return `${Date.now().toString(36)}-${Math.floor(
		Math.random() * 1e16,
	).toString(36)}`;
}

export function createTimeCheckWorker() {
	function add(item, postMessage) {
		if (!item.done && item.date > Date.now()) this.items.push(item)
	}

	function remove({ id }, postMessage) {
		this.items = this.items.filter((item) => item.id !== id)
	}

	function init(items, postMessage) {
		const now = Date.now()
		this.items = items.filter(item => !item.done && item.date > now)
	}

	function onmessage({ data: [message, data] }) {
		if (typeof this.interval === 'number') clearInterval(this.interval)

		const action = this[message]
		if (typeof action === 'function') action(data, this.postMessage)
	}

	function startInterval() {
		setInterval(() => {
			const expiredItems = []
			const _items = []
			console.log('interval', this.items)
			this.items.forEach((item) => {
				if (item.date < Date.now()) expiredItems.push(item)
				else _items.push(item)
			})
			this.items = _items
			this.postMessage(['notify', expiredItems])
		}, 3000)
	}
	const blobURL = URL.createObjectURL(new Blob([
		`(${function () {
			this.items = [];
			this.interval = null;
		}.toString()})();`,
		`${init.toString()};`,
		`${add.toString()};`,
		`${remove.toString()};`,
		`${startInterval.toString()};`,
		`(${function () { this.startInterval(); }.toString()})();`,
		`onmessage = ${onmessage.toString()}`
	], { type: 'application/javascript' }));

	const worker = new Worker(blobURL);
	// cleanup the blob after it's created
	URL.revokeObjectURL(blobURL);

	return worker
}