import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const students = await prisma.students.findMany();
  if (!students.length == 0) {
    res.render('index', { students })
  } else {
    res.render("error")
  }

})

app.get("/students", (req, res) => {
  res.render('createStudent')

});

app.post("/students", async (req, res, next) => {

  const { username, email } = req.body;
  if (email.includes("@gmail.com") || email.includes("@mail.com")) {
    const newStudent = await prisma.students.create({
      data: {
        username,
        email,
      },
    });
    res.json(newStudent);
  } else {
    next()
  }
});

app.post('/', async (req, res) => {
  const { id } = req.body;
  await prisma.students.delete({
    where: {
      id: parseInt(id),
    },
  })
  const students = await prisma.students.findMany();
  res.render('index', { students })
})


app.listen(port, () => {

});
