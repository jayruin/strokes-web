class KanjiSVG {
    static loadCharacterData(character) {
        var rootURL = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji";
        return fetch(`${rootURL}/${character.codePointAt(0).toString(16).padStart(5, "0")}.svg`, { method: "GET" })
            .then(response => response.blob())
            .then(blob => blob.text())
            .then(text => new DOMParser().parseFromString(text, "image/svg+xml"))
            .then(doc => {
                var viewBox = doc.querySelector("svg").getAttribute("viewBox");
                var strokes = [];
                Array.from(doc.querySelectorAll("path")).sort(function (a, b) {
                    var aID = a.getAttribute("id");
                    var bID = b.getAttribute("id");
                    if (aID < bID) {
                        return -1;
                    }
                    if (aID > bID) {
                        return 1;
                    }
                    return 0;
                }).forEach(element => strokes.push(element.getAttribute("d")));
                return { viewBox: viewBox, strokes: strokes };
            });
    }
}

async function jpCreateSVGs(character) {
    svgs = []
    await KanjiSVG.loadCharacterData(character)
        .then(function (charData) {
            for (var i = 0; i < charData.strokes.length; i++) {
                var strokesPortion = charData.strokes.slice(0, i + 1);
                svgs.push(jpCreateSVG(charData.viewBox, strokesPortion));
            }
        });
    return svgs;
}

function jpCreateSVG(viewBox, strokes) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttributeNS(null, "viewBox", viewBox);

    var [minx, miny, width, height] = viewBox.split(" ").map(value => parseInt(value));
    svg.appendChild(createLine(width / 2, 0, width / 2, height, "#DDD"));
    svg.appendChild(createLine(0, height / 2, width, height / 2, "#DDD"));

    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.style = "fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;";
    svg.appendChild(group);

    strokes.forEach(function (strokePath) {
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(null, "d", strokePath);
        group.appendChild(path);
    });

    return svg;
}

async function jpRenderFanningStrokes(character, target) {
    var svgs = await jpCreateSVGs(character);
    var digits = Math.floor(Math.log10(svgs.length)) + 1;
    for (var i = 0; i < svgs.length; i++) {
        var svg = svgs[i];
        var span = document.createElement("span");
        span.style = "display: inline-block; width: 100px; height: 100px; border: 1px solid rgb(0, 0, 0); margin-right: 1em;";
        span.appendChild(svg);
        target.appendChild(span);
        if (shouldDownload.checked) {
            download(`${character}-jp-${(i + 1).toString().padStart(digits, "0")}.svg`, svg.outerHTML);
        }
    }
}

document.getElementById("generate-button-jp").addEventListener("click", function () {
    var character = document.getElementById("character-input").value;
    var target = document.getElementById("target-jp");
    clearNode(target);
    jpRenderFanningStrokes(character, target);
});
