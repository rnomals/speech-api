const express = require('express');
const shell = require('shelljs');
const files = require('fs');
const path  = require('path');
const util = require('util');
const showdown  = require('showdown');

const voice = "voice_cmu_sinhala_ama_cg";

const app = express();

// function generate command
function generateCommand(text, voice, output){
    var command = util.format("echo '%s' | text2wave -o %s -eval \"(%s)\"", text, output, voice);
    return command;
  };


// defining an endpoint to return README.md
app.get('/', (req, res) => {
    const converter = new showdown.Converter();
    files.readFile("./README.md",'utf8', function(err, buf) {
        const text = buf;
        let html = converter.makeHtml(text);
        res.send(html);
      });
  });
  
  // Defining an endpoint to generate audio files using text
  app.get('/generate/:text', (req, res) => {
    const timestamp = Date.now().toString();
    const outputFileName = path.join('./output/' + timestamp + '.wav');
    var text = req.params.text;
  
    // Execute TTS
    var command = generateCommand(text, voice, outputFileName);
    console.log("Executing TTS: " + text);
    shell.exec(command);
  
    res.status(200).json(timestamp + ".wav")
  });

  // Download 
  app.get('/download/:text', (req, res) => {
    const outputFileName = path.join('./output/voice.wav');
  
    // Parse GET Data
    var text = req.params.text;
  
    // Execute TTS
    var command = generateCommand(text, voice, outputFileName);
    console.log("Executing TTS: " + text);
    shell.exec(command);
  
    // Return voice file
    var stat = files.statSync(outputFileName);
    res.writeHead(200, {
      'Content-Type'        : 'audio/wav',
      'Content-Disposition' : 'attachment;filename=voice.wav',
      'Content-Length'      : stat.size
    });
  
    var readStream = files.createReadStream(outputFileName);
    readStream.pipe(res);
  });


  // starting the server
  app.listen(3000, () => {
    console.log('listening on port 3000');
  })