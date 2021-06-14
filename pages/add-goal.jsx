import React, { useEffect, useState } from 'react';

export function KeyResult(props) {
  return (
    <li>
      <input onChange={(e) => props.onChangeName(e)} type="text" placeholder="Ex. Yoga every day"/>
      <input onChange={(e) => props.onChangeUnit(e)} type="text" placeholder="unit"/>
    </li>
  );
}

export function FailureMode(props) {
  return (
    <li>
      <input onChange={(e) => props.onChange(e)} type="text" placeholder="Ex. I'd rather watch TV"  />
    </li>
  );
}

export default function GoalForm() {
  const [keyResults, setKeyResults] = useState([]);
  const [failureModes, setFailureModes] = useState([]);

  useEffect(() => {
    console.log(keyResults)
    console.log(failureModes)
  }, [keyResults, failureModes])
    
  function addKeyResult(e) {
    e.preventDefault();
    setKeyResults([...keyResults, { name: "", unit: "" }]);
  }

  function addFailureMode(e) {
    e.preventDefault();
    setFailureModes([...failureModes, { name: "" }]);
  }

  function submit() {}

  return (
    <form onSubmit={submit}>
      <h1>Objective</h1>
        <label>Objective</label> <input type="text" /> <br />
        <label>Category</label> <input type="text" /> <br />
        <label>Description</label> <br /> <textarea rows={4} cols={30}></textarea> 
      <h1>Key Results</h1>
        {keyResults.map((kr, index) => { return <KeyResult 
        onChangeUnit={(e) => {
          let temp = [...keyResults];
          temp[index].unit = e.target.value;
          setKeyResults(temp);
        }}
        onChangeName={(e) => {
          let temp = [...keyResults];
          temp[index].name = e.target.value;
          setKeyResults(temp);
        }} key={index} name={kr.name} unit={kr.unit}></KeyResult> })}
        <button onClick={e => addKeyResult(e)}>Add</button>
      <h1>Possible Failure Modes</h1>
        {failureModes.map((fm, index) => { return <FailureMode onChange={(e) => {
          let temp = [...failureModes];
          temp[index].name = e.target.value;
          setFailureModes(temp);
        }} key={index} name={fm.name}></FailureMode> })}
        <button onClick={e => addFailureMode(e)}>Add</button> <br />
      <input type="submit" value="Create" />
    </form>
  );
};