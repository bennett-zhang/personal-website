"use strict"

const express = require("express")
const app = express()
const http = require("http").Server(app)
const port = process.env.PORT || 8080

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
	res.sendFile("index.html")
})

http.listen(port, () => {
	console.log(`Listening on ${port}.`)
})
