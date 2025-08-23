const express = require("express");
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "App is running"
    })
});

function main(){
    app.listen(3000);
    console.log("App is running on PORT 3000");
}
main();