module.exports = {
    apps : [{
      name   : "SteelShock-backend ",
      script : "./app.js",
      instances : "1",
      exec_mode : "cluster"
    }]
  }