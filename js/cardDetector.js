/*
=====================================================
 cardDetector.js
 Version 1.0
 Kart Algılama
=====================================================
*/

const CardDetector = {

    lastQuad: null

};

//------------------------------------------
// Kartı Bul
//------------------------------------------

function detectCard(src) {

    const gray = new cv.Mat();
    const blur = new cv.Mat();
    const edge = new cv.Mat();

    cv.cvtColor(
        src,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    cv.GaussianBlur(
        gray,
        blur,
        new cv.Size(5,5),
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

    for(let i=0;i<contours.size();i++){

        const cnt = contours.get(i);

        const area = cv.contourArea(cnt);

        if(area < 10000){

            cnt.delete();
            continue;

        }

        const peri = cv.arcLength(
            cnt,
            true
        );

        const approx = new cv.Mat();

        cv.approxPolyDP(
            cnt,
            approx,
            peri * 0.02,
            true
        );

        if(
            approx.rows == 4 &&
            area > bestArea
        ){

            if(best != null){

                best.delete();

            }

            best = approx;

            bestArea = area;

        }else{

            approx.delete();

        }

        cnt.delete();

    }

    console.log(
        "Contours =",
        contours.size(),
        "Best Area =",
        bestArea,
        "Found =",
        best != null
    );

    gray.delete();
    blur.delete();
    edge.delete();
    contours.delete();
    hierarchy.delete();

    CardDetector.lastQuad = best;

    return best;

}

//------------------------------------------
// Kartı Çiz
//------------------------------------------

function drawCard(canvas, quad){

    if(quad == null)
        return;

    const ctx = canvas.getContext("2d");

    const p = quad.data32S;

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

    ctx.restore();

}

//------------------------------------------
// Son Kart
//------------------------------------------

function getDetectedCard(){

    return CardDetector.lastQuad;

}

console.log(
    "cardDetector.js hazır."
);
