// #!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander";
import { ITreeConfig } from "./interface";
import utils from "./utils/index";

const program = new Command();
program.version("0.0.1");

program.command("tree <dir> [type] [ignore...]").action(function (dir,type,ignore) {
  if (type&&!/(simple|clear)/g.test(type)) {
    throw new Error("simple,clear")
  }
  const cfg: ITreeConfig = {
    name: "",
    path: "",
    ignoreList: [/^\./, /node_modules/],
    outputType: type||'simple',
  };
  
  if (path.isAbsolute(dir)) {
    cfg.name = path.parse(dir).name;
  }else{
    cfg.name = path.parse(path.resolve(process.cwd(),dir)).name;
  }
  cfg.path = dir;
  var jsonObj = utils.dirDFS(cfg.path, cfg.name, cfg.ignoreList);
  var str = utils.stringifyDirTree(jsonObj, cfg.outputType);
  console.log(str);
});

program.parse(process.argv);

// interface IOption {
//   origin?: string;
// }

// const argu = process.argv.slice(2);

// class CoCli {
//   private options: IOption = {
//     origin: "",
//   };
//   constructor(option: IOption = {}) {
//     const keys = Object.keys(this.options);
//     Object.keys(option).forEach((key) => {
//       if (keys.includes(key)) {
//         const options = this.options;
//         this.options[<keyof typeof options>key] =
//           option[<keyof typeof option>key];
//       } else {
//         console.log("不包含配置选项：" + key);
//       }
//     });
//   }
// }
