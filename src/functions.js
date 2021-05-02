HTMLElement.prototype.wrap = function (wrapper) {
    this.parentNode.insertBefore(wrapper, this);
    wrapper.appendChild(this);
}


function getFaviconColor(img) {
    var colorList = {};

    var imageWidth = img.width;
    var imageHeight = img.height;
    var canvas = document.createElement('canvas');
    canvas.height = imageHeight;
    canvas.width = imageWidth;
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, imageWidth, imageHeight);
    var imageData;

    try {
        imageData = context.getImageData(0, 0, imageWidth, imageHeight);
    } catch (e) {
        console.log(e);
    }

    if (imageData == null) return '#000000';

    var data = imageData.data;
    // quickly iterate over all pixels
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];


        if (r > 200 && g > 200 && b > 200) continue;
        if (r == 0 && g == 0 && b == 0) continue;

        var hex = rgb2hex("rgb(" + r + "," + g + "," + b + ")");

        if (colorList[hex] == null || colorList[hex] == undefined) {
            colorList[hex] = 1;
        } else {
            colorList[hex] += 1;
        }
    }
    // console.log(colorList);

    var sorted_keys = Object.keys(colorList).sort(function (a, b) { return colorList[a] - (colorList[b]); }).reverse();

    if (sorted_keys.length == 0) return '#000000';
    colorToReturn = colorList[sorted_keys[0]] - colorList[sorted_keys[1]] > 2 ? sorted_keys[0] : sorted_keys[1];
    /// Color returned for results with no favicon. Return white, which will be ignored
    if (colorToReturn == '#4040bf') return '#ffffff';

    // console.log(img.src);
    // console.log(colorToReturn);


    return colorToReturn;
}

//rgb to hex function
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

/// Doesn't work - request gets blocked by CORS policies
function getResultFullTilte(url, resultTitle) {
    console.log('trying to get result full title...');
    try {

        fetch(url, { mode: 'cors' })
            .then(function (response) {
                return response.text();
            })
            .then(function (body) {
                if (body !== undefined && body.includes('<title>')) {
                    var title = body.split('<title>')[1].split('</title>')[0]
                    // var output = { id: 1234, rawHTML: title };
                    // callback(null, output);
                    resultTitle.setAttribute('title', title);
                    console.log('Set title ' + title);
                }

            });
    } catch (e) {
        console.log('error while setting full title for ' + url);
        console.log(e);
    }
}