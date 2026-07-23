/*=========================================*
 * templateMatcher.js
 * Version 1.0
 *=========================================*/

const Templates = {

    ranks: {},

    suits: {}

};

async function loadTemplates() {

    console.log("Templates yükleniyor...");

    Templates.ranks["AH"] =
        await loadImageMat("templates/ranks/AH.png");

    Templates.suits["H"] =
        await loadImageMat("templates/suits/H.png");

    console.log(
        "Rank templates:",
        Object.keys(Templates.ranks)
    );

    console.log(
        "Suit templates:",
        Object.keys(Templates.suits)
    );

    console.log("Templates hazır.");
}

console.log("templateMatcher.js hazır.");


//--------------------------------------------------
// PNG dosyasını Mat olarak yükle
//--------------------------------------------------

function loadImageMat(path)
{
    return new Promise(resolve =>
    {
        const img = new Image();

        img.onload = function()
        {
            const canvas =
                document.createElement("canvas");

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx =
                canvas.getContext("2d");

            ctx.drawImage(img,0,0);

            const mat = cv.imread(canvas);

            resolve(mat);
        };

        img.src = path;
    });
}
