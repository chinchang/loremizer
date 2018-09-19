window.loremiscous =
	window.loremiscous ||
	(function() {
		const lorem =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hoc non est positum in nostra actione. Dat enim intervalla et relaxat. Cupit enim dícere nihil posse ad beatam vitam deesse sapienti. Quasi vero, inquit, perpetua oratio rhetorum solum, non etiam philosophorum sit. Pauca mutat vel plura sane; Ne tum quidem te respicies et cogitabis sibi quemque natum esse et suis voluptatibus? Duo Reges: constructio interrete. Ergo instituto veterum, quo etiam Stoici utuntur, hinc capiamus exordium.';
		// https://loripsum.net/

		var imgs = [...document.querySelectorAll('img')];
		var operations = [];

		function addOperation(fn) {
			operations.push(fn);
		}

		function replaceImgs() {
			imgs.forEach(i => {
				const width = +i.style.width;
				const height = +i.style.height;
				const lastValue = i.src;
				addOperation(() => (i.src = lastValue));
				if (width) {
					i.src = `https://picsum.photos/${width}/${height}?random`;
				} else {
					i.src = `https://picsum.photos/200?random`;
				}
				//    https://loremflickr.com/320/240
			});
		}

		function handleIframes() {
			var iframes = [...document.querySelectorAll('iframe')];
			iframes.forEach(iframe => {
				const lastValue = iframe.style.filter;
				addOperation(() => (iframe.style.filter = lastValue));
				iframe.style.filter = 'blur(4px)';
			});
		}

		function handleFormInputs() {
			var inputs = [...document.querySelectorAll('input, textarea')];
			inputs.forEach(input => {
				const lastValue = input.value;
				addOperation(() => (input.value = lastValue));
				input.value = lorem.substr(0, input.value.length);
			});
		}

		function replaceBgImgs() {
			var allBackgroundURLs = new Array();
			var tags = [...document.querySelectorAll('*')];
			var numTags = tags.length;
			for (var i = 0; i < numTags; i++) {
				tag = tags[i];
				if (tag.style.background.match('url') || tag.style.backgroundImage) {
					var bg = tag.style.background;
					// allBackgroundURLs.push({tag, bg.substr(bg.indexOf("url") + 4, bg.lastIndexOf(")") - (bg.indexOf("url") + 4) ) });
					const lastValue = tag.style.backgroundImage;
					addOperation(() => (tag.style.backgroundImage = lastValue));
					tag.style.backgroundImage = 'url(https://picsum.photos/200?random)';
				}
			}
		}

		function getTextNodesIn(elem, opt_fnFilter) {
			var textNodes = [];
			if (elem) {
				for (var nodes = elem.childNodes, i = nodes.length; i--; ) {
					var node = nodes[i],
						nodeType = node.nodeType;
					if (nodeType == 3) {
						if (!opt_fnFilter || opt_fnFilter(node, elem)) {
							textNodes.push(node);
						}
					} else if (nodeType == 1 || nodeType == 9 || nodeType == 11) {
						textNodes = textNodes.concat(getTextNodesIn(node, opt_fnFilter));
					}
				}
			}
			return textNodes;
		}

		function replaceText() {
			var nodes = getTextNodesIn(document.body).filter(n =>
				n.nodeValue.match(/\S/)
			);
			// console.log(nodes.length, nodes[3].nodeValue)
			nodes.forEach(n => {
				const lastValue = n.nodeValue;
				addOperation(() => (n.nodeValue = lastValue));
				n.nodeValue = lorem.substr(0, n.nodeValue.trim().length);
			});
		}

		function undo() {
			operations.forEach(op => op());
			operations = [];
		}

		function runLoremiscous() {
			if (operations.length) {
				undo();
			} else {
				requestIdleCallback(replaceText);
				requestIdleCallback(replaceImgs);
				requestIdleCallback(replaceBgImgs);
				requestIdleCallback(handleIframes);

				// TODO: Replacing form control values can trigger unexpected behavior.
				// requestIdleCallback(handleFormInputs)
			}
		}
		return runLoremiscous;
	})();

window.loremiscous();
