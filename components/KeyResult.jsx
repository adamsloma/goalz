import React, { useState } from "react";
import { Popover } from "reactstrap";
import styles from "../styles/KeyResult.module.css";
import moment from "moment";

function WeekDetail({ days, onChange }) {
  return (
    <div>
      {/* a simple check box */}
      {Object.keys(days).map((day, index) => {
        return (
          <input 
            onClick={(e) => {e.stopPropagation();}}
            type="checkbox" 
            // checked={days[day]}
            onChange={(e) => { onChange(e) }}
          />
        );
      })}
    </div>
  )
}

function KRDetail({ hidden, weeks }) {

  // determine the color of the week
  // green for you followed your goal
  // yellow for ok
  // red for you were bad
  function weekStyle(week) {
    var sum = 0;
    Object.keys(week).forEach(day => {
      sum += week[day];
    });

    var color = "";
    if (sum < 4)
      color = "red";
    else if (sum < 6)
      color = "yellow";
    else
      color = "green";

    var circleStyle = {
      padding:10,
      margin:20,
      display:"inline-block",
      backgroundColor: color,
      borderRadius: "50%",
      width:25,
      height:25,
    } 
    
    return circleStyle;
  }


  if (hidden)
    return null;
  
  return (
    <div className={styles.weeklist}>
      {/* display a colored dot for each week */}
      {weeks.map((week, index) => {
        const [popoverOpen, setPopoverOpen] = useState(false);
        const toggle = () => setPopoverOpen(!popoverOpen);

        return (
        <>
          {/* represents the label for each week, and the clickable dot */}
          <div className={styles.week}>
            {moment(Object.keys(week)[0]).format('MMM D')}
            <div
            id={`dot__${index}`} 
            onClick={(e) => {
              e.stopPropagation();
              // show week detail
              toggle();
            }}
            style={weekStyle(week)}></div>
          </div>
          <Popover placement="bottom" isOpen={popoverOpen} target={`dot__${index}`} toggle={toggle}>
            <WeekDetail
            onChange={(e) => {
              console.log(e.target.checked);
            }}
            days={week} />
          </Popover>
        </>
        );
      })}
      {/* when the dot is clicked, show the week component containing individual days */}
    </div>
  );
}

export default function KeyResult(props) {
  const [hidden, setHidden] = useState(true);

  // organize the days list into a list of weeks
  const weeksList = []; // list of weeks
  const today = moment(props.insertedAt); // starting from when the goal was created (in supabase)
  var week = {};
  for (var i = 1; i < 106; i++) { // for 15 weeks
    const nextDay = today.add(1, 'days'); // next day after last day
    if (i % 7 === 0) {
      weeksList.push(week);
      week = {};
    }
    if (props.days.includes(nextDay.format())) {
      week[nextDay.format()] = 1;
    } else {
      week[nextDay.format()] = 0;
    }
  }

  // populating state data ahead of time to avoid re-renders
  const [weeks, setWeeks] = useState(weeksList);

  return (
    <li onClick={(e) => {
      e.preventDefault();
      setHidden(!hidden);
    }}>
      <input onClick={(e) => e.stopPropagation()} onChange={(e) => props.onChangeName(e)} defaultValue={props.name} type="text" placeholder="Ex. Yoga every day"/>
      <input onClick={(e) => e.stopPropagation()} onChange={(e) => props.onChangeUnit(e)} defaultValue={props.unit} type="text" placeholder="unit"/>
      <button onClick={(e) => {
        e.stopPropagation();
        props.onDelete(e);
      }}>x</button>
      {<KRDetail insertedAt={props.insertedAt}  weeks={weeks} hidden={hidden}></KRDetail>}
    </li>
  );
}