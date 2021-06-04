// Require the Fastify framework and instantiate it
const fastify = require("fastify")();

const students = [
    {
      id: 1,
      last: "Last1",
      first: "First1",
    },
    {
      id: 2,
      last: "Last2",
      first: "First2",
    },
    {
      id: 3,
      last: "Last3",
      first: "First3",
    }
  ];
  

// Handle GET verb for / route using Fastify
// Note use of "chain" dot notation syntax

// Student Route
fastify.get("/cit/student", (request, reply) => {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(students);
});

//Student ID Route
fastify.get("/cit/student/:id", (request, reply) => {
    // 1) Client makes a request to the server
    // Get the id
    let studentIDFromClient = request.params.id;
    

    // 2) The server (us) does something with the request
    // Get the student associated with the id given from the array called 'students'

    let studentRequestedFromClientID = null;

    for (studentInArray of students) {
        if (studentInArray.id == studentIDFromClient) {
            studentRequestedFromClientID = studentInArray;
            break;
        }
    }
    // 3) The server provides some sort of reply to the client
    // Send the student data found in (2) to the client
    if (studentRequestedFromClientID != null) {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(studentRequestedFromClientID);
    }
    else {
        reply
      .code(404)
      .header("Content-Type", "text/html; charset=utf-8")
      .send("<h1>No student with the given ID was found.</h1>");
    }
  });

//Unmatched / Wildcard Route
fastify.get("*", (request, reply) => {
    reply
      .code(200)
      .header("Content-Type", "text/html; charset=utf-8")
      .send("<h1>At Unmatched Route</h1>");
  });

fastify.post("/cit/students/add", (request, reply) => {
    // 1) Get request from client

    let userData = JSON.parse(request.body)
    console.log(userData);

    // 2) Do something with that request
        // a) figure out the max id currently in the array 'students'
        let maxID = 0;
        for (individualStudent of students) {
            if (maxID < individualStudent.id) {
                maxID = individualStudent.id;
            }
        }

        // b) create a new student object 's' of the form:
             // fname = userData.firstname
             // ...
            // id = maxID + 1
       let generatedStudent = {
            id: maxID + 1,
            last: userData.lname,
            first: userData.fname
        };
        // c) add student object created in (b) to 'students' array
        students.push(generatedStudent)

        // d) send the student object created in (b) back to the client

    // 3) Reply to client

    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(generatedStudent);
  });
// Start server and listen to requests using Fastify
const listenIP = "localhost";
const listenPort = 8080;
fastify.listen(listenPort, listenIP, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});