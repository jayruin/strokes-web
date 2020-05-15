async function cnCreateSVGs(character) {
	svgs = []
	await HanziWriter.loadCharacterData(character)
	.then(function(charData) {
		for (var i = 0; i < charData.strokes.length; i++) {
			var strokesPortion = charData.strokes.slice(0, i + 1);
			svgs.push(cnCreateSVG(strokesPortion));
		}
	});
	return svgs;
}

function cnCreateSVG(strokes) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	svg.setAttributeNS(null, "viewBox", "0 0 1024 1024");
	
	svg.appendChild(createLine(512, 0, 512, 1024, "#DDD"));
	svg.appendChild(createLine(0, 512, 1024, 512, "#DDD"));
	
	var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	var transformData = HanziWriter.getScalingTransform(1024, 1024);
	group.setAttributeNS(null, "transform", transformData.transform);
	svg.appendChild(group);

	strokes.forEach(function(strokePath) {
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttributeNS(null, "d", strokePath);
		path.style.fill = "#000";
		group.appendChild(path);
	});
	
	return svg;
}

async function cnRenderFanningStrokes(character, target) {
	var svgs = await cnCreateSVGs(character);
	console.log(svgs);
	console.log(target);
	var digits = Math.ceil(Math.log10(svgs.length));
	for (var i = 0; i < svgs.length; i++) {
		var svg = svgs[i];
		var span = document.createElement("span");
		span.style = "display: inline-block; width: 100px; height: 100px; border: 1px solid rgb(0, 0, 0); margin-right: 1em;";
		span.appendChild(svg);
		target.appendChild(span);
		download(`${character}-${(i + 1).toString().padStart(digits, "0")}.svg`, svg.outerHTML)
	}
}

document.getElementById("generate-button-cn").addEventListener("click", function() {
	var target = document.getElementById("target-cn");
	console.log(target);
	clearNode(target);
	cnRenderFanningStrokes(document.getElementById("character-input").value, target);
});
