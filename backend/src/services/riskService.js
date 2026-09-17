const axios = require("axios");

const ML_SERVICE_URL = "http://localhost:8000";
const AML_SERVICE_URL = "http://localhost:8001";

async function checkServices() {
  const [ml, aml] = await Promise.all([
    axios.get(`${ML_SERVICE_URL}/health`),
    axios.get(`${AML_SERVICE_URL}/health`)
  ]);

  return {
    ml: ml.data,
    aml: aml.data
  };
}

module.exports = {
  checkServices
};