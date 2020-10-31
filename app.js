require('dotenv').config();

const express = require('express');
const joi = require('joi');

const courses = [
    { id: 1, name : 'Course 1'},
    { id: 2, name : 'Course 2'},
    { id: 3, name : 'Course 3'},
]


const app = express();


app.use(express.json());

app.get('/api/course', (req, res) => {
    res.send(courses);
});

app.post('/api/course', (req,res) => {
    // Create Schema To Joi Validation
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Create New Course
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/course/:id', (req, res) => {
    // Look If Course Not Exits
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with Given Id Was Not Found');
    // Validata
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // Ubdate Course And Return New Update
    course.name = req.body.name;
    res.send(course);

    
});

app.delete('/api/course/:id', (req, res) => {
    // Look If Course Not Exits
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with Given Id Was Not Found');

    // Delete Course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

app.get('/api/course/:id', (req, res) => {
    // Get Data Courses in Array
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with Given Id Was Not Found');
    res.send(course);
});

function validateCourse(course) {
    const schema = joi.object({
        name: joi.string().min(3).required()
    });
    return schema.validate(course);
}

const PORT = process.env.PORT || 5000;


app.listen( PORT, () => {
    console.log(`Srver Work in Port ${PORT}`);
});