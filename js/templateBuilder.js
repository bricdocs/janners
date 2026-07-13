/*=========================================*
 * templateBuilder.js
 * Version 1.0
 *=========================================*/

window.onload = () => {

    console.log("Template Builder hazır.");

    const fileInput = document.getElementById("fileInput");

    fileInput.addEventListener("change", loadImage);

};

function loadImage(e)
{
    const file = e.target.files[0];

    if (!file) return;

    const img = new Image();

    img.onload = function ()
    {
        const canvas = document.getElementById("sourceCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        console.log("Image loaded:", img.width, img.height);
    };

    img.src = URL.createObjectURL(file);
}
