/*=========================================
cardRecognizer.js
Version 1.0
=========================================*/

let cropDebugSaved = false;

function preprocessCorner(card)
{
// Kart boyutuna göre ROI
const x = Math.round(card.cols * 0.02);
const y = Math.round(card.rows * 0.02);

const w = Math.round(card.cols * 0.24);
const h = Math.round(card.rows * 0.24);

    // 1- Önce ROI kutusunu çiz
    cv.rectangle(
        card,
        new cv.Point(x, y),
        new cv.Point(x + w, y + h),
        new cv.Scalar(0, 255, 0, 255),
        2
    );

    // 2- Sonra warpCanvas'ı güncelle
    cv.imshow("warpCanvas", card);

    // 3- Daha sonra ROI'yi al

console.log(
    "Card:",
    card.cols,
    card.rows
);
    const roi = card.roi(
        new cv.Rect(x, y, w, h)
    );

console.log(
    "ROI:",
    roi.cols,
    roi.rows,
    roi.type(),
    roi.channels()
);

console.log(
    "Empty:",
    roi.empty()
);
    
saveMat(roi, "01_roi.png");    
    
    // 4- Gray
    const gray = new cv.Mat();
    cv.cvtColor(roi, gray, cv.COLOR_RGBA2GRAY);
saveMat(gray, "02_gray.png");
    
cv.imshow("binaryCanvas", gray);

DebugImages.gray =
    document.getElementById("binaryCanvas");    
    
    // 5- Binary
const binary = new cv.Mat();

cv.threshold(
    gray,
    binary,
    120,
    255,
    cv.THRESH_BINARY_INV
);

saveMat(binary, "03_binary.png");
    
console.log(
    "Binary corner pixels:",
    binary.ucharPtr(0,0)[0],
    binary.ucharPtr(0,binary.cols-1)[0],
    binary.ucharPtr(binary.rows-1,0)[0],
    binary.ucharPtr(binary.rows-1,binary.cols-1)[0]
);
    
const kernel = cv.Mat.ones(
    3,
    3,
    cv.CV_8U
);

//cv.morphologyEx(
//    binary,
//    binary,
//    cv.MORPH_CLOSE,
//    kernel
//);

kernel.delete();

    // 6- Sonucu göster
    cv.imshow("binaryCanvas", binary);

//----------------------------------
// Rank ROI
//----------------------------------

const rankRect = new cv.Rect(
    0,
    0,
    binary.cols,
    Math.floor(binary.rows * 0.45)
);

const rank = binary.roi(rankRect);

cv.imshow("rankCanvas", rank);

saveMat(rank, "04_rank.png");
    
let black = 0;
let white = 0;

for (let y = 0; y < rank.rows; y++)
{
    for (let x = 0; x < rank.cols; x++)
    {
        if (rank.ucharPtr(y, x)[0] == 0)
            black++;
        else
            white++;
    }
}

console.log(
    "Rank pixels:",
    "Black =", black,
    "White =", white
);
    
DebugImages.rankBefore =
    document.getElementById("rankCanvas");    

//saveMat(rank, "runtime_rank.png");
    
//----------------------------------
// Suit ROI
//----------------------------------

const suitRect = new cv.Rect(
    0,
    Math.floor(binary.rows * 0.45),
    binary.cols,
    binary.rows - Math.floor(binary.rows * 0.45)
);

const suit = binary.roi(suitRect);

cv.imshow("suitCanvas", suit);

DebugImages.suit =
    document.getElementById("suitCanvas");    

// Artık binary silinmeyecek.
// rank ve suit de silinmeyecek.
// Bunları çağıran fonksiyon kullanacak.

roi.delete();
gray.delete();

return {
    binary,
    rank,
    suit
};
    
}

function cropBinary(src)
{
console.log(
    "Channels:", src.channels(),
    "Type:", src.type(),
    "Depth:", src.depth()
);

console.log(
    "Continuous:", src.isContinuous()
);

const debug = src.clone();

cv.imshow("rankCanvas", debug);

if (window.DEBUG_CAPTURE)
{
    console.log(
        "SaveMat:",
        debug.cols,
        debug.rows,
        "NonZero =",
        cv.countNonZero(debug)
    );

    saveMat(debug, "05_crop_input.png");
}

debug.delete();    
    
    
    console.log(
        "cropBinary INPUT:",
        src.cols,
        src.rows
    );

const test = src.clone();
cv.imshow("binaryCanvas", test);
test.delete();
    
cv.imshow("rankCanvas", src);
    
    let minX = src.cols;
    let minY = src.rows;

    let maxX = 0;
    let maxY = 0;

//----------------------------------
// Köşe piksellerini kontrol et
//----------------------------------

console.log(
    "Top-left =",
    src.ucharPtr(0,0)[0]
);

console.log(
    "Top-right =",
    src.ucharPtr(0,src.cols-1)[0]
);

console.log(
    "Bottom-left =",
    src.ucharPtr(src.rows-1,0)[0]
);

console.log(
    "Bottom-right =",
    src.ucharPtr(src.rows-1,src.cols-1)[0]
);

//----------------------------------
// Beyaz piksel arama
//----------------------------------

console.log("----- Row Analysis -----");

for (let y = 0; y < src.rows; y++)
{
    let first = -1;
    let last  = -1;

    for (let x = 0; x < src.cols; x++)
    {
        if (src.ucharPtr(y,x)[0] == 255)
        {
            if (first == -1)
                first = x;

            last = x;
        }
    }

    if (first != -1)
    {
        console.log(
            "Row",
            y,
            ": first =",
            first,
            "last =",
            last
        );
    }
}

console.log("------------------------");
    
    
// for (let y = 0; y < src.rows; y++)
// {
//     let row = "";

//     for (let x = 0; x < src.cols; x++)
//     {
//         row += (src.ucharPtr(y,x)[0] == 255) ? "." : "#";
//     }

//     console.log(row);
// }
    
    
    for(let y=0; y<src.rows; y++)
    {
        for(let x=0; x<src.cols; x++)
        {
            const value = src.ucharPtr(y,x)[0];

            if(x==10 && y==10)
                console.log("Pixel =", value);

            if(value==255)
            {
                if(x<minX) minX=x;
                if(y<minY) minY=y;

                if(x>maxX) maxX=x;
                if(y>maxY) maxY=y;
            }
        }
    }

    if(maxX<=minX || maxY<=minY)
        return src.clone();

console.log(
    "Bounds:",
    minX,
    minY,
    maxX,
    maxY
);
    
    const rect = new cv.Rect(
        minX,
        minY,
        maxX-minX+1,
        maxY-minY+1
    );

    const crop = src.roi(rect).clone();

cv.imshow("rankCanvas", crop);

DebugImages.rankAfter =
    document.getElementById("rankCanvas");    
    
    console.log(
        "cropBinary OUTPUT:",
        crop.cols,
        crop.rows
    );

    return crop;
}

function saveMat(mat, fileName)
{

if (!window.DEBUG_CAPTURE)
    return;
    
    console.log("====================================");
    console.log("saveMat()");
    console.log("File      :", fileName);
    console.log("Size      :", mat.cols, "x", mat.rows);
    console.log("Channels  :", mat.channels());
    console.log("Type      :", mat.type());
    console.log("Depth     :", mat.depth());
    //console.log("NonZero   :", cv.countNonZero(mat));

    const canvas = document.createElement("canvas");

    cv.imshow(canvas, mat);

    console.log(
        "Canvas    :",
        canvas.width,
        "x",
        canvas.height
    );

    const link = document.createElement("a");

    link.download = fileName;
    link.href = canvas.toDataURL("image/png");

    console.log(
        "DataURL len:",
        link.href.length
    );

    console.log("====================================");

    link.click();
}
