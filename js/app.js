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

        // Kamerayı çiz
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        //----------------------------------
        // OpenCV
        //----------------------------------

        let src = cv.imread(canvas);

        let gray = new cv.Mat();
        let edge = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        cv.Canny(
            gray,
            edge,
            60,
            150
        );

        // SADECE Canny görüntüsünü göster
        cv.imshow(canvas, edge);

        src.delete();
        gray.delete();
        edge.delete();

        requestAnimationFrame(loop);
    }

    loop();

    console.log("CANNY TEST MODE");
};
