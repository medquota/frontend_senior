import React, { useState, useEffect } from 'react';

interface Event {
  id: number;
  start: string;
  duration: number;
}

interface EventWithPosition extends Event {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface CalendarProps {
  data: Event[];
}

const Calendar = ({ data }: CalendarProps) => {
  const [eventList, setEventList] = useState<EventWithPosition[]>([]);

  useEffect(() => {
    // sort events by start time
    const sortedEvents = data.sort((a, b) => a.start.localeCompare(b.start));
    const eventGroups: Event[][] = [];

    // group overlapping events
    for (let i = 0; i < sortedEvents.length; i++) {
      let group = [sortedEvents[i]];
      for (let j = i + 1; j < sortedEvents.length; j++) {
        if (groupOverlap(group, sortedEvents[j])) {
          group.push(sortedEvents[j]);
          i++;
        } else {
          break;
        }
      }
      eventGroups.push(group);
    }

    // calculate widths and positions of events
    const screenWidth = window.innerWidth;
    const eventList: EventWithPosition[] = [];
    let topOffset = 0;
    for (let i = 0; i < eventGroups.length; i++) {
      const groupWidth = screenWidth / eventGroups[i].length;
      for (let j = 0; j < eventGroups[i].length; j++) {
        const event = eventGroups[i][j];
        const eventHeight = (event.duration / 60) * (screenWidth / 24);
        eventList.push({
          id: event.id,
          width: groupWidth,
          height: eventHeight,
          top: topOffset + ((parseInt(event.start.substr(0, 2)) - 9) * (screenWidth / 24)),
          left: j * groupWidth,
          start: event.start,
          duration: event.duration
        });
      }
      topOffset += eventList[eventList.length - 1].height;
    }

    setEventList(eventList);
  }, [data]);

  const groupOverlap = (group: Event[], event: Event) => {
    for (let i = 0; i < group.length; i++) {
      if (eventOverlap(group[i], event)) {
        return true;
      }
    }
    return false;
  };

  const eventOverlap = (event1: Event, event2: Event) => {
    const start1 = parseInt(event1.start.substr(0, 2)) * 60 + parseInt(event1.start.substr(3, 2));
    const end1 = start1 + event1.duration;
    const start2 = parseInt(event2.start.substr(0, 2)) * 60 + parseInt(event2.start.substr(3, 2));
    const end2 = start2 + event2.duration;
    return !(end1 <= start2 || start1 >= end2);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {eventList.map((event) => (
        <div
          key={event.id}
          style={{
            position: 'absolute',
            top: `${event.top}px`,
            left: `${event.left}px`,
            width: `${event.width}px`,
            height: `${event.height}px`,
            backgroundColor: 'lightblue',
            border: '1px solid black',
            overflow: 'hidden',
          }}
        >
          {event.id}
        </div>
      ))}
    </div>
  )
}
export default Calendar;