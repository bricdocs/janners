/*=========================================
 templateBuilder.js
 Version 1.0
=========================================*/

window.onload = function ()
{
    console.log("Template Builder hazır.");

    const imageFile = document.getElementById("imageFile");

    imageFile.addEventListener("change", loadImage);
};


function loadImage(event)
{
    const file = event.target.files[0];

    if (!file)
        return;

    const img = new Image();

    img.onload = function ()
    {
        //--------------------------------------------------
        // Source Canvas
        //--------------------------------------------------

        const canvas = document.getElementById("sourceCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        console.log(
            "Image loaded:",
            img.width,
            "x",
            img.height
        );

        //--------------------------------------------------
        // OpenCV
        //--------------------------------------------------

        const src = cv.imread(canvas);

        //--------------------------------------------------
        // Kartı bul
        //--------------------------------------------------

        const quad = detectCard(src);

        if (quad)
        {
            drawCard(canvas, quad);

            console.log("Kart bulundu.");
        }
        else
        {
            console.log("Kart bulunamadı.");
        }

        src.delete();
    };

    img.src = URL.createObjectURL(file);
}
