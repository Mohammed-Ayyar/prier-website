import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';
import "moment/dist/locale/ar-ma"
import { useState, useEffect } from 'react';



function maincontent() {
// STATES 
    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

    const [timings, setTimings] = useState({
        Fajr: "07:02",
        Dhuhr: "13:43",
        Asr: "16:22",
        Maghrib: "18:46",
        Isha: "20:04",
    });

    const [remainingTime, setRemainingTime] = useState("");

    const [selectedCity,setSelectedCity] = useState({
        displayName : "أدار البيضاء",
        apiName : "Casablanca",
    });

    const [today, setToday] = useState("");

    const avilableCities = [

    {
        displayName : "أدار البيضاء",
        apiName : "Casablanca",
    },
    {
        displayName : "الرباط",
        apiName : "Rabat",
    },
    {
        displayName : "طنجة",
        apiName : "Tanger",
    },

    ]

    const prayersArray = [
        {key: "Fajr", displayName: "AL Fajr"},
        {key: "Dhuhr", displayName: "AL Dhuhr"},
        {key: "Asr", displayName: "AL Asr"},
        {key: "Maghrib", displayName: "AL Maghrib"},
        {key: "Isha", displayName: "AL Isha"},
    ];

    const getTimings = async () => {
        const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=MA&city=${selectedCity.apiName}`
        );
            setTimings(response.data.data.timings);
    };

        useEffect(() => {
        getTimings ();


    }, [selectedCity]);

        useEffect(() => {

            let interval = setInterval(() => {
                setupCountdownTimer()
            },1000);
      
        const t = moment();
        setToday(t.format("Do MM YYYY | h:mm"));
    
            return() => {
                clearInterval(interval)
            };
    }, [timings]);
 
    const setupCountdownTimer = () => {
        const momentNow = moment();

        let prayerIndex = 2;

        if (
            momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) &&
         momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))
         ){
            prayerIndex = 1;
        }else if (
            momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) &&
         momentNow.isBefore(moment(timings["Asr"],"hh:mm"))
         ) {
            prayerIndex = 2;

        }else if (
            momentNow.isAfter(moment(timings["Asr"],"hh:mm")) &&
         momentNow.isBefore(moment(timings["Maghrib"],"hh:mm"))
         ) {
            prayerIndex = 3;

        }else if (
            momentNow.isAfter(moment(timings["Maghrib"],"hh:mm")) &&
         momentNow.isBefore(moment(timings["Isha"],"hh:mm"))
         ) {
            prayerIndex = 4;

        }else {
            prayerIndex = 0;
        }

        setNextPrayerIndex(prayerIndex);

        // NOW AFTER KNOWING WHAT THE NEXT PRAYER.

        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings [nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrTomidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );
                
            const totalDifference = midnightDiff + fajrTomidnightDiff;

            remainingTime = totalDifference
        }



        const durationRemainingTime = moment.duration(remainingTime)

        setRemainingTime(`${durationRemainingTime.seconds()} : 
        ${durationRemainingTime.minutes()} :
        ${durationRemainingTime.hours()} `
    );
    };

    const handleCityChange = (event) => {
        const cityObject = avilableCities.find((city) => {
           return city.apiName == event.target.value
        });

        console.log("The new value is", event.target.value);
        setSelectedCity(cityObject);
      };

  return (
    <>
    {/* === Top Row === */}
    <Grid container >
        <Grid xs={6}>
            <div>
                <h2> {today} </h2> 
                <h1> {selectedCity.displayName} </h1>
            </div>       
        </Grid>

        <Grid xs={6}>
            <div>
                <h2>
                    Prochaine priére {prayersArray[nextPrayerIndex].displayName}
                </h2>

                <h1> 
                    {remainingTime} 
                </h1>
            </div>       
        </Grid>

    </Grid>
        {/*=== Top Row === */}

        <Divider style={{borderColor: "white",opacity:"0.1", }} />

        {/* PRAYERS CARDS */}

        <Stack direction="row" justifyContent={"space-around"} style={{marginTop: "50px"}}>
            <Prayer 
            name="AL Fajr"
            time={timings.Fajr} 
            image="/src/image/fajr-prayer.png"/>

            <Prayer 
            name="AL Dhuhr" 
            time={timings.Dhuhr} 
            image="/src/image/asr-prayer-mosque.png"/>

            <Prayer 
            name="AL Asr" 
            time={timings.Asr}
            image="/src/image/dhhr-prayer-mosque.png"/>

            <Prayer 
            name="AL Maghrib" 
            time={timings.Maghrib} 
            image="/src/image/sunset-prayer-mosque.png"/>

            <Prayer 
            name="AL Isha" 
            time={timings.Isha}
            image="/src/image/night-prayer-mosque.png" />
        </Stack>

        {/*=== PRAYERS CARDS === */}

        {/* SELECT CITY */}

        <Stack direction="row" justifyContent="center" style={{margin:"40px"}}>

        <FormControl style={{width:"20%"}}>
        <InputLabel id="demo-simple-select-label">

            <span style={{color:"white"}}>City</span> 
            
            </InputLabel>

        <Select 
          style={{color:"white"}}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        //   value={age}
          label="Age"
          onChange={handleCityChange}
        >

            {avilableCities.map((city) => {
                return(
                    <MenuItem 
                    value= {city.apiName} 
                    key={city.apiName}
                    >
                    {city.displayName}
                   </MenuItem>
                );
            })}
        </Select>
        
      </FormControl>

        </Stack>

        {/* === SELECT CITY ==== */}


    </>
  )
}

export default maincontent



