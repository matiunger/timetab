import React from 'react';
import '../css/TenMinutesBlocks.css';
import { useTranslation, Trans } from 'react-i18next';

function Block(props) {
  let classes = ["l-day-blocks__block"]
  if (props.id * props.block_minutes < props.now_min) { classes.push("l-day-blocks__block--past") }
  if (props.id < props.sunrise_index || props.id > props.sunset_index) { classes.push("l-day-blocks__block--night") }
  
  const getHour = () => {
    if ((props.id -1) % 12 === 0) {
    return <div className="l-day-blocks__block__hour l-day-blocks__block__hour--left">{2*(props.id -1) / 12}</div>
    } else if ((props.id +12) % 12 === 0) {
      return <div className="l-day-blocks__block__hour l-day-blocks__block__hour--right">{(2*(props.id +12) / 12)-2}</div>
    } else {
      return ""
    }
  }
  
  return (
    <div className={classes.join(" ")}>{getHour()}</div>
  )
}


function TenMinutesBlocks(props) {

  const { i18n } = useTranslation();

  const block_minutes = 10
  const total_blocks = 24 * 60 / block_minutes
  const blocks = Array.from(Array(total_blocks).keys())

  const times = props.times
  const sunriseHoursIndex = Math.floor((times.sunrise.getHours() * 60 + times.sunrise.getMinutes()) / 10) + 1
  const sunsetHoursIndex = Math.floor((times.sunset.getHours() * 60 + times.sunset.getMinutes()) / 10) + 1

  const now = new Date();
  const now_min = now.getHours() * 60 + now.getMinutes();

  var wd = i18n.t("time.weekdays."+now.getDay().toString())
  var d = now.getDate()
  var m = i18n.t("time.months."+now.getMonth().toString())

  return (
    <div style={props.style} id="ten-minutes-blocks" className="l-day-blocks">
      <div className='l-day-blocks__title'>{wd} {d}, {m}</div>
      <div className='l-day-blocks__subtitle'><Trans i18nKey="inTenMinBlock">in 10 minutes blocks</Trans></div>
      <div className='l-day-blocks__block-cont'>
        <div className='l-day-blocks__block-container'>
          {
            blocks.map((item, index) => {
              return <Block id={index + 1} key={index + 1} now_min={now_min} locationOn={props.locationOn} block_minutes={block_minutes} sunrise_index={sunriseHoursIndex} sunset_index={sunsetHoursIndex} />
            })
          }
        </div>
      </div>
      <div className='l-day-blocks__footer'><a target="_blank" rel="noreferrer" href="https://waitbutwhy.com/2016/10/100-blocks-day.html"><Trans i18nKey="blocksQuestion">How is this useful?</Trans></a></div>

    </div>
  );
}


export default TenMinutesBlocks
