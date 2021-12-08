import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { toast } from 'react-toastify'
import './FaceDetector.scss'

const videoWidth = 720
const videoHeight = 560

function FaceDetector() {
  const [initializing, setInitializing] = useState(true)
  const canvasRef = useRef()
  const videoRef = useRef()
  const [faceMatcher, setFaceMatcher] = useState(null)

    
  async function loadTrainingData() {
    const labels = ['Bùi Huy Tùng']

    const faceDescriptors = []
    for (const label of labels) {
      const descriptors = []
      for (let i = 1; i <= 4; i++) {
        const image = await faceapi.fetchImage(`${process.env.PUBLIC_URL}/data/${label}/${i}.jpeg`)
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
        descriptors.push(detection.descriptor)
      }
      faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors))
      toast.success(`Training xong data của ${label}!`)
    }

    return faceDescriptors
  }

  useEffect(() => {
    const loadModels = async() => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models'
      setInitializing(false)
      await Promise.all([
        faceapi.loadSsdMobilenetv1Model(MODEL_URL),
        faceapi.loadFaceRecognitionModel(MODEL_URL),
        faceapi.loadFaceLandmarkModel(MODEL_URL),
        faceapi.loadAgeGenderModel(MODEL_URL)
      ]).then(toast.success('Tải dữ liệu thành công !!'))


      const trainingData = await loadTrainingData()
	    setFaceMatcher(new faceapi.FaceMatcher(trainingData, 0.6))
    }
    loadModels()
  },[])

  function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      },
      err => console.error(err)
    )
  }

  async function handleOnPlayVideo() {
    if(!initializing && faceMatcher!== null) {
      const displaySize = { width: videoWidth, height: videoHeight }
      setInterval(async() => {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
    		faceapi.matchDimensions(canvasRef.current, displaySize)
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors().withAgeAndGender()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
        for (const detection of resizedDetections) {
          canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
            label: faceMatcher.findBestMatch(detection.descriptor).toString()
          })
          drawBox.draw(canvasRef.current)
        }
      }, 2000)
    }
  }
  
  return (
    <div className="FaceDetector">
      <button onClick={startVideo}>bat cam</button>
      <span>{initializing ? "Chờ chút. . ." : "Sẵn sàng !!!"}</span>
      <div className='FaceDetector__video'>
        <video autoPlay muted ref={videoRef} width={videoWidth} height={videoHeight} onPlay={handleOnPlayVideo}/>
        <canvas className="FaceDetector__video__canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default FaceDetector;
