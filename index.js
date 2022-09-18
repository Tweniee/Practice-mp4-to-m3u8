const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const NetworkSpeed = require('network-speed');  // ES5
const testNetworkSpeed = new NetworkSpeed();

const app = express()
app.disable("x-powered-by");

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/convert/m3u8", (req, res) => {
  const firstName = upload.name.split('.')
  if (!req.files) {
    res.send("No file uploaded"); //No file error handling
  } else if (firstName[1] != 'mp4') {
    res.send("Please upload a video only")
  } else {
    let upload = req.files.upload;
    upload.mv("./uploads/" + upload.name);
    speed((width) => {
      // .setDuration('5')
      ffmpeg("./uploads/" + upload.name)
        .size(width < 1000 ? "640x480" : width < 3000 ? "1280x720" : width < 5000 ? "1920x1080" : "1920x1080")
        .output(`./thumbnail/${firstName[0]}.m3u8`)
        .on('end', function (err) {
          if (!err) { res.send("File is converted to m3u8"); }
        })
        .on('error', function (err) {
          res.send(err)
        }).run()
    })

  }
});
const speed = (callback) => {
  const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
  const fileSizeInBytes = 500000;
  const speed = testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
  callback(speed.kbps)
}

//start app
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`listening on port ${PORT}.`));
