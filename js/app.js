/*=====================================================*
 app.js
 Version 1.0
=====================================================*/

window.onload = async function () {

    await waitForOpenCV();
    await loadTemplates();
    await startCamera();

    const video = getVideo();

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function loop() {

        if (!cameraReady()) {
            requestAnimationFrame(loop);
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        //----------------------------------
        // Kamera görüntüsü
        //----------------------------------

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        //----------------------------------
        // Kart Algılama
        //----------------------------------

        const src = cv.imread(canvas);

        const quad = detectCard(src);

if (quad) {

    drawCard(canvas, quad);
    
const warped = warpCard(src, quad);

if (warped) {

const corner = preprocessCorner(warped);

const rankCrop = cropBinary(corner.rank);

console.log(
    "Rank Crop:",
    rankCrop.cols,
    "x",
    rankCrop.rows
);

saveMat(rankCrop, "runtime.png");
 
const rankResult =
matchTemplate(rankCrop, Templates.ranks);

rankCrop.delete();

console.log(
    "Rank Match:",
    rankResult.name,
    rankResult.score
);


// Şimdilik sadece test
console.log(
    "Rank:",
    corner.rank.cols,
    "x",
    corner.rank.rows
);

console.log(
    "Suit:",
    corner.suit.cols,
    "x",
    corner.suit.rows
);

corner.binary.delete();
corner.rank.delete();
corner.suit.delete();

warped.delete();

}

}

        src.delete();

        requestAnimationFrame(loop);
    }

    loop();

    console.log("CARD DETECTOR MODE");

};
