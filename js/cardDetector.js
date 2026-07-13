/*=====================================================*
 cardDetector.js
 Version 4.0
=====================================================*/

const CardDetector = {
    lastQuad: null
};

//--------------------------------------------------
// Kart Bul
//--------------------------------------------------

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

    //--------------------------------------------------
    // Dilate
    //--------------------------------------------------

    const kernel = cv.Mat.ones(
        3,
        3,
        cv.CV_8U
    );

    const work = new cv.Mat();

    cv.dilate(
        edge,
        work,
        kernel
    );

    //--------------------------------------------------
    // Morph Close
    //--------------------------------------------------

    cv.morphologyEx(
        work,
        work,
        cv.MORPH_CLOSE,
        kernel
    );

    //--------------------------------------------------
    // Contours
    //--------------------------------------------------

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.findContours(
        work,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
    );

    let best = null;
    let bestArea = 0;

    for (let i = 0; i < contours.size(); i++) {

        const cnt = contours.get(i);

        const area = cv.contourArea(cnt);

        if (area < 5000) {
            cnt.delete();
            continue;
        }

        const peri = cv.arcLength(
            cnt,
            true
        );

        //--------------------------------------------------
        // Farklı epsilon dene
        //--------------------------------------------------

        const epsList = [
            0.010,
            0.015,
            0.020,
            0.025,
            0.030
        ];

        let found = null;

        for (let e of epsList) {

            const approx = new cv.Mat();

            cv.approxPolyDP(
                cnt,
                approx,
                peri * e,
                true
            );

            if (
                approx.rows == 4 &&
                cv.isContourConvex(approx)
            ) {

                found = approx;
                break;

            }

            approx.delete();

        }

        if (
            found &&
            area > bestArea
        ) {

            if (best)
                best.delete();

            best = found;
            bestArea = area;

        } else {

            if (found)
                found.delete();

        }

        cnt.delete();

    }

    console.log(
        "Largest contour area =",
        Math.round(bestArea),
        "Found =",
        best != null
    );

    gray.delete();
    blur.delete();
    edge.delete();
    work.delete();
    kernel.delete();
    contours.delete();
    hierarchy.delete();

    CardDetector.lastQuad = best;

    return best;

}

//--------------------------------------------------
// Kart Çiz
//--------------------------------------------------

function drawCard(canvas, quad) {

    if (!quad)
        return;

    const p = quad.data32S;

    const ctx = canvas.getContext("2d");

    ctx.save();

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        p[0],
        p[1]
    );

    ctx.lineTo(
        p[2],
        p[3]
    );

    ctx.lineTo(
        p[4],
        p[5]
    );

    ctx.lineTo(
        p[6],
        p[7]
    );

    ctx.closePath();

    ctx.stroke();

    //--------------------------------------------------
    // Köşeleri göster
    //--------------------------------------------------

    ctx.fillStyle = "#ff0000";

    for (let i = 0; i < 4; i++) {

        ctx.beginPath();

        ctx.arc(
            p[i * 2],
            p[i * 2 + 1],
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.restore();

}

//--------------------------------------------------

function getDetectedCard() {

    return CardDetector.lastQuad;

}

console.log("cardDetector.js v4.0 hazır.");
