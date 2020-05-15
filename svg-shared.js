function clearNode(node) {
	while (node.firstChild) {
		node.removeChild(node.lastChild);
	}
}

function createLine(x1, y1, x2, y2, stroke) {
	var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttributeNS(null, "x1", x1);
	line.setAttributeNS(null, "y1", y1);
	line.setAttributeNS(null, "x2", x2);
	line.setAttributeNS(null, "y2", y2);
	line.setAttributeNS(null, "stroke", stroke);
	line.setAttributeNS(null, "stroke-width", "1%");
	return line;
}

function download(filename, text) {
	var a = document.createElement("a");
	a.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text));
	a.setAttribute('download', filename);

	a.style.display = 'none';
	document.body.appendChild(a);

	a.click();

	document.body.removeChild(a);
}