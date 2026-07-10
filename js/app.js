window.onload = async function () {

    await waitForOpenCV();

    await startCamera();

    console.log("Sistem hazır.");

};
