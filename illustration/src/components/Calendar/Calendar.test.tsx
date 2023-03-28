import React from 'react';
import { shallow } from 'enzyme';
import Calendar, { CalendarProps, Event, EventWithPosition } from './Calendar';

describe('<Calendar />', () => {
  const eventData: Event[] = [
    {
      id: 1,
      start: '09:00',
      duration: 60,
    },
    {
      id: 2,
      start: '10:00',
      duration: 120,
    },
  ];

  const defaultProps: CalendarProps = {
    data: eventData,
  };

  it('should render without errors', () => {
    const wrapper = shallow(<Calendar {...defaultProps} />);
    expect(wrapper.length).toBe(1);
  });

  it('should render event boxes', () => {
    const wrapper = shallow(<Calendar {...defaultProps} />);
    const eventList: EventWithPosition[] = wrapper.state('eventList');
    expect(wrapper.find('.event-box').length).toBe(eventList.length);
  });

  it('should group overlapping events correctly', () => {
    const wrapper = shallow(<Calendar {...defaultProps} />);
    const eventGroups: Event[][] = wrapper.instance().groupEvents(eventData);
    expect(eventGroups.length).toBe(2);
    expect(eventGroups[0].length).toBe(1);
    expect(eventGroups[1].length).toBe(1);
  });

  it('should calculate event positions correctly', () => {
    const wrapper = shallow(<Calendar {...defaultProps} />);
    const eventList: EventWithPosition[] = wrapper.state('eventList');
    expect(eventList.length).toBe(2);
    expect(eventList[0].left).toBe(0);
    expect(eventList[1].left).toBeGreaterThan(0);
    expect(eventList[0].top).toBe(0);
    expect(eventList[1].top).toBeGreaterThan(eventList[0].height);
  });
});
