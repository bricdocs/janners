/*=====================================================*
 cardDetector.js
 Version 2.1 DEBUG
*=====================================================*/

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

    for(let i=0;i<contours.size();i++){

        const cnt = contours.get(i);

        const area = cv.contourArea(cnt);

        if(area < 100){

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

        //--------------------------------------------------
        // SADECE BÜYÜK CONTOURLARI YAZ
        //--------------------------------------------------

        if(area > 1000){

            console.log(
                "Area:",
                Math.round(area),
                "Vertices:",
                approx.rows
            );

        }

        //--------------------------------------------------

        if(
            approx.rows == 4 &&
            area > bestArea
        ){

            if(best){
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
        "Largest contour =",
        Math.round(bestArea),
        "Vertices =",
        best ? best.rows : 0
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

function drawCard(canvas, quad){

    if(!quad)
        return;

    const ctx = canvas.getContext("2d");

    const p = quad.data32S;

    if(p.length < 8)
        return;

    ctx.save();

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(p[2], p[3]);
    ctx.lineTo(p[4], p[5]);
    ctx.lineTo(p[6], p[7]);

    ctx.closePath();
    ctx.stroke();

    ctx.restore();

}

//--------------------------------------------------

function getDetectedCard(){

    return CardDetector.lastQuad;

}

console.log("cardDetector.js v2.1 DEBUG hazır.");
