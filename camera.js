const Camera = {

    video: null,

    stream: null,

    ready: false

};

async function startCamera() {

    Camera.video = document.getElementById("camera");

    try {

        Camera.stream = await navigator.mediaDevices.getUserMedia({

            video: {

                facingMode: {

                    ideal: "environment"

                },

                width: {

                    ideal: 1920

                },

                height: {

                    ideal: 1080

                }

            },

            audio: false

        });

        Camera.video.srcObject = Camera.stream;

        await Camera.video.play();

        Camera.ready = true;

        document.getElementById("status").textContent =
            "Kamera hazır";

        console.log(
            "Camera started",
            Camera.video.videoWidth,
            Camera.video.videoHeight
        );

    } catch (err) {

        console.error(err);

        document.getElementById("status").textContent =
            "Kamera açılamadı";

    }

}

function cameraReady() {

    return Camera.ready;

}

function getVideo() {

    return Camera.video;

}
