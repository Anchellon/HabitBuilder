import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongo from "../db/mongoDB.js";
import fileUpload from "express-fileupload";

const router = express.Router();

//ROUTER TO /api/myhabits
/* ------Katerina----- */

/* GET myhabits */
router.get("/", async function (req, res) {
    const myhabits = await mongo.getHabits();
    console.log("got habits", myhabits);

    res.status(200).json(myhabits);
});

/* DELETE myhabits */
router.delete("/:id", async function (req, res) {
    const habitId = req.params.id;

    console.log("will delete habitId", habitId);
    const result = await mongo.deleteHabit(habitId);

    if (result.acknowledged) {
        console.log("habit was deleted");
        res.status(200).send();
    } else {
        console.log("no habit was deleted");
    }
});
/* ------Katerina end ----- */

/* ------Anshul Start ----- */
router.post("/", fileUpload(), async (req, res) => {
    console.log(req.files);
    if (req.files) {
        let file;

        file = req.files.img;
        let uploadPath =
            "/assets/images/" +
            Date.now().toString(36) +
            Math.random().toString(36).slice(2) +
            "." +
            file.name.split(".").pop();
        console.log(uploadPath);
        try {
            // Use the mv() method to place the file somewhere on your server
            let path = "./public" + uploadPath;
            await file.mv(path, function (err) {
                if (err) return res.status(500).send(err);
                return;
                // res.send("Received!!!");
            });
            let { habitName, goalPerDay, startDate, numberOfDays, picture } =
                req.body;
            picture = uploadPath;
            mongo.createHabits(
                habitName,
                goalPerDay,
                startDate,
                numberOfDays,
                picture
            );
            //res.send("Usign custom images");
            res.redirect("/myhabits.html");
        } catch (e) {
            console.log("Error", e);
            res.status(400).send({ err: e });
        }
    } else {
        // check which image has been selected and assign a value
        // if its beach set the path in it as the
        const { habitName, goalPerDay, startDate, numberOfDays, picture } =
            req.body;
        mongo.createHabits(
            habitName,
            goalPerDay,
            startDate,
            numberOfDays,
            picture
        );
        console.log(req.body.picture);
        //res.send("Usign default images");
        res.redirect("/myhabits.html");
    }
});

router.get("/myHabitsWithAwards", async function (req, res) {
    const myHabitsWithAwards = await mongo.getHabitsWithAwards();
    console.log("got habits wtih awards", myHabitsWithAwards);

    res.status(200).json(myHabitsWithAwards);
});
// /* ------Anshul End ----- */

/* ------Katerina start ----- */
/* POST myhabits log */
router.post("/:id/log", async function (req, res) {
    const habitId = req.params.id;
    console.log(`habitId = ${habitId}`);

    const logUnits = Number(req.body.logUnits);
    console.log(`logUnits = ${logUnits}`);

    await mongo.insertLogUnits(habitId, logUnits);

    //TODO add error handling
});

/* ------Katerina end ----- */

export default router;
