// ** React Import
import React, { useRef, memo, useEffect, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import { calendarsColor } from '../../constants/color'
import './home.scss'
import { notification, Card } from 'antd'
import { useHistory } from 'react-router'
import Request from '../../services/request';
import Create from '../Create'

const Calendar = props => {
  // ** Refs
  const calendarRef = useRef(null)
  const [eventData, setEventData] = useState([])

  // ** Props
  const history = useHistory()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [infoDate, setInfoDate] = useState(null)

  // ** UseEffect checks for CalendarAPI Update

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: eventData,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-c no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }) {
      console.log('even click', clickedEvent)
      history.push('/detail', { eventId: clickedEvent._def.publicId })

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    dateClick(info) {
      setIsOpenModal(true)
      setInfoDate(info.date)
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      notification.success({
        message: "",
        description: 'Event Updated'
      })
      console.log(droppedEvent)
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      notification.success('Event Updated')
    },

    ref: calendarRef,
  }

  function fetchData() {
    Request({
      method: "POST",
      path: '/get-list-event'
    }).then(result => {
      if(result && result.length > 0) {
        let resData = [];
        for(let i = 0; i <result.length; i++) {
          let newData = {
            id: result[i]._id,
            url: '',
            title: result[i].title,
            start: result[i].startDate,
            end: result[i].endDate,
            allDay: true,
            extendedProps: {
              calendar: result[i].eventType
            }
          }
          resData.push(newData);
        }
        setEventData(resData)
      }
    })
  }

  useEffect(() => {
    fetchData()
  },[])

  const onCreateEvent = (data) => {
    Request({
      method: "POST",
      path: '/create-event',
      data: data
    }).then(result => {
      if(result && result === 'ok') {
        notification.success({
          message: '',
          description: "Tạo lịch thành công"
        })
        setIsOpenModal(false)
        fetchData()
      } else {
        notification.error({
          message: "",
          description: "Tạo thất bại vui lòng thử lại sau"
        })
      }
    })
  }

  return (
    <>
      <Card className='shadow-none border-0 mb-0 rounded-0 mt-3'>
        <FullCalendar {...calendarOptions} />{' '}
      </Card>
      <Create 
        openModal={isOpenModal} 
        onCancel={() => setIsOpenModal(false)}
        infoDate={infoDate}
        onCreateEvent={onCreateEvent}
      />
    </>
  )
}

export default memo(Calendar)