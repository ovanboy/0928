let {spawn,exec} = require("child_process");
let path = require("path");
let os = require("os");

let Queue = require("./queue");
let getProjectLink = require("./get-project-link");

let log = (...ar) => { console.log(...ar); }

let sub=exec('node ./app.js', { env: { NODE_ENV: 'production' } })

let linkPool = []

process.argv.slice(2).forEach(p=>{
  linkPool= linkPool.concat(getProjectLink(p));
})


let q = new Queue({
    endCallback() {
        log("构建结束");
        os.platform() === 'win32' ?  exec('taskkill /pid ' + sub.pid + ' /T /F') : sub.kill('SIGHUP')
    }
})



linkPool.forEach(l => {
    q.add(next => {
        require("request")(l, () => {
            next()
        })
    })
})


q.start()

