const Camera = {

    video: null,
    stream: null,
    ready: false

};

async function startCamera() {

    Camera.video = document.getElementById("video");

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

        console.log(
            "Camera started",
            Camera.video.videoWidth,
            Camera.video.videoHeight
        );

    } catch (err) {

        console.error(err);

    }

}

function cameraReady() {

    return Camera.ready;

}

function getVideo() {

    return Camera.video;

}
