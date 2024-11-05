import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";

export default function MainContent() {
  //STATES
  const [nextPrayer, setNextPrayer] = useState(2);

  const [timings, setTimings] = useState({
    Fajr: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const [cityName, setCityName] = useState({
    displayName: "Riyadh",
    country: "SA",
    apiName: "Riyadh",
  });

  const [today, setToday] = useState("");

  const [remainingTime, setRemainingTime] = useState("");

  //

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=${cityName.country}&city=${cityName.apiName}`
    );
    console.log(response.data.data.timings);
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [cityName]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);
    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));
    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const cities = [
    { displayName: "Mecca", country: "SA", apiName: "Makkah al Mukarramah" },
    { displayName: "Riyadh", country: "SA", apiName: "Riyadh" },
    { displayName: "Beirut", country: "LB", apiName: "Beyrouth" },
    { displayName: "Dagestan", country: "RU", apiName: "Dagestan" },
  ];

  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  //
  const setupCountdownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 2;
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayer(prayerIndex);
    //
    const nextPrayerTime = timings[prayers[nextPrayer]];
    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const midnightToFajrDiff = moment(nextPrayerTime, "hh:mm").diff(
        moment("00:00", "hh:mm")
      );
      const fajrDiff = midnightDiff + midnightToFajrDiff;
      remainingTime = fajrDiff;
    }

    const durationRemainingTime = moment.duration(remainingTime);
    setRemainingTime(
      `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`
    );
  };
  //
  const handleCityChange = (event) => {
    const cityObj = cities.find((city) => {
      return city.apiName == event.target.value;
    });
    setCityName(cityObj);
  };
  //
  return (
    <>
      <Grid container>
        <Grid size={6}>
          <h2>{today}</h2>
          <h1>{cityName.displayName}</h1>
        </Grid>
        <Grid size={6}>
          <h2>time left until {prayers[nextPrayer]}</h2>
          <h1>{remainingTime}</h1>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: "white", opacity: "0.2" }} />

      <Stack
        direction="row"
        justifyContent={"space-around"}
        style={{ marginTop: "50px" }}
      >
        <Prayer
          name={"Fajr"}
          time={timings.Fajr}
          img="https://images.squarespace-cdn.com/content/v1/5624f8eee4b0d232542ead5b/1474290009852-KAAEK193TG236ALIDKQ2/image-asset.jpeg"
        />
        <Prayer
          name={"Dhuhr"}
          time={timings.Dhuhr}
          img="https://www.arabiantongue.com/wp-content/uploads/2023/02/1c529047-c39d-4959-8949-a09f5453df64_900_900.webp"
        />
        <Prayer
          name={"Asr"}
          time={timings.Asr}
          img="https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/al-asr-prayer-in-nature-hany-musallam.jpg"
        />
        <Prayer
          name={"Maghrib"}
          time={timings.Maghrib}
          img="https://st.depositphotos.com/69888618/59296/v/450/depositphotos_592960232-stock-illustration-maghrib-prayer-icon-vector-illustration.jpg"
        />
        <Prayer
          name={"Ishaa"}
          time={timings.Isha}
          img="https://st.depositphotos.com/1006076/56638/v/450/depositphotos_566383682-stock-illustration-closeup-abstract-devot-holy-saint.jpg"
        />
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"center"}
        style={{ marginTop: "50px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>City</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            //value={age}
            label="City"
            onChange={handleCityChange}
          >
            {cities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
