// ** React Import
import { useRef, memo } from 'react'

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

const date = new Date()

const fake = [
  {
    id: 2,
    url: '',
    title: 'Meeting With Client',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    extendedProps: {
      calendar: 'start'
    }
  },
  {
    id: 3,
    url: '',
    title: 'Meeting With Client',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    extendedProps: {
      calendar: 'end'
    }
  }
]

const Calendar = props => {
  // ** Refs
  const calendarRef = useRef(null)

  // ** Props
  const history = useHistory()

  // ** UseEffect checks for CalendarAPI Update

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: fake,
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

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    dateClick(info) {
      history.push('/detail', { date: info.date })
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      notification.success('Event Updated')
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

  return (
    <Card className='shadow-none border-0 mb-0 rounded-0 mt-3'>
      <FullCalendar {...calendarOptions} />{' '}
    </Card>
  )
}

export default memo(Calendar)