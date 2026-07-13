window.onload = async function () {

    await waitForOpenCV();
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

    detectCorner(warped);

    warped.delete();

}

}

        src.delete();

        requestAnimationFrame(loop);
    }

    loop();

    console.log("CARD DETECTOR MODE");

};
