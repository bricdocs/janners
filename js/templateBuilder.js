/*=========================================
 templateBuilder.js
 Version 1.0
=========================================*/

//----------------------------------
// Mouse Points
//----------------------------------

let clickPoints = [];

let sourceImage = null;

window.onload = async function ()
{
    await waitForOpenCV();

    console.log("OpenCV hazır.");
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

sourceImage = img;

// Eski noktaları temizle
clickPoints = [];

// Mouse event
canvas.onclick = onCanvasClick;
     
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

function onCanvasClick(event)
{
    const canvas = event.target;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    clickPoints.push({
        x: x,
        y: y
    });

    console.log(
        "Point",
        clickPoints.length,
        x,
        y
    );

    drawPoints();

    //----------------------------------
    // 4 köşe tamamlandı
    //----------------------------------

    if (clickPoints.length == 4)
    {
        console.log("4 corner selected.");

        const quad = makeQuad(clickPoints);

        const src = cv.imread("sourceCanvas");

        const warped = warpCard(
            src,
            quad
        );

        preprocessCorner(warped);

        quad.delete();
        warped.delete();
        src.delete();
    }
}

function drawPoints()
{
    const canvas = document.getElementById("sourceCanvas");
    const ctx = canvas.getContext("2d");

    // Resmi tekrar çiz
    ctx.drawImage(
        sourceImage,
        0,
        0
    );

    ctx.fillStyle = "red";

    for (const p of clickPoints)
    {
        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}
//----------------------------------
// Mouse points -> Quad
//----------------------------------

function makeQuad(points)
{
    const quad = new cv.Mat(
        4,
        1,
        cv.CV_32SC2
    );

    const p = quad.data32S;

    for (let i = 0; i < 4; i++)
    {
        p[i * 2]     = Math.round(points[i].x);
        p[i * 2 + 1] = Math.round(points[i].y);
    }

    return quad;
}
