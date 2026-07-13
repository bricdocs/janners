/*=====================================================*
 cardDetector.js
 Version 3.0
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
        new cv.Size(5,5),
        0
    );

    cv.Canny(
        blur,
        edge,
        60,
        150
    );

    //--------------------------------------------------
    // Dilate + Close
    //--------------------------------------------------

    const kernel = cv.Mat.ones(3,3,cv.CV_8U);

    const work = new cv.Mat();

    cv.dilate(edge, work, kernel);

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

    let bestContour = null;
    let bestArea = 0;

    for(let i=0;i<contours.size();i++){

        const cnt = contours.get(i);

        const area = cv.contourArea(cnt);

        if(area > bestArea){

            if(bestContour)
                bestContour.delete();

            bestContour = cnt.clone();
            bestArea = area;

        }

        cnt.delete();

    }

    let quad = null;

    if(bestContour && bestArea > 5000){

        console.log(
            "Largest contour area =",
            Math.round(bestArea)
        );

        //--------------------------------------------------
        // En küçük döndürülmüş dikdörtgen
        //--------------------------------------------------

        const rect = cv.minAreaRect(bestContour);

        const pts = cv.RotatedRect.points(rect);

        quad = new cv.Mat(4,1,cv.CV_32SC2);

        const p = quad.data32S;

        for(let i=0;i<4;i++){

            p[i*2]     = Math.round(pts[i].x);
            p[i*2 + 1] = Math.round(pts[i].y);

        }

    }
    else{

        console.log("Kart bulunamadı.");

    }

    gray.delete();
    blur.delete();
    edge.delete();
    work.delete();
    kernel.delete();
    contours.delete();
    hierarchy.delete();

    if(bestContour)
        bestContour.delete();

    CardDetector.lastQuad = quad;

    return quad;

}

//--------------------------------------------------
// Kart Çiz
//--------------------------------------------------

function drawCard(canvas, quad){

    if(!quad)
        return;

    const p = quad.data32S;

    const ctx = canvas.getContext("2d");

    ctx.save();

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(p[0],p[1]);
    ctx.lineTo(p[2],p[3]);
    ctx.lineTo(p[4],p[5]);
    ctx.lineTo(p[6],p[7]);
    ctx.closePath();

    ctx.stroke();

    ctx.restore();

}

//--------------------------------------------------

function getDetectedCard(){

    return CardDetector.lastQuad;

}

console.log("cardDetector.js v3.0 (minAreaRect) hazır.");
