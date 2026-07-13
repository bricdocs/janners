const CardDetector = {

    lastQuad: null

};

function detectCard(src) {

    const gray = new cv.Mat();
    const blur = new cv.Mat();
    const edge = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    cv.GaussianBlur(
        gray,
        blur,
        new cv.Size(5, 5),
        0
    );

    cv.Canny(
        blur,
        edge,
        60,
        150
    );

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.findContours(
        edge,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    let best = null;
    let bestArea = 0;

    for (let i = 0; i < contours.size(); i++) {

        const c = contours.get(i);

        const area = cv.contourArea(c);

        if (area < 30000) {

            c.delete();
            continue;

        }

        const peri = cv.arcLength(c, true);

        const approx = new cv.Mat();

        cv.approxPolyDP(
            c,
            approx,
            peri * 0.02,
            true
        );

        if (
            approx.rows === 4 &&
            area > bestArea
        ) {

            if (best)
                best.delete();

            best = approx;

            bestArea = area;

        } else {

            approx.delete();

        }

        c.delete();

    }

    gray.delete();
    blur.delete();
    edge.delete();
    contours.delete();
    hierarchy.delete();

    CardDetector.lastQuad = best;

    return best;

}

function drawCard(canvas, quad) {

    if (!quad)
        return;

    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;

    ctx.beginPath();

    const d = quad.data32S;

    ctx.moveTo(d[0], d[1]);

    ctx.lineTo(d[2], d[3]);

    ctx.lineTo(d[4], d[5]);

    ctx.lineTo(d[6], d[7]);

    ctx.closePath();

    ctx.stroke();

}
