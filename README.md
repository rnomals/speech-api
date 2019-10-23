# Speech API Service

## Usage

All responses will have the form

```json
{
    "data":"Mixed type holding the content of the request",
    "message": "Description of what happened"
}
```
### Synthesize audio and Get location of the audio

**Definition**

`GET /generate/<Text>`

**Response**
-`200 OK` on success

```json
{
    "file path":"https://34.93.182.3/audio/example.wav"
}
```