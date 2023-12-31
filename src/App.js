  
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Table from "./components/Table";
import Mapp from "./components/Map";
import {sortData} from './util.js'
import LineGraph from './components/LineGraph'
import 'leaflet/dist/leaflet.css'
import {prettyPrintStat} from './util'
const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3)
  const [casesType, setCasesType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data)
          setMapCountries(data);
          setCountries(countries);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
        countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
   
      countryCode === 'worldwide'?await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([34.80746,-40.4796])
        setMapZoom(4)
      }) :
        await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      });
  };
  return (
    <div className="app">
      <div className = "app__left">
      <div className = 'app__header'>
      <h1>
COVID-19 TRACKER
</h1>
<FormControl className = "app__dropdown">
  <Select
  variant = "outlined"
  value = {country}
  onChange = {onCountryChange}
  >
        <MenuItem value = 'worldwide'>Worldwide</MenuItem>

    {
      countries.map((country)=>{
        return(
        <MenuItem value = {country.value}>{country.name}</MenuItem>
      )})
    }
    </Select>
</FormControl>

      </div>
      <div className = "app__stats">
<InfoBox isRed active = {casesType == 'cases'} onClick = {e => setCasesType('cases')}title = "Coronavirus Cases"  cases = {prettyPrintStat(countryInfo.todayCases)} total = {countryInfo.cases}/>
<InfoBox active = {casesType == 'recovered'} onClick = {e => setCasesType('recovered')}title = "Recovered" cases = {prettyPrintStat(countryInfo.todayRecovered)}  total = {countryInfo.recovered}/>
<InfoBox isRed active = {casesType == 'deaths'} onClick = {e => setCasesType('deaths')}title = "Deaths" cases = {prettyPrintStat(countryInfo.todayDeaths)}  total = {countryInfo.deaths}/>

      </div>
<Mapp 

          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
/>
      </div>
      <Card className = "app__right">
      <CardContent>
        <h3>
          Live Cases by country
        </h3>
        <Table countries = {tableData}/>
        <h3>
          Worldwide new {casesType}
          <LineGraph className = "app__graph" casesType = {casesType}/>
                  </h3>
        
      </CardContent>
      </Card>
     </div>
  );
}

export default App;
