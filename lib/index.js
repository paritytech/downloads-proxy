var ua = require("universal-analytics"),
    express = require("express"),
    fs = require("fs"),
    http = require("http"),
    https = require("https")

var app = express(),
    port = process.env.PORT || 80,
    sslPort = process.env.SSL_PORT || 443,
    httpServer,
    httpsServer




app.get("/*", function(req,res){
  var visitor = ua(process.env.GA_TOKEN_ID),
      os = ((req.path.split("/")[2] || "").split("-") || [])[2]

  visitor.event("parity_github_downloads", "download", os).send()
  
  res.redirect(process.env.TRUE_URL + req.path)
})


http.createServer(app).listen(port, (err, server) => {
  console.log("http server listening on", port)

  httpServer = server
})

if(process.env.SSL_KEY && process.env.SSL_CERT){
  https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
  }, app).listen(sslPort, (err, server) => {
    console.log("https server listening on", sslPort)
    httpsServer = server
  });
}
