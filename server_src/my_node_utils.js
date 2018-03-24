let sys = require('util');
let exec = require('child_process').exec;
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

function get_parent_dir(path) {return path.replace(/[/\\]\w+\b$/, "")}

function get_dir_list(path) {
    const isDirectory = source => lstatSync(source).isDirectory();
    const getDirectories = source =>
        readdirSync(source).map(name => join(source, name)).filter(isDirectory);
    return getDirectories(path)
}

function get_top_dir(path) {return path.match(/[\/]([^\/]+$)/)[1]}

//function fun_shell_script(array_of_cmds) {}//todo think of a way to implent this with callabacks

function run_shell_cmd(cmd_with_args, callback, err_callback=undefined) {
    if (cmd_with_args===undefined || callback===undefined){
        throw new Error("Not all arguments defined.");
    }
    let dir = exec(cmd_with_args, function(err, stdout, stderr) {
        callback(err, stdout, stderr);
    });

    if (err_callback === undefined){
        err_callback = (code) => {
            //this doesn't give me the full stacktrace for some reason (i think)
            throw new Error("Shell commmand got errorcode " + code);
        };
    }

    dir.on('exit', function (err_code) {
        if (err_code !== 0){
            err_callback(err_code);
        }
    });
}

module.exports = {
    get_parent_dir: get_parent_dir,
    get_dir_list: get_dir_list,
    get_top_dir: get_top_dir,
    run_shell_cmd: run_shell_cmd
};