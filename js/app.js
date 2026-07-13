window.onload = async function () {

    try {

        await waitForOpenCV();

        await startCamera();

        // Kameranın ilk görüntüyü oluşturmasını bekle
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("Sistem hazır.");

        const src = captureFrame(getVideo());

        const gray = preprocess(src);

        console.log("Frame :", src.cols, src.rows);
        console.log("Gray  :", gray.cols, gray.rows);

        src.delete();
        gray.delete();

    }
    catch (err) {

        console.error("APP ERROR:", err);

    }

};
