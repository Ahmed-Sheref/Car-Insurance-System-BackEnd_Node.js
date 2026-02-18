import axios from 'axios';


async function decodeVin(vin) 
{
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`;

    const response = await axios.get(url);

    const data = response.data.Results[0];

    const carData = {make: data.Make, model: data.Model, year: data.ModelYear};
    return carData;
}

export default decodeVin;