/*=========================================
cardRecognizer.js
Version 1.0
=========================================*/

function preprocessCorner(card)
{
    const roi = card.roi(
        new cv.Rect(0,0,50,90)
    );

    const gray = new cv.Mat();

    cv.cvtColor(
        roi,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    cv.imshow("grayCanvas", gray);

    roi.delete();

    return gray;
}

console.log("cardRecognizer.js hazır.");
