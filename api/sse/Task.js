let express = require('express')
let sseTaskRouter = express.Router()

let Task = require(__appRoot+'/models/Task.js')

sseTaskRouter.get('/getupdate/:task_id', async (req, res)=> {
  console.log(req.params.task_id);
  console.log(req.query.start);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    "Access-Control-Allow-Origin":"*"
  })

  let task=  await Task.findById(req.params.task_id).lean().exec();
  let interval =null;

  if (req.params.task_id) {

    interval=  setInterval(() => res.write("data: " + JSON.stringify(task) + "\n\n"), 1000);
  }
  if (req.query.start=='') {
    if (interval) {
      cleatInterval(interval);
      res.end();
    }
    console.log(req.query);
    res.end();
  }



  // countdown(res, 50)
})

// async function countdown(res, count) {
//   await Task.findById(req.params.task_id).populate('assignees').exec();
//   res.write("data: " + JSON.stringify({count}) + "\n\n")
//   if (count)
//     setTimeout(() => countdown(res, count-1), 1000)
//   else
//     res.end()
// }

module.exports= sseTaskRouter
