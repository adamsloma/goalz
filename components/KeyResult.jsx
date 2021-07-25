import React, { useState } from "react";
import { Popover } from "reactstrap";
import styles from "../styles/GoalDetail.module.css";
import moment from "moment";
import { CloseOutline } from "react-ionicons";

function WeekDetail({ days, onChangeDay }) {
  return (
    <div>
      {/* a simple check box */}
      {Object.keys(days).map((day) => {
        return (
          <input
            onClick={(e) => {
              e.stopPropagation();
            }}
            type="checkbox"
            checked={days[day]}
            onChange={(e) => {
              // pass up the index of the day
              onChangeDay(day);
            }}
          />
        );
      })}
    </div>
  );
}

function KRDetail({ hidden, weeks, onChangeDay }) {
  // determine the color of the week
  // green for you followed your goal
  // yellow for ok
  // red for you were bad
  function weekStyle(week) {
    var sum = 0;
    Object.keys(week).forEach((day) => {
      sum += week[day];
    });

    var color = "";
    if (sum < 4) color = "red";
    else if (sum < 6) color = "yellow";
    else color = "green";

    var circleStyle = {
      padding: 10,
      margin: 20,
      display: "inline-block",
      backgroundColor: color,
      borderRadius: "50%",
      width: 25,
      height: 25,
    };

    return circleStyle;
  }

  if (hidden) return null;

  return (
    <div className={styles.weeklist}>
      {/* display a colored dot for each week */}
      {/* week is of type object */}
      {weeks.map((week, index) => {
        const [popoverOpen, setPopoverOpen] = useState(false);

        return (
          <>
            {/* represents the label for each week, and the clickable dot */}
            <div className={styles.week}>
              {moment(Object.keys(week)[0]).format("MMM D")}
              <div
                id={`dot__${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // show week detail
                  setPopoverOpen(!popoverOpen);
                }}
                style={weekStyle(week)}
              ></div>
            </div>
            <Popover
              placement="bottom"
              isOpen={popoverOpen}
              target={`dot__${index}`}
            >
              <WeekDetail days={week} onChangeDay={onChangeDay} />
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
  const weeks = []; // list of weeks

  const today = moment(props.insertedAt); // starting from when the goal was created (in supabase)
  var days = {};

  for (var i = 1; i < 106; i++) {
    // for 15 weeks
    const nextDay = today.add(1, "days"); // next day after last day
    const date = nextDay.format().toString();

    if (props.days.includes(date)) {
      days[date] = 1;
    } else {
      days[date] = 0;
    }

    if (i % 7 === 0) {
      weeks.push({ ...days });
      days = {};
    }
  }

  return (
    <li
      onClick={(e) => {
        e.preventDefault();
        setHidden(!hidden);
      }}
    >
      <input
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => props.onChangeName(e)}
        defaultValue={props.name}
        type="text"
        placeholder="Ex. Yoga every day"
      />
      <input
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => props.onChangeUnit(e)}
        defaultValue={props.unit}
        type="text"
        placeholder="unit"
      />
      <CloseOutline
        cssClasses={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          props.onDelete(e);
        }}
        color={"#cd1818"}
        title={"title"}
        height="25px"
        width="25px"
      />
      <KRDetail
        insertedAt={props.insertedAt}
        weeks={weeks}
        onChangeDay={props.onChangeDay}
        hidden={hidden}
      ></KRDetail>
    </li>
  );
}
