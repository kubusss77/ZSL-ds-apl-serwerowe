const fs = require('fs');
const path = require('path');


function getConfigController(req, res) {
  res.json(configJson);
}

function updateConfigController(req, res) {
  console.log(req.body);
  const fontSize = req.body.fontSize;
  const backgroundColor = req.body.backgroundColor;

  if (fontSize) {
    configJson.fontSize = fontSize;
  }

  if (backgroundColor) {
    configJson.backgroundColor = backgroundColor;
  }

  res.json(configJson);
}

module.exports = {
  getConfigController,
  updateConfigController,
};
