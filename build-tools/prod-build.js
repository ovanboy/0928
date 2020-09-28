let { exec ,spawn} = require("child_process");
let { resolve } = require("path");
let os = require("os");
let glob = require("glob");
let fs = require("fs");
let getProjectLink = require("./get-dir-file");
let log = (...ar) => {
    console.log(...ar);
};
let request = require("request");
let del = require("del");
let port = require("../config").port;
let appBase = resolve(__dirname, "../");
let htmlBase = appBase + "/html";
let staticBase = appBase + "/static";
let sub;
let project = "";
let isDeleteCommon = true;
let argvs = process.argv.slice(2, 4);

argvs.forEach(a => {
    if (/^--/.test(a)) {
        isDeleteCommon = !a.replace(/-/g, "") === "common";
    } else {
        project = a;
    }
});
project='activity/2020/fuli'
if (project) {
    // zip()
    init();
}

async function init() {
    sub = exec("npm run prod", { env: { NODE_ENV: "production" } });
    sub.stdout.on("data", data => {
        if (/server\s*start/.test(data)) {
            log(data);
            spider();
        }
    });
    sub.stderr.on("data", data => {
        log(data);
    });

    // sub.
}

async function spider() {
    let ppath=resolve("./src/view", project)+'/**/*.pug'
    let links = glob.sync(ppath);
    links = links.map(l => {
        return l
            .replace(/.*(\\|\/)src(\\|\/)view/, "")
            .replace(/[\\]/g, "/")
            .replace(/pug$/g, "html");
    });

    try {
        for (let l of links) {
            let url = `http://localhost:${port}${l}`;
            let { res } = await requestAsyc(url);
            if (res.statusCode == 200) {
                 log(l, ' 生成成功')
            } else {
                log(l, res.statusCode, " 生成失败");
            }
        }
        log("构建结束");
        filterFile();
    } catch (e) {
        log(e);
    }
    os.platform() === "win32"
            ? exec("taskkill /pid " + sub.pid + " /T /F")
            : sub.kill("SIGHUP");
}

function filterFile() {
    let htmlDelPath = ["html/*", "!html/" + project];
    let staticDelPath = [
        "data/image/*",
        "data/lottie",
        "!data/image/" + project,
        "map/*",
        "!map/" + project,
        "style/*",
        "!style/" + project,
        "!style/common-3.0.css",
        "!style/common-ui.css",
        // "!style/common.css",
        "!style/_asset",
        "style/_asset/image/*",
        "!style/_asset/image/" + project,
        "script/entry/*",
        "!script/entry/" + project,
        // ...getScriptDependFromEntry(),
        // ...getScriptDependFromHtml()
    ];

    if (isDeleteCommon) {
        staticDelPath.unshift("public/*");
    }

    htmlDelPath = htmlDelPath.map(d => {
        return /^!/.test(d)
            ? "!" + resolve(appBase, d.substring(1))
            : resolve(appBase, d);
    });
    staticDelPath = staticDelPath.map(d => {
        return /^!/.test(d)
            ? "!" + resolve(staticBase, d.substring(1))
            : resolve(staticBase, d);
    });
    // log([...htmlDelPath, ...staticDelPath])
    del([...htmlDelPath, ...staticDelPath], { force: true });
    zip()

}

function getScriptDependFromEntry() {
    let scripts = getProjectLink(
        resolve(appBase, "src/static/script/entry", project)
    ).filter(s => /\.js$/.test(s));
    let moduleScripts = fs
        .readdirSync(resolve(appBase, "src/static/script/module"))
        .filter(s => /\.js$/.test(s))
        .map(s => s.replace(".js", "")); /**所有module js文件 */
    let configfile = resolve(appBase, "src/static/script/require.config-3.0.js");
    let allDepends = [];
    let paths, shim;
    let context = {
        require: function (ds, cb) {
            allDepends.push(...ds);
            try {
                cb();
            } catch (e) {
                console.log(JSON.stringify(e));
            }
        },
        define: function (ds, cb) {
            allDepends.push(...ds);
            try {
                cb();
            } catch (e) {
                console.log(JSON.stringify(e));
            }
        },
        requirejs: {
            config: cfg => {
                paths = cfg.paths;
                shim = cfg.shim;
            }
        }
    };

    with (context) {
        eval(fs.readFileSync(configfile).toString("utf8"));
    }

    for (let f of scripts) {
        with (context) {
            try {
                eval(fs.readFileSync(f).toString("utf8"));
            } catch (e) { }
        }
    }
    allDepends = Array.from(new Set(allDepends));

    let projectModulejs = allDepends.filter(s =>
        moduleScripts.includes(s)
    ); /**筛选出project中用到的modulejs */
        console.log('projectModulejs',projectModulejs)
    projectModulejs.forEach(s => {
        with (context) {
            try {
                eval(
                    fs
                        .readFileSync(
                            resolve(
                                appBase,
                                "src/static/script/module",
                                s + ".js"
                            )
                        )
                        .toString("utf8")
                );
            } catch (error) { }
        }
    });

    let tmp = [];
    try {
        for (let d of allDepends) {
            if (shim[d]) {
                tmp.push(...shim[d].deps);
            }
        }
    } catch (e) { }

    allDepends = allDepends.concat(tmp);
    allDepends = Array.from(new Set(allDepends));

    return allDepends.map(d => {
        let p = paths[d].replace(/^\.{1,2}\//g, "");
        if (/^public/.test(p)) {
            p = p.replace(/\/[^/]*$/, "");
        } else {
            p = "script/" + p + ".js";
        }
        return "!" + p;
    });
}

function getScriptDependFromHtml() {
    let htmls = getProjectLink(resolve(appBase, "html", project)).filter(s =>
        /\.html$/.test(s)
    );
    let ps = [];
    let resAr;
    for (let h of htmls) {
        let publicRex = /\/static\/public\/([^/]*)\//g;
        let text = fs.readFileSync(h).toString();
        while ((resAr = publicRex.exec(text)) !== null) {
            ps.push("!public/" + resAr[1]);
        }
    }
    return Array.from(new Set(ps));
}

function requestAsyc(options) {
    return new Promise((resolve, reject) => {
        request(options, (er, res, body) => {
            er ? reject(er) : resolve({ res, body });
        });
    });
}


function zip(){
    exec("tar -cvzf "+project+".zip ./html ./static & echo 打包成功")
}