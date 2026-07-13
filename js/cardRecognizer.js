/*=========================================
cardRecognizer.js
Version 1.0
=========================================*/

function preprocessCorner(card)
{
    // Köşe bölgesi
    const roi = card.roi(
        new cv.Rect(5, 5, 65, 120)
    );

    // Gri görüntü
    const gray = new cv.Mat();

    cv.cvtColor(
        roi,
        gray,
        cv.COLOR_RGBA2GRAY
    );

    // Siyah-Beyaz (Otsu)
    const binary = new cv.Mat();

    cv.threshold(
        gray,
        binary,
        0,
        255,
        cv.THRESH_BINARY + cv.THRESH_OTSU
    );

    // Sonucu göster
    cv.imshow("binaryCanvas", binary);

    // Belleği temizle
    roi.delete();
    gray.delete();

    // Binary görüntüyü geri döndür
    return binary;
}

console.log("cardRecognizer.js hazır.");
