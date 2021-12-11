import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import './FaceDetector.scss'
import { Button, notification, Select, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import Request from '../../services/request'
import _ from 'lodash'

const videoWidth = 720
const videoHeight = 560

let timerId

function FaceDetector(props) {
  const [initializing, setInitializing] = useState(true)
  const canvasRef = useRef()
  const videoRef = useRef()
  const [faceMatcher, setFaceMatcher] = useState(null)
  const [listUserDevices, setListUserDevices] = useState([])
  const { t: translation } = useTranslation()
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [disableAll, setDisableAll] = useState(true)
  const [selectedOptionCheck, setSelectedOptionCheck] = useState(null)

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
    }

    return faceDescriptors
  }

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models'
      await Promise.all([
        faceapi.loadSsdMobilenetv1Model(MODEL_URL),
        faceapi.loadFaceRecognitionModel(MODEL_URL),
        faceapi.loadFaceLandmarkModel(MODEL_URL),
        faceapi.loadAgeGenderModel(MODEL_URL)
      ])
      const trainingData = await loadTrainingData()
      setFaceMatcher(new faceapi.FaceMatcher(trainingData, 0.6))
      setInitializing(false)
      notification.success({
        message: "",
        description: translation('landing.loadDataDone')
      })
    }
    loadModels()
  }, [])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      let listDevices = []
      for(var i = 0; i < devices.length; i ++){
        var device = devices[i];
        if (device.kind === 'videoinput') {
          let option = {}
          option.value = device.deviceId;
          option.text = device.label || 'camera ' + (i + 1);
          listDevices.push(option);
        }
      }
      setListUserDevices(listDevices)
    })
  },[])
  
  function handleCheckIsCreated(type) {
    Request({
      method: "POST",
      path: '/check-created',
      data: {
        type: type
      }
    }).then(result =>{
      if(result) {
        setDisableAll(false)
        notification.success({
          message: "",
          description: translation('landing.ready')
        })
      } else {
        setDisableAll(true)
        notification.info({
          message:"",
          description: translation('landing.notHaveSchedule')
        })
      }
    })
  }

  function startVideo() {
    if(disableAll) {
      notification.error({
        message: "",
        description: translation('landing.notHaveSchedule')
      })
      return
    }

    if(!selectedDevice) {
      navigator.getUserMedia(
        { video: { } },
        stream => {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        },
        err => console.error(err)
      )
    } else {
      navigator.getUserMedia(
        { video: { deviceId: selectedDevice } },
        stream => {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        },
        err => console.error(err)
      )
    }

    handleOnPlayVideo()
  }

  function handleStopVideo() {
    videoRef.current.pause()
    videoRef.current.srcObject = null
    videoRef.current.src = ''
    canvasRef.current.innerHTML = ''
    clearInterval(timerId)
  }

  function stopVideo() {
    Promise.all([
      handleStopVideo(),
      handleStopVideo(),
      handleStopVideo()
    ])
  }

  async function handleOnPlayVideo() {
    if (!initializing && faceMatcher !== null) {
      const displaySize = { width: videoWidth, height: videoHeight }
      try {
        timerId = setInterval(async () => {
          canvasRef.current.innerHTML = await faceapi.createCanvasFromMedia(videoRef.current)
          faceapi.matchDimensions(canvasRef.current, displaySize)
          const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors().withAgeAndGender()
          const resizedDetections = faceapi.resizeResults(detections, displaySize)
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
          const detection = resizedDetections[0]
          canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          const employeeFound = await faceMatcher.findBestMatch(detection.descriptor).toString()
          const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
            label: employeeFound
          })
          drawBox.draw(canvasRef.current)
          handleCheckAttendance({
            age: detection.age,
            gender: detection.gender,
            name: employeeFound.split("(")[0].trim()
          })
        }, 3000)
      } catch(e) {
        notification.error({
          message: "",
          description: JSON.stringify(e)
        })
      }
    }
  }
  
  async function handleCheckAttendance(detection) {
    const { name, age, gender } = detection
    if(name && name !== 'unknown') {
      clearInterval(timerId);
      videoRef.current.pause();
      let arrayName = name.split(" ");
      let firstName = arrayName[0]
      arrayName.shift();
      let lastName = arrayName.join(' ')
      Request({
        method: "POST",
        path: "/AI/findUser",
        newUrl: process.env.REACT_APP_API_LOGIN_URL,
        data: {    
          firstName: firstName,
          lastName: lastName,
          gender: gender === "male" ? "M" : "F",
          age: age
        }
      }).then(result => {
        if(result && !_.isEmpty(result)) {
          Request({
            method: "POST",
            path: selectedOptionCheck === "START" ? "/check-attendance" : "/finish-attendance",
            data: selectedOptionCheck === "START" ? {    
              employeeId: result.id,
              timeCome: new Date().toISOString()
            } : {
              employeeId: result.id,
              timeLeave: new Date().toISOString()
            }
          }).then(result => {
            if(result && (result === "ok" || result === 'checked')) {
              notification.success({
                message: name,
                description: translation('landing.checked')
              })
              setTimeout(() => {
                videoRef.current.play()
                handleOnPlayVideo()
              }, 1500)
            } else {
              notification.error({
                message: name,
                description: translation('landing.notFound')
              })
              videoRef.current.play()
              handleOnPlayVideo()
            }
          })
        } else {
          notification.error({
            message: "",
            description: translation('landing.notFound')
          })
          videoRef.current.play()
          handleOnPlayVideo()
        }
      })
    }
  }

  return (
    <div className="FaceDetector">
      <div className='w-100 d-flex justify-content-end'>
        <Button type='primary' onClick={() => props.history.push('/login')}>{translation('landing.login')}</Button>
      </div>
      <div className='w-100 text-center FaceDetector_title'>Chấm công ngày {moment(new Date()).format('DD/MM/YYYY')}</div>
      <div className='row pt-3'>
        <div className='col-5'>
          <Select className='w-100'  placeholder={translation('landing.selectDevice')} onChange={e => {
            setSelectedDevice(e)
          }}>
            {
              listUserDevices && listUserDevices.length > 0 && listUserDevices.map(item => {
                return (
                  <Select.Option key={Math.random()} value={item.value}>{item.text}</Select.Option>
                )
              })
            }
          </Select>
        </div>
        <div className='col-3'>
          <Space size="small">
            <Button type='primary' onClick={startVideo}>{translation('landing.turnOn')}</Button>
            <Button type='default' onClick={stopVideo}>{translation('landing.turnOff')}</Button>
          </Space>
        </div>
        <div className='col-4'>
          <Select placeholder="Chọn loại" className='w-50' onChange={(e) => {
            handleCheckIsCreated(e)
            setSelectedOptionCheck(e)
          }}>
            <Select.Option value="START">{translation('landing.start')}</Select.Option>
            <Select.Option value="END">{translation('landing.finish')}</Select.Option>
          </Select>
        </div>
      </div>
      <div className='FaceDetector__video'>
        <video autoPlay muted ref={videoRef} width={videoWidth} height={videoHeight} />
        <canvas className="FaceDetector__video__canvas" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default FaceDetector;
