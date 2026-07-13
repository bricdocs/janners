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

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const src = cv.imread(canvas);

        const quad = detectCard(src);

        if (quad) {

            drawCard(canvas, quad);

        }

        src.delete();

        requestAnimationFrame(loop);

    }

    loop();

    console.log("Sistem hazır.");

};
