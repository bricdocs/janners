window.onload = async function () {

    await waitForOpenCV();

    await startCamera();

    console.log("Sistem hazır.");

    const src = captureFrame(getVideo());

    const gray = preprocess(src);

    console.log("Frame:", src.cols, src.rows);
    console.log("Gray :", gray.cols, gray.rows);

    src.delete();
    gray.delete();

};
